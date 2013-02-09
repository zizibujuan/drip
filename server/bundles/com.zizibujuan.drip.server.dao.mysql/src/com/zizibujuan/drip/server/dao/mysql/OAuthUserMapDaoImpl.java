package com.zizibujuan.drip.server.dao.mysql;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Map;

import com.zizibujuan.drip.server.dao.OAuthUserMapDao;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;

/**
 * 用户关联表 数据访问实现类
 * @author jzw
 * @since 0.0.1
 */
public class OAuthUserMapDaoImpl extends AbstractDao implements OAuthUserMapDao {

	private static final String SQL_GET_DRIP_USER_ID = "SELECT DBID MAP_USER_ID," +
			"LOCAL_USER_ID, " +
			"OAUTH_SITE_ID," +
			"OAUTH_USER_ID " +
			"FROM DRIP_OAUTH_USER_MAP " +
			"WHERE OAUTH_SITE_ID=? AND OAUTH_USER_ID=?";
	@Override
	public Map<String, Object> getUserMapperInfo(int authSiteId, String authUserId) {
		return DatabaseUtil.queryForMap(getDataSource(), SQL_GET_DRIP_USER_ID, authSiteId, authUserId);
	}
	
	private static final String SQL_INSERT_AUTH_USER_MAP = "INSERT INTO DRIP_OAUTH_USER_MAP (" +
			"OAUTH_SITE_ID," +
			"OAUTH_USER_ID," +
			"LOCAL_USER_ID) " +
			"VALUE (?,?,?)";
	@Override
	public Long mapUserId(Connection con, int authSiteId,String authUserId, Long userId) throws SQLException {
		return DatabaseUtil.insert(con, SQL_INSERT_AUTH_USER_MAP, authSiteId, authUserId, userId);
	}
	
	private static final String SQL_GET_LOCAL_USER_ID_BY_MAP_USER_ID = "SELECT LOCAL_USER_ID FROM DRIP_OAUTH_USER_MAP WHERE DBID=?";
	@Override
	public Long getLocalUserId(Long mapUserId) {
		return DatabaseUtil.queryForLong(getDataSource(), SQL_GET_LOCAL_USER_ID_BY_MAP_USER_ID, mapUserId);
	}
}
