package com.zizibujuan.drip.server.dao.mysql;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Map;

import com.zizibujuan.drip.server.dao.UserBindDao;
import com.zizibujuan.drip.server.model.UserInfo;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;
import com.zizibujuan.drip.server.util.dao.RowMapper;

/**
 * 用户帐号绑定 数据访问实现类
 * @author jzw
 * @since 0.0.1
 */
public class UserBindDaoImpl extends AbstractDao implements UserBindDao {

	private static final String SQL_GET_MAP_USER_INFO= "SELECT a.BIND_USER_ID \"connectUserId\"," +
			"a.LOCAL_USER_ID \"localUserId\" " +
			"FROM DRIP_USER_BIND a, DRIP_GLOBAL_USER_INFO b " +
			"WHERE " +
			"b.SITE_ID=? AND " +
			"b.OPEN_ID=? AND " +
			"a.BIND_USER_ID = b.DBID";
	@Override
	public Map<String, Object> getUserMapperInfo(int authSiteId, String authUserId) {
		return DatabaseUtil.queryForMap(getDataSource(), SQL_GET_MAP_USER_INFO, authSiteId, authUserId);
	}
	
	private static final String SQL_INSERT_AUTH_USER_MAP = "INSERT INTO DRIP_USER_BIND (" +
			"LOCAL_USER_ID," +
			"BIND_USER_ID," +
			"REF_USER_INFO) " +
			"VALUE (?,?,?)";
	@Override
	public Long bind(Connection con, Long localUserId, Long connectUserId, boolean refUserInfo) throws SQLException {
		return DatabaseUtil.insert(con, SQL_INSERT_AUTH_USER_MAP, localUserId, connectUserId, refUserInfo);
	}
	
	private static final String SQL_GET_LOCAL_USER_ID_BY_CONNECT_USER_ID = "SELECT LOCAL_USER_ID FROM DRIP_USER_BIND WHERE BIND_USER_ID=?";
	@Override
	public Long getLocalUserId(Long connectUserId) {
		return DatabaseUtil.queryForLong(getDataSource(), SQL_GET_LOCAL_USER_ID_BY_CONNECT_USER_ID, connectUserId);
	}
	
	private static final String SQL_GET_REF_USER_INFO = "SELECT " +
			"a.LOCAL_USER_ID \"localUserId\"," +
			"a.BIND_USER_ID \"connectUserId\" " +
			"FROM " +
			"DRIP_USER_BIND a " +
			"WHERE " +
			"a.LOCAL_USER_ID=? AND " +
			"a.REF_USER_INFO=?";
	@Override
	public Map<String, Object> getRefUserMapperInfo(Long localUserId) {
		return DatabaseUtil.queryForMap(getDataSource(), SQL_GET_REF_USER_INFO, localUserId, true);
	}
	
	private static final String SQL_GET_REF_USER_ID = "SELECT " +
			"a.BIND_USER_ID \"connectUserId\" " +
			"FROM " +
			"DRIP_USER_BIND a " +
			"WHERE " +
			"a.LOCAL_USER_ID=? AND " +
			"a.REF_USER_INFO=?";
	@Override
	public Long getRefUserId(Long localUserId) {
		return DatabaseUtil.queryForLong(getDataSource(), SQL_GET_REF_USER_ID, localUserId, true);
	}
	
}
