package com.zizibujuan.drip.server.util.dao;

import java.sql.PreparedStatement;
import java.sql.SQLException;

/**
 * 为对象设置值的回调接口
 * @author jzw
 * @since 0.0.1
 */
public interface PreparedStatementSetter {

	/**
	 * 设置参数值
	 * @param ps
	 * @throws SQLException
	 */
	void setValues(PreparedStatement ps)throws SQLException;
}
