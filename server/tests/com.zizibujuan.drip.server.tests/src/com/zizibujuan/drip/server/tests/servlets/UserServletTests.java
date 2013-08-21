package com.zizibujuan.drip.server.tests.servlets;


import static org.junit.Assert.assertEquals;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.junit.Test;

import com.zizibujuan.drip.server.tests.AbstractServletTests;
import com.zizibujuan.drip.server.util.json.JsonUtil;
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
	public void register_success(){
		params.put("email", "a@a.com");
		params.put("password", "aaa111,,,");
		params.put("loginName", "user1");
		
		initPostServlet("users");
		
		assertEquals(HttpServletResponse.SC_OK, response.getResponseCode());
	}
	
	@Test
	public void register_all_input_is_blank() throws IOException{
		params.put("email", "");
		params.put("password", "");
		params.put("loginName", "");
		
		initPostServlet("users");
		assertEquals(HttpServletResponse.SC_PRECONDITION_FAILED, response.getResponseCode());
		
		String jsonString = response.getText();
		List<String> errors = JsonUtil.fromJsonArray(jsonString, List.class, String.class);
		assertEquals("请输入常用邮箱", errors.get(0));
		assertEquals("请输入密码", errors.get(1));
		assertEquals("请输入用户名", errors.get(2));
	}
	
	@Test
	public void register_password_input_is_blank() throws IOException{
		params.put("email", "a@a.com");
		params.put("password", "");
		params.put("loginName", "user1");
		
		initPostServlet("users");
		assertEquals(HttpServletResponse.SC_PRECONDITION_FAILED, response.getResponseCode());
		
		String jsonString = response.getText();
		List<String> errors = JsonUtil.fromJsonArray(jsonString, List.class, String.class);
		assertEquals("请输入密码", errors.get(0));
	}
}
