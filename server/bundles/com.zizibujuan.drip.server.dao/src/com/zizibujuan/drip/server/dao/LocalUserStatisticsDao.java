package com.zizibujuan.drip.server.dao;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Map;

/**
 * 本地用户的统计信息 数据访问接口
 * @author jzw
 * @since 0.0.1
 */
public interface LocalUserStatisticsDao {

	/**
	 * 为新增的本地用户初始化统计信息，所有统计信息的值都置为0
	 * @param con 数据库链接
	 * @param localGlobalUserId 为本地用户生成的全局用户标识
	 * @throws SQLException 
	 */
	void init(Connection con, Long localGlobalUserId) throws SQLException;

	/**
	 * 添加一道习题后，在用户的添加习题数上加1
	 * @param con 数据库链接
	 * @param localGlobalUserId 为本地用户生成的全局用户标识
	 * @throws SQLException 
	 */
	void increaseExerciseCount(Connection con, Long localGlobalUserId) throws SQLException;
	
	/**
	 * 添加一道习题后，在用户的添加习题数上减1
	 * @param con 数据库链接
	 * @param localGlobalUserId 为本地用户生成的全局用户标识
	 * @throws SQLException 
	 */
	void decreaseExerciseCount(Connection con, Long localGlobalUserId) throws SQLException;
	
	/**
	 * 用户回答了一套习题后，在用户回答的习题数上加1
	 * @param con 数据库链接
	 * @param localGlobalUserId 为本地用户生成的全局用户标识
	 * @throws SQLException 
	 */
	void increaseAnswerCount(Connection con, Long localGlobalUserId) throws SQLException;
	
	/**
	 * 用户回答了一套习题后，在用户回答的习题数上减1
	 * @param con 数据库链接
	 * @param localGlobalUserId 为本地用户生成的全局用户标识
	 * @throws SQLException 
	 */
	void decreaseAnswerCount(Connection con, Long localGlobalUserId) throws SQLException;
	
	/**
	 * 粉丝数加1
	 * @param con 数据库链接
	 * @param localGlobalUserId 为本地用户生成的全局用户标识
	 * @throws SQLException 
	 */
	void increaseFollowerCount(Connection con, Long localGlobalUserId) throws SQLException;
	
	/**
	 * 粉丝数减1
	 * @param con 数据库链接
	 * @param localGlobalUserId 为本地用户生成的全局用户标识
	 * @throws SQLException 
	 */
	void decreaseFollowerCount(Connection con, Long localGlobalUserId) throws SQLException;
	
	/**
	 * 关注的用户数加1
	 * @param con 数据库链接
	 * @param localGlobalUserId 为本地用户生成的全局用户标识
	 * @throws SQLException 
	 */
	void increaseFollowingCount(Connection con, Long localGlobalUserId) throws SQLException;
	
	/**
	 * 关注的用户数减1
	 * @param con 数据库链接
	 * @param localGlobalUserId 为本地用户生成的全局用户标识
	 * @throws SQLException 
	 */
	void decreaseFollowingCount(Connection con, Long localGlobalUserId) throws SQLException;
	
	
	
	/**
	 * 获取本地用户相关的统计数据，这些只是在客户端显示的统计项。
	 * @param localGlobalUserId 为本地用户生成的全局用户标识
	 * @return 返回基于本地用户的统计数据。
	 */
	Map<String, Object> getUserStatistics(Long localGlobalUserId);
}
