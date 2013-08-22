package com.zizibujuan.drip.server.service.impl;

import java.util.Map;

import org.apache.commons.codec.digest.DigestUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.zizibujuan.drip.server.dao.ConnectUserDao;
import com.zizibujuan.drip.server.dao.LocalUserStatisticsDao;
import com.zizibujuan.drip.server.dao.UserAttributesDao;
import com.zizibujuan.drip.server.dao.UserAvatarDao;
import com.zizibujuan.drip.server.dao.UserBindDao;
import com.zizibujuan.drip.server.dao.UserDao;
import com.zizibujuan.drip.server.model.UserInfo;
import com.zizibujuan.drip.server.service.ApplicationPropertyService;
import com.zizibujuan.drip.server.service.UserService;

/**
 * 用户服务实现类
 * @author jinzw
 * @since 0.0.1
 */
public class UserServiceImpl implements UserService {

	private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);
	private UserDao userDao;
	private UserAttributesDao userAttributesDao;
	private UserAvatarDao userAvatarDao;
	private ConnectUserDao connectUserDao;
	private ApplicationPropertyService applicationPropertyService;
	private UserBindDao userBindDao;
	private LocalUserStatisticsDao localUserStatisticsDao;

	// FIXME:学习如何加入salt，明白加入salt有哪些具体好处
	@Override
	public Long add(UserInfo userInfo) {
		String salt = "";
		String password = userInfo.getPassword();
		String md5Password = DigestUtils.md5Hex(password+salt);
		userInfo.setPassword(md5Password);
		// userInfo.put("salt", salt);
		
		return userDao.add(userInfo);
	}

	@Override
	public Map<String,Object> login(String email, String password) {
		// 根据邮箱和密码查找用户信息
		// 如果查到了，则保存在session中。
		String md5Password = DigestUtils.md5Hex(password);
		Map<String,Object> userInfo = userDao.get(email, md5Password);
		
		if(userInfo.isEmpty()){
			return null;
		}else{
			Long userId = Long.valueOf(userInfo.get("id").toString());
			userInfo.put("connectUserId", userId);
			userInfo.put("localUserId", userId);// 在本网站创建的用户localUserId与connectUserId相同
			userAttributesDao.updateLoginState(userId);
			Map<String,Object> avatarInfo = userAvatarDao.get(userId);
			userInfo.putAll(avatarInfo);

			return userInfo;
		}
	}
	
	//TODO:需要将获取本地用户信息和获取第三方用户信息的接口统一。
	@Override
	public Map<String, Object> login(Long localUserId, Long connectUserId) {
		userAttributesDao.updateLoginState(connectUserId);
		
		// 第三方网站注册用户
		// 获取基本信息
		Map<String,Object> userInfo = connectUserDao.getPublicInfo(connectUserId);
		userInfo.put("localUserId", localUserId);
		// 获取头像信息
		Map<String,Object> avatarInfo = userAvatarDao.get(connectUserId);
		userInfo.putAll(avatarInfo);

		return userInfo;
	}
	
	// 获取基本信息
	// 获取统计信息
	// 获取头像信息
	@Override
	public Map<String, Object> getPublicInfo(Long localGlobalUserId) {
		// TODO：需要缓存
		Map<String,Object> userInfo = null;
		// 先从映射关系表中获取信息。
		Map<String, Object> mapUserInfo = userBindDao.getRefUserMapperInfo(localGlobalUserId);
		if(mapUserInfo.isEmpty()){
			return mapUserInfo;
		}
		
		// 注意，该connectUserId是与本地用户引用用户信息的帐号，与参数中的connectGlobalUserId可能不是同一个帐号
		Long connectUserId = Long.valueOf(mapUserInfo.get("connectUserId").toString());
		
		// TODO:获取用户家乡所在地和用户性别代码。将用户家乡所在地缓存
		// 从propertyService中获取城市名称，该方法要支持缓存。
		userInfo = connectUserDao.getPublicInfo(connectUserId);
		userInfo.put("localUserId", localGlobalUserId);
		String cityCode = (String) userInfo.get("homeCityCode");
		if(cityCode != null && !cityCode.isEmpty()){
			userInfo.put("homeCity", applicationPropertyService.getCity(cityCode));
		}
		// 这个统计数据是所有关联用户和本网站用户的数据之和。
		Map<String,Object> statistics = localUserStatisticsDao.getUserStatistics(localGlobalUserId);
		userInfo.putAll(statistics);
			
		Map<String,Object> avatarInfo = userAvatarDao.get(connectUserId);
		userInfo.putAll(avatarInfo);
		return userInfo;
	}
	
	@Override
	public Map<String, Object> getSimpleInfo(Long digitalId) {
		Long localUserId = userDao.getLocalUserIdByDigitalId(digitalId);
		
		Map<String, Object> mapUserInfo = userBindDao.getRefUserMapperInfo(localUserId);
		if(mapUserInfo.isEmpty()){
			return mapUserInfo;
		}
		// 注意，该connectUserId是与本地用户引用用户信息的帐号，与参数中的connectGlobalUserId可能不是同一个帐号
		Long connectUserId = Long.valueOf(mapUserInfo.get("connectUserId").toString());
		Map<String, Object>userInfo = connectUserDao.getPublicInfo(connectUserId);
		userInfo.put("localUserId", localUserId);
		Map<String,Object> avatarInfo = userAvatarDao.get(connectUserId);
		userInfo.putAll(avatarInfo);
		Map<String,Object> statistics = localUserStatisticsDao.getUserStatistics(localUserId);
		userInfo.putAll(statistics);
		return userInfo;
	}
	
	@Override
	public Map<String,Object> importUser(Map<String, Object> userInfo) {
		return userDao.importUser(userInfo);
	}
	
	@Override
	public Map<String, Object> syncUserInfo(Map<String, Object> userInfo) {
		throw new UnsupportedOperationException();
	}

	@Override
	public Map<String, Object> getLoginInfo(Long userId) {
		return userDao.getLoginInfo(userId);
	}
	
	@Override
	public Map<String, Object> getLocalUserStatistics(Long localUserId) {
		return localUserStatisticsDao.getUserStatistics(localUserId);
	}

	@Override
	public boolean emailIsExist(String email) {
		return userDao.emailIsExist(email);
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
	
	public void setApplicationPropertyService(ApplicationPropertyService applicationPropertyService) {
		logger.info("注入applicationPropertyService");
		this.applicationPropertyService = applicationPropertyService;
	}

	public void unsetApplicationPropertyService(ApplicationPropertyService applicationPropertyService) {
		if (this.applicationPropertyService == applicationPropertyService) {
			logger.info("注销applicationPropertyService");
			this.applicationPropertyService = null;
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
