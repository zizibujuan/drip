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

	/*
	private static final String SQL_GET_USER_FOR_SESSION = "SELECT " +
			"DBID \"id\"," +
			"LOGIN_NAME \"loginName\"," +
			"EMAIL \"email\"," +
			//"LOGIN_PWD," + 登录密码，不在session中缓存
			//支持三种大小的头像信息
			"MOBILE \"mobile\"," +
			"REAL_NAME \"realName\"," +
			"NICK_NAME \"nickName\"," +
			//"CRT_TM \"createTime\" " +
			"DIGITAL_ID \"digitalId\" " +
			"FROM DRIP_GLOBAL_USER_INFO ";
	 */
	@Override
	public UserInfo mapRow(ResultSet rst, int rowNum) throws SQLException {
		UserInfo userInfo = new UserInfo();
		userInfo.setId(rst.getLong("id"));
		userInfo.setLoginName(rst.getString("loginName"));
		userInfo.setEmail(rst.getString("email"));
		userInfo.setDigitalId(rst.getLong("digitalId"));
		userInfo.setNickName(rst.getString("nickName"));
		return userInfo;
	}

}
