package com.zizibujuan.drip.server.tests;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.apache.commons.io.IOUtils;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.xml.sax.SAXException;

import com.meterware.httpunit.GetMethodWebRequest;
import com.meterware.httpunit.HttpException;
import com.meterware.httpunit.PostMethodWebRequest;
import com.meterware.httpunit.PutMethodWebRequest;
import com.meterware.httpunit.WebConversation;
import com.meterware.httpunit.WebRequest;
import com.meterware.httpunit.WebResponse;
import com.zizibujuan.dbaccess.mysql.service.DataSourceHolder;
import com.zizibujuan.drip.server.service.UserService;
import com.zizibujuan.drip.server.servlet.ServiceHolder;
import com.zizibujuan.drip.server.tests.servlets.internal.DeleteMethodWebRequest;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;
import com.zizibujuan.drip.server.util.json.JsonUtil;

/**
 * servlet测试基类
 * @author jzw
 * @since 0.0.1
 */
public class AbstractServletTests {

	protected static final String SERVER_LOCATION = "http://localhost:8199/";
	protected static UserService userService;
	protected static DataSource dataSource;
	
	// 
	protected static String testUserEmail = "test@zizibujuan.com";
	protected static String testUserPassword = "test123";
	protected static String testUserLoginName = "test";
	protected Long testUserId;
	
	protected WebConversation webConversation;
	protected WebRequest request;
	protected WebResponse response;
	protected Map<String, String> params;
	protected Map<String, String> headers;
	protected Map<String, Object> postData;
	
	@BeforeClass
	public static void setUpClass(){
		dataSource = DataSourceHolder.getDefault().getDataSourceService().getDataSource();
		userService = ServiceHolder.getDefault().getUserService();
	}
	
	@AfterClass
	public static void tearDownClass(){
		
	}
	
	@Before
	public void setUp(){
		webConversation = new WebConversation();
		params = new HashMap<String, String>();
		headers = new HashMap<String, String>();
		// 所有测试的都是ajax请求
		headers.put("X-Requested-With", "XMLHttpRequest");
		postData = new HashMap<String, Object>();
	}
	
	@After
	public void tearDown(){
		webConversation = null;
		request = null;
		response = null;
		params = null;
		headers = null;
		postData = null;
	}
	
	protected void initGetServlet(String urlString){
		request = new GetMethodWebRequest(SERVER_LOCATION + urlString);
		setUpResponse();
	}
	
	protected void initPostServlet(String urlString){
		String json = null;
		if(postData.isEmpty()){
			json = JsonUtil.toJson(params);
		}else{
			json = JsonUtil.toJson(postData);
		}
		webConversation.setExceptionsThrownOnErrorStatus(false);
		request = new PostMethodWebRequest(SERVER_LOCATION + urlString, IOUtils.toInputStream(json), "text/plain");
		params = null;
		setUpResponse();
	}
	
	protected void initPutServlet(String urlString){
		String json = null;
		if(postData.isEmpty()){
			json = JsonUtil.toJson(params);
		}else{
			json = JsonUtil.toJson(postData);
		}
		webConversation.setExceptionsThrownOnErrorStatus(false);
		request = new PutMethodWebRequest(SERVER_LOCATION + urlString, IOUtils.toInputStream(json), "text/plain");
		params = null;
		setUpResponse();
	}
	
	protected void initDeleteServlet(String urlString){
		request = new DeleteMethodWebRequest(SERVER_LOCATION + urlString);
		setUpResponse();
	}

	private void setUpResponse(){
		if(params != null){
			for(Map.Entry<String, String> entry: params.entrySet()){
				request.setParameter(entry.getKey(), entry.getValue());
			}
		}
		if(headers != null){
			for(Map.Entry<String, String> entry: headers.entrySet()){
				request.setHeaderField(entry.getKey(), entry.getValue());
			}
		}
		
		try {
			response = webConversation.getResponse(request);
			System.out.println(response);
		} catch (IOException e) {
			e.printStackTrace();
		} catch (SAXException e) {
			e.printStackTrace();
		} catch (HttpException e) {
			e.printStackTrace();
		}
	}
	
	protected List<Map<String, Object>> getResponseArray() throws IOException{
		String jsonString = response.getText();
		return JsonUtil.fromJsonArray(jsonString);
	}
	
	protected <T> T getResponseData(Class<T> classOfT) throws IOException{
		String jsonString = response.getText();
		return JsonUtil.fromJsonObject(jsonString, classOfT);
	}
	
	protected void setUpAuthorization(){
		testUserId = createUser(testUserEmail, testUserPassword, testUserLoginName);
	}
	
	protected Long createUser(String email, String password, String loginName){
		// 如果用户不存在，则创建用户
		params = new HashMap<String, String>();
		params.put("email", email);
		params.put("password", password);
		params.put("loginName", loginName);
		// 注册并登录
		initPostServlet("users");
		return DatabaseUtil.queryForLong(dataSource, "SELECT DBID FROM DRIP_USER_INFO WHERE EMAIL=?", email);
	}
	
	protected void removeUser(Long userId){
		// 删除用户
		DatabaseUtil.update(dataSource, "DELETE FROM DRIP_USER_ATTRIBUTES WHERE USER_ID=?", userId);
		DatabaseUtil.update(dataSource, "DELETE FROM DRIP_USER_INFO  WHERE DBID=?", userId);
		// 删除自我关注信息,如果存在的话
		DatabaseUtil.update(dataSource, "DELETE FROM DRIP_USER_RELATION WHERE USER_ID=? AND WATCH_USER_ID=?", userId, userId);
	}
	
	protected void activeUser(Long userId){
		if(userId != null){
			userService.active(userId);
		}
	}
	
	protected void tearDownAuthorization(){
		removeUser(testUserId);
		initPostServlet("logout");
	}
	
	protected void activeTestUser(){
		activeUser(testUserId);
	}
}
