package com.zizibujuan.drip.server.dao;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Map;

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
	 * 将外部网站的用户标识与本网站的用户进行关联
	 * @param conn 数据库链接
	 * @param authSiteId 外部网站标识
	 * @param authUserId 外部网站用户标识
	 * @param userId 本网站用户标识
	 * @return 返回映射记录的标识，该标识不是第三方网站的用户标识，而是与drip用户关联后生成的一个新标识。
	 * @throws SQLException 
	 */
	Long mapUserId(Connection conn, int authSiteId, String authUserId, Long userId) throws SQLException;
	
	/**
	 * 获取映射用户标识对应的本地用户标识
	 * @param mapUserId 映射用户标识
	 * @return 本地用户标识
	 */
	Long getLocalUserId(Long mapUserId);

}
