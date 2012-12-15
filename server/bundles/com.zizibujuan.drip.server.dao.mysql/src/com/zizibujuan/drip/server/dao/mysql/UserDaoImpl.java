package com.zizibujuan.drip.server.dao.mysql;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Map;

import org.apache.commons.lang3.ObjectUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.zizibujuan.drip.server.dao.OAuthUserMapDao;
import com.zizibujuan.drip.server.dao.UserDao;
import com.zizibujuan.drip.server.dao.UserRelationDao;
import com.zizibujuan.drip.server.exception.dao.DataAccessException;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;

/**
 * 用户数据访问实现类
 * @author jinzw
 * @since 0.0.1
 */
public class UserDaoImpl extends AbstractDao implements UserDao {
	private static final Logger logger = LoggerFactory.getLogger(UserDaoImpl.class);
	private UserRelationDao userRelationDao;
	private OAuthUserMapDao oAuthUserMapDao;
	
	private static final String SQL_INSERT_USER = "INSERT INTO DRIP_USER_INFO " +
			"(LOGIN_NAME,NICK_NAME,EMAIL,LOGIN_PWD,MOBILE,REAL_NAME,CREATE_TIME) " +
			"VALUES " +
			"(?,?,?,?,?,?,now())";
	
	// TODO:在注册用户分支中添加用户注册功能
	@Override
	public Long add(Map<String, Object> userInfo) {
		Connection con = null;
		try {
			con = getDataSource().getConnection();
			con.setAutoCommit(false);
			
			String email = userInfo.get("login").toString();
			Object oNickName = userInfo.get("realName");
			String nickName = "";
			if(oNickName==null){
				nickName = email;
			}else{
				nickName = oNickName.toString();
			}
			
			Long userId = DatabaseUtil.insert(con, SQL_INSERT_USER, email,
					nickName,
					email,
					userInfo.get("md5Password"),
					userInfo.get("mobile"),
					userInfo.get("realName"));
			// 添加完用户之后，需要在用户关系表中，添加一条用户关注用户自己的记录
			userRelationDao.watch(con, userId, userId);
			con.commit();
			return userId;
		} catch (SQLException e) {
			DatabaseUtil.safeRollback(con);
			throw new DataAccessException(e);
		}catch(Exception e){
			DatabaseUtil.safeRollback(con);
			throw new DataAccessException(e);
		}finally{
			DatabaseUtil.closeConnection(con);
		}
	}

	// 这里只查询出需要在界面上显示的用户信息，主要存储在当前用户的session中。
	private static final String SQL_GET_USER_FOR_SESSION = "SELECT " +
			"DBID \"id\"," +
			//"LOGIN_NAME," +
			"EMAIL \"email\"," +
			//"LOGIN_PWD," + 登录密码，不在session中缓存
			//支持三种大小的头像信息
			"MOBILE \"mobile\"," +
			"REAL_NAME \"displayName\"," +
			//"CRT_TM \"createTime\" " +
			"FAN_COUNT \"fanCount\","+
			"FOLLOW_COUNT \"followCount\","+
			"EXER_DRAFT_COUNT \"exerDraftCount\","+
			"EXER_PUBLISH_COUNT \"exerPublishCount\", "+
			"ANSWER_COUNT \"answerCount\", "+
			"EXER_DRAFT_COUNT+EXER_PUBLISH_COUNT \"exerciseCount\" " +
			"FROM DRIP_USER_INFO ";
	private static final String SQL_GET_USER_FOR_SESSION_BY_PWD = SQL_GET_USER_FOR_SESSION + "WHERE EMAIL = ? AND LOGIN_PWD = ?";
	@Override
	public Map<String, Object> get(String email, String md5Password) {
		return DatabaseUtil.queryForMap(getDataSource(), SQL_GET_USER_FOR_SESSION_BY_PWD, email, md5Password);
	}
	
	private static final String SQL_GET_USER_FOR_SESSION_BY_ID = SQL_GET_USER_FOR_SESSION + "WHERE DBID=?";
	@Override
	public Map<String, Object> get(Long userId) {
		return DatabaseUtil.queryForMap(getDataSource(), SQL_GET_USER_FOR_SESSION_BY_ID, userId);
	}
	
	private static final String SQL_UPDATE_USER = "UPDATE DRIP_USER_INFO SET LAST_LOGIN_TIME = now() " +
			"WHERE DBID=?";
	@Override
	public void updateLastLoginTime(Long userId) {
		DatabaseUtil.update(getDataSource(), SQL_UPDATE_USER, userId);
	}
	
	// 在插入记录时，如果nickName为空，则插入登录名
	private static final String SQL_GET_LOGIN = "SELECT DBID \"userId\", REAL_NAME \"realName\", NICK_NAME \"nickName\" FROM DRIP_USER_INFO WHERE DBID=?";
	@Override
	public Map<String, Object> getLoginInfo(Long userId) {
		return DatabaseUtil.queryForMap(getDataSource(), SQL_GET_LOGIN, userId);
	}
	
	private static final String SQL_EMAIL_EXIST = "select 1 from DRIP_USER_INFO where EMAIL = ? limit 1";
	@Override
	public boolean emailIsExist(String email) {
		String result = DatabaseUtil.queryForString(getDataSource(), SQL_EMAIL_EXIST, email);
		return result != null;
	}
	
	private static final String SQL_UPDATE_EXERCISE_COUNT = "UPDATE DRIP_USER_INFO SET " +
			"EXER_PUBLISH_COUNT=EXER_PUBLISH_COUNT+1 " +
			"where DBID=?";
	@Override
	public void increaseExerciseCount(Connection con, Long userId) {
		DatabaseUtil.update(con, SQL_UPDATE_EXERCISE_COUNT, userId);
	}
	
	private static final String SQL_UPDATE_ANSWER_COUNT = "UPDATE DRIP_USER_INFO SET " +
			"ANSWER_COUNT=ANSWER_COUNT+1 " +
			"where DBID=?";
	@Override
	public void increaseAnswerCount(Connection con, Long userId) {
		DatabaseUtil.update(con, SQL_UPDATE_ANSWER_COUNT, userId);
	}
	
	@Override
	public Long importUser(Map<String, Object> userInfo) {
		Long userId = null;
		
		Connection con = null;
		
		int authSiteId = Integer.valueOf(userInfo.get("authSiteId").toString());
		String authUserId = userInfo.get("authUserId").toString();
		try{
			con = getDataSource().getConnection();
			con.setAutoCommit(false);
			userId = this.addUser(con, userInfo);
			oAuthUserMapDao.mapUserId(con, authSiteId, authUserId, userId);
			userRelationDao.watch(con, userId, userId);
			con.commit();
		}catch(SQLException e){
			DatabaseUtil.safeRollback(con);
			throw new DataAccessException(e);
		}finally{
			DatabaseUtil.closeConnection(con);
		}
		return userId;
	}
	
	
	private Long addUser(Connection con, Map<String,Object> userInfo){
		// TODO:继续添加更详细的用户信息。
		String loginName = userInfo.get("loginName").toString();
		String nickName = userInfo.get("nickName").toString();
		// 注意为EMAIL字段添加了唯一性约束字段，所以如果email不存在，要置为null，而不是转化为一个空的字符串。
		Object email  = userInfo.get("email");
		String password = null;
		String mobile = ObjectUtils.toString(userInfo.get("mobile"));
		String realName = ObjectUtils.toString(userInfo.get("realName"));
		
		return DatabaseUtil.insert(con, SQL_INSERT_USER, loginName,nickName,email,password,mobile,realName);
	}
	
	public void setUserRelationDao(UserRelationDao userRelationDao) {
		logger.info("注入userRelationDao");
		this.userRelationDao = userRelationDao;
	}

	public void unsetUserRelationDao(UserRelationDao userRelationDao) {
		if (this.userRelationDao == userRelationDao) {
			logger.info("注销userRelationDao");
			this.userRelationDao = null;
		}
	}
	
	public void setOAuthUserMapDao(OAuthUserMapDao oAuthUserMapDao) {
		logger.info("注入oAuthUserMapDao");
		this.oAuthUserMapDao = oAuthUserMapDao;
	}

	public void unsetOAuthUserMapDao(OAuthUserMapDao oAuthUserMapDao) {
		if (this.oAuthUserMapDao == oAuthUserMapDao) {
			logger.info("注销oAuthUserMapDao");
			this.oAuthUserMapDao = null;
		}
	}

}
