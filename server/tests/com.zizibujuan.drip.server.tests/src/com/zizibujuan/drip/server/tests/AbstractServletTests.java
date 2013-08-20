package com.zizibujuan.drip.server.tests;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.io.IOUtils;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.xml.sax.SAXException;

import com.meterware.httpunit.GetMethodWebRequest;
import com.meterware.httpunit.PostMethodWebRequest;
import com.meterware.httpunit.PutMethodWebRequest;
import com.meterware.httpunit.WebConversation;
import com.meterware.httpunit.WebRequest;
import com.meterware.httpunit.WebResponse;
import com.zizibujuan.drip.server.tests.servlets.internal.DeleteMethodWebRequest;
import com.zizibujuan.drip.server.util.json.JsonUtil;

/**
 * servlet测试基类
 * @author jzw
 * @since 0.0.1
 */
public class AbstractServletTests {

	private static final String SERVER_LOCATION = "http://localhost:8199/";
	
	protected WebConversation webConversation;
	protected WebRequest request;
	protected WebResponse response;
	protected Map<String, String> params;
	protected Map<String, String> headers;
	
	@BeforeClass
	public static void setUpClass() throws MalformedURLException{
		
	}
	
	@AfterClass
	public static void tearDownClass(){
		
	}
	
	@Before
	public void setUp(){
		webConversation = new WebConversation();
		params = new HashMap<String, String>();
		headers = new HashMap<String, String>();
	}
	
	@After
	public void tearDown(){
		webConversation = null;
		request = null;
		response = null;
		params = null;
		headers = null;
	}
	
	protected void initGetServlet(String urlString) throws IOException, SAXException{
		request = new GetMethodWebRequest(SERVER_LOCATION + urlString);
		setUpResponse();
	}
	
	protected void initPostServlet(String urlString) throws IOException, SAXException{
		String json = JsonUtil.toJson(params);
		request = new PostMethodWebRequest(SERVER_LOCATION + urlString, IOUtils.toInputStream(json), "text/plain");
		params = null;
		setUpResponse();
	}
	
	protected void initPutServlet(String urlString) throws IOException, SAXException{
		String json = JsonUtil.toJson(params);
		request = new PutMethodWebRequest(SERVER_LOCATION + urlString, IOUtils.toInputStream(json), "text/plain");
		params = null;
		setUpResponse();
	}
	
	protected void initDeleteServlet(String urlString) throws IOException, SAXException{
		request = new DeleteMethodWebRequest(SERVER_LOCATION + urlString);
		setUpResponse();
	}

	private void setUpResponse() throws IOException, SAXException {
		if(params != null){
			for(Map.Entry<String, String> entry: params.entrySet()){
				request.setParameter(entry.getKey(), entry.getValue());
			}
		}
		if(headers != null){
			for(Map.Entry<String, String> entry: headers.entrySet()){
				request.setParameter(entry.getKey(), entry.getValue());
			}
		}
		response = webConversation.getResponse(request);
	}
	
	
}
