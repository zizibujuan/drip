package com.zizibujuan.drip.server.servlet;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import weibo4j.Account;
import weibo4j.model.WeiboException;

import com.qq.connect.QQConnectException;
import com.qq.connect.api.OpenID;
import com.qq.connect.api.qzone.UserInfo;
import com.qq.connect.javabeans.AccessToken;
import com.qq.connect.javabeans.qzone.UserInfoBean;
import com.qq.connect.oauth.Oauth;
import com.zizibujuan.drip.server.service.OAuthUserMapService;
import com.zizibujuan.drip.server.service.UserService;
import com.zizibujuan.drip.server.servlet.authentication.Oauth2Exception;
import com.zizibujuan.drip.server.servlet.authentication.RenrenHelper;
import com.zizibujuan.drip.server.util.OAuthConstants;
import com.zizibujuan.drip.server.util.servlet.BaseServlet;
import com.zizibujuan.drip.server.util.servlet.RequestUtil;
import com.zizibujuan.drip.server.util.servlet.ResponseUtil;
import com.zizibujuan.drip.server.util.servlet.UserSession;

/**
 * 用户登录，建立会话
 * 
 * @author jinzw
 * @since 0.0.1
 */
public class LoginServlet extends BaseServlet {
	private static final Logger logger = LoggerFactory.getLogger(LoginServlet.class);

	private static final long serialVersionUID = 3186980773671995338L;
	private UserService userService = null;
	private OAuthUserMapService oAuthUserMapService = null;
	
	public LoginServlet() {
		userService = ServiceHolder.getDefault().getUserService();
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
					try{
						RenrenHelper.handleOauthReturnAndLogin(req, resp, code);
					}catch(Oauth2Exception e){
						// TODO：处理解析失败的返回值 displayError
					}
				}else{
					RenrenHelper.redirectToOauthProvider(req, resp);
				}
				return;
			} else if (pathInfo.equals("/qq")) {
				String code = req.getParameter("code");
				if(code != null && !code.isEmpty()){
					processQQLogin(req, resp, code);
				}else{
					redirectToQQLoginPage(req, resp);
				}
				return;
			}else if(pathInfo.equals("/sinaWeibo")){
				String code = req.getParameter("code");
				if(code != null && !code.isEmpty()){
					processSinaWeiboLogin(req, resp, code);
				}else{
					redirectToSinaWeiboLoginPage(req, resp);
				}
				return;
			}
		}
		
		super.doGet(req, resp);
	}

	private void redirectToSinaWeiboLoginPage(HttpServletRequest req,
			HttpServletResponse resp) throws IOException {
		weibo4j.Oauth oauth = new weibo4j.Oauth();
		try {
			resp.sendRedirect(oauth.authorize("code","state_weibo",""));
		} catch (WeiboException e) {
			logger.error("打开新浪微博授权页面失败",e);
		}
	}
	
	private void redirectToQQLoginPage(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
        	resp.sendRedirect(new Oauth().getAuthorizeURL(req));
        } catch (QQConnectException e) {
            logger.error("获取qq登录页面失败", e);
        }
	}

	private void processQQLogin(HttpServletRequest req,
			HttpServletResponse resp, String code) throws IOException {
		try {
			AccessToken accessTokenObj = new Oauth().getAccessTokenByRequest(req);
			String accessToken = null;
			String openID = null;
			long tokenExpireIn = 0L;
			
			accessToken = accessTokenObj.getAccessToken();
			if(accessToken.equals("")){
				logger.error("没有获取到响应参数");
				return;
			}
		
			tokenExpireIn = accessTokenObj.getExpireIn();
			req.getSession().setAttribute("qq_access_token", accessToken);
			req.getSession().setAttribute("qq_token_expirein", tokenExpireIn);
			
			OpenID openIDObj = new OpenID(accessToken);
			openID = openIDObj.getUserOpenID();
			UserInfo qzoneUserInfo = new UserInfo(accessToken, openID);
			UserInfoBean qzoneUserInfoBean = qzoneUserInfo.getUserInfo();
			
			if(qzoneUserInfoBean.getRet() != 0){
				logger.error(qzoneUserInfoBean.getMsg());
				return;
			}
			
			Map<String,Object> userMapperInfo = oAuthUserMapService.getUserMapperInfo(OAuthConstants.QQ, openID);
			if(userMapperInfo.isEmpty()){
				Map<String, Object> renrenUserInfo = qqUserToDripUser(qzoneUserInfoBean);
				userMapperInfo = userService.importUser(renrenUserInfo);
			}
			
		
		} catch (QQConnectException e) {
			e.printStackTrace();
		}
		resp.sendRedirect("/");
	}

	private void processSinaWeiboLogin(HttpServletRequest req,
			HttpServletResponse resp, String code) throws IOException {
		weibo4j.Oauth oauth = new weibo4j.Oauth();
		try {
			weibo4j.http.AccessToken accessTokenObj = oauth.getAccessTokenByCode(code);
			String accessToken = accessTokenObj.getAccessToken();
			Account am = new Account();
			am.client.setToken(accessToken);
			weibo4j.org.json.JSONObject userInfo = am.getAccountPrivacy();
			logger.info("微博用户信息:"+userInfo.toString());
			
			resp.sendRedirect("/");
		} catch (WeiboException e) {
			logger.error("使用微博帐号登录失败", e);
		}
		
	}

	private Map<String, Object> qqUserToDripUser(UserInfoBean qzoneUserInfoBean) {
		// TODO Auto-generated method stub
		return null;
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
