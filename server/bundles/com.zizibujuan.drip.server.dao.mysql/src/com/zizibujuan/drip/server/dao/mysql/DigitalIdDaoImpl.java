package com.zizibujuan.drip.server.dao.mysql;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import com.zizibujuan.drip.server.dao.DigitalIdDao;
import com.zizibujuan.drip.server.util.dao.AbstractDao;
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
	public Long random(Connection con) throws SQLException {
		String uuid = IdGenerator.uuid();
		DatabaseUtil.update(con, SQL_UPDATE_RANDOM_ROW, uuid);
		// 如果新建一个dataSource则查不到这个记录，必须使用保存的connection查，因为只能查同一事务中的数据。
		//int result = DatabaseUtil.queryForInt(getDataSource(), SQL_GET_NUM, uuid);
		Long result = null;
		PreparedStatement pst = con.prepareStatement(SQL_GET_NUM);
		pst.setString(1, uuid);
		ResultSet rst = pst.executeQuery();
		if(rst.next()){
			result = rst.getLong(1);
		}
		if(result == null || result == 0l)
			throw new SQLException("随机产生的用户数字帐号失败");
		return result;
	}

}
