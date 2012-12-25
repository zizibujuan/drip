package com.zizibujuan.drip.server.service;

import java.util.List;
import java.util.Map;

import com.zizibujuan.drip.server.util.PageInfo;

/**
 * 活动列表服务
 * @author jinzw
 * @since 0.0.1
 */
public interface ActivityService {

	/**
	 * 获取用户的所有活动列表，如果有多个第三方帐号与本地帐号关联，则获取所有帐号的活动
	 * @param localUserId 本地用户标识，即drip用户
	 * @param pageInfo 分页信息
	 * @return 活动列表，如果没有则返回空列表
	 */
	List<Map<String, Object>> get(Long localUserId, PageInfo pageInfo);

}
