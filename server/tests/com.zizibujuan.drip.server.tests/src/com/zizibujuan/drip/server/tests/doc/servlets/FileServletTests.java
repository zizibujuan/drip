package com.zizibujuan.drip.server.tests.doc.servlets;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.io.StringWriter;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.eclipse.core.filesystem.EFS;
import org.eclipse.core.filesystem.IFileStore;
import org.eclipse.core.runtime.CoreException;
import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

import com.zizibujuan.drip.server.doc.model.FileInfo;
import com.zizibujuan.drip.server.service.ApplicationPropertyService;
import com.zizibujuan.drip.server.servlet.ServiceHolder;
import com.zizibujuan.drip.server.tests.AbstractServletTests;
import com.zizibujuan.drip.server.util.GitConstants;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;

/**
 * 文件维护测试用例
 * 
 * @author jzw
 * @since 0.0.1
 */
public class FileServletTests extends AbstractServletTests {

	private static ApplicationPropertyService applicationPropertyService;
	private static String ROOT_PATH;
	private String projectName = "p1";
	private String fileName = "a";
	private String content = "abc123";
	
	@BeforeClass
	public static void setUpProjectServletClass(){
		applicationPropertyService = ServiceHolder.getDefault().getApplicationPropertyService();
		ROOT_PATH = applicationPropertyService.getForString(GitConstants.KEY_GIT_ROOT);
	}
	
	@Before
	public void setUp(){
		super.setUp();
		// 使用测试用户登录
		setUpAuthorization();
		// 创建项目
		params = new HashMap<String, String>();
		params.put("name", projectName);
		params.put("label", "项目1");
		params.put("description", "描述1");
		initPostServlet("projects");
		assertEquals(HttpServletResponse.SC_OK, response.getResponseCode());
	}
	
	@After
	public void tearDown(){
		// 删除项目
		// 删除项目信息
		DatabaseUtil.update(dataSource, "DELETE FROM DRIP_DOC_PROJECT WHERE PROJECT_NAME=? AND CRT_USER_ID=?", projectName, testUserId);
		// 删除项目文件
		try {
			IFileStore store = getProjectStore(testUserLoginName, projectName);
			store.delete(EFS.NONE, null);
		} catch (URISyntaxException e) {
			e.printStackTrace();
		} catch (CoreException e) {
			e.printStackTrace();
		}
		// 用户注销
		tearDownAuthorization();
		super.tearDown();
	}
	
	private IFileStore getProjectStore(String loginName, String projectName) throws URISyntaxException{
		String path = ROOT_PATH + loginName + "/" + projectName;
		IFileStore store = EFS.getLocalFileSystem().getStore(new URI(path));
		return store;
	}
	
	private void insertNewFile(){
		Map<String, String> fileInfo = new HashMap<String, String>();
		fileInfo.put("name", fileName);
		fileInfo.put("content", content);
		Map<String, String> commitInfo = new HashMap<String, String>();
		commitInfo.put("summary", "first commit");
		postData.put("fileInfo", fileInfo);
		postData.put("commitInfo", commitInfo);
		initPostServlet("files/"+testUserLoginName+"/"+projectName);
	}
	
	@Test
	public void new_file_success() throws URISyntaxException, IOException, CoreException{
		insertNewFile();
		
		assertEquals(HttpServletResponse.SC_OK, response.getResponseCode());
		IFileStore newFileStore = getProjectStore(testUserLoginName, projectName).getChild(fileName);
		assertTrue(newFileStore.fetchInfo().exists());
		StringWriter writer = new StringWriter();
		IOUtils.copy(newFileStore.openInputStream(EFS.NONE, null), writer);
		assertEquals(content, writer.toString());
	}
	
	@Test
	public void get_file_blob_success() throws IOException{
		insertNewFile();
		
		initGetServlet("blob/" + testUserLoginName + "/" + projectName + "/" +fileName);
		assertEquals(HttpServletResponse.SC_OK, response.getResponseCode());
		FileInfo file = getResponseData(FileInfo.class);
		assertEquals(fileName, file.getName());
		assertEquals(content, file.getContent());
		assertNotNull(file.getSize());
		assertNull(file.getId());
		assertNull(file.getPath());
	}
	
	// 暂不支持修改文件名，如果要修改文件名，就需要增加new_file_name属性
	@Test
	public void edit_file_success() throws URISyntaxException, IOException, CoreException{
		insertNewFile();
		
		Map<String, String> fileInfo = new HashMap<String, String>();
		String newContent = content + "甲";
		fileInfo.put("name", fileName);
		fileInfo.put("content", newContent);
		Map<String, String> commitInfo = new HashMap<String, String>();
		commitInfo.put("summary", "update");
		postData = new HashMap<String, Object>();
		postData.put("fileInfo", fileInfo);
		postData.put("commitInfo", commitInfo);
		initPutServlet("files/" + testUserLoginName + "/" + projectName + "/" +fileName);
		
		assertEquals(HttpServletResponse.SC_OK, response.getResponseCode());
		IFileStore newFileStore = getProjectStore(testUserLoginName, projectName).getChild(fileName);
		assertTrue(newFileStore.fetchInfo().exists());
		StringWriter writer = new StringWriter();
		IOUtils.copy(newFileStore.openInputStream(EFS.NONE, null), writer);
		assertEquals(newContent, writer.toString());
	}
}
