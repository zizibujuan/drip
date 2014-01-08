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

import com.zizibujuan.drip.server.dao.ConnectUserDao;
import com.zizibujuan.drip.server.dao.UserAttributesDao;
import com.zizibujuan.drip.server.dao.UserAvatarDao;
import com.zizibujuan.drip.server.dao.UserBindDao;
import com.zizibujuan.drip.server.dao.UserDao;
import com.zizibujuan.drip.server.dao.UserRelationDao;
import com.zizibujuan.drip.server.dao.UserStatisticsDao;
import com.zizibujuan.drip.server.dao.mysql.rowmapper.UserInfoRowMapper;
import com.zizibujuan.drip.server.exception.dao.DataAccessException;
import com.zizibujuan.drip.server.model.Avatar;
import com.zizibujuan.drip.server.model.UserBindInfo;
import com.zizibujuan.drip.server.model.UserInfo;
import com.zizibujuan.drip.server.util.OAuthConstants;
import com.zizibujuan.drip.server.util.dao.AbstractDao;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;
import com.zizibujuan.drip.server.util.dao.PreparedStatementSetter;
import com.zizibujuan.drip.server.util.dao.RowMapper;

/**
 * 用户数据访问实现类
 * 
 * @author jinzw
 * @since 0.0.1
 */
public class UserDaoImpl extends AbstractDao implements UserDao {
	
	private static final Logger logger = LoggerFactory.getLogger(UserDaoImpl.class);
	
	private UserRelationDao userRelationDao;
	private UserBindDao userBindDao;
	private UserAvatarDao userAvatarDao;
	private ConnectUserDao connectUserDao;
	private UserAttributesDao userAttributesDao;
	private UserStatisticsDao userStatisticsDao;
	
	@Override
	public Long add(final UserInfo userInfo) {
		Long userId = null;
		Connection con = null;
		// 用户默认不激活
		userInfo.setActive(false);
		try{
			con = getDataSource().getConnection();
			con.setAutoCommit(false);
			this.add(con, userInfo);
			con.commit();
		}catch(SQLException e){
			DatabaseUtil.safeRollback(con);
			logger.error("sql异常", e);
			throw new DataAccessException("用户注册失败", e);
		}catch (Exception e) {
			DatabaseUtil.safeRollback(con);
			logger.error("普通异常", e);
			throw new DataAccessException("用户注册失败", e);
		}finally{
			DatabaseUtil.closeConnection(con);
		}
		
		return userId;
	}
	
	private static final String SQL_INSERT_USER_REGISTER = "INSERT INTO "
			+ "DRIP_USER_INFO "
			+ "(LOGIN_NAME,"
			+ "NICK_NAME,"
			+ "LOGIN_PWD,"
			+ "EMAIL,"
			+ "SEX,"
			+ "CONFIRM_KEY,"
			+ "ACTIVITY,"
			+ "CREATE_TIME,"
			+ "ACCESS_TOKEN,"
			+ "EXPIRES_TIME) " 
			+ "VALUES "
			+ "(?, ?, ?, ?, ?, ?, ?, now(),?,?)";
	private Long add(Connection con, final UserInfo userInfo) throws SQLException{
		Long userId = DatabaseUtil.insert(con, SQL_INSERT_USER_REGISTER, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement ps) throws SQLException {
				ps.setString(1, userInfo.getLoginName());
				ps.setString(2, userInfo.getNickName());
				ps.setString(3, userInfo.getPassword());
				ps.setString(4, userInfo.getEmail());
				ps.setString(5, userInfo.getSex());
				ps.setString(6, userInfo.getConfirmKey());
				ps.setBoolean(7, userInfo.isActive());
				ps.setString(8, userInfo.getAccessToken());
				if(userInfo.getExpiresTime() == null){
					ps.setNull(9, Types.NUMERIC);
				}else{
					ps.setLong(9, userInfo.getExpiresTime());
				}
				
			}
		});
		// 在用户属性表中初始化属性值,TODO:这里的行列转换设计虽然灵活，但是如果因为保存属性出错，
		// 反而会影响用户注册，需要再推敲。
		userAttributesDao.initUserState(con, userId);
		return userId;
	}
	
	private static final String SQL_EMAIL_IS_USED = "select 1 from DRIP_USER_INFO where EMAIL = ? limit 1";
	@Override
	public boolean emailIsUsed(String email) {
		String result = DatabaseUtil.queryForString(getDataSource(), SQL_EMAIL_IS_USED, email);
		return result != null;
	}
	
	private static final String SQL_LOGIN_NAME_IS_USED = "select 1 from DRIP_USER_INFO where LOGIN_NAME = ? limit 1";
	@Override
	public boolean loginNameIsUsed(String loginName) {
		String result = DatabaseUtil.queryForString(getDataSource(), SQL_LOGIN_NAME_IS_USED, loginName);
		return result != null;
	}
	
	private static final String SQL_UPDATE_EMAIL_SEND_TIME = "UPDATE DRIP_USER_INFO "
			+ "SET EMAIL_SEND_TIME = now() WHERE LOGIN_NAME=?";
	@Override
	public void logSendEmailTime(String loginName) {
		DatabaseUtil.update(getDataSource(), SQL_UPDATE_EMAIL_SEND_TIME, loginName);
	}
	
	private static final String SQL_GET_USER_INFO = "SELECT "
			+ "DBID,"
			+ "LOGIN_NAME,"
			+ "EMAIL,"
			+ "SEX,"
			+ "INTRODUCE,"
			+ "CONFIRM_KEY,"
			+ "ACTIVITY "
			+ "FROM "
			+ "DRIP_USER_INFO ";
	private static final String SQL_GET_USER_INFO_BY_LOGIN_NAME = SQL_GET_USER_INFO
			+ "WHERE "
			+ "LOGIN_NAME=?";
	@Override
	public UserInfo getByLoginName(String loginName) {
		return DatabaseUtil.queryForObject(getDataSource(), SQL_GET_USER_INFO_BY_LOGIN_NAME, new UserInfoRowMapper(), loginName);
	}
	
	private static final String SQL_GET_USER_INFO_BY_CONFIRM_KEY = SQL_GET_USER_INFO
			+ "WHERE "
			+ "CONFIRM_KEY=?";
	@Override
	public UserInfo getByConfirmKey(String confirmKey) {
		return DatabaseUtil.queryForObject(getDataSource(), SQL_GET_USER_INFO_BY_CONFIRM_KEY, new UserInfoRowMapper(), confirmKey);
	}
	
	private static final String SQL_GET_USER_INFO_BY_TOKEN = SQL_GET_USER_INFO
			+ "WHERE "
			+ "ACCESS_TOKEN=?";
	@Override
	public UserInfo getByToken(String token) {
		return DatabaseUtil.queryForObject(getDataSource(), SQL_GET_USER_INFO_BY_TOKEN, new UserInfoRowMapper(), token);
	}
	
	private static final String SQL_UPDATE_ACTIVE_USER = "UPDATE DRIP_USER_INFO "
			+ "SET "
			+ "ACTIVITY=1,"
			+ "ACTIVE_TIME=now() "
			+ "WHERE "
			+ "DBID=?";
	/**
	 * 激活成功之后，要自我关注
	 */
	@Override
	public void active(Long userId) {
		Connection con = null;
		try{
			con = getDataSource().getConnection();
			con.setAutoCommit(false);
			DatabaseUtil.update(con, SQL_UPDATE_ACTIVE_USER, userId);
			// 关注自己
			userRelationDao.watch(con, userId, userId);
			// 添加一条值都为0的统计记录
			userStatisticsDao.init(con, userId);
			con.commit();
		}catch (Exception e) {
			DatabaseUtil.safeRollback(con);
			throw new DataAccessException(e);
		}finally{
			DatabaseUtil.closeConnection(con);
		}
	}
	
	// 这里只查询出需要在界面上显示的用户信息，主要存储在当前用户的session中。
	// 以下信息可以存在session中，但是有些信息不能显示在客户端，如email和mobile。
	// 注意：获取登录用户自己的信息，则是越全越好；获取好友的信息，则是若不需要，则不提供。
	private static final String SQL_GET_USER_INFO_FOR_SELF = "SELECT "
			+ "DBID,"
			+ "LOGIN_NAME,"
			+ "EMAIL, "
			+ "NICK_NAME,"
			+ "SEX "
			+ "FROM "
			+ "DRIP_USER_INFO ";
	private static final String SQL_GET_USER_FOR_SESSION_BY_EMAIL = SQL_GET_USER_INFO_FOR_SELF
			+ "WHERE "
			+ "EMAIL = ? AND "
			+ "LOGIN_PWD = ?";
	private static final String SQL_GET_USER_FOR_SESSION_BY_LOGIN_NAME = SQL_GET_USER_INFO_FOR_SELF
			+ "WHERE "
			+ "LOGIN_NAME = ? AND "
			+ "LOGIN_PWD = ?";
	@Override
	public UserInfo get(String login, String md5Password) {
		// 推荐使用邮箱登录
		UserInfo userInfo = DatabaseUtil.queryForObject(getDataSource(), SQL_GET_USER_FOR_SESSION_BY_EMAIL, new RowMapper<UserInfo>() {

			@Override
			public UserInfo mapRow(ResultSet rs, int rowNum)
					throws SQLException {
				UserInfo userInfo = new UserInfo();
				userInfo.setId(rs.getLong(1));
				userInfo.setLoginName(rs.getString(2));
				userInfo.setEmail(rs.getString(3));
				userInfo.setNickName(rs.getString(4));
				userInfo.setSex(rs.getString(5));
				return userInfo;
			}
		}, login, md5Password);
		
		if(userInfo != null) return userInfo;
		
		return DatabaseUtil.queryForObject(getDataSource(), SQL_GET_USER_FOR_SESSION_BY_LOGIN_NAME, new RowMapper<UserInfo>() {

			@Override
			public UserInfo mapRow(ResultSet rs, int rowNum)
					throws SQLException {
				UserInfo userInfo = new UserInfo();
				userInfo.setId(rs.getLong(1));
				userInfo.setLoginName(rs.getString(2));
				userInfo.setEmail(rs.getString(3));
				userInfo.setNickName(rs.getString(4));
				userInfo.setSex(rs.getString(5));
				return userInfo;
			}
		}, login, md5Password);
	}
	
	private static final String SQL_GET_USER_FOR_SESSION_BY_USER_ID = SQL_GET_USER_INFO_FOR_SELF
			+ "WHERE "
			+ "DBID=?";
	@Override
	public UserInfo getById(Long userId) {
		return DatabaseUtil.queryForObject(getDataSource(), SQL_GET_USER_FOR_SESSION_BY_USER_ID, new RowMapper<UserInfo>() {

			@Override
			public UserInfo mapRow(ResultSet rs, int rowNum)
					throws SQLException {
				UserInfo userInfo = new UserInfo();
				userInfo.setId(rs.getLong(1));
				userInfo.setLoginName(rs.getString(2));
				userInfo.setEmail(rs.getString(3));
				userInfo.setNickName(rs.getString(4));
				userInfo.setSex(rs.getString(5));
				return userInfo;
			}
		}, userId);
	}
	
	private static final String SQL_GET_USER_PUBLIC_INFO = "SELECT "
			+ "a.DBID \"userId\","
			+ "a.NICK_NAME \"nickName\","
			+ "a.LOGIN_NAME \"loginName\","
			+ "a.DIGITAL_ID \"digitalId\","
			+ "a.HOME_CITY_CODE \"homeCityCode\","
			+ "a.SEX \"sex\","
			+ "b.SITE_ID \"siteId\" "
			+ "FROM "
			+ "DRIP_USER_INFO a LEFT JOIN DRIP_USER_BIND b ON a.DBID = b.USER_ID "
			+ "WHERE a.DBID=?";
	@Override
	public Map<String, Object> getPublicInfo(Long userId) {
		Map<String, Object> userInfo = DatabaseUtil.queryForMap(getDataSource(), SQL_GET_USER_PUBLIC_INFO, userId);
		if(userInfo.get("siteId") == null){
			userInfo.put("siteId", OAuthConstants.ZIZIBUJUAN);
		}
		return userInfo;
	}
	
	@Override
	public Long importUser(UserInfo userInfo, UserBindInfo userBindInfo, List<Avatar> avatars) {
		Long userId = null;
		Connection con = null;
		try{
			con = getDataSource().getConnection();
			con.setAutoCommit(false);
			// 导入的用户默认激活
			userInfo.setActive(true);
			userId = this.add(con, userInfo);
			// 将本地用户与第三方用户关联起来
			userBindInfo.setUserId(userId);
			userBindDao.bind(con, userBindInfo);
			
			// 关注自己
			userRelationDao.watch(con, userId, userId);
			// 添加一条值都为0的统计记录
			userStatisticsDao.init(con, userId);
			userAvatarDao.add(con, userId, avatars);
			con.commit();
		}catch(SQLException e){
			DatabaseUtil.safeRollback(con);
			throw new DataAccessException(e);
		}catch(Exception e){
			DatabaseUtil.safeRollback(con);
			throw new DataAccessException(e);
		}finally{
			DatabaseUtil.closeConnection(con);
		}
		return userId;
	}
	
	private static final String SQL_UPDATE_USER = "UPDATE "
			+ "DRIP_USER_INFO "
			+ "SET "
			+ "NICK_NAME=?, "
			+ "EMAIL=?, "
			+ "SEX=? "
			+ "WHERE DBID=?";
	@Override
	public void update(UserInfo userInfo) {
		DatabaseUtil.update(getDataSource(), SQL_UPDATE_USER, userInfo.getNickName(), userInfo.getEmail(), userInfo.getSex(), userInfo.getId());
	}

	
	
	
	
	
	
	
	
	
	
	
	/*
	 	// 后面的操作移到用户激活成功之后？
		// 在关联表中添加一条记录，自己关联自己,本地用户也需要添加一个关联关系
		// 不需要添加一个字段来标识是不是本地用户，只要两个用户标识相等，则必是本地用户，代码中根据这个逻辑判断。
		userBindDao.bind(con, userId, userId, true);
		
		// 添加完用户之后，需要在用户关系表中，添加一条用户关注用户自己的记录
		userRelationDao.watch(con, userId, userId);
		// 为本网站用户添加初始的统计信息
		localUserStatisticsDao.init(con, userId);
	 */

	// 在插入记录时，如果nickName为空，则插入登录名
	private static final String SQL_GET_LOGIN = "SELECT " +
			"DBID \"userId\", " +
			"REAL_NAME \"realName\", " +
			"NICK_NAME \"nickName\" " +
			"FROM DRIP_GLOBAL_USER_INFO WHERE DBID=?";
	@Override
	public Map<String, Object> getLoginInfo(Long userId) {
		return DatabaseUtil.queryForMap(getDataSource(), SQL_GET_LOGIN, userId);
	}
	
	
	
	
	
	
	
	private static final String SQL_GET_LOCAL_USER_ID_BY_DIGITAL = "SELECT DBID FROM DRIP_GLOBAL_USER_INFO WHERE DIGITAL_ID=?";
	@Override
	public Long getLocalUserIdByDigitalId(Long digitalId) {
		return DatabaseUtil.queryForLong(getDataSource(), SQL_GET_LOCAL_USER_ID_BY_DIGITAL, digitalId);
	}
	
	private static final String SQL_GET_USER_BY_DBID = SQL_GET_USER_INFO_FOR_SELF + "WHERE DBID=?";
	@Override
	public UserInfo getBaseInfoByLocalUserId(Long localUserId) {
		// 先查询是否引用第三方网站的用户信息，如果引用，则返回第三方网站的用户；
		// 否则返回本网站用户信息
		Long connectUserId = userBindDao.getRefUserId(localUserId);
		
		if(connectUserId == null){
			connectUserId = localUserId;
		}
		return DatabaseUtil.queryForObject(getDataSource(), SQL_GET_USER_BY_DBID, new UserInfoRowMapper(), connectUserId);
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
	
	public void setUserBindDao(UserBindDao userBindDao) {
		logger.info("注入userBindDao");
		this.userBindDao = userBindDao;
	}
	public void unsetUserBindDao(UserBindDao userBindDao) {
		if (this.userBindDao == userBindDao) {
			logger.info("注销userBindDao");
			this.userBindDao = null;
		}
	}
	
	public void setUserAvatarDao(UserAvatarDao userAvatarDao) {
		logger.info("注入userAvatarDao");
		this.userAvatarDao = userAvatarDao;
	}
	public void unsetUserAvatarDao(UserAvatarDao userAvatarDao) {
		if (this.userAvatarDao == userAvatarDao) {
			logger.info("注销userAvatarDao");
			this.userAvatarDao = null;
		}
	}
	
	public void setConnectUserDao(ConnectUserDao connectUserDao) {
		logger.info("注入connectUserDao");
		this.connectUserDao = connectUserDao;
	}
	public void unsetConnectUserDao(ConnectUserDao connectUserDao) {
		if (this.connectUserDao == connectUserDao) {
			logger.info("注销connectUserDao");
			this.connectUserDao = null;
		}
	}
	
	public void setUserAttributesDao(UserAttributesDao userAttributesDao) {
		logger.info("注入userAttributesDao");
		this.userAttributesDao = userAttributesDao;
	}
	public void unsetUserAttributesDao(UserAttributesDao userAttributesDao) {
		if (this.userAttributesDao == userAttributesDao) {
			logger.info("注销userAttributesDao");
			this.userAttributesDao = null;
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
