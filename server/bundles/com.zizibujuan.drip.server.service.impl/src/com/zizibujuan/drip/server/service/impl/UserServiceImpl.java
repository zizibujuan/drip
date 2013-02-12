package com.zizibujuan.drip.server.service.impl;

import java.util.Map;

import org.apache.commons.codec.digest.DigestUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.zizibujuan.drip.server.dao.ConnectUserDao;
import com.zizibujuan.drip.server.dao.OAuthUserMapDao;
import com.zizibujuan.drip.server.dao.UserAttributesDao;
import com.zizibujuan.drip.server.dao.UserAvatarDao;
import com.zizibujuan.drip.server.dao.UserDao;
import com.zizibujuan.drip.server.service.ApplicationPropertyService;
import com.zizibujuan.drip.server.service.OAuthUserMapService;
import com.zizibujuan.drip.server.service.UserService;
import com.zizibujuan.drip.server.util.OAuthConstants;

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
	private OAuthUserMapDao oAuthUserMapDao;
	
	// FIXME:学习如何加入salt，明白加入salt有哪些具体好处
	@Override
	public Long add(Map<String, Object> userInfo) {
		String salt = "";
		String password = userInfo.get("password").toString();
		String md5Password = DigestUtils.md5Hex(password+salt);
		userInfo.put("md5Password", md5Password);
		userInfo.put("salt", salt);
		
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
			String userId = userInfo.get("id").toString();
			userAttributesDao.updateLoginState(Long.valueOf(userId));
			return userInfo;
		}
	}
	
	// 获取基本信息
	// 获取统计信息
	// 获取头像信息
	// 重新审视localUserId和mapUserId，这里的设计约定，一个localUserId对应多个mapUserId
	// mapUserId是全局唯一的标识
	// FIXME：也许应该使用mapUserId唯一定位和存储，而不是部分地方存储localUserid
	@Override
	public Map<String, Object> getPublicInfo(Long localUserId, Long mapUserId) {
		// TODO：需要缓存
		Map<String,Object> userInfo = null;
		if(userDao.isLocalUser(mapUserId)){
			userInfo = userDao.getPublicInfo(mapUserId);
			userInfo.put("mapUserId", mapUserId);
		}else{
			// TODO:获取用户家乡所在地和用户性别代码。将用户家乡所在地缓存
			// 从propertyService中获取城市名称，该方法要支持缓存。
			userInfo = connectUserDao.getPublicInfo(mapUserId);
			String cityCode = (String) userInfo.get("homeCityCode");
			if(cityCode != null && !cityCode.isEmpty()){
				userInfo.put("homeCity", applicationPropertyService.getCity(cityCode));
			}
			
			userInfo.put("id", localUserId);
			Map<String,Object> statistics = userDao.getUserStatistics(localUserId);
			userInfo.putAll(statistics);
		}
		Map<String,Object> avatarInfo = userAvatarDao.get(mapUserId);
		userInfo.putAll(avatarInfo);
		return userInfo;
	}
	
	@Override
	public Map<String, Object> getPublicInfo(Long localUserId) {
		Map<String,Object> userInfo = null;
		// 先从映射关系表中获取信息。
		Map<String, Object> mapUserInfo = oAuthUserMapDao.getRefUserMapperInfo(localUserId);
		Long connectUserId = Long.valueOf(mapUserInfo.get("connectUserId").toString());
		boolean isLocalUser = true;
		if(connectUserId == localUserId){
			// 是在本网站注册的用户
			throw new UnsupportedOperationException();
			//userInfo = userDao.getPublicInfo(localUserId);
		}else{
			// TODO:获取用户家乡所在地和用户性别代码。将用户家乡所在地缓存
			// 从propertyService中获取城市名称，该方法要支持缓存。
			userInfo = connectUserDao.getPublicInfo(connectUserId);
			// 这个统计数据是所有关联用户和本网站用户的数据之和。
			Map<String,Object> statistics = userDao.getUserStatistics(localUserId);
			userInfo.putAll(statistics);
			isLocalUser = false;
		}
		
		// 但是如何区分本网站注册用户和第三方网站用户
		Map<String,Object> avatarInfo = userAvatarDao.get(connectUserId, isLocalUser);
		userInfo.putAll(avatarInfo);
		return userInfo;
	}
	
	//TODO:需要将获取本地用户信息和获取第三方用户信息的接口统一。
	@Override
	public Map<String, Object> login(Long localUserId, Long mapUserId, int siteId) {
		// 如果localUserId与mapUserId相等，则从drip_user_info中获取用户信息
		// 如果不相等，则从drip_connect_user_info中获取
		userAttributesDao.updateLoginState(mapUserId);
		
		Map<String,Object> userInfo = null;
		if(siteId == OAuthConstants.ZIZIBUJUAN){ // 本网站注册用户
			// 获取基本信息和统计信息
			userInfo = userDao.getSimple(localUserId);
			userInfo.put("site", siteId); // 注明是使用人人帐号登录的
			userInfo.put("mapUserId", mapUserId);
			// 获取头像信息
			Map<String,Object> avatarInfo = userAvatarDao.get(mapUserId);
			userInfo.putAll(avatarInfo);
			return userInfo;
		}else{
			// 第三方网站注册用户
			// 获取基本信息
			userInfo = userDao.getSimple(localUserId);
			userInfo.put("site", siteId); // 注明是使用人人帐号登录的
			userInfo.put("mapUserId", mapUserId);
			// 获取头像信息
			Map<String,Object> avatarInfo = userAvatarDao.get(mapUserId);
			userInfo.putAll(avatarInfo);
			
			// 只获取统计信息，用户的其余信息实时来自第三方网站
			userInfo = userDao.getUserStatistics(localUserId);
			// 在session中使用id表示本地用户标识
			userInfo.put("id", localUserId);
			return userInfo;
		}
		
	}
	
	// FIXME：调整导入用户逻辑，如果是使用第三方帐号第一次登录，则拷贝一份给第三方用户。
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
