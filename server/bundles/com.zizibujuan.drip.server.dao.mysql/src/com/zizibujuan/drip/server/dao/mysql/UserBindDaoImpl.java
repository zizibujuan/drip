package com.zizibujuan.drip.server.dao.mysql;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Map;

import com.zizibujuan.drip.server.dao.UserBindDao;
import com.zizibujuan.drip.server.model.UserBindInfo;
import com.zizibujuan.drip.server.util.dao.AbstractDao;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;
import com.zizibujuan.drip.server.util.dao.PreparedStatementSetter;
import com.zizibujuan.drip.server.util.dao.RowMapper;

/**
 * 用户帐号绑定 数据访问实现类
 * @author jzw
 * @since 0.0.1
 */
public class UserBindDaoImpl extends AbstractDao implements UserBindDao {

	private static final String SQL_GET_USER_BIND_INFO= "SELECT "
			+ "a.DBID,"
			+ "a.USER_ID,"
			+ "a.OPEN_ID, "
			+ "a.SITE_ID "
			+ "FROM "
			+ "DRIP_USER_BIND a "
			+ "WHERE "
			+ "a.SITE_ID=? AND "
			+ "a.OPEN_ID=?";
	@Override
	public UserBindInfo get(int siteId, String openId) {
		return DatabaseUtil.queryForObject(getDataSource(), SQL_GET_USER_BIND_INFO, new RowMapper<UserBindInfo>() {
			@Override
			public UserBindInfo mapRow(ResultSet rs, int rowNum) throws SQLException {
				UserBindInfo bindInfo = new UserBindInfo();
				bindInfo.setId(rs.getLong(1));
				bindInfo.setUserId(rs.getLong(2));
				bindInfo.setOpenId(rs.getString(3));
				bindInfo.setSiteId(rs.getInt(4));
				return bindInfo;
			}
		}, siteId, openId);
	}
	
	private static final String SQL_INSERT_AUTH_USER_MAP = "INSERT INTO "
			+ "DRIP_USER_BIND ("
			+ "SITE_ID,"
			+ "OPEN_ID,"
			+ "USER_ID) "
			+ "VALUE "
			+ "(?, ?, ?)";
	@Override
	public Long bind(Connection con, final UserBindInfo userBindInfo) throws SQLException {
		return DatabaseUtil.insert(con, SQL_INSERT_AUTH_USER_MAP, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement ps) throws SQLException {
				ps.setInt(1, userBindInfo.getSiteId());
				ps.setString(2, userBindInfo.getOpenId());
				ps.setLong(3, userBindInfo.getUserId());
			}
		});
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
