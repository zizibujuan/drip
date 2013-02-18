package com.zizibujuan.drip.server.dao.mysql;

import java.sql.Connection;
import java.sql.SQLException;

import com.zizibujuan.drip.server.dao.DigitalIdDao;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;
import com.zizibujuan.drip.server.util.dao.IdGenerator;

/**
 * 数字帐号 数据访问实现类
 * @author jzw
 * @since 0.0.1
 */
public class DigitalIdDaoImpl extends AbstractDao implements DigitalIdDao {

	private static final String SQL_UPDATE_RANDOM_ROW = "UPDATE " +
			"DRIP_USER_NUMBER " +
			"SET USE_TOKEN = ?,APPLY_TIME = now() " +
			"WHERE USE_TOKEN IS NULL " +
			"ORDER BY RAND() LIMIT 1";
	
	private static final String SQL_GET_NUM = "SELECT NUM FROM DRIP_USER_NUMBER WHERE USE_TOKEN=?";
	@Override
	public int random(Connection con) throws SQLException {
		String uuid = IdGenerator.uuid();
		DatabaseUtil.update(con, SQL_UPDATE_RANDOM_ROW, uuid);
		int result = DatabaseUtil.queryForInt(getDataSource(), SQL_GET_NUM, uuid);
		if(result == 0)
			throw new SQLException("随机产生的用户数字帐号不能为0");
		return result;
	}

}
