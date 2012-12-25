package com.zizibujuan.drip.server.service;

import java.util.Map;

import com.zizibujuan.drip.server.util.OAuthConstants;

/**
 * 获取与OAuth授权网站关联的用户，不同站点可能使用不同的类型来表示用户标识，因此多个方法
 * @author jzw
 * @since 0.0.1
 */
public interface OAuthUserMapService {

	/**
	 * 从帐号关联表中获取用户名
	 * @param 授权站点标识 {@link OAuthConstants}
	 * @param oauthUserId 第三方用户标识
	 * @return 本网站用户与第三方网站用户映射信息
	 * <pre>
	 * map结构：
	 * LOCAL_USER_ID: 本网站用户标识
	 * MAP_USER_ID: 映射标识
	 * OAUTH_SITE_ID：第三方网站标识
	 * OAUTH_USER_ID：第三方网站用户标识
	 * </pre>
	 */
	Map<String,Object> getUserMapperInfo(int authSiteId, String oauthUserId);
	
	/**
	 * 从帐号关联表中获取用户名
	 * @param 授权站点标识 {@link OAuthConstants}
	 * @param oauthUserId 第三方用户标识
	 * @return 本网站用户与第三方网站用户映射信息
	 */
	Map<String,Object> getUserMapperInfo(int authSiteId, int oauthUserId);

}
