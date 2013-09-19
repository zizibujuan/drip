package com.zizibujuan.drip.server.servlet;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.core.runtime.IPath;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import weibo4j.Account;
import weibo4j.model.WeiboException;

import com.qq.connect.QQConnectException;
import com.qq.connect.api.OpenID;
import com.qq.connect.javabeans.AccessToken;
import com.qq.connect.javabeans.qzone.UserInfoBean;
import com.qq.connect.oauth.Oauth;
import com.zizibujuan.drip.server.model.UserInfo;
import com.zizibujuan.drip.server.service.UserBindService;
import com.zizibujuan.drip.server.service.UserService;
import com.zizibujuan.drip.server.servlet.authentication.Oauth2Exception;
import com.zizibujuan.drip.server.servlet.authentication.RenrenHelper;
import com.zizibujuan.drip.server.util.OAuthConstants;
import com.zizibujuan.drip.server.util.servlet.BaseServlet;
import com.zizibujuan.drip.server.util.servlet.CookieUtil;
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
	private UserBindService oAuthUserMapService = null;
	
	private List<String> errors;
	
	public LoginServlet() {
		userService = ServiceHolder.getDefault().getUserService();
		oAuthUserMapService = ServiceHolder.getDefault().getUserBindService();
	}

	/**
	 * FIXME：代码应遵循以下逻辑，第三方用户只是用来登录，登录之后就关联到本地用户，后面所有的操作都
	 * 记录在本地用户的头上，而不记录在第三方用户的头上。
	 * 弊端，就是无法分析从哪个网站登录的用户做了哪些事情；但是如果这样做的话，就会让查询用户信息时的逻辑变得很复杂
	 * 如何抉择呢？
	 * 
	 * 第一版本先实现复杂的情况，等后续实际运行一段时间之后再定夺。
	 */
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
			// 把这些代码移到各自的类中，就不需要写完整的包名
			com.qq.connect.api.qzone.UserInfo qzoneUserInfo = new com.qq.connect.api.qzone.UserInfo(accessToken, openID);
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
		IPath path = getPath(req);
		
		if(path.segmentCount() == 1){
			if(path.segment(0).equals("form")){
				errors = new ArrayList<String>();
				Map<String, Object> userInfo = RequestUtil.fromJsonObject(req);
				// login 邮箱或用户名
				String login = userInfo.get(KEY_LOGIN).toString().trim();
				String password = userInfo.get(KEY_PASSWORD).toString();
				this.validate(login, password);
				if(hasErrors()){
					ResponseUtil.toJSON(req, resp, errors, HttpServletResponse.SC_PRECONDITION_FAILED);
					return;
				}
				
				UserInfo existUserInfo = userService.login(login, password);
				if(existUserInfo == null){
					// 登录失败
					errors.add("用户名或密码错误");
					ResponseUtil.toJSON(req, resp, errors, HttpServletResponse.SC_NOT_FOUND);
					return;
				}
				
				// 如果登录成功，则跳转到用户专有首页
				// 在登录的时候设置帐号来源
				existUserInfo.setSiteId(OAuthConstants.ZIZIBUJUAN);
				UserSession.setUser(req, existUserInfo);
				// 在cookie中添加是否登录标记
				CookieUtil.set(resp, "zzbj_user", existUserInfo.getLoginName(), null, 365*24*60*60/*一年有效*/);
				CookieUtil.set(resp, "logged_in", "1", null, -1);
				CookieUtil.set(resp, "zzbj_user_token", existUserInfo.getAccessToken(), null, -1);
				// 返回到客户端，然后客户端跳转到首页
				ResponseUtil.toJSON(req, resp, new HashMap<String, Object>());
				return;
			}
		}
		super.doPost(req, resp);
	}
	
	private void validate(String login, String password){
		if(login.isEmpty()){
			errors.add("请输入邮箱或用户名");
		}
		
		if(password.isEmpty()){
			errors.add("请输入密码");
		}
	}
	
	private boolean hasErrors(){
		return errors != null && errors.size() > 0;
	}
}
