package com.zizibujuan.drip.server.dao.mysql;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.zizibujuan.drip.server.dao.ActivityDao;
import com.zizibujuan.drip.server.dao.AnswerDao;
import com.zizibujuan.drip.server.dao.ExerciseDao;
import com.zizibujuan.drip.server.dao.HistExerciseDao;
import com.zizibujuan.useradmin.server.dao.UserDao;
import com.zizibujuan.useradmin.server.dao.UserStatisticsDao;
import com.zizibujuan.drip.server.model.Activity;
import com.zizibujuan.drip.server.model.Answer;
import com.zizibujuan.drip.server.model.AnswerDetail;
import com.zizibujuan.drip.server.model.Exercise;
import com.zizibujuan.drip.server.model.ExerciseForm;
import com.zizibujuan.drip.server.model.ExerciseOption;
import com.zizibujuan.drip.server.model.HistExercise;
import com.zizibujuan.drip.server.util.PageInfo;
import com.zizibujuan.drip.server.util.constant.ActionType;
import com.zizibujuan.drip.server.util.constant.DBAction;
import com.zizibujuan.drip.server.util.constant.ExerciseStatus;
import com.zizibujuan.drip.server.util.constant.ExerciseType;
import com.zizibujuan.drip.server.util.dao.AbstractDao;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;
import com.zizibujuan.drip.server.util.dao.PreparedStatementSetter;
import com.zizibujuan.drip.server.util.dao.RowMapper;
import com.zizibujuan.drip.server.util.dao.exception.DataAccessException;

/**
 * 维护习题 数据访问实现类
 * 
 * @author jinzw
 * @since 0.0.1
 */
public class ExerciseDaoImpl extends AbstractDao implements ExerciseDao {
	private static final Logger logger = LoggerFactory.getLogger(ExerciseDaoImpl.class);
	
	private UserDao userDao;
	private ActivityDao activityDao;
	private AnswerDao answerDao;
	private UserStatisticsDao userStatisticsDao;
	private HistExerciseDao histExerciseDao;
	
	private static final String SQL_LIST_EXERCISE = "SELECT "
			+ "DBID,"
			+ "CONTENT,"
			+ "EXER_TYPE,"
			+ "EXER_COURSE,"
			+ "IMAGE_NAME,"
			+ "CRT_TM,"
			+ "CRT_USER_ID,"
			+ "UPT_TM,"
			+ "UPT_USER_ID "
			+ "FROM "
			+ "DRIP_EXERCISE "
			+ "ORDER BY CRT_TM DESC";
	@Override
	public List<Exercise> get(PageInfo pageInfo) {
		List<Exercise> result = DatabaseUtil.query(getDataSource(), SQL_LIST_EXERCISE, new RowMapper<Exercise>() {
			@Override
			public Exercise mapRow(ResultSet rs, int rowNum)
					throws SQLException {
				Exercise exercise = new Exercise();
				exercise.setId(rs.getLong(1));
				exercise.setContent(rs.getString(2));
				exercise.setExerciseType(rs.getString(3));
				exercise.setCourse(rs.getString(4));
				exercise.setImageName(rs.getString(5));
				exercise.setCreateTime(rs.getTimestamp(6));
				exercise.setCreateUserId(rs.getLong(7));
				exercise.setLastUpdateTime(rs.getTimestamp(8));
				exercise.setLastUpdateUserId(rs.getLong(9));
				return exercise;
			}
		}, pageInfo);
		
		for(Exercise exer : result){
			String exerType = exer.getExerciseType();
			if (ExerciseType.SINGLE_OPTION.equals(exerType)
					|| ExerciseType.MULTI_OPTION.equals(exerType)
					|| ExerciseType.FILL.equals(exerType)) {
				List<ExerciseOption> options = this.getExerciseOptions(exer.getId());
				exer.setOptions(options);
			}
		}
		
		return result;
	}
	
	@Override
	public Long add(ExerciseForm exerciseForm) {
		Long exerId = null;
		Connection con = null;
		try{
			con = getDataSource().getConnection();
			con.setAutoCommit(false);
			// 添加习题
			Exercise exercise = exerciseForm.getExercise();
			exercise.setVersion(1);
			exerId = this.addExercise(con, exercise); // 注意：在addExercise中队exercise的值有加工
			// 在历史表中添加纪录
			Long histExerId = histExerciseDao.insert(con, DBAction.CREATE, exercise);
			
			Long userId = exercise.getCreateUserId();
			// 习题添加成功后，在用户的“创建的习题数”上加1
			// 同时修改后端和session中缓存的该记录
			String actionType = null;
			if(exercise.getStatus().equals(ExerciseStatus.DRAFT)){
				userStatisticsDao.increaseDraftExerciseCount(con, userId);
				actionType = ActionType.SAVE_EXERCISE_DRAFT;
			}else{
				userStatisticsDao.increasePublishExerciseCount(con, userId);
				actionType = ActionType.PUBLISH_EXERCISE;
			}
			
			// 在活动表中插入一条记录
			addActivity(con, userId, histExerId, actionType); // 往活动表中插入历史记录
			
			// 如果存在答案，则添加答案
			Answer answer = exerciseForm.getAnswer();
			if(answer != null){
				Exercise exerciseInfo = exerciseForm.getExercise();
				String exerciseType = exerciseInfo.getExerciseType();
				answer.setExerciseId(histExerId); // 注意，这里保存的是历史习题标识
				answer.setAnswerVersion(1);
				answer.setCreateUserId(exerciseInfo.getCreateUserId());
				
				List<AnswerDetail> answerList = answer.getDetail();
				// 在新增习题的同时保存答案，因为选项的值是刚加的，所以需要在detail中为选项标识赋值。
				if(answerList != null && answerList.size() > 0){
					if(ExerciseType.SINGLE_OPTION.equals(exerciseType) || ExerciseType.MULTI_OPTION.equals(exerciseType)){
						List<ExerciseOption> options = exerciseInfo.getOptions();
						// seq从1开始
						if(options != null && !options.isEmpty()){
							for(AnswerDetail answerDetail : answerList){
								int seq = answerDetail.getSeq();
								ExerciseOption option = options.get(seq - 1);
								answerDetail.setOptionId(option.getId());
								answerDetail.setContent(null);
							}
						}
					}
				}
				// 准备好数据之后，再保存
				answerDao.insert(con, answer);
			}
			
			con.commit();
		}catch(SQLException e){
			DatabaseUtil.safeRollback(con);
			throw new DataAccessException(e);
		}catch(DataAccessException e){
			DatabaseUtil.safeRollback(con);
			throw e;
		}finally{
			DatabaseUtil.closeConnection(con);
		}
		return exerId;
	}
	
	@Override
	public Long add(Exercise exercise) {
		Long exerId = null;
		Connection con = null;
		try{
			con = getDataSource().getConnection();
			con.setAutoCommit(false);
			// 添加习题
			exercise.setVersion(1);
			exerId = this.addExercise(con, exercise); // 注意：在addExercise中队exercise的值有加工
			// 在历史表中添加纪录
			Long histExerId = histExerciseDao.insert(con, DBAction.CREATE, exercise);
			
			Long userId = exercise.getCreateUserId();
			// 习题添加成功后，在用户的“创建的习题数”上加1
			// 同时修改后端和session中缓存的该记录
			String actionType = null;
			if(exercise.getStatus().equals(ExerciseStatus.DRAFT)){
				userStatisticsDao.increaseDraftExerciseCount(con, userId);
				actionType = ActionType.SAVE_EXERCISE_DRAFT;
			}else{
				userStatisticsDao.increasePublishExerciseCount(con, userId);
				actionType = ActionType.PUBLISH_EXERCISE;
			}
			
			// 在活动表中插入一条记录
			addActivity(con, userId, histExerId, actionType); // 往活动表中插入历史记录
			
			con.commit();
		}catch(SQLException e){
			DatabaseUtil.safeRollback(con);
			logger.error("sql异常", e);
			throw new DataAccessException(e);
		}catch(DataAccessException e){
			DatabaseUtil.safeRollback(con);
			logger.error("sql异常", e);
			throw e;
		}finally{
			DatabaseUtil.closeConnection(con);
		}
		return exerId;
	}

	private void addActivity(Connection con,Long userId, Long contentId, String actionType) throws SQLException {
		Activity activityInfo = new Activity(userId, contentId, actionType);
		
		activityDao.add(con, activityInfo);
	}
	
	private static final String SQL_INSERT_EXERCISE = "INSERT INTO "
			+ "DRIP_EXERCISE "
			+ "(CONTENT,"
			+ "VERSION,"
			+ "EXER_TYPE,"
			+ "STATUS,"
			+ "EXER_COURSE,"
			+ "IMAGE_NAME,"
			+ "CRT_TM, "
			+ "CRT_USER_ID) "
			+ "VALUES "
			+ "(?,?,?,?,?,?,now(),?)";

	private static final String SQL_INSERT_EXER_OPTION = "INSERT INTO "
			+ "DRIP_EXER_OPTION "
			+ "(EXER_ID,"
			+ "CONTENT,"
			+ "OPT_SEQ) "
			+ "VALUES " 
			+ "(?,?,?)";
	// 1. 新增习题
	private Long addExercise(Connection con, Exercise exerciseInfo) throws SQLException{
		final Exercise finalExerciseInfo = exerciseInfo;
		final Long exerId = DatabaseUtil.insert(con, SQL_INSERT_EXERCISE, new PreparedStatementSetter() {
			
			@Override
			public void setValues(PreparedStatement ps) throws SQLException {
				ps.setString(1, finalExerciseInfo.getContent());
				ps.setInt(2, finalExerciseInfo.getVersion());
				ps.setString(3, finalExerciseInfo.getExerciseType());
				ps.setString(4, finalExerciseInfo.getStatus());
				ps.setString(5, finalExerciseInfo.getCourse());
				ps.setString(6, finalExerciseInfo.getImageName());
				ps.setLong(7, finalExerciseInfo.getCreateUserId());
			}
		});
		exerciseInfo.setId(exerId);
		
		// 如果存在选项，则添加习题选项
		List<ExerciseOption> finalOptions = finalExerciseInfo.getOptions();
		List<ExerciseOption> options = exerciseInfo.getOptions();
		if(finalOptions != null && !finalOptions.isEmpty()){
			for(int i = 0; i < finalOptions.size(); i++){
				final ExerciseOption finalOption = finalOptions.get(i);
				final int seq = i+1;
				Long optionId = DatabaseUtil.insert(con, SQL_INSERT_EXER_OPTION, new PreparedStatementSetter() {
					
					@Override
					public void setValues(PreparedStatement ps) throws SQLException {
						ps.setLong(1, exerId);
						ps.setString(2, finalOption.getContent());
						ps.setInt(3, seq);
					}
				});
				
				ExerciseOption option = options.get(i);
				option.setId(optionId);
			}
		}
		return exerId;
	}
	
	private static final String SQL_UPDATE_EXERCISE_STATUS = "UPDATE "
			+ "DRIP_EXERCISE "
			+ "SET "
			+ "STATUS = ? "
			+ "WHERE "
			+ "DBID = ?";
	@Override
	public void publish(HistExercise exercise) {
		Connection con = null;
		try{
			con = getDataSource().getConnection();
			con.setAutoCommit(false);
			// 修改习题状态
			DatabaseUtil.update(con, SQL_UPDATE_EXERCISE_STATUS, ExerciseStatus.PUBLISH, exercise.getId());
			// 在历史习题表中记录状态
			Long histExerId = histExerciseDao.insert(con, DBAction.CREATE, exercise);
			
			Long userId = exercise.getLastUpdateUserId();
			// 习题发布成功后，习题草稿数-1, 发布习题数+1
			userStatisticsDao.decreaseDraftExerciseCount(con, userId);
			userStatisticsDao.increasePublishExerciseCount(con, userId);
			
			// 在活动表中插入一条记录
			String actionType = ActionType.PUBLISH_EXERCISE;
			addActivity(con, userId, histExerId, actionType); // 往活动表中插入历史记录
			
			con.commit();
		}catch(SQLException e){
			DatabaseUtil.safeRollback(con);
			logger.error("sql异常", e);
			throw new DataAccessException(e);
		}catch(DataAccessException e){
			DatabaseUtil.safeRollback(con);
			logger.error("sql异常", e);
			throw e;
		}finally{
			DatabaseUtil.closeConnection(con);
		}
		
	}
	
	private static final String SQL_DELETE_EXERCISE = "DELETE FROM DRIP_EXERCISE WHERE DBID=?";
	@Override
	public void delete(Long exerciseId, Long userId) {
		// 获取习题信息
		// 在历史表中保存习题信息， 将状态设置为删除
		// 在当前习题表中删除习题信息
		// 在活动表中记录下删除操作
		// 习题草稿数-1
		
		Connection con = null;
		try{
			con = getDataSource().getConnection();
			con.setAutoCommit(false);	
			
			Exercise exercise = get(con, exerciseId);
			exercise.setLastUpdateUserId(userId);
			
			// 删除习题
			DatabaseUtil.update(con, SQL_DELETE_EXERCISE, exerciseId);

			// 在历史习题表中记录状态
			Long histExerId = histExerciseDao.insert(con, DBAction.DELETE, exercise);
			
			// 习题删除成功后，习题草稿数-1
			userStatisticsDao.decreaseDraftExerciseCount(con, userId);
			
			// 在活动表中插入一条记录
			String actionType = ActionType.DELETE_EXERCISE_DRAFT;
			addActivity(con, userId, histExerId, actionType);
			
			con.commit();
		}catch(SQLException e){
			DatabaseUtil.safeRollback(con);
			logger.error("sql异常", e);
			throw new DataAccessException(e);
		}catch(DataAccessException e){
			DatabaseUtil.safeRollback(con);
			logger.error("sql异常", e);
			throw e;
		}finally{
			DatabaseUtil.closeConnection(con);
		}
	}
	
	private static final String SQL_UPDATE_EXERCISE = "UPDATE "
			+ "DRIP_EXERCISE "
			+ "SET "
			+ "VERSION=?,"
			+ "CONTENT=?,"
			+ "EXER_TYPE=?,"
			+ "EXER_COURSE=?,"
			+ "UPT_TM=now(),"
			+ "UPT_USER_ID=? "
			+ "WHERE "
			+ "DBID=?";
	private void update(Connection con, final Long exerciseId, final Exercise exercise) throws SQLException{

		
		DatabaseUtil.update(con, SQL_UPDATE_EXERCISE, new PreparedStatementSetter() {
			
			@Override
			public void setValues(PreparedStatement ps) throws SQLException {
				ps.setLong(1, exercise.getVersion());
				ps.setString(2, exercise.getContent());
				ps.setString(3, exercise.getExerciseType());
				ps.setString(4, exercise.getCourse());
				ps.setLong(5, exercise.getLastUpdateUserId());
				ps.setLong(6, exerciseId);
			}
		});
	}
	
	@Override
	public void update(Long exerciseId, Exercise exercise) {
		// 更新习题信息，并将版本号+1
		// 在历史表中记录新版信息
		// 在活动表中插入一条记录
		
		Connection con = null;
		try{
			con = getDataSource().getConnection();
			con.setAutoCommit(false);
			
			Integer version = exercise.getVersion() + 1;
			exercise.setVersion(version);
			
			update(con, exerciseId, exercise);
			// 在历史习题表中记录状态
			Long histExerId = histExerciseDao.insert(con, DBAction.UPDATE, exercise);
			// 在活动表中插入一条记录
			Long userId = exercise.getLastUpdateUserId();
			String actionType = ActionType.EDIT_EXERCISE_DRAFT;
			addActivity(con, userId, histExerId, actionType);
			con.commit();
		}catch(SQLException e){
			DatabaseUtil.safeRollback(con);
			logger.error("sql异常", e);
			throw new DataAccessException(e);
		}catch(DataAccessException e){
			DatabaseUtil.safeRollback(con);
			logger.error("sql异常", e);
			throw e;
		}finally{
			DatabaseUtil.closeConnection(con);
		}	
	}
	
	// TODO:不在sql中联合查询编码，而是从缓存中获取编码对应的文本信息
	private static final String SQL_GET_EXERCISE = "SELECT "
			+ "DBID, "
			+ "VERSION,"
			+ "CONTENT,"
			+ "EXER_TYPE,"
			+ "EXER_COURSE,"
			+ "IMAGE_NAME,"
			+ "STATUS,"
			+ "CRT_TM,"
			+ "CRT_USER_ID,"
			+ "UPT_TM,"
			+ "UPT_USER_ID "
			+ "FROM "
			+ "DRIP_EXERCISE "
			+ "WHERE "
			+ "DBID=?";
	@Override
	public ExerciseForm get(Long userId, Long exerciseId) {
		ExerciseForm result = new ExerciseForm();
		
		result.setExercise(get(exerciseId));
		
		if(userId != null){
			Answer answer = answerDao.get(userId, exerciseId);
			result.setAnswer(answer);
		}
		
		return result;
	}

	private final static String SQL_LIST_EXERCISE_OPTION = "SELECT "
			+ "DBID,"
			+ "EXER_ID,"
			+ "CONTENT,"
			+ "OPT_SEQ "
			+ "FROM "
			+ "DRIP_EXER_OPTION "
			+ "WHERE "
			+ "EXER_ID=? "
			+ "ORDER BY OPT_SEQ";
	private List<ExerciseOption> getExerciseOptions(final Long exerciseId){
		return DatabaseUtil.query(getDataSource(), SQL_LIST_EXERCISE_OPTION, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement ps) throws SQLException {
				ps.setLong(1, exerciseId);
			}
		}, new ExerciseOptionRowMapper());
	}
	
	private List<ExerciseOption> getExerciseOptions(Connection con, final Long exerciseId){
		return DatabaseUtil.query(con, SQL_LIST_EXERCISE_OPTION, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement ps) throws SQLException {
				ps.setLong(1, exerciseId);
			}
		}, new ExerciseOptionRowMapper());
	}
	
	// 2. 回答习题
	// 3. 新增习题的同时，回答习题，放在一个事务中。
	
	
	@Override
	public Exercise get(Long exerciseId) {
		Exercise exercise = DatabaseUtil.queryForObject(getDataSource(), SQL_GET_EXERCISE, new ExerciseRowMapper(), exerciseId);
				
		if(exercise == null){
			return null;
		}
		
		String exerType = exercise.getExerciseType();
		if (ExerciseType.SINGLE_OPTION.equals(exerType)
				|| ExerciseType.MULTI_OPTION.equals(exerType)
				|| ExerciseType.FILL.equals(exerType)) {
			List<ExerciseOption> options = this.getExerciseOptions(exerciseId);
			exercise.setOptions(options);
		}
		return exercise;
	}
	
	private Exercise get(Connection con, Long exerciseId){
		Exercise exercise = DatabaseUtil.queryForObject(con, SQL_GET_EXERCISE, new ExerciseRowMapper(), exerciseId);
		if(exercise == null){
			return null;
		}
		
		String exerType = exercise.getExerciseType();
		if (ExerciseType.SINGLE_OPTION.equals(exerType)
				|| ExerciseType.MULTI_OPTION.equals(exerType)
				|| ExerciseType.FILL.equals(exerType)) {
			List<ExerciseOption> options = this.getExerciseOptions(con, exerciseId);
			exercise.setOptions(options);
		}
		return exercise;
	}
	
	
	public void setUserDao(UserDao userDao) {
		logger.info("注入userDao");
		this.userDao = userDao;
	}

	public void unsetUserDao(UserDao userDao) {
		if (this.userDao == userDao) {
			logger.info("注销userDao");
			this.userDao = null;
		}
	}
	
	public void setActivityDao(ActivityDao activityDao) {
		logger.info("注入ActivityDao");
		this.activityDao = activityDao;
	}

	public void unsetActivityDao(ActivityDao activityDao) {
		if (this.activityDao == activityDao) {
			logger.info("注销ActivityDao");
			this.activityDao = null;
		}
	}
	
	public void setAnswerDao(AnswerDao answerDao) {
		logger.info("注入AnswerDao");
		this.answerDao = answerDao;
	}

	public void unsetAnswerDao(AnswerDao answerDao) {
		if (this.answerDao == answerDao) {
			logger.info("注销AnswerDao");
			this.answerDao = null;
		}
	}
	
	public void setUserStatisticsDao(UserStatisticsDao userStatisticsDao) {
		logger.info("注入userStatisticsDao");
		this.userStatisticsDao = userStatisticsDao;
	}

	public void unsetUserStatisticsDao(UserStatisticsDao userStatisticsDao) {
		if (this.userStatisticsDao == userStatisticsDao) {
			logger.info("注销userStatisticsDao");
			this.userStatisticsDao = null;
		}
	}
	
	public void setHistExerciseDao(HistExerciseDao histExerciseDao) {
		logger.info("注入histExerciseDao");
		this.histExerciseDao = histExerciseDao;
	}

	public void unsetHistExerciseDao(HistExerciseDao histExerciseDao) {
		if (this.histExerciseDao == histExerciseDao) {
			logger.info("注销histExerciseDao");
			this.histExerciseDao = null;
		}
	}

	private class ExerciseRowMapper implements RowMapper<Exercise>{
		@Override
		public Exercise mapRow(ResultSet rs, int rowNum)
				throws SQLException {
			Exercise exercise = new Exercise();
			exercise.setId(rs.getLong(1));
			exercise.setVersion(rs.getInt(2));
			exercise.setContent(rs.getString(3));
			exercise.setExerciseType(rs.getString(4));
			exercise.setCourse(rs.getString(5));
			exercise.setImageName(rs.getString(6));
			exercise.setStatus(rs.getString(7));
			exercise.setCreateTime(rs.getTimestamp(8));
			exercise.setCreateUserId(rs.getLong(9));
			exercise.setLastUpdateTime(rs.getTimestamp(10));
			exercise.setLastUpdateUserId(rs.getLong(11));
			return exercise;
		}
	}
	
	private class ExerciseOptionRowMapper implements RowMapper<ExerciseOption>{
		@Override
		public ExerciseOption mapRow(ResultSet rs, int rowNum) throws SQLException {
			ExerciseOption option = new ExerciseOption();
			option.setId(rs.getLong(1));
			option.setContent(rs.getString(3));
			// seq与list中元素的顺序相同
			return option;
		}
	}

}
