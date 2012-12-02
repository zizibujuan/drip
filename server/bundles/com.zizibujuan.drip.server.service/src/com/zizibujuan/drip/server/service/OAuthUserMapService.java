package com.zizibujuan.drip.server.service;

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
	 * @param userId 用户标识
	 * @return 用户名
	 */
	String getUserName(int authSiteId, String userId);
	
	/**
	 * 从帐号关联表中获取用户名
	 * @param 授权站点标识 {@link OAuthConstants}
	 * @param userId 用户标识
	 * @return 用户名
	 */
	String getUserName(int authSiteId, int userId);

}
