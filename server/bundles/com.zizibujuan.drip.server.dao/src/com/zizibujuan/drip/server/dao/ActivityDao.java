package com.zizibujuan.drip.server.dao;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import com.zizibujuan.drip.server.model.Activity;
import com.zizibujuan.drip.server.util.ActionType;
import com.zizibujuan.drip.server.util.PageInfo;

/**
 * 活动列表 数据访问接口
 * @author jinzw
 * @since 0.0.1
 */
public interface ActivityDao {

	/**
	 * 获取userId所关注用户的活动列表的索引信息
	 * 
	 * @param pageInfo 分页信息
	 * @param localUserId 本地用户标识
	 * 
	 * @return 活动列表的索引，并不包含活动内容详情。如果不存在，则返回空列表。
	 */
	List<Activity> getFollowing(PageInfo pageInfo, Long localUserId);
	
	/**
	 * 添加一个新的活动
	 * 
	 * @param con 数据库链接
	 * @param activityInfo 活动信息
	 * @return 活动标识
	 * @throws SQLException 
	 */
	Long add(Connection con, Activity activityInfo) throws SQLException;
	
	/**
	 * 添加一个新的活动
	 * @param con 数据库链接
	 * @param connectGlobalUserId 本网站为第三方网站用户生成的全局用户标识
	 * @param contentId 活动内容标识
	 * @param actionType 操作类型 参考 {@link ActionType}
	 * @param showInHome 是否在个人首页中显示，true 显示; false 不显示
	 * @return 活动标识
	 * @throws SQLException 
	 */
	Long add(Connection con, 
			Long connectGlobalUserId, 
			Long contentId, 
			String actionType, 
			boolean showInHome) throws SQLException;

	List<Map<String, Object>> getMyAnswers(PageInfo pageInfo, Long localUserId);

	List<Map<String, Object>> getMyExercises(PageInfo pageInfo, Long localUserId);
}
