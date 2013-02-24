package com.zizibujuan.drip.server.dao.mysql;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.zizibujuan.drip.server.dao.LocalUserStatisticsDao;
import com.zizibujuan.drip.server.dao.UserBindDao;
import com.zizibujuan.drip.server.dao.UserRelationDao;
import com.zizibujuan.drip.server.exception.dao.DataAccessException;
import com.zizibujuan.drip.server.util.PageInfo;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;

/**
 * 用户关系 数据访问实现类
 * 
 * @author jinzw
 * @since 0.0.1
 */
public class UserRelationDaoImpl extends AbstractDao implements UserRelationDao {
	private static final Logger logger = LoggerFactory.getLogger(UserRelationDaoImpl.class);
	
	private LocalUserStatisticsDao localUserStatisticsDao;
	private UserBindDao userBindDao;

	private static final String SQL_INSERT_USER_RELATION = "INSERT INTO " +
			"DRIP_USER_RELATION " +
			"(USER_ID, WATCH_USER_ID,CRT_TM) " +
			"VALUES " +
			"(?,?,now())";
	@Override
	public void watch(Connection con, Long userId, Long watchUserId) throws SQLException {
		DatabaseUtil.insert(con, SQL_INSERT_USER_RELATION, userId, watchUserId);
	}
	@Override
	public void watch(Long userId, Long watchUserId) {
		Connection con = null;
		try {
			con = getDataSource().getConnection();
			con.setAutoCommit(false);
			this.watch(con, userId, watchUserId);
			Long watchLocalUserId = userBindDao.getLocalUserId(watchUserId);
			localUserStatisticsDao.increaseFollowingCount(con, userId);
			localUserStatisticsDao.increaseFollowerCount(con, watchLocalUserId);
			con.commit();
		} catch (SQLException e) {
			DatabaseUtil.safeRollback(con);
			throw new DataAccessException(e);
		} finally {
			DatabaseUtil.closeConnection(con);
		}
	}

	private static final String SQL_GET_RELATION_ID = "SELECT DBID FROM DRIP_USER_RELATION WHERE USER_ID=? AND WATCH_USER_ID=?";
	@Override
	public Long getRelationId(Long userId, Long watchUserId) {
		return DatabaseUtil.queryForLong(getDataSource(), SQL_GET_RELATION_ID, userId, watchUserId);
	}

	private static final String SQL_DELETE_RELATION = "DELETE FROM DRIP_USER_RELATION WHERE  USER_ID=? AND WATCH_USER_ID=?";
	@Override
	public void delete(Long userId, Long watchUserId) {
		Connection con = null;
		try {
			con = getDataSource().getConnection();
			con.setAutoCommit(false);
			DatabaseUtil.update(getDataSource(), SQL_DELETE_RELATION, userId, watchUserId);
			Long watchLocalUserId = userBindDao.getLocalUserId(watchUserId);
			localUserStatisticsDao.decreaseFollowingCount(con, userId);
			localUserStatisticsDao.decreaseFollowerCount(con, watchLocalUserId);
			con.commit();
		} catch (SQLException e) {
			DatabaseUtil.safeRollback(con);
			throw new DataAccessException(e);
		} finally {
			DatabaseUtil.closeConnection(con);
		}
		
	}

	private static final String SQL_LIST_FOLLOWING = "SELECT " +
			"DUR.WATCH_USER_ID \"following\" " +
			"FROM " +
			"DRIP_USER_RELATION DUR, " +
			"DRIP_GLOBAL_USER_INFO DGUI, " +
			"DRIP_USER_BIND DUB " +
			"WHERE " +
			"DGUI.DIGITAL_ID = ? AND " +
			"DGUI.DBID = DUB.LOCAL_USER_ID AND " +
			"DUB.BIND_USER_ID = DUR.USER_ID AND " +
			"DUR.USER_ID != DUR.WATCH_USER_ID " +// 剔除掉用户的自我关注
			"ORDER BY DUR.DBID DESC";
	@Override
	public List<Map<String, Object>> getFollowing(PageInfo pageInfo, Long digitalId) {
		return DatabaseUtil.queryForList(getDataSource(), SQL_LIST_FOLLOWING, pageInfo, digitalId);
	}

	private static final String SQL_LIST_FOLLOWERS = "SELECT " +
			"DUR.USER_ID \"follower\" " +
			"FROM " +
			"DRIP_USER_RELATION DUR, " +
			"DRIP_GLOBAL_USER_INFO DGUI, " +
			"DRIP_USER_BIND DUB " +
			"WHERE " +
			"DGUI.DIGITAL_ID = ? AND " +
			"DGUI.DBID = DUB.LOCAL_USER_ID AND " +
			"DUB.BIND_USER_ID = DUR.WATCH_USER_ID AND " +
			"DUR.USER_ID != DUR.WATCH_USER_ID " +// 剔除掉用户的自我关注,因为这里存储的都是全局用户标识，所以不会出现两个网站都有id为1的重复情况出现
			"ORDER BY DUR.DBID DESC";
	@Override
	public List<Map<String, Object>> getFollowers(PageInfo pageInfo, Long digitalId) {
		return DatabaseUtil.queryForList(getDataSource(), SQL_LIST_FOLLOWERS, pageInfo, digitalId);
	}
	
	private static final String SQL_GET_WATCHED = "SELECT " +
			"DUR.WATCH_USER_ID \"following\" " +
			"FROM " +
			"DRIP_USER_RELATION DUR, " +
			"DRIP_GLOBAL_USER_INFO DGUI, " +
			"DRIP_USER_BIND DUB " +
			"WHERE " +
			"DGUI.DIGITAL_ID = ? AND DUR.WATCH_USER_ID=? AND " +
			"DGUI.DBID = DUB.LOCAL_USER_ID AND " +
			"DUB.BIND_USER_ID = DUR.USER_ID AND " +
			"DUR.USER_ID != DUR.WATCH_USER_ID " +// 剔除掉用户的自我关注
			"ORDER BY DUR.DBID DESC LIMIT 1";
	@Override
	public boolean isWatched(Long digitalId, Long followingConnectUserId) {
		List<Map<String,Object>> result = DatabaseUtil.queryForList(getDataSource(), SQL_GET_WATCHED, digitalId,followingConnectUserId);
		return result.size() > 0;
	}

	public void setLocalUserStatisticsDao(LocalUserStatisticsDao localUserStatisticsDao) {
		logger.info("注入localUserStatisticsDao");
		this.localUserStatisticsDao = localUserStatisticsDao;
	}
	
	public void unsetLocalUserStatisticsDao(LocalUserStatisticsDao localUserStatisticsDao) {
		if (this.localUserStatisticsDao == localUserStatisticsDao) {
			logger.info("注销localUserStatisticsDao");
			this.localUserStatisticsDao = null;
		}
	}
	
	public void setUserBindDao(UserBindDao userBindDao) {
		logger.info("注入userBindDao");
		this.userBindDao = userBindDao;
	}
	
	public void unsetUserBindDao(UserBindDao userBindDao) {
		if (this.userBindDao == userBindDao) {
			logger.info("注销userBindDao");
			this.userBindDao = null;
		}
	}
}
