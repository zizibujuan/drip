package com.zizibujuan.drip.server.tests.servlets;


import static org.junit.Assert.assertEquals;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

import org.apache.commons.lang3.StringUtils;
import org.junit.BeforeClass;
import org.junit.Test;

import com.zizibujuan.dbaccess.mysql.service.DataSourceHolder;
import com.zizibujuan.dbaccess.mysql.service.DataSourceService;
import com.zizibujuan.drip.server.model.UserInfo;
import com.zizibujuan.drip.server.service.UserService;
import com.zizibujuan.drip.server.servlet.ServiceHolder;
import com.zizibujuan.drip.server.tests.AbstractServletTests;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;
import com.zizibujuan.drip.server.util.json.JsonUtil;
// 约定：测试用例中将正常逻辑放在最前面
/**
 * 测试用户注册
 * @author jzw
 * @since 0.0.1
 */
public class UserServletTests extends AbstractServletTests{

	private static UserService userService;
	private static DataSource dataSource;
	
	@BeforeClass
	public static void setUpClass(){
		userService = ServiceHolder.getDefault().getUserService();
		dataSource = DataSourceHolder.getDefault().getDataSourceService().getDataSource();
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
	
	// 如果用户没有激活，则？
	@Test
	public void register_email_input_is_used() throws IOException{
		
		Long dbid = null;
		try{
			UserInfo userInfo = null;
			userInfo = new UserInfo();
			userInfo.setEmail("a@a.com");
			userInfo.setLoginName("user0");
			userInfo.setPassword("aaabbb,,,");
			
			dbid = userService.add(userInfo);
			
			params.put("email", "a@a.com");
			params.put("password", "aaa111,,,");
			params.put("loginName", "user1");
			
			initPostServlet("users");
			assertEquals(HttpServletResponse.SC_PRECONDITION_FAILED, response.getResponseCode());
			
			String jsonString = response.getText();
			List<String> errors = JsonUtil.fromJsonArray(jsonString, List.class, String.class);
			assertEquals("邮箱格式不正确", errors.get(0));
		}finally{
			if(dbid != null){
				DatabaseUtil.update(dataSource, "DELETE FROM DRIP_GLOBAL_USER_INFO  WHERE DBID=?", dbid);
			}
		}
		
	}
	
}
