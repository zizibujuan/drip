package com.zizibujuan.drip.server.service;

import java.util.Map;

import com.zizibujuan.drip.server.util.OAuthConstants;

/**
 * 获取与OAuth授权网站关联的用户，不同站点可能使用不同的类型来表示用户标识，因此多个方法
 * @author jzw
 * @since 0.0.1
 */
public interface UserBindService {

	/**
	 * 从帐号关联表中获取用户名
	 * @param siteId 授权站点标识 {@link OAuthConstants}
	 * @param userId 指定网站的用户标识
	 * @return 本网站用户与第三方网站用户映射信息
	 * <pre>
	 * map结构：
	 * 		mapUserId：关联用户标识
	 * 		localUserId：本地用户标识
	 * 		connectUserId：本网站为第三方网站用户生成的代理主键
	 * </pre>
	 */
	Map<String,Object> getUserMapperInfo(int siteId, String userId);
	
	/**
	 * 从帐号关联表中获取用户名
	 * @param siteId 授权站点标识 {@link OAuthConstants}
	 * @param userId 指定网站的用户标识
	 * @return 本网站用户与第三方网站用户映射信息
	 * <pre>
	 * map结构：
	 * 		localUserId：本网站为本地用户生成的全局用户标识
	 * 		connectUserId：本网站为第三方网站用户生成的全局用户标识
	 * </pre>
	 */
	Map<String,Object> getUserMapperInfo(int siteId, int userId);

}
