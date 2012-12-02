package com.zizibujuan.drip.server.dao;

import java.sql.Connection;

import com.zizibujuan.drip.server.util.OAuthConstants;

/**
 * 用户关联表 数据访问接口
 * @author jzw
 * @since 0.0.1
 */
public interface OAuthUserMapDao {

	/**
	 * 从帐号关联表中获取用户名
	 * @param 授权站点标识 {@link OAuthConstants}
	 * @param authUserId 外部网站的用户标识
	 * @return 本网站的用户标识
	 */
	Long getUserId(int authSiteId, String authUserId);
	
	/**
	 * 将外部网站的用户标识与本网站的用户进行关联
	 * @param conn 数据库链接
	 * @param authSiteId 外部网站标识
	 * @param authUserId 外部网站用户标识
	 * @param userId 本网站用户标识
	 */
	void mapUserId(Connection conn, int authSiteId, String authUserId, Long userId);

}
