package com.zizibujuan.drip.server.tests.servlets;


import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.junit.Test;

import com.zizibujuan.drip.server.model.UserInfo;
import com.zizibujuan.drip.server.tests.AbstractServletTests;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;
import com.zizibujuan.drip.server.util.json.JsonUtil;

/**
 * 测试用户注册
 * 
 * @author jzw
 * @since 0.0.1
 */
public class UserServletTests extends AbstractServletTests{

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
	
	@Test
	public void register_email_input_is_too_long() throws IOException{
		params.put("email", StringUtils.repeat("a", 65));
		params.put("password", "aaa111,,,");
		params.put("loginName", "user1");
		
		initPostServlet("users");
		assertEquals(HttpServletResponse.SC_PRECONDITION_FAILED, response.getResponseCode());
		
		String jsonString = response.getText();
		List<String> errors = JsonUtil.fromJsonArray(jsonString, List.class, String.class);
		assertEquals("邮箱不能超过50个字符", errors.get(0));
	}
	
	@Test
	public void register_email_input_is_not_valid() throws IOException{
		params.put("email", "1");
		params.put("password", "aaa111,,,");
		params.put("loginName", "user1");
		
		initPostServlet("users");
		assertEquals(HttpServletResponse.SC_PRECONDITION_FAILED, response.getResponseCode());
		
		String jsonString = response.getText();
		List<String> errors = JsonUtil.fromJsonArray(jsonString, List.class, String.class);
		assertEquals("邮箱格式不正确", errors.get(0));
	}
	
	@Test
	public void register_password_input_is_space() throws IOException{
		params.put("email", "a@a.com");
		params.put("password", StringUtils.repeat(" ", 10));
		params.put("loginName", "user1");
		
		initPostServlet("users");
		assertEquals(HttpServletResponse.SC_PRECONDITION_FAILED, response.getResponseCode());
		
		String jsonString = response.getText();
		List<String> errors = JsonUtil.fromJsonArray(jsonString, List.class, String.class);
		assertEquals("密码不能全为空格", errors.get(0));
	}

	@Test
	public void register_password_input_is_too_small() throws IOException{
		params.put("email", "a@a.com");
		params.put("password", "12345");
		params.put("loginName", "user1");
		
		initPostServlet("users");
		assertEquals(HttpServletResponse.SC_PRECONDITION_FAILED, response.getResponseCode());
		
		String jsonString = response.getText();
		List<String> errors = JsonUtil.fromJsonArray(jsonString, List.class, String.class);
		assertEquals("密码长度应为6到20个字符", errors.get(0));
	}

	@Test
	public void register_password_input_is_too_long() throws IOException{
		params.put("email", "a@a.com");
		params.put("password", "123456789012345678901");
		params.put("loginName", "user1");
		
		initPostServlet("users");
		assertEquals(HttpServletResponse.SC_PRECONDITION_FAILED, response.getResponseCode());
		
		String jsonString = response.getText();
		List<String> errors = JsonUtil.fromJsonArray(jsonString, List.class, String.class);
		assertEquals("密码长度应为6到20个字符", errors.get(0));
	}
	
	@Test
	public void register_password_input_is_all_number() throws IOException{
		params.put("email", "a@a.com");
		params.put("password", "1234567890");
		params.put("loginName", "user1");
		
		initPostServlet("users");
		assertEquals(HttpServletResponse.SC_PRECONDITION_FAILED, response.getResponseCode());
		
		String jsonString = response.getText();
		List<String> errors = JsonUtil.fromJsonArray(jsonString, List.class, String.class);
		assertEquals("密码不能全为数字", errors.get(0));
	}
	
	@Test
	public void register_password_input_is_all_letter() throws IOException{
		params.put("email", "a@a.com");
		params.put("password", "abcdefg");
		params.put("loginName", "user1");
		
		initPostServlet("users");
		assertEquals(HttpServletResponse.SC_PRECONDITION_FAILED, response.getResponseCode());
		
		String jsonString = response.getText();
		List<String> errors = JsonUtil.fromJsonArray(jsonString, List.class, String.class);
		assertEquals("密码不能全为字母", errors.get(0));
	}

	/**
	 * 有关测试用户名有效性的正则表达式的测试，参考{@link RegexTests}
	 * @throws IOException
	 */
	@Test
	public void register_loginName_input_should_begin_with_letter_or_number() throws IOException{
		params.put("email", "a@a.com");
		params.put("password", "abc123");
		params.put("loginName", "-abc");
		
		initPostServlet("users");
		assertEquals(HttpServletResponse.SC_PRECONDITION_FAILED, response.getResponseCode());
		
		String jsonString = response.getText();
		List<String> errors = JsonUtil.fromJsonArray(jsonString, List.class, String.class);
		assertEquals("用户名只能包含英文字母，数字,-或_，不能以-或_开头，不区分大小写", errors.get(0));
	}

	@Test
	public void register_loginName_input_is_too_long() throws IOException{
		params.put("email", "a@a.com");
		params.put("password", "abc123");
		params.put("loginName", StringUtils.repeat("a", 21));
		
		initPostServlet("users");
		assertEquals(HttpServletResponse.SC_PRECONDITION_FAILED, response.getResponseCode());
		
		String jsonString = response.getText();
		List<String> errors = JsonUtil.fromJsonArray(jsonString, List.class, String.class);
		assertEquals("用户名不能多于20个字符", errors.get(0));
	}

	@Test
	public void register_loginName_input_is_too_long_contain_chinese() throws IOException{
		params.put("email", "a@a.com");
		params.put("password", "abc123");
		params.put("loginName", StringUtils.repeat("一", 10) + "a");
		
		initPostServlet("users");
		assertEquals(HttpServletResponse.SC_PRECONDITION_FAILED, response.getResponseCode());
		
		String jsonString = response.getText();
		List<String> errors = JsonUtil.fromJsonArray(jsonString, List.class, String.class);
		assertEquals("用户名不能多于20个字符", errors.get(0));
	}
	
	@Test
	public void register_loginName_input_is_used() throws IOException{
		String email = "a@a.com";
		try{
			// 先注册一次
			params.put("email", email);
			params.put("password", "aaa111,,,");
			params.put("loginName", "user1");
			
			initPostServlet("users");
			assertEquals(HttpServletResponse.SC_OK, response.getResponseCode());
			
			// 然后再注册一次
			params = new HashMap<String, String>();
			params.put("email", "b@b.com");
			params.put("password", "aaa111,,,");
			params.put("loginName", "user1");
			
			initPostServlet("users");
			assertEquals(HttpServletResponse.SC_PRECONDITION_FAILED, response.getResponseCode());
			String jsonString = response.getText();
			List<String> errors = JsonUtil.fromJsonArray(jsonString, List.class, String.class);
			assertEquals("该用户名已注册，<a href=\"javascript:\">直接登录</a>", errors.get(0));
		}finally{
			DatabaseUtil.update(dataSource, "DELETE FROM DRIP_USER_ATTRIBUTES");
			DatabaseUtil.update(dataSource, "DELETE FROM DRIP_USER_INFO  WHERE EMAIL=?", email);
		}
	}

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
	 * @throws IOException 
	 */
	// 注册用户，暂不支持数字帐号，没有存在的必要，也不好记，一个登录名足矣。
	@Test
	public void register_success() throws IOException{
		String email = "a@a.com";
		try{			
			params.put("email", email);
			params.put("password", "aaa111,,,");
			params.put("loginName", "user1");
			
			initPostServlet("users");
			assertEquals(HttpServletResponse.SC_OK, response.getResponseCode());
			
			String jsonString = response.getText();
			assertEquals("{}", jsonString);
			
		}finally{
			DatabaseUtil.update(dataSource, "DELETE FROM DRIP_USER_ATTRIBUTES");
			DatabaseUtil.update(dataSource, "DELETE FROM DRIP_USER_INFO  WHERE EMAIL=?", email);
		}
	}

	@Test
	public void register_email_input_is_used() throws IOException{
		String email = "a@a.com";
		try{
			// 先注册一次
			params.put("email", email);
			params.put("password", "aaa111,,,");
			params.put("loginName", "user1");
			
			initPostServlet("users");
			assertEquals(HttpServletResponse.SC_OK, response.getResponseCode());
			
			// 然后再注册一次
			params = new HashMap<String, String>();
			params.put("email", email);
			params.put("password", "aaa111,,,");
			params.put("loginName", "user2");
			
			initPostServlet("users");
			assertEquals(HttpServletResponse.SC_PRECONDITION_FAILED, response.getResponseCode());
			String jsonString = response.getText();
			List<String> errors = JsonUtil.fromJsonArray(jsonString, List.class, String.class);
			assertEquals("该邮箱已注册，<a href=\"javascript:\">直接登录</a>", errors.get(0));
		}finally{
			DatabaseUtil.update(dataSource, "DELETE FROM DRIP_USER_ATTRIBUTES");
			DatabaseUtil.update(dataSource, "DELETE FROM DRIP_USER_INFO  WHERE EMAIL=?", email);
		}
		
	}

	@Test
	public void get_user_info_logged() throws IOException{
		String email = "a@a.com";
		try{			
			params.put("email", email);
			params.put("password", "aaa111,,,");
			params.put("loginName", "user1");
			
			initPostServlet("users");
			assertEquals(HttpServletResponse.SC_OK, response.getResponseCode());
			
			initGetServlet("users");
			assertEquals(HttpServletResponse.SC_OK, response.getResponseCode());
			UserInfo userInfo = getResponseData(UserInfo.class);
			assertEquals(email, userInfo.getEmail());
			assertEquals("user1", userInfo.getLoginName());
			assertNull(userInfo.getPassword());
		}finally{
			DatabaseUtil.update(dataSource, "DELETE FROM DRIP_USER_ATTRIBUTES");
			DatabaseUtil.update(dataSource, "DELETE FROM DRIP_USER_INFO  WHERE EMAIL=?", email);
		}
	}
	
	@Test
	public void get_user_info_by_loginName() throws IOException{
		String email = "a@a.com";
		try{			
			params.put("email", email);
			params.put("password", "aaa111,,,");
			params.put("loginName", "user1");
			
			initPostServlet("users");
			assertEquals(HttpServletResponse.SC_OK, response.getResponseCode());
			
			initGetServlet("users/user1");
			assertEquals(HttpServletResponse.SC_OK, response.getResponseCode());
			UserInfo userInfo = getResponseData(UserInfo.class);
			assertNull(userInfo.getEmail()); // 暂不支持获取其他人邮箱的功能
			assertEquals("user1", userInfo.getLoginName());
			assertNull(userInfo.getPassword());
		}finally{
			DatabaseUtil.update(dataSource, "DELETE FROM DRIP_USER_ATTRIBUTES");
			DatabaseUtil.update(dataSource, "DELETE FROM DRIP_USER_INFO  WHERE EMAIL=?", email);
		}
	}
}
