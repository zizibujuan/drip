package com.zizibujuan.drip.server.util.dao;

import java.sql.PreparedStatement;
import java.sql.SQLException;

/**
 * 为{@link PreparedStatement}设置参数
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
