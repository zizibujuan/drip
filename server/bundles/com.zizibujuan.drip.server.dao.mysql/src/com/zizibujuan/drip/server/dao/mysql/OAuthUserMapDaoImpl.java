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

	private static final String SQL_GET_MAP_USER_INFO= "SELECT a.DBID \"mapUserId\"," +
			"a.LOCAL_USER_ID \"localUserId\", " +
			"a.CONNECT_USER_ID \"connectUserId\" " +
			"FROM DRIP_OAUTH_USER_MAP a, DRIP_CONNECT_USER_INFO b " +
			"WHERE " +
			"b.SITE_ID=? AND " +
			"b.USER_ID=? AND " +
			"a.CONNECT_USER_ID = b.DBID";
	@Override
	public Map<String, Object> getUserMapperInfo(int authSiteId, String authUserId) {
		return DatabaseUtil.queryForMap(getDataSource(), SQL_GET_MAP_USER_INFO, authSiteId, authUserId);
	}
	
	private static final String SQL_INSERT_AUTH_USER_MAP = "INSERT INTO DRIP_OAUTH_USER_MAP (" +
			"LOCAL_USER_ID," +
			"CONNECT_USER_ID," +
			"REF_USER_INFO) " +
			"VALUE (?,?,?)";
	@Override
	public Long mapUser(Connection con, Long localUserId, Long connectUserId, boolean refUserInfo) throws SQLException {
		return DatabaseUtil.insert(con, SQL_INSERT_AUTH_USER_MAP, localUserId, connectUserId, refUserInfo);
	}
	
	private static final String SQL_GET_LOCAL_USER_ID_BY_MAP_USER_ID = "SELECT LOCAL_USER_ID FROM DRIP_OAUTH_USER_MAP WHERE DBID=?";
	@Override
	public Long getLocalUserId(Long mapUserId) {
		return DatabaseUtil.queryForLong(getDataSource(), SQL_GET_LOCAL_USER_ID_BY_MAP_USER_ID, mapUserId);
	}
	
	private static final String SQL_GET_REF_USER_INFO = "SELECT a.DBID \"mapUserId\"," +
			"a.LOCAL_USER_ID \"localUserId\"," +
			"a.CONNECT_USER_ID \"connectUserId\"," +
			"b.SITE_ID \"siteId\" " +
			"FROM DRIP_OAUTH_USER_MAP a, DRIP_CONNECT_USER_INFO b " +
			"WHERE " +
			"a.LOCAL_USER_ID=? AND " +
			"a.REF_USER_INFO=? AND " +
			"a.CONNECT_USER_ID = b.DBID";
	@Override
	public Map<String, Object> getRefUserMapperInfo(Long localUserId) {
		return DatabaseUtil.queryForMap(getDataSource(), SQL_GET_REF_USER_INFO, localUserId, true);
	}
	
}
