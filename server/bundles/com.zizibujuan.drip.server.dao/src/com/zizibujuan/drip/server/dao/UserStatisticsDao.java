package com.zizibujuan.drip.server.dao;

import java.sql.Connection;
import java.sql.SQLException;

import com.zizibujuan.drip.server.model.UserStatistics;

/**
 * 本地用户的统计信息 数据访问接口
 * 
 * @author jinzw
 * @since 0.0.1
 */
public interface UserStatisticsDao {

	/**
	 * 为新增的本地用户初始化统计信息，所有统计信息的值都置为0
	 * 
	 * @param con 数据库链接
	 * @param userId 本网站用户标识
	 * @throws SQLException 
	 */
	void init(Connection con, Long userId) throws SQLException;

	/**
	 * 发布一道习题后，在用户的发布习题数上加1
	 * 
	 * @param con 数据库链接
	 * @param userId 本网站用户标识
	 * @throws SQLException 
	 */
	void increasePublishExerciseCount(Connection con, Long userId) throws SQLException;
	
	/**
	 * 取消发布一道习题后，在用户的发布习题数上减1
	 * 
	 * @param con 数据库链接
	 * @param userId 本网站用户标识
	 * @throws SQLException 
	 */
	void decreasePublishExerciseCount(Connection con, Long userId) throws SQLException;
	
	/**
	 * 保存一道习题草稿后，在用户的习题草稿数上加1
	 * 
	 * @param con 数据库链接
	 * @param userId 本网站用户标识
	 * @throws SQLException 
	 */
	void increaseDraftExerciseCount(Connection con, Long userId) throws SQLException;
	
	/**
	 * 删除一道习题草稿后，在用户的习题草稿数上减1
	 * 
	 * @param con 数据库链接
	 * @param userId 本网站用户标识
	 * @throws SQLException 
	 */
	void decreaseDraftExerciseCount(Connection con, Long userId) throws SQLException;
	
	/**
	 * 用户回答了一套习题后，在用户回答的习题数上加1
	 * 
	 * @param con 数据库链接
	 * @param userId 本网站用户标识
	 * @throws SQLException 
	 */
	void increaseAnswerCount(Connection con, Long userId) throws SQLException;
	
	/**
	 * 用户回答了一套习题后，在用户回答的习题数上减1
	 * 
	 * @param con 数据库链接
	 * @param userId 本网站用户标识
	 * @throws SQLException 
	 */
	void decreaseAnswerCount(Connection con, Long userId) throws SQLException;
	
	/**
	 * 粉丝数加1
	 * 
	 * @param con 数据库链接
	 * @param userId 本网站用户标识
	 * @throws SQLException 
	 */
	void increaseFollowerCount(Connection con, Long userId) throws SQLException;
	
	/**
	 * 粉丝数减1
	 * 
	 * @param con 数据库链接
	 * @param userId 本网站用户标识
	 * @throws SQLException 
	 */
	void decreaseFollowerCount(Connection con, Long userId) throws SQLException;
	
	/**
	 * 关注的用户数加1
	 * 
	 * @param con 数据库链接
	 * @param userId 本网站用户标识
	 * @throws SQLException 
	 */
	void increaseFollowingCount(Connection con, Long userId) throws SQLException;
	
	/**
	 * 关注的用户数减1
	 * 
	 * @param con 数据库链接
	 * @param userId 本网站用户标识
	 * @throws SQLException 
	 */
	void decreaseFollowingCount(Connection con, Long userId) throws SQLException;
	
	/**
	 * 获取本地用户相关的统计数据，这些只是在客户端显示的统计项。
	 * 
	 * @param userId 本网站用户标识
	 * @return 返回基于本地用户的统计数据。
	 */
	UserStatistics getUserStatistics(Long userId);
}
