package com.zizibujuan.drip.server.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.zizibujuan.drip.server.dao.UserBindDao;
import com.zizibujuan.drip.server.model.UserBindInfo;
import com.zizibujuan.drip.server.service.UserBindService;

/**
 * 帐号关联表 业务逻辑实现类
 * 
 * @author jzw
 * @since 0.0.1
 *
 */
public class UserBindServiceImpl implements UserBindService {

	private static final Logger logger = LoggerFactory.getLogger(UserBindServiceImpl.class);
	private UserBindDao userBindDao;
	
	@Override
	public UserBindInfo get(int siteId, String openId) {
		return userBindDao.get(siteId, openId);
	}

	@Override
	public UserBindInfo getUserMapperInfo(int siteId, int openId) {
		String sUserId = String.valueOf(openId);
		return userBindDao.get(siteId, sUserId);
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
