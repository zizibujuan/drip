package com.zizibujuan.drip.server.servlet;

import java.io.IOException;
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

import com.renren.api.client.RenrenApiClient;
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
		
		if(pathInfo == null || pathInfo.equals("/")){
			String code = req.getParameter("code");
			if(code != null && !code.isEmpty()){
				String key = applicationPropertyService.getForString(OAuthConstants.KEY_RENREN_APP_KEY);
				String secret = applicationPropertyService.getForString(OAuthConstants.KEY_RENREN_APP_SECRET);
				String uri = "http://www.zizibujuan/login";
				String renrenOAuthTokenEndPoint = "https://graph.renren.com/oauth/token";
				Map<String,String> parameters = new HashMap<String, String>();
				parameters.put("client_id",key);
				parameters.put("client_secret", secret);
				parameters.put("redirect_uri", uri);
				parameters.put("grant_type", "authorization_code");
				parameters.put("code", code);
				String tokenResult = HttpURLUtils.doPost(renrenOAuthTokenEndPoint, parameters);
				JSONObject tokenJson = (JSONObject)JSONValue.parse(tokenResult);
				if(tokenJson!=null){

					String accessToken = (String) tokenJson.get("access_token");
					Long expiresIn = (Long) tokenJson.get("expires_in");//距离过期时的时间段（秒数）
					long currentTime = System.currentTimeMillis() / 1000;
					long expiresTime = currentTime + expiresIn;//即将过期的时间点（秒数）
					req.getSession().setAttribute("expiresTime", expiresTime);
					//调用人人网API获得用户信息
					RenrenApiClient apiClient = new RenrenApiClient(accessToken, true);
					int rrUid = apiClient.getUserService().getLoggedInUser();
					JSONArray userInfo = apiClient.getUserService().getInfo(String.valueOf(rrUid), "name,email_hash,headurl");
					if (userInfo != null && userInfo.size() > 0) {
						JSONObject currentUser = (JSONObject) userInfo.get(0);
						if (currentUser != null) {
							String name = (String) currentUser.get("name");
							String headurl = (String) currentUser.get("headurl");
							String email = (String)currentUser.get("email_hash");
//							//判断帐号关联表里有没有现成的关联
							String userName = oAuthUserMapService.getUserName(OAuthConstants.RENREN, rrUid);
//							User user;
//							if (username == null) {
//								//在帐号关联表里没有记录，用户是第一次来；为这个用户创建一个User对象
//								User newUser = new User();
//								newUser.setName(name);
//								newUser.setHeadurl(headurl);
//								//自动拼装一个username并随即生成一个password；实际实现时，这里应该保证
//		                                                  拼装出来的username不与其它帐号冲突
//								username = "renren-" + rrUid;
//								String password = UUID.randomUUID().toString();
//								newUser.setUsername(username);
//								newUser.setPassword(password);
//								//保存到用户表, 也许加入的用户设置为未激活更好些，保证该名字的唯一性，并允许修改该名称，同时更新帐号关联表中的名称
//								UserDAO.getInstance().addUser(newUser);
//								//保存到帐号关联表
//								RenrenUserMappingDAO.getInstance().addMapping(rrUid, username);
//								user = newUser;
//							}
//							else {
//								//用户不是第一次来了，已经在帐号关联表里有了
//								user = UserDAO.getInstance().getUser(username);
//							}
//							//将用户身份信息保存在会话里
//							request.getSession().setAttribute("user", user);
//							//已登录，跳转到个人主页
//							response.sendRedirect("/profile");
							return;
						}
					}
				}
				return;
			}
			
		}else if (pathInfo != null && !pathInfo.equals("/")) {
			String[] pathes = pathInfo.split("/");

			String to = pathes[1];
			if (to.equals("renren")) {
				// TODO:将这个链接配置在数据库中，所有参数的key值也配置在数据库中。
				String appId = applicationPropertyService.getForString(OAuthConstants.KEY_RENREN_APP_ID);
				String redirectUri = URLEncoder.encode("http://zizibujuan.com/login", "UTF-8");
				String hrefTemplate="https://graph.renren.com/oauth/authorize?client_id={0}&response_type=code&redirect_uri={1}&display=page";
				String href=MessageFormat.format(hrefTemplate, appId,redirectUri);
				resp.sendRedirect(href);
				return;
			} else if (to.equals("qq")) {

				return;
			}
		}
		
		super.doGet(req, resp);
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
