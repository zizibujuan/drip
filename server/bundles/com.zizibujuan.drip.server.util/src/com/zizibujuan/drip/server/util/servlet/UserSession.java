package com.zizibujuan.drip.server.util.servlet;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * 用户session帮助类,注意这个类不提供获取登录用户详细信息的方法，只做session应该做的事情。
 * 
 * @author jzw
 * @since 0.0.1
 */
public abstract class UserSession {
	
	private static final String SESSION_KEY = "drip-user";
	
	/**
	 * 设置session
	 * @param req
	 * @param userInfo 暂时使用Object类型，没有使用UserInfo类型，因为目前的项目结构会出现循环依赖
	 */
	public static void setUser(HttpServletRequest req, Object userInfo) {
		HttpSession httpSession = req.getSession();
		httpSession.setMaxInactiveInterval(60 * 60 * 4); // 单位为秒，4小时
		httpSession.setAttribute(SESSION_KEY, userInfo);
	}
	
	public static Object getUser(HttpServletRequest req){
		HttpSession session = req.getSession();
		return session.getAttribute(SESSION_KEY);
	}

	public static boolean isLogged(HttpServletRequest req) {
		return getUser(req) != null;
	}

}
