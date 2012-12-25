package com.zizibujuan.drip.server.service.impl;

import java.util.Map;

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
	public Map<String,Object> getUserMapperInfo(int authSiteId, String oauthUserId) {
		return oAuthUserMapDao.getUserMapperInfo(authSiteId, oauthUserId);
	}

	@Override
	public Map<String,Object> getUserMapperInfo(int authSiteId, int oauthUserId) {
		String sOauthUserId = String.valueOf(oauthUserId);
		return oAuthUserMapDao.getUserMapperInfo(authSiteId, sOauthUserId);
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
