package com.zizibujuan.drip.server.dao.mysql;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import com.zizibujuan.drip.server.dao.UserAvatarDao;
import com.zizibujuan.drip.server.util.dao.BatchPreparedStatementSetter;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;

/**
 * 用户头像信息 数据访问实现类。
 * 支持访问使用Oauth获取的第三方网站的用户头像
 * 
 * @author jzw
 * @since 0.0.1
 */
public class UserAvatarDaoImpl extends AbstractDao implements UserAvatarDao {

	private static final String SQL_INSERT_USER_AVATAR = "INSERT INTO DRIP_USER_AVATAR " +
			"(USER_MAP_ID, " +
			"URL_NAME, " +
			"WIDTH, " +
			"HEIGHT, " +
			"URL, " +
			"CREATE_TIME) " +
			"VALUES (?,?,?,?,?,now())";
	/**
	 * 使用批量新增的方式插入
	 * @throws SQLException 
	 */
	@Override
	public void add(Connection con, final Long mapUserId, final List<Map<String, Object>> avatarList) throws SQLException {
		DatabaseUtil.batchUpdate(con, SQL_INSERT_USER_AVATAR, new BatchPreparedStatementSetter() {
			
			@Override
			public void setValues(PreparedStatement ps, int index) throws SQLException {
				Map<String,Object> avatar = avatarList.get(index);
				ps.setLong(1, mapUserId);
				
				ps.setObject(2, avatar.get("urlName"));
				ps.setObject(3, avatar.get("width"));
				ps.setObject(4, avatar.get("height"));
				ps.setObject(5, avatar.get("url"));
			}
			
			@Override
			public int getBatchSize() {
				return avatarList.size();
			}
		});
	}

}
