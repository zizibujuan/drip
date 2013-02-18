package com.zizibujuan.drip.server.dao.mysql;

import java.sql.Connection;
import java.sql.SQLException;

import com.zizibujuan.drip.server.dao.LocalUserStatisticsDao;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;

/**
 * 本地用户的统计信息 数据访问实现类
 * @author jzw
 * @since 0.0.1
 */
public class LocalUserStatisticsDaoImpl extends AbstractDao implements
		LocalUserStatisticsDao {

	private static final String SQL_INSERT_LOCAL_USER_STATISTICS = "INSERT INTO DRIP_LOCAL_USER_STATISTICS " +
			"(GLOBAL_USER_ID) " +
			"VALUES " +
			"(?)";
	@Override
	public void init(Connection con, Long localGlobalUserId) throws SQLException {
		DatabaseUtil.update(con, SQL_INSERT_LOCAL_USER_STATISTICS, localGlobalUserId);
	}

}
