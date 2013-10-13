package com.zizibujuan.drip.server.service;

import java.util.List;
import java.util.Map;

import com.zizibujuan.drip.server.util.PageInfo;
import com.zizibujuan.drip.server.util.RelationType;

/**
 * 用户关系服务接口
 * @author jzw
 * @since 0.0.1
 */
public interface UserRelationService {

	/**
	 * 获取第一个用户没有关注第二个用户的关系标识。
	 * @param userId 用户标识, 该用户关注第二个参数标识的用户。
	 * @param watchUserId 被关注的用户标识
	 * @return 用户关系标识，如果第一个用户没有关注第二个用户，则返回null；否则返回关系标识。
	 */
	Long getRelationId(Long userId, Long watchUserId);

	/**
	 * 关注好友，不能重复关注同一个人
	 * 
	 * @param userId 发起关注的用户标识,本网站用户标识
	 * @param watchUserId 被关注的用户标识，本网站用户标识
	 */
	void follow(Long userId, Long watchUserId);

	/**
	 * 取消关注好友
	 * @param connectUserId 发起关注的用户标识，本网站为第三方用户生成的全局用户标识/本网站用户标识
	 * @param followConnectUserId 被关注的用户标识，本网站为第三方用户生成的全局用户标识/本网站用户标识
	 */
	void unFollow(Long connectUserId, Long followConnectUserId);

	/**
	 * 获取我关注的用户列表
	 * @param pageInfo 分页信息
	 * @param loginDigitalId 当前登录的用户数字帐号
	 * @param digitalId 要查看用户的数字帐号
	 * @return 关注的用户列表，如果没有则返回空的列表。
	 * <pre>
	 * map结构：
	 * 		watched: 0 关注的用户与登录用户是同一个人； 1 已关注； 2 没有关注 {@link RelationType}
	 * </pre>
	 */
	List<Map<String, Object>> getFollowing(PageInfo pageInfo, Long loginDigitalId, Long digitalId);

	/**
	 * 获取关注我的用户列表,即我的粉丝
	 * @param pageInfo 分页信息
	 * @param loginDigitalId 当前登录的用户数字帐号
	 * @param digitalId 要查看用户的数字帐号
	 * @return 关注我的用户列表，如果没有则返回空的列表。
	 * <pre>
	 * map结构：
	 * 		watched: 0 关注的用户与登录用户是同一个人； 1 已关注； 2 没有关注 {@link RelationType}
	 * </pre>
	 */
	List<Map<String, Object>> getFollowers(PageInfo pageInfo, Long loginDigitalId, Long digitalId);

}
