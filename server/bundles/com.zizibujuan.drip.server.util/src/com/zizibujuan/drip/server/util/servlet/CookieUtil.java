package com.zizibujuan.drip.server.util.servlet;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * cookie帮助类
 * 
 * @author jzw
 * @since 0.0.1
 */
public abstract class CookieUtil {
	
	public static void set(HttpServletResponse resp, String name,
			String value, String domain, int maxAge) {
		if (value == null) {
			value = "";
		}
		Cookie cookie = new Cookie(name, value);
		if(maxAge > 0){
			cookie.setMaxAge(maxAge);
		}
		if (domain != null && !"".equals(domain)) {
			cookie.setDomain(domain);
		}
		cookie.setPath("/");
		resp.addCookie(cookie);
	}

	public static Cookie get(HttpServletRequest req, String name) {
		Cookie cookies[] = req.getCookies();
		// Return null if there are no cookies or the name is invalid.
		if (cookies == null || name == null || name.length() == 0) {
			return null;
		}
		// Otherwise, we do a linear scan for the cookie.
		Cookie cookie = null;
		for (int i = 0; i < cookies.length; i++) {
			// If the current cookie name matches the one we're looking for,
			// we've
			// found a matching cookie.
			if (cookies[i].getName().equals(name)) {
				cookie = cookies[i];
				// The best matching cookie will be the one that has the correct
				// domain name. If we've found the cookie with the correct
				// domain name,
				// return it. Otherwise, we'll keep looking for a better match.
				break;
			}
		}
		return cookie;
	}
	
	public static void remove(HttpServletRequest req, HttpServletResponse resp, String name) {
		Cookie[] cookies = req.getCookies();
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				if (cookie.getName().equals(name)) {
					// 设置cookie的周期为0，也就是删除cookie。
					cookie.setMaxAge(0);
					// 要删除cookie，必须要设置path
					cookie.setPath("/");
					// 必须要加上这一句，否则上面的一句就等于无效。
					// 结论：服务器修改cookie后，一定要调用addCookie()方法，重新添加到客户端中
					resp.addCookie(cookie);
					break;
				}
			}
		}
	}
}
