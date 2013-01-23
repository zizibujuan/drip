package com.zizibujuan.drip.server.servlet;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
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
			} else if (pathInfo.equals("/qq")) {

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
		
		// TODO:在数据库中存储acess token
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
		Map<String,Object> userMapperInfo = oAuthUserMapService.getUserMapperInfo(OAuthConstants.RENREN, rrUid);
		
		if(userMapperInfo.isEmpty()){
			Map<String, Object> renrenUserInfo = renrenUserToDripUser(currentUser);
			userMapperInfo = userService.importUser(renrenUserInfo);
		}
		Long localUserId = Long.valueOf(userMapperInfo.get("LOCAL_USER_ID").toString());
		Long mapUserId = Long.valueOf(userMapperInfo.get("MAP_USER_ID").toString());
		
		// 记录登录次数，哪个帐号登录的就记在哪个下面。
		// 这里调用肯定是用renren登录的。
		Map<String,Object> userInfo = userService.login(localUserId, mapUserId, OAuthConstants.RENREN);
		// 在用户session中保存从第三方网站过来的最新数据，而不是从本地的数据库中获取这些数据，
		// 避免用户已经在第三方网站修改了用户信息，但是drip没能及时更新的问题。
		// session中存储的值一部分来自drip，一部分来自第三方网站
		String displayName = currentUser.get("name").toString();
		userInfo.put("displayName", displayName);
		userInfo.put("smallImageUrl", currentUser.get("tinyurl"));
		userInfo.put("largeImageUrl", currentUser.get("headurl"));
		userInfo.put("largerImageUrl", currentUser.get("mainurl"));
		userInfo.put("site", OAuthConstants.RENREN); // 注明是使用人人帐号登录的
		userInfo.put(UserSession.KEY_MAPPED_USER_ID, mapUserId);
		
		UserSession.setUser(req, userInfo);
		logger.info("使用人人帐号登录成功，人人标识是:"+rrUid+",用户名是:"+displayName+"。");
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
		
		// 用户头像列表
		String tinyurl = (String)renrenUser.get("tinyurl");
		String mainurl = (String)renrenUser.get("mainurl");
		
		List<Map<String,Object>> avatarList = new ArrayList<Map<String,Object>>();
		addUserImage(avatarList,"tinyUrl",tinyurl,50,50);
		addUserImage(avatarList,"headUrl",headurl,100,100);
		addUserImage(avatarList,"mainUrl",mainurl,200,200);
		renrenUserInfo.put("avatar", avatarList);
		
		return renrenUserInfo;
	}

	private void addUserImage(List<Map<String, Object>> avatarList,
			String urlName,
			String url,
			int width,
			int height) {
		Map<String,Object> tinyUrlMap = new HashMap<String, Object>();
		tinyUrlMap.put("urlName", urlName);
		tinyUrlMap.put("url", url);
		tinyUrlMap.put("width", width);
		tinyUrlMap.put("height", height);
		avatarList.add(tinyUrlMap);
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


	private static final String KEY_LOGIN = "login";
	private static final String KEY_PASSWORD = "password";
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		traceRequest(req);
		String pathInfo = req.getPathInfo();
		if (isNullOrSeparator(pathInfo)) {
			// 从session中获取用户登录信息
			Map<String,Object> loginInfo = UserSession.getUser(req);
			if(loginInfo == null || loginInfo.isEmpty()){
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
				String email = userInfo.get(KEY_LOGIN).toString();
				String password = userInfo.get(KEY_PASSWORD).toString();
				Map<String,Object> existUserInfo = userService.login(email, password);
				if(existUserInfo != null){
					// 如果登录成功，则跳转到用户专有首页
					String zzbjUserId = existUserInfo.get("id").toString(); 
					Map<String,Object> userMapperInfo = oAuthUserMapService.getUserMapperInfo(OAuthConstants.ZIZIBUJUAN, zzbjUserId);
					existUserInfo.put(UserSession.KEY_MAPPED_USER_ID, userMapperInfo.get("MAP_USER_ID"));
					UserSession.setUser(req, existUserInfo);
					// 返回到客户端，然后客户端跳转到首页
					Map<String,Object> result = new HashMap<String, Object>();
					result.put("status", "1");// 1表示登录成功。
					ResponseUtil.toJSON(req, resp, result);
				}else{
					// 登录失败
					Map<String,Object> result = new HashMap<String, Object>();
					result.put("status", "2");// 2表示登录失败。
					ResponseUtil.toJSON(req, resp, result);
				}
				return;
			}
		}
		super.doPost(req, resp);
	}
}
