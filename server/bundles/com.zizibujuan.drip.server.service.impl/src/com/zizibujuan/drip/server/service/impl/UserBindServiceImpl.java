package com.zizibujuan.drip.server.service.impl;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.zizibujuan.drip.server.dao.UserBindDao;
import com.zizibujuan.drip.server.service.UserBindService;

/**
 * 帐号关联表 业务逻辑实现类
 * @author jzw
 * @since 0.0.1
 *
 */
public class UserBindServiceImpl implements UserBindService {

	private static final Logger logger = LoggerFactory.getLogger(UserBindServiceImpl.class);
	private UserBindDao userBindDao;
	
	@Override
	public Map<String,Object> getUserMapperInfo(int siteId, String userId) {
		return userBindDao.getUserMapperInfo(siteId, userId);
	}

	@Override
	public Map<String,Object> getUserMapperInfo(int siteId, int userId) {
		String sUserId = String.valueOf(userId);
		return userBindDao.getUserMapperInfo(siteId, sUserId);
	}
	
	
	public void setUserBindDao(UserBindDao userBindDao) {
		logger.info("注入userBindDao");
		this.userBindDao = userBindDao;
	}

	public void unsetUserBindDao(UserBindDao userBindDao) {
		if (this.userBindDao == userBindDao) {
			logger.info("注销oAuthUserMapDao");
			this.userBindDao = null;
		}
	}

}
