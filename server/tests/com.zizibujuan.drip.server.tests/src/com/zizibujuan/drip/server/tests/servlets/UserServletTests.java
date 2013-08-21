package com.zizibujuan.drip.server.tests.servlets;

import javax.servlet.http.HttpServletResponse;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

import com.zizibujuan.drip.server.tests.AbstractServletTests;
// 约定：测试用例中将正常逻辑放在最前面
/**
 * 测试用户注册
 * @author jzw
 * @since 0.0.1
 */
public class UserServletTests extends AbstractServletTests{

	/**
	 * 注册成功
	 * url: users
	 * method: POST
	 * params:
	 * 		loginName
	 * 		password
	 * 		email
	 * 
	 * 注册成功之后，返回状态码200
	 * 
	 * 跳转到激活邮箱页面
	 */
	@Test
	public void signup_success(){
		params.put("login", "user1");
		params.put("password", "aaa111,,,");
		params.put("email", "a@a.com");
		
		// TODO: servlet中改为使用UserInfo
		
		initPostServlet("users");
		
		assertEquals(HttpServletResponse.SC_OK, response.getResponseCode());
		
	}
}
