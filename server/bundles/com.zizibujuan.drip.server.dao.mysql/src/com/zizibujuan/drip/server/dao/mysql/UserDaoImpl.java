package com.zizibujuan.drip.server.dao.mysql;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.zizibujuan.drip.server.dao.ConnectUserDao;
import com.zizibujuan.drip.server.dao.DigitalIdDao;
import com.zizibujuan.drip.server.dao.LocalUserStatisticsDao;
import com.zizibujuan.drip.server.dao.UserAttributesDao;
import com.zizibujuan.drip.server.dao.UserAvatarDao;
import com.zizibujuan.drip.server.dao.UserBindDao;
import com.zizibujuan.drip.server.dao.UserDao;
import com.zizibujuan.drip.server.dao.UserRelationDao;
import com.zizibujuan.drip.server.exception.dao.DataAccessException;
import com.zizibujuan.drip.server.util.OAuthConstants;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;

/**
 * 用户数据访问实现类
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
	private DigitalIdDao digitalIdDao;
	private LocalUserStatisticsDao localUserStatisticsDao;
	
	private static final String SQL_INSERT_USER = "INSERT INTO DRIP_USER_INFO " +
			"(LOGIN_NAME," +
			"NICK_NAME," +
			"EMAIL," +
			"LOGIN_PWD," +
			"MOBILE," +
			"REAL_NAME," +
			"CREATE_TIME) " +
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
			// 在关联表中添加一条记录，自己关联自己,本地用户也需要添加一个关联关系
			// 不需要添加一个字段来标识是不是本地用户，只要两个用户标识相等，则必是本地用户，代码中根据这个逻辑判断。
			userBindDao.bind(con, userId, userId, true);
			// 在用户属性表中初始化属性值
			userAttributesDao.initUserState(con, userId);
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
	// 以下信息可以存在session中，但是有些信息不能显示在客户端，如email和mobile。
	private static final String SQL_GET_USER_FOR_SESSION = "SELECT " +
			"DBID \"id\"," +
			//"LOGIN_NAME," +
			"EMAIL \"email\"," +
			//"LOGIN_PWD," + 登录密码，不在session中缓存
			//支持三种大小的头像信息
			"MOBILE \"mobile\"," +
			"REAL_NAME \"realName\"," +
			"NICK_NAME \"nickName\"," +
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
	
	private static final String SQL_GET_USER_FOR_PUBLIC = "SELECT " +
			"DBID \"id\"," +
			"REAL_NAME \"displayName\"," +
			"FAN_COUNT \"fanCount\","+
			"FOLLOW_COUNT \"followCount\","+
			"EXER_DRAFT_COUNT \"exerDraftCount\","+
			"EXER_PUBLISH_COUNT \"exerPublishCount\", "+
			"ANSWER_COUNT \"answerCount\", "+
			"EXER_DRAFT_COUNT+EXER_PUBLISH_COUNT \"exerciseCount\" " +
			"FROM DRIP_USER_INFO WHERE DBID=?";
	// FIXME:这些字段与下面的getUserStatics方法的字段大同小异，待重构
	@Override
	public Map<String, Object> getPublicInfo(Long userId) {
		// TODO：添加用户头像, 该使用drip用户标识，还是第三方网站的用户标识，使用第三方更灵活
		return DatabaseUtil.queryForMap(getDataSource(), SQL_GET_USER_FOR_PUBLIC, userId);
	}
	
	private static final String SQL_UPDATE_USER = "UPDATE DRIP_USER_INFO " +
			"SET LAST_LOGIN_TIME = now() " +
			"WHERE DBID=?";
	@Override
	public void updateLoginState(Long userId) {
		DatabaseUtil.update(getDataSource(), SQL_UPDATE_USER, userId);
	}
	
	// 在插入记录时，如果nickName为空，则插入登录名
	private static final String SQL_GET_LOGIN = "SELECT " +
			"DBID \"userId\", " +
			"REAL_NAME \"realName\", " +
			"NICK_NAME \"nickName\" " +
			"FROM DRIP_USER_INFO WHERE DBID=?";
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
	
	
	@Override
	public Map<String,Object> importUser(Map<String, Object> userInfo) {
		Map<String,Object> result = new HashMap<String, Object>();
		Long localGlobalUserId = null;
		Long connectGlobalUserId = null;
		Long digitalId = null;
		
		Connection con = null;
		
		@SuppressWarnings("unchecked")
		List<Map<String,Object>> avatarList = (List<Map<String, Object>>) userInfo.get("avatar");
		try{
			con = getDataSource().getConnection();
			con.setAutoCommit(false);
			// 存储本网站生成的用户信息
			// 本网站产生的数字帐号
			digitalId = digitalIdDao.random(con);
			localGlobalUserId = this.addLocalUser(con,digitalId);
			// 存储第三方网站的用户信息,connectGlobalUserId是本网站为第三方网站用户产生的代理主键
			connectGlobalUserId = connectUserDao.add(con, userInfo);
			// 将本地用户与第三方用户关联起来
			userBindDao.bind(con,localGlobalUserId, connectGlobalUserId, true);
			
			// 初始化用户属性表,导入的用户肯定都是第三方网站的用户。
			userAttributesDao.initUserState(con, connectGlobalUserId);
			// 自己关注自己，使用drip用户标识, 在关注的表中，也要加入connectUserId, 这样可以跟踪哪个网站的用户关注的比较多
			// 但是为了可以顺利迁移，最好存储connectUserId
			userRelationDao.watch(con, connectGlobalUserId, connectGlobalUserId);
			if(avatarList != null && avatarList.size()>0){
				userAvatarDao.add(con, connectGlobalUserId, avatarList);
			}
			// 为本网站用户添加初始的统计信息
			localUserStatisticsDao.init(con, localGlobalUserId);
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
		
		result.put("localUserId", localGlobalUserId);
		result.put("connectUserId", connectGlobalUserId);
		result.put("digitalId", digitalId);
		return result;
	}
	
	private static final String SQL_INSERT_BASE_LOCAL_USER = "INSERT INTO " +
			"DRIP_GLOBAL_USER_INFO " +
			"(DIGITAL_ID," +
			"SITE_ID, " +
			"ACTIVITY, " +
			"CREATE_TIME) " +
			"VALUES " +
			"(?,?,?,now())";
	private Long addLocalUser(Connection con, Long digitalId) throws SQLException{
		return DatabaseUtil.insert(con, SQL_INSERT_BASE_LOCAL_USER,
				digitalId,
				OAuthConstants.ZIZIBUJUAN,
				false);
	}
	
	@Override
	public Map<String, Object> getFull(Long userId) {
		// TODO Auto-generated method stub
		return null;
	}
	
	private static final String SQL_GET_OAUTH_SITE_ID = "SELECT OAUTH_SITE_ID FROM DRIP_USER_BIND WHERE DBID=?";
	// 这个方法就在这里实现，更直观些，虽然数据存储在映射表中
	@Override
	public boolean isLocalUser(Long mapUserId) {
		int siteId = DatabaseUtil.queryForInt(getDataSource(), SQL_GET_OAUTH_SITE_ID, mapUserId);
		return siteId == OAuthConstants.ZIZIBUJUAN;
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
	
	public void setDigitalIdDao(DigitalIdDao digitalIdDao) {
		logger.info("注入digitalIdDao");
		this.digitalIdDao = digitalIdDao;
	}
	public void unsetDigitalIdDao(DigitalIdDao digitalIdDao) {
		if (this.digitalIdDao == digitalIdDao) {
			logger.info("注销digitalIdDao");
			this.digitalIdDao = null;
		}
	}
	
	public void setLocalUserStatisticsDao(LocalUserStatisticsDao localUserStatisticsDao) {
		logger.info("注入localUserStatisticsDao");
		this.localUserStatisticsDao = localUserStatisticsDao;
	}
	public void unsetLocalUserStatisticsDao(LocalUserStatisticsDao localUserStatisticsDao) {
		if (this.localUserStatisticsDao == localUserStatisticsDao) {
			logger.info("注销localUserStatisticsDao");
			this.localUserStatisticsDao = null;
		}
	}
}
