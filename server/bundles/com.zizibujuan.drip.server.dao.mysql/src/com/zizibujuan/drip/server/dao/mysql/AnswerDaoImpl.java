package com.zizibujuan.drip.server.dao.mysql;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Types;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.zizibujuan.drip.server.dao.ActivityDao;
import com.zizibujuan.drip.server.dao.AnswerDao;
import com.zizibujuan.drip.server.dao.UserDao;
import com.zizibujuan.drip.server.exception.dao.DataAccessException;
import com.zizibujuan.drip.server.util.ActionType;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;

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
	
	private static final String SQL_GET_ANSWER = "SELECT " +
			"DBID \"id\"," +
			"EXER_ID \"exerciseId\"," +
			"GUIDE \"guide\"," +
			"CRT_TM \"createTime\"," +
			"CRT_USER_ID \"createUserId\"," +
			"UPT_TM \"updateTime\"," +
			"UPT_USER_ID \"updateUserId\" " +
			"FROM DRIP_ANSWER ";

	// 暂定，将习题解析看作答案的一部分。
	private static final String SQL_GET_ANSWER_BY_ID = SQL_GET_ANSWER + "WHERE DBID=? ";
	
	private static final String SQL_LIST_ANSWER_DETAIL = "SELECT " +
			"DBID \"id\"," +
			"ANSWER_ID \"answerId\"," +
			"OPT_ID \"optionId\"," +
			"CONTENT \"content\" " +
			"FROM DRIP_ANSWER_DETAIL " +
			"WHERE ANSWER_ID=?";
	@Override
	public Map<String, Object> get(Long answerId) {
		Map<String,Object> result = DatabaseUtil.queryForMap(getDataSource(), SQL_GET_ANSWER_BY_ID, answerId);
		
		if(!result.isEmpty()){
			List<Map<String,Object>> detail = DatabaseUtil.queryForList(getDataSource(), SQL_LIST_ANSWER_DETAIL, answerId);
			result.put("detail", detail);
		}
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


	private static final String SQL_GET_EXERCISE_ANSWER_BY_USER_ID = SQL_GET_ANSWER + "WHERE CRT_USER_ID=? AND EXER_ID=?";
	@Override
	public Map<String, Object> get(Long userId, Long exerciseId) {
		Map<String,Object> result = DatabaseUtil.queryForMap(getDataSource(), SQL_GET_EXERCISE_ANSWER_BY_USER_ID, userId, exerciseId);
		if(!result.isEmpty()){
			Long answerId = Long.valueOf(result.get("id").toString());
			List<Map<String,Object>> detail = DatabaseUtil.queryForList(getDataSource(), SQL_LIST_ANSWER_DETAIL, answerId);
			result.put("detail", detail);
		}
		return result;
	}

	@Override
	public void save(Long userId, Map<String, Object> answerInfo) {
		Connection con = null;
		try {
			con = getDataSource().getConnection();
			con.setAutoCommit(false);
			this.save(con, userId, answerInfo);
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

	private static final String SQL_INSERT_ANSWER = "INSERT INTO DRIP_ANSWER (EXER_ID,GUIDE,CRT_TM,CRT_USER_ID) VALUES (?,?,now(),?)";
	private static final String SQL_INSERT_ANSWER_DETAIL = "INSERT INTO DRIP_ANSWER_DETAIL (ANSWER_ID,OPT_ID,CONTENT) VALUES (?,?,?)";
	@Override
	public void save(Connection con, Long userId, Map<String, Object> answerInfo) throws SQLException {
		Object exerId = answerInfo.get("exerId");
		Object guide = answerInfo.get("guide");
		Long answerId = DatabaseUtil.insert(con, SQL_INSERT_ANSWER, exerId, guide, userId);
		
		Object oDetail = answerInfo.get("detail");
		if(oDetail != null){
			@SuppressWarnings("unchecked")
			List<Map<String,Object>> detail = (List<Map<String, Object>>) oDetail;
			try {
				addAnswerDetail(con, answerId, detail);
			} catch (SQLException e) {
				throw new DataAccessException(e);
			}
		}
		
		// 答案回答完成后，在用户的“已回答的习题数”上加1
		// 同时修改后端和session中缓存的该记录
		userDao.increaseAnswerCount(con, userId);
		// 在活动表中插入一条记录
		activityDao.add(con, userId, answerId, ActionType.ANSWER_EXERCISE, true);
		// 插入答案概述
		
				// 插入答案详情
				
				// 在活动列表中插入一条
				
				// 增加用户的回答次数
				
				// TODO：exerciseDao中的插入答案的方法要使用这里的接口。
				// 保持接口一致。
	}


	private void addAnswerDetail(Connection con, Long answerId,
			List<Map<String, Object>> detail) throws SQLException {
		PreparedStatement pst = con.prepareStatement(SQL_INSERT_ANSWER_DETAIL);
		for(Map<String,Object> each : detail){
			pst.setLong(1, answerId);
			Object oOptId = each.get("optionId");
			if(oOptId == null){
				pst.setNull(2, Types.NUMERIC);
			}else{
				pst.setLong(2, Long.valueOf(oOptId.toString()));
			}
			
			Object oContent = each.get("content");
			if(oContent == null){
				pst.setNull(3, Types.VARCHAR);
			}else{
				String content = oContent.toString();
				if(content.trim().isEmpty()){
					pst.setNull(3, Types.VARCHAR);
				}else{
					pst.setString(3, content);
				}
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
}
