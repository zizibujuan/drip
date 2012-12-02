package com.zizibujuan.drip.server.dao;

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
	 * @param userId 用户标识
	 * @return 用户名
	 */
	String getUserName(int authSiteId, String userId);

}
