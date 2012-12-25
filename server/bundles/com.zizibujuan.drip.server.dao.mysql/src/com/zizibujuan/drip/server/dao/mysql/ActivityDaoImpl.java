package com.zizibujuan.drip.server.dao.mysql;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import com.zizibujuan.drip.server.dao.ActivityDao;
import com.zizibujuan.drip.server.util.PageInfo;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;

/**
 * 活动列表 数据访问实现类
 * 
 * @author jinzw
 * @since 0.0.1
 */
public class ActivityDaoImpl extends AbstractDao implements ActivityDao {

	// 获取用户关注者列表
	// 注意，关注的永远是drip用户，但是一个drip用户会关联多个第三方网站用户，
	// 这里要查处所有第三方网站用户的活动列表。
	// 真正用到的用户信息是，如果用户已经有drip信息，则用drip信息；否则使用第三方网站的用户信息
	private static final String SQL_LIST_ACTIVITY_INDEX = "select " +
				"a.WATCH_USER_ID \"userId\"," + // 应该是活动用户标识，如果不是drip用户，则填写第三方网站用户与drip用户映射的关联标识。
				"c.REAL_NAME \"displayUserName\", " +
				"b.CRT_TM \"createTime\"," +
				"b.CONTENT_ID \"contentId\"," +
				"b.ACTION_TYPE \"actionType\"" +
			"FROM " +
			"DRIP_USER_RELATION a, " +
			"DRIP_ACTIVITY b," +
			"DRIP_USER_INFO c," +
			"DRIP_OAUTH_USER_MAP d"+
			" where " +
			"a.USER_ID = ? AND a.WATCH_USER_ID=b.USER_ID AND a.WATCH_USER_ID=c.DBID ORDER BY b.DBID DESC";

	@Override
	public List<Map<String, Object>> get(Long userId, PageInfo pageInfo) {
		return DatabaseUtil.queryForList(getDataSource(),
				SQL_LIST_ACTIVITY_INDEX, pageInfo, userId);
	}

	private static final String SQL_INSERT_ACTIVITY = "INSERT INTO DRIP_ACTIVITY " +
			"(USER_ID,ACTION_TYPE,IS_IN_HOME,CONTENT_ID,CRT_TM) " +
			"VALUES " +
			"(?,?,?,?,now())";
	@Override
	public Long add(Connection con, Map<String, Object> activityInfo) throws SQLException {
		Object userId = activityInfo.get("USER_ID");
		Object actionType = activityInfo.get("ACTION_TYPE");
		Object isInHome = activityInfo.get("IS_IN_HOME");
		Object contentId = activityInfo.get("CONTENT_ID");
		return DatabaseUtil.insert(con, SQL_INSERT_ACTIVITY, userId,actionType,isInHome,contentId);
	}
	@Override
	public Long add(Connection con, Long userId, Long contentId,
			String actionType, boolean showInHome) throws SQLException {
		return DatabaseUtil.insert(con, SQL_INSERT_ACTIVITY, userId, actionType, showInHome, contentId);
	}

}
