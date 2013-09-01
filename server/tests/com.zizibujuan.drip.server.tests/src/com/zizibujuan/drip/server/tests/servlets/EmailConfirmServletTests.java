package com.zizibujuan.drip.server.tests.servlets;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

import org.junit.BeforeClass;
import org.junit.Test;
import org.xml.sax.SAXException;

import com.zizibujuan.dbaccess.mysql.service.DataSourceHolder;
import com.zizibujuan.drip.server.model.UserInfo;
import com.zizibujuan.drip.server.service.UserService;
import com.zizibujuan.drip.server.servlet.ServiceHolder;
import com.zizibujuan.drip.server.tests.AbstractServletTests;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;

/**
 * 激活用户帐号测试用例
 * 
 * @author jzw
 * @since 0.0.1
 */
public class EmailConfirmServletTests extends AbstractServletTests{

	private static DataSource dataSource;
	
	
	@BeforeClass
	public static void setUpClass(){
		dataSource = DataSourceHolder.getDefault().getDataSourceService().getDataSource();
	}
	
	// 第一次激活
	@Test
	public void test_confirm_success() throws IOException, SAXException{
		String email = "a@a.com";
		Long userId = null;
		try{			
			params.put("email", email);
			params.put("password", "aaa111,,,");
			params.put("loginName", "user1");
			// 注册并登录
			initPostServlet("users");
			// 注销用户,让可以跳转到中间提示页面，而登录用户直接跳转到个人首页。
			initPostServlet("logout");
			
			UserService userService = ServiceHolder.getDefault().getUserService();
			UserInfo userInfo = userService.getByLoginName("user1");
			userId = userInfo.getId();
			assertFalse(userInfo.isActive());
			
			initGetServlet("confirm/" + userInfo.getConfirmKey());
			userInfo = userService.getByLoginName("user1");
			assertTrue(userInfo.isActive());
			// 激活成功后，跳转到激活成功页面
			assertEquals(HttpServletResponse.SC_OK, response.getResponseCode());
			assertTrue(response.isHTML());
			//assertEquals("孜孜不倦 · 激活成功", response.getTitle());
		}finally{
			DatabaseUtil.update(dataSource, "DELETE FROM DRIP_USER_ATTRIBUTES WHERE USER_ID=?", userId);
			DatabaseUtil.update(dataSource, "DELETE FROM DRIP_USER_INFO  WHERE EMAIL=?", email);
		}
	}
	
	// 用户已经激活
	@Test
	public void test_has_confirmed(){
		String email = "a@a.com";
		Long userId = null;
		try{			
			params.put("email", email);
			params.put("password", "aaa111,,,");
			params.put("loginName", "user1");
			
			initPostServlet("users");
			initPostServlet("logout");
			
			UserService userService = ServiceHolder.getDefault().getUserService();
			UserInfo userInfo = userService.getByLoginName("user1");
			userId = userInfo.getId();
			assertFalse(userInfo.isActive());
			initGetServlet("confirm/" + userInfo.getConfirmKey());
			userInfo = userService.getByLoginName("user1");
			assertTrue(userInfo.isActive());
			// 重复激活
			initGetServlet("confirm/" + userInfo.getConfirmKey());
			userInfo = userService.getByLoginName("user1");
			assertTrue(userInfo.isActive());
			assertEquals(HttpServletResponse.SC_OK, response.getResponseCode());
			assertTrue(response.isHTML());
			
		}finally{
			DatabaseUtil.update(dataSource, "DELETE FROM DRIP_USER_ATTRIBUTES WHERE USER_ID=?", userId);
			DatabaseUtil.update(dataSource, "DELETE FROM DRIP_USER_INFO  WHERE EMAIL=?", email);
		}
	}
	
	// 激活链接被修改
	@Test
	public void test_url_is_invalid(){
		webConversation.setExceptionsThrownOnErrorStatus(false);
		initGetServlet("confirm/XXX");
		assertEquals(HttpServletResponse.SC_NOT_FOUND, response.getResponseCode());
		assertTrue(response.isHTML());
	}
	
}
