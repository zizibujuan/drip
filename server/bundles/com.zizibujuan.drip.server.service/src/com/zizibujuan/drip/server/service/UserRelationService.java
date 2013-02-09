package com.zizibujuan.drip.server.service;

import java.util.List;
import java.util.Map;

import com.zizibujuan.drip.server.util.PageInfo;

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
	 * @param userId 发起关注的用户标识
	 * @param followUserId 被关注的用户标识
	 */
	void follow(Long userId, Long followUserId);

	/**
	 * 取消关注好友
	 * @param userId 发起关注的用户标识
	 * @param followUserId 被关注的用户标识
	 */
	void unFollow(Long userId, Long followUserId);

	/**
	 * 获取我关注的用户列表
	 * @param pageInfo 分页信息
	 * @param localUserId 本地用户标识，注意不能使用映射的用户标识，这个标识是全网站唯一的，而localUserId会对应多个第三方用户标识
	 * @return 关注的用户列表，如果没有则返回空的列表。
	 */
	List<Map<String, Object>> getFollowing(PageInfo pageInfo, Long localUserId);

	/**
	 * 获取关注我的用户列表
	 * @param pageInfo 分页信息
	 * @param localUserId 本地用户标识，注意不能使用映射的用户标识，这个标识是全网站唯一的，而localUserId会对应多个第三方用户标识
	 * @return 关注我的用户列表，如果没有则返回空的列表。
	 */
	List<Map<String, Object>> getFollowers(PageInfo pageInfo, Long localUserId);

}
