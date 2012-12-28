package com.zizibujuan.drip.server.service.impl;

import java.util.Map;

import org.apache.commons.codec.digest.DigestUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.zizibujuan.drip.server.dao.UserAttributesDao;
import com.zizibujuan.drip.server.dao.UserAvatarDao;
import com.zizibujuan.drip.server.dao.UserDao;
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
	
	@Override
	public Map<String, Object> getPublicInfo(Long mapUserId) {
		Map<String,Object> userInfo = userDao.getPublicInfo(mapUserId);
		Map<String,Object> avatarInfo = userAvatarDao.get(mapUserId);
		userInfo.putAll(avatarInfo);
		return userInfo;
	}
	
	@Override
	public Map<String, Object> login(Long localUserId, Long mapUserId) {
		// 如果localUserId与mapUserId相等，则从drip_user_info中获取用户信息
		// 如果不相等，则从drip_connect_user_info中获取
		userAttributesDao.updateLoginState(mapUserId);
		if(localUserId.equals(mapUserId)){
			return userDao.getSimple(localUserId);
		}else{
			// 只获取统计信息，用户的其余信息实时来自第三方网站
			return userDao.getUserStatistics(localUserId);
		}
		
	}
	
	@Override
	public Map<String,Object> importUser(Map<String, Object> userInfo) {
		return userDao.importUser(userInfo);
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
	
}
