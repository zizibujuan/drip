package com.zizibujuan.drip.server.tests.servlets;


import static org.junit.Assert.assertEquals;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

import org.apache.commons.lang3.StringUtils;
import org.junit.BeforeClass;
import org.junit.Ignore;
import org.junit.Test;

import com.zizibujuan.dbaccess.mysql.service.DataSourceHolder;
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
	 * @throws IOException 
	 */
	// 注册用户，暂不支持数字帐号，没有存在的必要，也不好记，一个登录名足矣。
	@Ignore
	@Test
	public void register_success() throws IOException{
		String email = "a@a.com";
		try{			
			// add 操作涉及到的数据库表：
			// DRIP_GLOBAL_USER_INFO      
			// DRIP_LOCAL_USER_STATISTICS 
			// DRIP_USER_ATTRIBUTES       
			// DRIP_USER_BIND             
			// DRIP_USER_NUMBER           
			// DRIP_USER_RELATION
			// FIXME：怎么依赖这么多张表呢？
			// 约定，第三方网站的帐号只用来登录，所有的操作记录的用户信息都是对应的本网站用户标识
			params.put("email", email);
			params.put("password", "aaa111,,,");
			params.put("loginName", "user1");
			
			initPostServlet("users");
			assertEquals(HttpServletResponse.SC_PRECONDITION_FAILED, response.getResponseCode());
			
			String jsonString = response.getText();
			List<String> errors = JsonUtil.fromJsonArray(jsonString, List.class, String.class);
			assertEquals("邮箱格式不正确", errors.get(0));
		}finally{
			DatabaseUtil.update(dataSource, "DELETE FROM DRIP_GLOBAL_USER_INFO  WHERE EMAIL=?", email);
		}
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
	@Ignore
	@Test
	public void register_email_input_is_used() throws IOException{
		
		Long dbid = null;
		try{
			UserInfo userInfo = null;
			userInfo = new UserInfo();
			userInfo.setEmail("a@a.com");
			userInfo.setLoginName("user0");
			userInfo.setPassword("aaabbb,,,");
			
			// add 操作涉及到的数据库表：
			// DRIP_GLOBAL_USER_INFO      
			// DRIP_LOCAL_USER_STATISTICS 
			// DRIP_USER_ATTRIBUTES       
			// DRIP_USER_BIND             
			// DRIP_USER_NUMBER           
			// DRIP_USER_RELATION
			// FIXME：怎么依赖这么多张表呢？
			// 约定，第三方网站的帐号只用来登录，所有的操作记录的用户信息都是对应的本网站用户标识
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
	 * 有关测试用户名有效性的正则表达式的测试，参考{@link LoginNameRegexTests}
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
}
