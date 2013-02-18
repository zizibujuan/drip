package com.zizibujuan.drip.server.dao.mysql;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Map;

import com.zizibujuan.drip.server.dao.ConnectUserDao;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;

/**
 * 通过第三方网站提供的connect功能，接入的用户。 数据访问实现类
 * TODO: 删除这个类，与UserInfoDao类合并
 * @author jzw
 * @since 0.0.1
 */
public class ConnectUserDaoImpl extends AbstractDao implements ConnectUserDao {

	
	private static final String SQL_GET_CONNECT_USER_PUBLIC = "SELECT " +
			"a.DBID \"connectUserId\"," +
			"a.NICK_NAME \"nickName\"," +
			"a.HOME_CITY_CODE \"homeCityCode\"," +
			"a.SEX \"sex\"," +
			"a.SITE_ID \"siteId\" " +
			"FROM DRIP_CONNECT_USER_INFO a " +
			"WHERE a.DBID=?";
	@Override
	public Map<String, Object> getPublicInfo(Long connectUserId) {
		return DatabaseUtil.queryForMap(getDataSource(), SQL_GET_CONNECT_USER_PUBLIC, connectUserId);
	}

	private static final String SQL_INSERT_CONNECT_USER = "INSERT INTO DRIP_GLOBAL_USER_INFO " +
			"(LOGIN_NAME," +
			"NICK_NAME," +
			"SITE_ID," +
			"OPEN_ID," +
			"EMAIL," +
			"MOBILE," +
			"REAL_NAME," +
			"SEX," +
			"BIRTHDAY,"+
			"HOME_CITY_CODE," +
			"HOME_CITY," +
			"INTRODUCE," +
			"CREATE_TIME) " +
			"VALUES " +
			"(?,?,?,?,?,?,?,?,?,?,?,?,now())";

	@Override
	public Long add(Connection con, Map<String, Object> connectUserInfo) throws SQLException {
		// TODO:继续添加更详细的用户信息。
		Object siteId = connectUserInfo.get("siteId");
		Object userId = connectUserInfo.get("openId");
		Object loginName = connectUserInfo.get("loginName");
		Object nickName = connectUserInfo.get("nickName");
		Object realName = connectUserInfo.get("realName");//FIXME:nickName与realName显示优先级的问题
		// 注意为EMAIL字段添加了唯一性约束字段，所以如果email不存在，要置为null，而不是转化为一个空的字符串。
		Object email  = connectUserInfo.get("email");
		Object mobile = connectUserInfo.get("mobile");
		
		Object sex = connectUserInfo.get("sex");
		Object birthDay = connectUserInfo.get("birthday");
		Object homeCityCode = connectUserInfo.get("homeCityCode");
		Object homeCity = connectUserInfo.get("homeCity");
		Object introduce = connectUserInfo.get("introduce");
		
		return DatabaseUtil.insert(con, SQL_INSERT_CONNECT_USER, 
				loginName,
				nickName,
				siteId, 
				userId,
				email,
				mobile,
				realName,
				sex,
				birthDay,
				homeCityCode,
				homeCity,
				introduce);
	}
}
