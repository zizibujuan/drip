package com.zizibujuan.drip.server.dao;

import java.sql.Connection;
import java.sql.SQLException;

/**
 * 数字帐号 数据访问接口
 * @author jzw
 * @since 0.0.1
 */
public interface DigitalIdDao {

	/**
	 * 从数字帐号库中随机获取预定义的可以使用的帐号
	 * @param con 数据库链接
	 * @return 数字帐号
	 * @throws SQLException 
	 */
	Long random(Connection con) throws SQLException;

}
