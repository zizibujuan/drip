package com.zizibujuan.drip.server.dao;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import com.zizibujuan.drip.server.model.Avatar;

/**
 * 用户头像信息 数据访问接口。
 * 支持访问使用Oauth获取的第三方网站的用户头像
 * 
 * @author jzw
 * @since 0.0.1
 */
public interface UserAvatarDao {
	 
	/**
	 * 存储用户头像列表。
	 * @param con 数据库链接
	 * @param userId 本网站用户标识/本网站为第三方网站用户生成的代理主键
	 * @param avatars 头像列表
	 * @throws SQLException 
	 */
	void add(Connection con, Long userId, List<Avatar> avatars) throws SQLException;

	/**
	 * 获取用户头像信息
	 * @param userId 本网站用户标识
	 * @return 用户头像信息，如果没有则返回空的map
	 * <pre>
	 *  map结构：
	 *		smallImageUrl: 小头像
 	 *		largeImageUrl: 
 	 *		largerImageUrl:
 	 *		xLargeImageUrl:
	 * </pre>
	 */
	Map<String, String> get(Long userId);

}
