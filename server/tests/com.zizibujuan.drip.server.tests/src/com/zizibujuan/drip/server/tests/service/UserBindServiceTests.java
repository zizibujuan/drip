package com.zizibujuan.drip.server.tests.service;

import java.util.Map;

import junit.framework.Assert;

import org.junit.Test;

import com.zizibujuan.drip.server.service.UserBindService;
import com.zizibujuan.drip.server.servlet.ServiceHolder;

/**
 * 用户映射关系测试用例
 * @author jzw
 * @since 0.0.1
 */
public class UserBindServiceTests extends AbstractUserTests{

	@Test
	public void testGetMapUserInfo(){
		try{
			UserBindService userBindService = ServiceHolder.getDefault().getUserBindService();
			Map<String,Object> userMapperInfo = userBindService.getUserMapperInfo(siteId, openId);
			Assert.assertTrue(userMapperInfo.isEmpty());
			
			importUser();
			
			userMapperInfo = userBindService.getUserMapperInfo(siteId, openId);
			Assert.assertFalse(userMapperInfo.isEmpty());
		}finally{
			super.deleteTestUser();
		}
	}
}
