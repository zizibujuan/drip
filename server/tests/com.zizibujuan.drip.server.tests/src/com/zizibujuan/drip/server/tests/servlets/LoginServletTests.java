package com.zizibujuan.drip.server.tests.servlets;

import static org.junit.Assert.assertEquals;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;


import org.junit.BeforeClass;
import org.junit.Test;

import com.zizibujuan.dbaccess.mysql.service.DataSourceHolder;
import com.zizibujuan.drip.server.tests.AbstractServletTests;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;
import com.zizibujuan.drip.server.util.json.JsonUtil;

/**
 * 测试用户登录方法,使用用户名或邮箱都可以登录成功
 * 
 * @author jzw
 * @since 0.0.1
 */
public class LoginServletTests extends AbstractServletTests{

	private static DataSource dataSource;
	
	@BeforeClass
	public static void setUpClass(){
		dataSource = DataSourceHolder.getDefault().getDataSourceService().getDataSource();
	}
	
	@Test
	public void test_login_all_input_is_blank() throws IOException{
		params.put("login", " ");
		params.put("password", "");
		initPostServlet("login/form");
		assertEquals(HttpServletResponse.SC_PRECONDITION_FAILED, response.getResponseCode());
		String jsonString = response.getText();
		List<String> errors = JsonUtil.fromJsonArray(jsonString, List.class, String.class);
		assertEquals("请输入邮箱或用户名", errors.get(0));
		assertEquals("请输入密码", errors.get(1));
	}
	
	@Test
	public void test_login_user_not_exist() throws IOException{
		params.put("login", "a@a.com");
		params.put("password", "abc123");
		initPostServlet("login/form");
		assertEquals(HttpServletResponse.SC_NOT_FOUND, response.getResponseCode());
		String jsonString = response.getText();
		List<String> errors = JsonUtil.fromJsonArray(jsonString, List.class, String.class);
		assertEquals("用户名或密码错误", errors.get(0));
	}
	
	@Test
	public void test_login_with_email_success() throws IOException{
		String email = "a@a.com";
		try{
			params.put("email", email);
			params.put("password", "abc123");
			params.put("loginName", "user1");
			initPostServlet("users");
			
			params = new HashMap<String, String>();
			params.put("login", "a@a.com");
			params.put("password", "abc123");
			initPostServlet("login/form");
			assertEquals(HttpServletResponse.SC_OK, response.getResponseCode());
			String jsonString = response.getText();
			assertEquals("{}", jsonString);
		}finally{
			// 删除用户相关属性
			DatabaseUtil.update(dataSource, "DELETE FROM DRIP_USER_ATTRIBUTES");
			DatabaseUtil.update(dataSource, "DELETE FROM DRIP_USER_INFO  WHERE EMAIL=?", email);
		}
	}
	
	@Test
	public void test_login_with_loginName_success() throws IOException{
		String email = "a@a.com";
		try{
			params.put("email", email);
			params.put("password", "abc123");
			params.put("loginName", "user1");
			initPostServlet("users");
			
			params = new HashMap<String, String>();
			params.put("login", "user1");
			params.put("password", "abc123");
			initPostServlet("login/form");
			assertEquals(HttpServletResponse.SC_OK, response.getResponseCode());
			String jsonString = response.getText();
			assertEquals("{}", jsonString);
		}finally{
			// 删除用户相关属性
			DatabaseUtil.update(dataSource, "DELETE FROM DRIP_USER_ATTRIBUTES");
			DatabaseUtil.update(dataSource, "DELETE FROM DRIP_USER_INFO  WHERE EMAIL=?", email);
		}
	}
}
