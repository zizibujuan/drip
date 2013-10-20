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

import com.zizibujuan.drip.server.model.UserInfo;
import com.zizibujuan.drip.server.service.UserService;
import com.zizibujuan.drip.server.servlet.connect.Oauth2Exception;
import com.zizibujuan.drip.server.servlet.connect.QQUserConnect;
import com.zizibujuan.drip.server.servlet.connect.RenrenHelper;
import com.zizibujuan.drip.server.servlet.connect.UserConnect;
import com.zizibujuan.drip.server.util.CookieConstants;
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
	
	private List<String> errors;
	
	public LoginServlet() {
		userService = ServiceHolder.getDefault().getUserService();
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
		IPath path = getPath(req);
		if(path.segmentCount() == 1){
			String site = path.segment(0);
			UserConnect connect = null;
			if (site.equals("qq")) {
				connect = new QQUserConnect();
				connect.manager(req, resp);
				return;
			}
			
			
			
			if (site.equals("renren")) {
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
			} else if(site.equals("sinaWeibo")){
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
				CookieUtil.set(resp, CookieConstants.LOGIN_NAME, existUserInfo.getLoginName(), null, 365*24*60*60/*一年有效*/);
				CookieUtil.set(resp, CookieConstants.LOGGED_IN, "1", null, -1);
				CookieUtil.set(resp, CookieConstants.ZZBJ_USER_TOKEN, existUserInfo.getAccessToken(), null, -1);
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
