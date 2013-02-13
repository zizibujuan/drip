package com.zizibujuan.drip.server.tests.service;

import java.util.Map;

import junit.framework.Assert;

import org.junit.Test;

import com.zizibujuan.drip.server.service.OAuthUserMapService;
import com.zizibujuan.drip.server.servlet.ServiceHolder;

/**
 * 用户映射关系测试用例
 * @author jzw
 * @since 0.0.1
 */
public class OAuthUserMapServiceTests extends AbstractUserTests{

	@Test
	public void testGetMapUserInfo(){
		try{
			OAuthUserMapService oAuthUserMapService = ServiceHolder.getDefault().getOAuthUserMapService();
			Map<String,Object> userMapperInfo = oAuthUserMapService.getUserMapperInfo(siteId, oauthUserId);
			Assert.assertTrue(userMapperInfo.isEmpty());
			
			importUser();
			
			userMapperInfo = oAuthUserMapService.getUserMapperInfo(siteId, oauthUserId);
			Assert.assertFalse(userMapperInfo.isEmpty());
		}finally{
			super.reset();
		}
	}
}
