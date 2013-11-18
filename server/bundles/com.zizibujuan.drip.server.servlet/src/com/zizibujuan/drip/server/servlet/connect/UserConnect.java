package com.zizibujuan.drip.server.servlet.connect;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.zizibujuan.drip.server.model.Avatar;
import com.zizibujuan.drip.server.service.UserService;
import com.zizibujuan.drip.server.servlet.ServiceHolder;
import com.zizibujuan.drip.server.util.CookieConstants;
import com.zizibujuan.drip.server.util.servlet.CookieUtil;
import com.zizibujuan.drip.server.util.servlet.UserSession;

/**
 * 使用第三方网站帐号登录的抽象类
 * 
 * @author jzw
 * @since 0.0.1
 */
public abstract class UserConnect {
	protected UserService userService = ServiceHolder.getDefault().getUserService();
	/**
	 * 登录功能被第三方网站托管
	 * 
	 * @param req
	 * @param resp
	 * @throws IOException 
	 */
	public void manager(HttpServletRequest req, HttpServletResponse resp) throws IOException{
		String code = req.getParameter("code");
		if(code != null && !code.isEmpty()){
			login(req, resp, code);
		}else{
			toLoginPage(req, resp);
		}
	}

	protected abstract void toLoginPage(HttpServletRequest req, HttpServletResponse resp) throws IOException;

	protected abstract void login(HttpServletRequest req, HttpServletResponse resp, String code) throws IOException;

	protected void addAvatar(List<Avatar> avatars, String urlName, String url,
			int width, int height) {
		Avatar avatar = new Avatar();
		avatar.setHeight(height);
		avatar.setWidth(width);
		avatar.setUrlName(urlName);
		avatar.setUrl(url);
		avatars.add(avatar);
	}

	protected void internLogin(HttpServletRequest req, HttpServletResponse resp, Long dripUserId) {
		// FIXME:注意，暂时不支持第三方用户自动登录
		// 是不是应该在每次登录时，都记录下token和过期时间呢?
		com.zizibujuan.drip.server.model.UserInfo dripUserInfo = userService.login(dripUserId);
		UserSession.setUser(req, dripUserInfo);
		// 第三方网站不在loginName中缓存昵称
		CookieUtil.set(resp, CookieConstants.LOGGED_IN, "1", null, -1);
		// 防止同一台电脑先使用drip用户登录，然后使用qq用户登录，要删除本网站的token
		// 这样就不会使用其他人的帐号自动登录
		// 同时也可以设置第三方网站的token，这样可以使用这些token自动登录
		CookieUtil.remove(req, resp, CookieConstants.ZZBJ_USER_TOKEN);
	}
}
