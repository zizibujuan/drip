package com.zizibujuan.drip.server.util.dao;

import java.sql.PreparedStatement;
import java.sql.SQLException;

/**
 * 批量更新的回调接口
 * @author jzw
 * @since 0.0.1
 */
public interface BatchPreparedStatementSetter {

	/**
	 * 设置参数值
	 * @param ps
	 * @param index 数值索引，从零开始
	 * @throws SQLException
	 */
	void setValues(PreparedStatement ps, int index) throws SQLException;
	
	/**
	 * 获取批量处理的个数
	 * @return 批量处理的个数
	 */
	int getBatchSize();
}
