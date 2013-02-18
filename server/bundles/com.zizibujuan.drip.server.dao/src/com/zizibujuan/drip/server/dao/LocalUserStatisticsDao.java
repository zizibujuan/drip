package com.zizibujuan.drip.server.dao;

import java.sql.Connection;
import java.sql.SQLException;

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

}
