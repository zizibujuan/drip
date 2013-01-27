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
public class ConnectUserDaoImpl extends AbstractDao implements ConnectUserDao {

	private static final String SQL_GET_CONNECT_USER_PUBLIC = "SELECT " +
			"a.MAP_USER_ID \"mapUserId\"," +
			"a.NICK_NAME \"displayName\"," +
			"a.HOME_CITY_CODE \"homeCityCode\"," +
			"a.SEX \"sex\"," +
			"b.OAUTH_SITE_ID \"fromSite\"" +
			"FROM DRIP_CONNECT_USER_INFO a, DRIP_OAUTH_USER_MAP b" +
			"WHERE a.MAP_USER_ID=? AND a.MAP_USER_ID=b.DBID";
	@Override
	public Map<String, Object> getPublicInfo(Long mapUserId) {
		return DatabaseUtil.queryForMap(getDataSource(), SQL_GET_CONNECT_USER_PUBLIC, mapUserId);
	}

	private static final String SQL_INSERT_CONNECT_USER = "INSERT INTO DRIP_CONNECT_USER_INFO " +
			"(MAP_USER_ID," +
			"LOGIN_NAME," +
			"NICK_NAME," +
			"EMAIL," +
			"MOBILE," +
			"REAL_NAME," +
			"SEX," +
			"HOME_CITY_CODE," +
			"HOME_CITY," +
			"INTRODUCE," +
			"CREATE_TIME) " +
			"VALUES " +
			"(?,?,?,?,?,?,now())";

	@Override
	public Long add(Connection con, Map<String, Object> connectUserInfo) throws SQLException {
		Object mapUserId = connectUserInfo.get("mapUserId");
		// TODO:继续添加更详细的用户信息。
		Object loginName = connectUserInfo.get("loginName");
		Object nickName = connectUserInfo.get("nickName");
		// 注意为EMAIL字段添加了唯一性约束字段，所以如果email不存在，要置为null，而不是转化为一个空的字符串。
		Object email  = connectUserInfo.get("email");
		Object mobile = connectUserInfo.get("mobile");
		Object realName = connectUserInfo.get("realName");
		Object sex = connectUserInfo.get("sex");
		Object homeCityCode = connectUserInfo.get("homeCityCode");
		Object homeCity = connectUserInfo.get("homeCity");
		Object introduce = connectUserInfo.get("introduce");
		
		return DatabaseUtil.insert(con, SQL_INSERT_CONNECT_USER, 
				mapUserId, loginName,nickName,email,mobile,realName,sex,homeCityCode,homeCity,introduce);
	}
}
