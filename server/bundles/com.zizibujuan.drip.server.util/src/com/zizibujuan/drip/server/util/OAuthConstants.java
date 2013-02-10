package com.zizibujuan.drip.server.util;

/**
 * 使用其他网站登录该网站时用到的常量的key
 * @author jzw
 * @since 0.0.1
 */
public class OAuthConstants {
	
	// oauth 站点标识,第三方网站的标识从100开始。
	/**
	 * 本网站标识 http://zizibujuan.com
	 */
	public static final int ZIZIBUJUAN = 1;
	/**
	 * 人人网站 http://renren.com
	 */
	public static final int RENREN = 101;
	
	/**
	 * qq
	 */
	public static final int QQ = 201;
	
	/**
	 * 新浪微博
	 */
	public static final int SINA_WEIBO = 301;
	
	

	public static final String KEY_RENREN_APP_ID = "renren.app.id";
	public static final String KEY_RENREN_APP_KEY = "renren.app.key";
	public static final String KEY_RENREN_APP_SECRET = "renren.app.secret";
	public static final String KEY_RENREN_LOGIN_PAGE_URL_TMPL = "renren.url.loginPage";
	public static final String KEY_RENREN_REDIRECT_URL = "renren.redirect.url";
	public static final String KEY_RENREN_OAUTH_TOKEN_END_POINT = "renren.oauth.token.endPoint";
	
	public static final String KEY_GROUP_RENREN = "renren";
	
}
