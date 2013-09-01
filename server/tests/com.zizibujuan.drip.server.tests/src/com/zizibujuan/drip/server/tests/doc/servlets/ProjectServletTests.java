package com.zizibujuan.drip.server.tests.doc.servlets;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.eclipse.core.filesystem.EFS;
import org.eclipse.core.filesystem.IFileStore;
import org.eclipse.core.runtime.CoreException;
import org.junit.BeforeClass;
import org.junit.Test;

import com.zizibujuan.drip.server.doc.model.ProjectInfo;
import com.zizibujuan.drip.server.service.ApplicationPropertyService;
import com.zizibujuan.drip.server.servlet.ServiceHolder;
import com.zizibujuan.drip.server.tests.AbstractServletTests;
import com.zizibujuan.drip.server.util.GitConstants;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;
import com.zizibujuan.drip.server.util.json.JsonUtil;

/**
 * 项目维护测试用例
 * 
 * @author jzw
 * @since 0.0.1
 */
public class ProjectServletTests extends AbstractServletTests {

	private static ApplicationPropertyService applicationPropertyService;
	private static String ROOT_PATH;
	
	@BeforeClass
	public static void setUpProjectServletClass(){
		applicationPropertyService = ServiceHolder.getDefault().getApplicationPropertyService();
		ROOT_PATH = applicationPropertyService.getForString(GitConstants.KEY_GIT_ROOT);
	}
	
	// 未登录用户创建项目
	@Test
	public void anonymous_user_create_project() throws IOException{
		params.put("name", "p1");
		params.put("label", "项目1");
		params.put("description", "描述1");
		initPostServlet("projects");
		assertEquals(HttpServletResponse.SC_UNAUTHORIZED, response.getResponseCode());
		String jsonString = response.getText();
		List<String> errors = JsonUtil.fromJsonArray(jsonString, List.class, String.class);
		assertEquals("只有登录用户,才能创建项目", errors.get(0));
	}
	
	// 登录用户创建项目成功
	@Test
	public void logged_user_create_project_success() throws IOException, CoreException, URISyntaxException{
		try{
			setUpAuthorization();
			params = new HashMap<String, String>();
			params.put("name", "p1");
			params.put("label", "项目1");
			params.put("description", "描述1");
			initPostServlet("projects");
			assertEquals(HttpServletResponse.SC_OK, response.getResponseCode());
			
			ProjectInfo projectInfo = getResponseData(ProjectInfo.class);
			assertNotNull(projectInfo.getId());
			assertEquals("p1", projectInfo.getName());
			assertEquals("项目1", projectInfo.getLabel());
			assertEquals("描述1", projectInfo.getDescription());
			
			IFileStore store = getProjectStore(testUserLoginName, "p1");
			assertTrue(store.getChild(".git").fetchInfo().exists());
		}finally{
			tearDownAuthorization();
			// 删除项目信息
			DatabaseUtil.update(dataSource, "DELETE FROM DRIP_DOC_PROJECT WHERE PROJECT_NAME=? AND CRT_USER_ID=?", "p1", testUserId);
			// 删除项目文件
			IFileStore store = getProjectStore(testUserLoginName, "p1");
			store.delete(EFS.NONE, null);
		}
	}
	
	private IFileStore getProjectStore(String loginName, String projectName) throws URISyntaxException{
		String path = ROOT_PATH + loginName + "/" + projectName;
		IFileStore store = EFS.getLocalFileSystem().getStore(new URI(path));
		return store;
	}
	
	// 项目名称必须是英文,字母，_ - 或 .
	@Test
	public void create_project_name_is_not_valid() throws IOException, URISyntaxException, CoreException{
		try{
			setUpAuthorization();
			params = new HashMap<String, String>();
			params.put("name", "a b");
			params.put("label", "项目1");
			params.put("description", "描述1");
			initPostServlet("projects");
			assertEquals(HttpServletResponse.SC_PRECONDITION_FAILED, response.getResponseCode());
			List<String> errors = JsonUtil.fromJsonArray(response.getText(), List.class, String.class);
			assertEquals("项目名称只能包含英文字母,数字,-,_或.", errors.get(0));
			IFileStore store = getProjectStore(testUserLoginName, "p1");
			assertFalse("没有为项目创建文件夹", store.fetchInfo().exists());
		}finally{
			tearDownAuthorization();
			// 虽然正常逻辑下不会创建项目信息，但是如果程序中没有添加名称有效性校验，就会创建，所以这里需要删除代码
			// 删除项目信息
			DatabaseUtil.update(dataSource, "DELETE FROM DRIP_DOC_PROJECT WHERE PROJECT_NAME=? AND CRT_USER_ID=?", "p1", testUserId);
			// 删除项目文件
			IFileStore store = getProjectStore(testUserLoginName, "p1");
			store.delete(EFS.NONE, null);
		}
	}
	
	// 登录用户要创建一个同名项目
	@Test
	public void create_project_name_is_duplicate() throws IOException, URISyntaxException, CoreException{
		try{
			setUpAuthorization();
			params = new HashMap<String, String>();
			params.put("name", "p1");
			params.put("label", "项目1");
			params.put("description", "描述1");
			initPostServlet("projects");
			
			params = new HashMap<String, String>();
			params.put("name", "p1");
			params.put("label", "项目1");
			params.put("description", "描述1");
			initPostServlet("projects");
			
			assertEquals(HttpServletResponse.SC_PRECONDITION_FAILED, response.getResponseCode());
			List<String> errors = JsonUtil.fromJsonArray(response.getText(), List.class, String.class);
			assertEquals("您已有一个同名项目", errors.get(0));
		}finally{
			tearDownAuthorization();
			// 虽然正常逻辑下不会创建项目信息，但是如果程序中没有添加名称有效性校验，就会创建，所以这里需要删除代码
			// 删除项目信息
			DatabaseUtil.update(dataSource, "DELETE FROM DRIP_DOC_PROJECT WHERE PROJECT_NAME=? AND CRT_USER_ID=?", "p1", testUserId);
			// 删除项目文件
			IFileStore store = getProjectStore(testUserLoginName, "p1");
			store.delete(EFS.NONE, null);
		}
	}
	
	// 删除一个项目
	
	@Test
	public void get_project_list() throws IOException, URISyntaxException, CoreException{
		try{
			setUpAuthorization();
			params = new HashMap<String, String>();
			params.put("name", "p1");
			params.put("label", "项目1");
			params.put("description", "描述1");
			initPostServlet("projects");
			
			params = new HashMap<String, String>();
			params.put("name", "p2");
			params.put("label", "项目2");
			params.put("description", "描述2");
			initPostServlet("projects");
			
			initGetServlet("projects");
			assertEquals(HttpServletResponse.SC_OK, response.getResponseCode());
			String jsonString = response.getText();
			List<ProjectInfo> list = JsonUtil.fromJsonArray(jsonString, List.class, ProjectInfo.class);
			
			assertEquals(2, list.size());
			ProjectInfo p1 = list.get(0);
			assertNull(p1.getId()); // 有意没有返回项目标识
			assertEquals("p1", p1.getName());
			assertEquals("项目1", p1.getLabel());
			assertEquals("描述1", p1.getDescription());
			
			ProjectInfo p2 = list.get(1);
			assertNull(p2.getId());
			assertEquals("p2", p2.getName());
			assertEquals("项目2", p2.getLabel());
			assertEquals("描述2", p2.getDescription());
		}finally{
			tearDownAuthorization();
			// 删除项目信息
			DatabaseUtil.update(dataSource, "DELETE FROM DRIP_DOC_PROJECT WHERE PROJECT_NAME=? AND CRT_USER_ID=?", "p1", testUserId);
			DatabaseUtil.update(dataSource, "DELETE FROM DRIP_DOC_PROJECT WHERE PROJECT_NAME=? AND CRT_USER_ID=?", "p2", testUserId);
			// 删除项目文件
			IFileStore store = getProjectStore(testUserLoginName, "p1");
			store.delete(EFS.NONE, null);
			store = getProjectStore(testUserLoginName, "p2");
			store.delete(EFS.NONE, null);
		}
	}
	   
	@Test
	public void get_project_files_list() throws IOException, URISyntaxException, CoreException{
		try{
			setUpAuthorization();
			params = new HashMap<String, String>();
			params.put("name", "p1");
			params.put("label", "项目1");
			params.put("description", "描述1");
			initPostServlet("projects");
			
			initGetServlet("projects/"+testUserLoginName+"/p1");
			assertEquals(HttpServletResponse.SC_OK, response.getResponseCode());
			String jsonString = response.getText();
			List<Map<String, Object>> list = JsonUtil.fromJsonArray(jsonString);
			// 默认会为项目创建一个README文件
			assertEquals(1, list.size());
			
			@SuppressWarnings("unchecked")
			Map<String, Object> fileInfo = (Map<String, Object>) list.get(0).get("fileInfo");
			assertEquals("README", fileInfo.get("name"));
		}finally{
			tearDownAuthorization();
			// 删除项目信息
			DatabaseUtil.update(dataSource, "DELETE FROM DRIP_DOC_PROJECT WHERE PROJECT_NAME=? AND CRT_USER_ID=?", "p1", testUserId);
			// 删除项目文件
			IFileStore store = getProjectStore(testUserLoginName, "p1");
			store.delete(EFS.NONE, null);
		}
	}
	
}
