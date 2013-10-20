package com.zizibujuan.drip.server.dao.mysql;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.zizibujuan.drip.server.dao.ActivityDao;
import com.zizibujuan.drip.server.dao.AnswerDao;
import com.zizibujuan.drip.server.dao.UserStatisticsDao;
import com.zizibujuan.drip.server.dao.UserDao;
import com.zizibujuan.drip.server.exception.dao.DataAccessException;
import com.zizibujuan.drip.server.model.Answer;
import com.zizibujuan.drip.server.model.AnswerDetail;
import com.zizibujuan.drip.server.util.ActionType;
import com.zizibujuan.drip.server.util.dao.AbstractDao;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;
import com.zizibujuan.drip.server.util.dao.PreparedStatementSetter;
import com.zizibujuan.drip.server.util.dao.RowMapper;

/**
 * 答案 数据访问实现类
 * 
 * @author jinzw
 * @since 0.0.1
 */
public class AnswerDaoImpl extends AbstractDao implements AnswerDao {
	private static final Logger logger = LoggerFactory.getLogger(AnswerDaoImpl.class);
	private UserDao userDao;
	private ActivityDao activityDao;
	private UserStatisticsDao userStatisticsDao;
	
	private static final String SQL_GET_ANSWER = "SELECT "
			+ "DBID,"
			+ "EXER_ID,"
			+ "GUIDE,"
			+ "CRT_TM,"
			+ "CRT_USER_ID,"
			+ "UPT_TM,"
			+ "UPT_USER_ID "
			+ "FROM "
			+ "DRIP_ANSWER ";

	// 暂定，将习题解析看作答案的一部分。
	private static final String SQL_GET_ANSWER_BY_ID = SQL_GET_ANSWER + "WHERE DBID=? ";
	
	private static final String SQL_LIST_ANSWER_DETAIL = "SELECT "
			+ "DBID,"
			+ "ANSWER_ID,"
			+ "OPT_ID,"
			+ "CONTENT "
			+ "FROM "
			+ "DRIP_ANSWER_DETAIL "
			+ "WHERE "
			+ "ANSWER_ID=?";
	@Override
	public Answer get(final Long answerId) {
		Answer result = DatabaseUtil.queryForObject(getDataSource(), SQL_GET_ANSWER_BY_ID, new RowMapper<Answer>() {
			@Override
			public Answer mapRow(ResultSet rs, int rowNum) throws SQLException {
				Answer answer = new Answer();
				answer.setId(rs.getLong(1));
				answer.setExerciseId(rs.getLong(2));
				answer.setGuide(rs.getString(3));
				answer.setCreateTime(rs.getTimestamp(4));
				answer.setCreateUserId(rs.getLong(5));
				answer.setLastUpdateTime(rs.getTimestamp(6));
				answer.setLastUpdateUserId(rs.getLong(7));
				return answer;
			}
		}, answerId);
		
		
		List<AnswerDetail> detail = DatabaseUtil.query(getDataSource(), SQL_LIST_ANSWER_DETAIL, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement ps) throws SQLException {
				ps.setLong(1, answerId);
				
			}
		}, new RowMapper<AnswerDetail>() {
			@Override
			public AnswerDetail mapRow(ResultSet rs, int rowNum) throws SQLException {
				AnswerDetail d = new AnswerDetail();
				d.setId(rs.getLong(1));
				d.setAnswerId(rs.getLong(2));
				d.setOptionId(rs.getLong(3));
				d.setContent(rs.getString(4));
				return d;
			}
		});
		result.setDetail(detail);
		return result;
	}
	
	
	@Override
	public void saveOpUpdate(Long userId, Map<String, Object> answer) {
		// 查询用户是否已经回答过该习题
		// 如果已经回答过，则删除之前的答案和习题解析
		// 注意，习题解析只有存在时才删除，而不是判断是不是答案已存在过。
		// 新增答案和习题解析
		
		// 将新的答案，在答题历史表中存储一份
		// 将习题解析在历史表中存储一份。如果存在的话
		
		//Connection con = null;
		
		
	}


	private static final String SQL_GET_EXERCISE_ANSWER_BY_USER_ID = SQL_GET_ANSWER
			+ "WHERE "
			+ "CRT_USER_ID=? AND "
			+ "EXER_ID=?";
	@Override
	public Answer get(Long userId, Long exerciseId) {
		final Answer result = DatabaseUtil.queryForObject(getDataSource(), SQL_GET_EXERCISE_ANSWER_BY_USER_ID, new RowMapper<Answer>() {
			@Override
			public Answer mapRow(ResultSet rs, int rowNum) throws SQLException {
				Answer answer = new Answer();
				answer.setId(rs.getLong(1));
				answer.setExerciseId(rs.getLong(2));
				answer.setGuide(rs.getString(3));
				answer.setCreateTime(rs.getTimestamp(4));
				answer.setCreateUserId(rs.getLong(5));
				answer.setLastUpdateTime(rs.getTimestamp(6));
				answer.setLastUpdateUserId(rs.getLong(7));
				return answer;
			}
		}, userId, exerciseId);
		if(result == null){
			return result;
		}
		
		List<AnswerDetail> details = DatabaseUtil.query(getDataSource(), SQL_LIST_ANSWER_DETAIL, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement ps) throws SQLException {
				ps.setLong(1, result.getId());
			}
		}, new RowMapper<AnswerDetail>() {
			@Override
			public AnswerDetail mapRow(ResultSet rs, int rowNum) throws SQLException {
				AnswerDetail detail = new AnswerDetail();
				detail.setId(rs.getLong(1));
				detail.setAnswerId(rs.getLong(2));
				detail.setOptionId(rs.getLong(3));
				detail.setContent(rs.getString(4));
				return detail;
			}
		});
		result.setDetail(details);
		return result;
	}

	@Override
	public void save(Long localGlobalUserId, Long connectGlobalUserId, Map<String, Object> answerInfo) {
		Connection con = null;
		try {
			con = getDataSource().getConnection();
			con.setAutoCommit(false);
			// FIXME: 这个方法还没有调试通过，为了消除编译错误，暂时注释掉
			// this.save(con, localGlobalUserId, connectGlobalUserId, answerInfo);
			con.commit();
		} catch (SQLException e) {
			DatabaseUtil.safeRollback(con);
			throw new DataAccessException(e);
		} catch(DataAccessException e){
			DatabaseUtil.safeRollback(con);
			throw e;
		}finally{
			DatabaseUtil.closeConnection(con);
		}
	}

	private static final String SQL_INSERT_ANSWER = "INSERT INTO "
			+ "DRIP_ANSWER "
			+ "(EXER_ID,"
			+ "GUIDE,"
			+ "CRT_TM,"
			+ "CRT_USER_ID) "
			+ "VALUES "
			+ "(?,?,now(),?)";
	private static final String SQL_INSERT_ANSWER_DETAIL = "INSERT INTO "
			+ "DRIP_ANSWER_DETAIL "
			+ "(ANSWER_ID,"
			+ "OPT_ID,"
			+ "CONTENT) "
			+ "VALUES "
			+ "(?,?,?)";
	@Override
	public void save(Connection con, final Answer answer) throws SQLException {
		Long answerId = DatabaseUtil.insert(con, SQL_INSERT_ANSWER, new PreparedStatementSetter() {
			
			@Override
			public void setValues(PreparedStatement ps) throws SQLException {
				ps.setLong(1, answer.getExerciseId());
				ps.setString(2, answer.getGuide());
				ps.setLong(3, answer.getCreateUserId());
			}
		});
		
		List<AnswerDetail> answerDetail = answer.getDetail();
		if(answerDetail != null && !answerDetail.isEmpty()){
			addAnswerDetail(con, answerId, answerDetail);
		}
		
		// 答案回答完成后，在用户的“已回答的习题数”上加1
		// 同时修改后端和session中缓存的该记录
		Long userId = answer.getCreateUserId();
		userStatisticsDao.increaseAnswerCount(con, userId);
		// 在活动表中插入一条记录
		activityDao.add(con, userId, answerId, ActionType.ANSWER_EXERCISE, true);
		// 插入答案概述
		
		// 插入答案详情
		
		// 在活动列表中插入一条
		
		// 增加用户的回答次数
		
		// TODO：exerciseDao中的插入答案的方法要使用这里的接口。
		// 保持接口一致。
	}


	private void addAnswerDetail(Connection con, Long answerId, List<AnswerDetail> answerDetails) throws SQLException {
		PreparedStatement pst = con.prepareStatement(SQL_INSERT_ANSWER_DETAIL);
		for(AnswerDetail each : answerDetails){
			pst.setLong(1, answerId);
			Long optionId = each.getOptionId();
			if(optionId == null){
				pst.setNull(2, Types.NUMERIC);
			}else{
				pst.setLong(2, optionId);
			}
			
			String content = each.getContent();
			if(content == null || content.trim().isEmpty()){
				pst.setNull(3, Types.VARCHAR);
			}else{
				pst.setString(3, content);
			}
			pst.addBatch();
		}
		pst.executeBatch();
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
}
