package com.zizibujuan.drip.server.dao.mysql;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import com.zizibujuan.drip.server.dao.ActivityDao;
import com.zizibujuan.drip.server.model.Activity;
import com.zizibujuan.drip.server.util.PageInfo;
import com.zizibujuan.drip.server.util.constant.ActionType;
import com.zizibujuan.drip.server.util.dao.AbstractDao;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;
import com.zizibujuan.drip.server.util.dao.PreparedStatementSetter;
import com.zizibujuan.drip.server.util.dao.RowMapper;

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
	// 4.找到每一个关联用户对应的本地用户
	// 5.按照活动时间倒排
	// 6.分页
	private static final String SQL_LIST_ACTIVITY_FOLLOWING = "SELECT "
			+ "DA.DBID,"
			+ "DA.USER_ID,"
			+ "DA.CONTENT_ID,"
			+ "DA.ACTION_TYPE,"
			+ "DA.CRT_TM "
			+ "FROM "
			+ "DRIP_USER_RELATION DUR, "
			+ "DRIP_ACTIVITY DA "
			+ "WHERE "
			+ "DUR.USER_ID=? AND "
			+ "DUR.WATCH_USER_ID = DA.USER_ID "
			+ "ORDER BY DA.DBID DESC";
	@Override
	public List<Activity> getFollowing(PageInfo pageInfo, Long userId) {
		return DatabaseUtil.query(getDataSource(), SQL_LIST_ACTIVITY_FOLLOWING, new RowMapper<Activity>() {

			@Override
			public Activity mapRow(ResultSet rs, int rowNum) throws SQLException {
				Activity activity = new Activity();
				activity.setId(rs.getLong(1));
				activity.setUserId(rs.getLong(2));
				activity.setContentId(rs.getLong(3));
				activity.setActionType(rs.getString(4));
				activity.setCreateTime(rs.getTimestamp(5));
				return activity;
			}
		}, pageInfo, userId);
	}

	private static final String SQL_LIST_MY_ACTIVITY_FILTER_BY_TYPE = "SELECT " +
			"DA.DBID," +
			"DA.GLOBAL_USER_ID \"connectGlobalUserId\"," +
			"DUB.LOCAL_USER_ID \"localGlobalUserId\"," +
			"DA.CONTENT_ID \"contentId\"," +
			"DA.ACTION_TYPE \"actionType\"," +
			"DA.CRT_TM \"createTime\" " +
			"FROM " +
			"DRIP_USER_BIND DUB, " +
			"DRIP_ACTIVITY DA " +
			"WHERE " +
			"DUB.LOCAL_USER_ID=? AND " +
			"DUB.BIND_USER_ID = DA.GLOBAL_USER_ID AND " +
			"DA.ACTION_TYPE = ? " +
			"ORDER BY DA.DBID DESC";
	@Override
	public List<Map<String, Object>> getMyAnswers(PageInfo pageInfo, Long localUserId) {
		return DatabaseUtil.queryForList(getDataSource(),
				SQL_LIST_MY_ACTIVITY_FILTER_BY_TYPE, pageInfo, localUserId, ActionType.ANSWER_EXERCISE);
	}

	// TODO: 将获取习题草稿和发布的习题分开
	// TODO: 重命名该方法
	@Override
	public List<Map<String, Object>> getMyExercises(PageInfo pageInfo, Long localUserId) {
		return DatabaseUtil.queryForList(getDataSource(),
				SQL_LIST_MY_ACTIVITY_FILTER_BY_TYPE, pageInfo, localUserId, ActionType.SAVE_EXERCISE_DRAFT);
	}
	
	private static final String SQL_INSERT_ACTIVITY = "INSERT INTO "
			+ "DRIP_ACTIVITY "
			+ "(USER_ID,"
			+ "ACTION_TYPE,"
			+ "IS_IN_HOME,"
			+ "CONTENT_ID,"
			+ "CRT_TM) "
			+ "VALUES "
			+ "(?,?,?,?,now())";
	@Override
	public Long add(Connection con, final Activity activityInfo) throws SQLException {
		return DatabaseUtil.insert(con, SQL_INSERT_ACTIVITY, new PreparedStatementSetter() {
			
			@Override
			public void setValues(PreparedStatement ps) throws SQLException {
				ps.setLong(1, activityInfo.getUserId());
				ps.setString(2, activityInfo.getActionType());
				ps.setBoolean(3, activityInfo.isInHome());
				ps.setLong(4, activityInfo.getContentId());
			}
		});
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
