package com.zizibujuan.drip.server.dao;

import java.sql.Connection;
import java.sql.SQLException;

/**
 * 用户关系 数据访问接口。
 * TODO：在添加使用第二个第三方网站用户登录时，添加帐号关联功能。也支持用户将本网站的几个帐号关联起来。
 * 但是那只能是个马甲，彼此之间没有信息互通。可通过合并帐号申请实现信息互通。
 * @author jinzw
 * @since 0.0.1
 */
public interface UserRelationDao {
	
	/**
	 * 用户关注另一个用户。
	 * <p>不论是被关注用户还是关注用户，这里的标识都是指drip的用户标识，而不是第三方网站的用户标识。
	 * 这样就可以通过drip用户，获取到所有关联帐号的信息</p>
	 * @param con 数据库链接
	 * @param userId 执行关注操作的用户标识
	 * @param watchUserId 被关注的用户标识
	 * @throws SQLException 
	 */
	void watch(Connection con, Long userId, Long watchUserId) throws SQLException;
	
	/**
	 * 用户关注另一个用户。
	 * <p>不论是被关注用户还是关注用户，这里的标识都是指drip的用户标识，而不是第三方网站的用户标识。
	 * 这样就可以通过drip用户，获取到所有关联帐号的信息</p>
	 * @param userId 执行关注操作的用户标识
	 * @param watchUserId 被关注的用户标识
	 */
	void watch(Long userId, Long watchUserId);

	/**
	 * 获取第一个用户没有关注第二个用户的关系标识。
	 * @param userId 用户标识, 该用户关注第二个参数标识的用户。
	 * @param watchUserId 被关注的用户标识
	 * @return 用户关系标识，如果第一个用户没有关注第二个用户，则返回null；否则返回关系标识。
	 */
	Long getRelationId(Long userId, Long watchUserId);

	/**
	 * 删除记录
	 * @param userId 发起关注的用户标识
	 * @param followUserId 被关注用户标识
	 */
	void delete(Long userId, Long followUserId);

}
