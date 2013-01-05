package com.zizibujuan.drip.server.tests.servlets;

import java.util.HashMap;
import java.util.Map;

import org.junit.Test;

import com.meterware.httpunit.PostMethodWebRequest;
import com.meterware.httpunit.WebConversation;

/**
 * 关注用户测试类
 * @author jzw
 * @since 0.0.1
 */
public class FollowServletTests {
	protected static final String SERVER_LOCATION = "http://localhost:8199";
	/**
	 * 关注<br/>
	 * 请求信息为：
	 * /follow/userId
	 * <p>
	 * 1.新建两个用户，testA, testB
	 * 2.testA关注testB
	 * 3.testA有1个关注者， testB有0个关注者（注意统计时不显示关注自个）
	 * 4.testA有0个粉丝，testB有一个粉丝
	 * </p>
	 */
	@Test
	public void testWatch(){
		// 调用服务接口，从人人导入数据
		WebConversation webConversation = new WebConversation();
		Map<String,String> params = new HashMap<String, String>();
		PostMethodWebRequest followRequest = new PostMethodWebRequest(SERVER_LOCATION+"/follow/");
	}
	
	@Test
	public void testCancelWatch(){
		
	}
}
