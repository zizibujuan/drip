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
	
	// 需要确定的是，是否允许关注第三方网站用户。现在做的约定是允许。
	// 该表中需要加一个标识，isLocalUser
	
	// 1.找到与登录本网站用户绑定的所有帐号，包括本网站用户
	// 2.找到所有绑定帐号关注的用户列表
	// 3.找到这些关注的用户的活动列表
	// 4.按照活动时间倒排
	// 5.分页
	private static final String SQL_LIST_ACTIVITY_INDEX = "SELECT " +
			"DA.DBID," +
			"DA.GLOBAL_USER_ID \"connectGlobalUserId\"," +
			"UBD.LOCAL_USER_ID \"localGlobalUserId\"," +
			"DA.CONTENT_ID \"contentId\"," +
			"DA.ACTION_TYPE \"actionType\"," +
			"DA.CRT_TM \"createTime\" " +
			"FROM " +
			"DRIP_USER_BIND DUB, " +
			"DRIP_USER_RELATION DUR, " +
			"DRIP_ACTIVITY DA, " +
			"DRIP_USER_BIND UBD " +
			"WHERE " +
			"DUR.WATCH_USER_ID=GLOBAL_USER_ID AND " +
			"DUB.BIND_USER_ID = DUR.USER_ID AND " +
			"DA.GLOBAL_USER_ID = UBD.BIND_USER_ID AND " +
			"DUB.LOCAL_USER_ID=? " +
			"ORDER BY DA.DBID DESC";
	 
	@Override
	public List<Map<String, Object>> get(Long userId, PageInfo pageInfo) {
		return DatabaseUtil.queryForList(getDataSource(),
				SQL_LIST_ACTIVITY_INDEX, pageInfo, userId);
	}

	private static final String SQL_INSERT_ACTIVITY = "INSERT INTO DRIP_ACTIVITY " +
			"(GLOBAL_USER_ID," +
			"ACTION_TYPE," +
			"IS_IN_HOME," +
			"CONTENT_ID," +
			"CRT_TM) " +
			"VALUES " +
			"(?,?,?,?,now())";
	@Override
	public Long add(Connection con, Map<String, Object> activityInfo) throws SQLException {
		Object connectGlobalUserId = activityInfo.get("connectGlobalUserId");
		Object actionType = activityInfo.get("actionType");
		Object isInHome = activityInfo.get("isInHome");
		Object contentId = activityInfo.get("contentId");
		return DatabaseUtil.insert(con, SQL_INSERT_ACTIVITY, connectGlobalUserId,actionType,isInHome,contentId);
	}
	@Override
	public Long add(Connection con, 
			Long connectGlobalUserId, 
			Long contentId,
			String actionType, 
			boolean showInHome) throws SQLException {
		return DatabaseUtil.insert(con, SQL_INSERT_ACTIVITY, connectGlobalUserId, actionType, showInHome, contentId);
	}

}
