package com.zizibujuan.drip.server.util.servlet;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * 用户session帮助类
 * @author jinzw
 * @since 0.0.1
 */
public abstract class UserSession {
	
	private static final String SESSION_KEY = "drip-user";
	public static final String KEY_LOCAL_USER_ID = "localUserId";
	public static final String KEY_CONNECT_USER_ID = "connectUserId";
	
	/**
	 * 获取本网站的用户标识，我们的用户有来自第三方网站的，有在本网站注册的。
	 * 每个用户都有三个标识，一个是对应到本网站的用户标识，一个第三方网站的用户标识，还有一个是关联本网站和第三方网站用户的关联标识。
	 * @param req
	 * @return 本网站的用户标识，如果没有取到，返回null
	 */
	public static Long getLocalUserId(HttpServletRequest req) {
		Map<String,Object> userInfo = getUser(req);
		if(userInfo == null){
			return null;
		}
		return Long.valueOf(userInfo.get(KEY_LOCAL_USER_ID).toString());
	}
	
	/**
	 * 获取为本网站用户分配的数字帐号
	 * @param req
	 * @return 数字帐号，如果没有取到，返回null
	 */
	public static Long getDigitalId(HttpServletRequest req){
		Map<String,Object> userInfo = getUser(req);
		if(userInfo == null){
			return null;
		}
		return Long.valueOf(userInfo.get("digitalId").toString());
	}
	
	/**
	 * 获取第三方网站用户与本网站用户关联的关联标识。注意在网站的所有活动中不使用第三方网站标识，而是使用这个关联标识。
	 * @param req
	 * @return 获取本网站为第三方网站用户统一生成的用户标识；如果没有取到，返回null
	 */
	public static Long getConnectUserId(HttpServletRequest req){
		Map<String,Object> userInfo = getUser(req);
		if(userInfo == null){
			return null;
		}
		return Long.valueOf(userInfo.get(KEY_CONNECT_USER_ID).toString());
	}
	
	/**
	 * 从session中哦呢获取用户登录信息
	 * @param req
	 * @return 如果用户已登录则返回登录信息，如果没有登录则返回null
	 */
	@SuppressWarnings("unchecked")
	public static Map<String,Object> getUser(HttpServletRequest req){
		HttpSession session = req.getSession();
		Object oUser = session.getAttribute(SESSION_KEY);
		if(oUser == null){
			return null;
		}
		
		return (Map<String,Object>)oUser;
	}
	
	public static void setUser(HttpServletRequest req, Object userInfo) {
		HttpSession httpSession = req.getSession();
		httpSession.setMaxInactiveInterval(60*30); // 单位为秒，30分钟
		httpSession.setAttribute(SESSION_KEY, userInfo);
	}

	public static boolean isLogged(HttpServletRequest req) {
		return getUser(req) != null;
	}

}
