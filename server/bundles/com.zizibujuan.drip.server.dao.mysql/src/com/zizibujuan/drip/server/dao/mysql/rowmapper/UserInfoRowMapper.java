package com.zizibujuan.drip.server.dao.mysql.rowmapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import com.zizibujuan.drip.server.model.UserInfo;
import com.zizibujuan.drip.server.util.dao.RowMapper;

/**
 * 将数据库表中的列映射到UserInfo对象上
 * @author jzw
 * @since 0.0.1
 */
public class UserInfoRowMapper implements RowMapper<UserInfo> {

	@Override
	public UserInfo mapRow(ResultSet rs, int rowNum) throws SQLException {
		UserInfo userInfo = new UserInfo();
		userInfo.setId(rs.getLong(1));
		userInfo.setLoginName(rs.getString(2));
		userInfo.setSex(rs.getString(3));
		userInfo.setIntroduce(rs.getString(4));
		userInfo.setConfirmKey(rs.getString(5));
		userInfo.setActive(rs.getBoolean(6));
		return userInfo;
	}

}
