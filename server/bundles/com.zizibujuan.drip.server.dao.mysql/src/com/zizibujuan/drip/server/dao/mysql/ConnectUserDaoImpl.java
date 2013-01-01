package com.zizibujuan.drip.server.dao.mysql;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Map;

import com.zizibujuan.drip.server.dao.ConnectUserDao;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;

/**
 * 通过第三方网站提供的connect功能，接入的用户。 数据访问实现类
 * 
 * @author jzw
 * @since 0.0.1
 */
public class ConnectUserDaoImpl implements ConnectUserDao {

	@Override
	public Map<String, Object> get(Long mapUserId) {
		// TODO Auto-generated method stub
		throw new UnsupportedOperationException();
	}

	private static final String SQL_INSERT_CONNECT_USER = "INSERT INTO DRIP_CONNECT_USER_INFO " +
			"(LOGIN_NAME," +
			"NICK_NAME," +
			"EMAIL," +
			"MOBILE," +
			"REAL_NAME," +
			"CREATE_TIME) " +
			"VALUES " +
			"(?,?,?,?,?,now())";

	@Override
	public Long add(Connection con, Map<String, Object> connectUserInfo) throws SQLException {
		// TODO:继续添加更详细的用户信息。
		Object loginName = connectUserInfo.get("loginName");
		Object nickName = connectUserInfo.get("nickName");
		// 注意为EMAIL字段添加了唯一性约束字段，所以如果email不存在，要置为null，而不是转化为一个空的字符串。
		Object email  = connectUserInfo.get("email");
		Object mobile = connectUserInfo.get("mobile");
		Object realName = connectUserInfo.get("realName");
		
		return DatabaseUtil.insert(con, SQL_INSERT_CONNECT_USER, loginName,nickName,email,mobile,realName);
	}
}
