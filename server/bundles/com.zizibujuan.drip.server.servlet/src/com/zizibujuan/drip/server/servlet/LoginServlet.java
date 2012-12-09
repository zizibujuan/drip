package com.zizibujuan.drip.server.servlet;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.text.MessageFormat;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.renren.api.client.RenrenApiClient;
import com.renren.api.client.RenrenApiConfig;
import com.renren.api.client.utils.HttpURLUtils;
import com.zizibujuan.drip.server.service.ApplicationPropertyService;
import com.zizibujuan.drip.server.service.OAuthUserMapService;
import com.zizibujuan.drip.server.service.UserService;
import com.zizibujuan.drip.server.servlet.command.LoginCommand;
import com.zizibujuan.drip.server.util.OAuthConstants;
import com.zizibujuan.drip.server.util.servlet.DripServlet;
import com.zizibujuan.drip.server.util.servlet.RequestUtil;
import com.zizibujuan.drip.server.util.servlet.ResponseUtil;
import com.zizibujuan.drip.server.util.servlet.UserSession;

/**
 * 用户登录，建立会话
 * 
 * @author jinzw
 * @since 0.0.1
 */
public class LoginServlet extends DripServlet {
	private static final Logger logger = LoggerFactory.getLogger(LoginServlet.class);

	private static final long serialVersionUID = 3186980773671995338L;
	private UserService userService = null;
	private ApplicationPropertyService applicationPropertyService = null;
	private OAuthUserMapService oAuthUserMapService = null;
	
	public LoginServlet() {
		userService = ServiceHolder.getDefault().getUserService();
		applicationPropertyService = ServiceHolder.getDefault().getApplicationPropertyService();
		oAuthUserMapService = ServiceHolder.getDefault().getOAuthUserMapService();
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		traceRequest(req);
		String pathInfo = req.getPathInfo();
		
		if (pathInfo != null && !pathInfo.equals("/")) {
			if (pathInfo.equals("/renren")) {
				String code = req.getParameter("code");
				if(code != null && !code.isEmpty()){
					processRenrenLogin(req, resp, code);
				}else{
					redirectToRenrenLoginPage(resp);
				}
				return;
			} else if (pathInfo.equals("qq")) {

				return;
			}
		}
		
		super.doGet(req, resp);
	}

	private void processRenrenLogin(HttpServletRequest req,
			HttpServletResponse resp, String code) throws IOException {
		
		String redirectUri = applicationPropertyService.getForString(OAuthConstants.KEY_RENREN_REDIRECT_URL);
		String renrenOAuthTokenEndPoint = applicationPropertyService.getForString(OAuthConstants.KEY_RENREN_OAUTH_TOKEN_END_POINT);
		
		Map<String,String> parameters = new HashMap<String, String>();
		parameters.put("client_id",RenrenApiConfig.renrenApiKey);
		parameters.put("client_secret", RenrenApiConfig.renrenApiSecret);
		parameters.put("redirect_uri", redirectUri);
		parameters.put("grant_type", "authorization_code");
		parameters.put("code", code);
		String tokenResult = HttpURLUtils.doPost(renrenOAuthTokenEndPoint, parameters);
		JSONObject tokenJson = (JSONObject)JSONValue.parse(tokenResult);
		
		if(tokenJson == null){
			// TODO:处理异常
			return;
		}
		
		String accessToken = (String) tokenJson.get("access_token");
		Long expiresIn = (Long) tokenJson.get("expires_in");//距离过期时的时间段（秒数）
		long currentTime = System.currentTimeMillis() / 1000;
		long expiresTime = currentTime + expiresIn;//即将过期的时间点（秒数）
		req.getSession().setAttribute("expiresTime", expiresTime);
		//调用人人网API获得用户信息
		RenrenApiClient apiClient = new RenrenApiClient(accessToken, true);
		int rrUid = apiClient.getUserService().getLoggedInUser();
		String fields = "name,sex,birthday,tinyurl,headurl,mainurl,hometown_location,work_history,university_history";
		JSONArray userInfoArray = apiClient.getUserService().getInfo(String.valueOf(rrUid), fields);
		logger.info("fields:"+userInfoArray.toJSONString());
		
		
		if(userInfoArray == null || userInfoArray.size() == 0){
			// TODO:处理异常
			return;
		}
		
		JSONObject currentUser = (JSONObject) userInfoArray.get(0);
		if(currentUser == null){
			// TODO:处理异常
			return;
		}

		//判断帐号关联表里有没有现成的关联
		Long dripUserId = oAuthUserMapService.getUserId(OAuthConstants.RENREN, rrUid);
		if(dripUserId == null){
			Map<String, Object> renrenUserInfo = renrenUserToDripUser(currentUser);
			dripUserId = userService.importUser(renrenUserInfo);
		}
		Map<String,Object> userInfo = userService.login(dripUserId);
		UserSession.setUser(req, userInfo);
		// 跳转到个人首页
		resp.sendRedirect("/");
	}

	/**
	 * 将人人上的用户信息的格式转换为drip用户的格式。
	 * @param renrenUser 人人用户信息
	 * @return drip用户信息
	 */
	private Map<String, Object> renrenUserToDripUser(JSONObject renrenUser) {
		int rrUid = Integer.valueOf(renrenUser.get("uid").toString());
		String name = (String) renrenUser.get("name");
		String headurl = (String) renrenUser.get("headurl");
		
		
		// name,sex,birthday,tinyurl,headurl,mainurl,hometown_location,work_history,university_history
		//在帐号关联表里没有记录，用户是第一次来；为这个用户创建一个User对象
		Map<String,Object> renrenUserInfo = new HashMap<String, Object>();
		renrenUserInfo.put("nickName", name);
		renrenUserInfo.put("loginName", name);
		renrenUserInfo.put("headUrl", headurl);
		renrenUserInfo.put("authSiteId", OAuthConstants.RENREN);
		renrenUserInfo.put("authUserId", rrUid);
		return renrenUserInfo;
	}

	private void redirectToRenrenLoginPage(HttpServletResponse resp)
			throws UnsupportedEncodingException, IOException {
		String appId = applicationPropertyService.getForString(OAuthConstants.KEY_RENREN_APP_ID);
		String hrefTemplate= applicationPropertyService.getForString(OAuthConstants.KEY_RENREN_LOGIN_PAGE_URL_TMPL);
		String redirectUri = applicationPropertyService.getForString(OAuthConstants.KEY_RENREN_REDIRECT_URL);
		redirectUri = URLEncoder.encode(redirectUri, "UTF-8");
		
		String href=MessageFormat.format(hrefTemplate, appId,redirectUri);
		resp.sendRedirect(href);
	}



	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		traceRequest(req);
		String pathInfo = req.getPathInfo();
		if (isNullOrSeparator(pathInfo)) {
			// 获取用户登录信息
			Long userId = UserSession.getUserId(req);
			Map<String,Object> loginInfo = userService.getLoginInfo(userId);
			if(loginInfo.isEmpty()){
				// 用户未登录
				Map<String,Object> map = new HashMap<String, Object>();
				ResponseUtil.toJSON(req, resp, map,HttpServletResponse.SC_UNAUTHORIZED);
			}else{
				// 用户已登录
				ResponseUtil.toJSON(req, resp, loginInfo);
			}
			
			return;
		}else{
			if(pathInfo.equals("/form")){
				Map<String, Object> userInfo = RequestUtil.fromJsonObject(req);
				LoginCommand.handleCommand(req, resp, userService, userInfo);
				return;
			}
		}
		super.doPost(req, resp);
	}
}
