package com.zizibujuan.drip.server.util;

/**
 * 系统中所有属性值的key值
 * 
 * @author jinzw
 * @since 0.0.1
 */
public abstract class ApplicationPropertyKey {

	public static final String GROUP_DRIP_PROPERTY = "drip.properties";

	public static final String DRIP_COOKIE_MAX_USER_ID = "drip.cookie.max.userId";

	/**
	 * 最近登录时间
	 */
	public static final String LOGIN_LAST_LOGIN_MILLIS = "login.lastLoginMillis";
	
	/**
	 * 用户登录次数
	 */
	public static final String LOGIN_COUNT = "login.count";
	
	/**
	 * 用户连续输错密码的次数
	 */
	public static final String INVALID_PASSWORD_ATTEMPTS = "invalidPasswordAttempts";
	
	/**
	 * 城市分组的key值
	 */
	public static final String GROUP_CITY = "city";
}
