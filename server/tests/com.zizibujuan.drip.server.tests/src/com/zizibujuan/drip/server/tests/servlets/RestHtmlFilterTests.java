package com.zizibujuan.drip.server.tests.servlets;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import javax.servlet.http.HttpServletResponse;

import org.junit.Before;
import org.junit.Test;

import com.zizibujuan.drip.server.tests.AbstractServletTests;


/**
 * rest风格的api规则测试
 * 
 * @author jzw
 * @since 0.0.1
 */
public class RestHtmlFilterTests extends AbstractServletTests{

	@Before
	public void setUp(){
		super.setUp();
		// 取消ajax请求设置
		headers.remove("X-Requested-With");
	}
	
	// newActions.put("/projects", "/doc/projects/new.html");
	@Test
	public void to_new_project_html(){
		initGetServlet("/projects/new");
		assertEquals(HttpServletResponse.SC_OK, response.getResponseCode());
		assertTrue(response.isHTML());
		assertEquals("/doc/projects/new.html", response.getURL().getPath());
	}
}
