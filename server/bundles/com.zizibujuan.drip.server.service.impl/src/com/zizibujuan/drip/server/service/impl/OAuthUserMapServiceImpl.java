package com.zizibujuan.drip.server.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.zizibujuan.drip.server.dao.OAuthUserMapDao;
import com.zizibujuan.drip.server.service.OAuthUserMapService;

/**
 * 帐号关联表 业务逻辑实现类
 * @author jzw
 * @since 0.0.1
 *
 */
public class OAuthUserMapServiceImpl implements OAuthUserMapService {

	private static final Logger logger = LoggerFactory.getLogger(OAuthUserMapServiceImpl.class);
	private OAuthUserMapDao oAuthUserMapDao;
	
	@Override
	public Long getUserId(int authSiteId, String userId) {
		return oAuthUserMapDao.getUserId(authSiteId, userId);
	}

	@Override
	public Long getUserId(int authSiteId, int userId) {
		String sUserId = String.valueOf(userId);
		return oAuthUserMapDao.getUserId(authSiteId, sUserId);
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
