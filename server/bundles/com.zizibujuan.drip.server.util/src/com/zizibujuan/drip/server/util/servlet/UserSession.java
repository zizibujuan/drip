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

	public static Long getUserId(HttpServletRequest req) {
		Map<String,Object> userInfo = getUser(req);
		if(userInfo == null){
			return null;
		}
		return Long.valueOf(userInfo.get("id").toString());
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
		httpSession.setMaxInactiveInterval(60*30); // 秒
		httpSession.setAttribute(SESSION_KEY, userInfo);
	}

	public static void increaseExerciseCount(HttpServletRequest req) {
		Map<String,Object> userInfo = getUser(req);
		int exerciseCount = Integer.valueOf(userInfo.get("exerPublishCount").toString());
		exerciseCount++;
		userInfo.put("exerPublishCount", exerciseCount);
	}

	public static void increaseAnswerCount(HttpServletRequest req) {
		Map<String,Object> userInfo = getUser(req);
		int answerCount = Integer.valueOf(userInfo.get("answerCount").toString());
		answerCount++;
		userInfo.put("answerCount", answerCount);
	}

	public static boolean isLogged(HttpServletRequest req) {
		return getUser(req) != null;
	}

}
