package com.zizibujuan.drip.server.dao.mysql;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;

import com.zizibujuan.drip.server.dao.UserStatisticsDao;
import com.zizibujuan.drip.server.model.UserStatistics;
import com.zizibujuan.drip.server.util.dao.AbstractDao;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;
import com.zizibujuan.drip.server.util.dao.RowMapper;

/**
 * 本地用户的统计信息 数据访问实现类
 * @author jzw
 * @since 0.0.1
 */
public class UserStatisticsDaoImpl extends AbstractDao implements
		UserStatisticsDao {

	private static final String SQL_INSERT_USER_STATISTICS = "INSERT INTO "
			+ "DRIP_USER_STATISTICS "
			+ "(USER_ID) "
			+ "VALUES "
			+ "(?)";
	@Override
	public void init(Connection con, Long userId) throws SQLException {
		DatabaseUtil.update(con, SQL_INSERT_USER_STATISTICS, userId);
	}

	private static final String SQL_UPDATE_INCREASE_EXERCISE_COUNT = "UPDATE "
			+ "DRIP_USER_STATISTICS "
			+ "SET "
			+ "EXER_PUBLISH_COUNT = EXER_PUBLISH_COUNT + 1 "
			+ "WHERE "
			+ "USER_ID = ?";
	@Override
	public void increaseExerciseCount(Connection con, Long userId) throws SQLException {
		DatabaseUtil.update(con, SQL_UPDATE_INCREASE_EXERCISE_COUNT, userId);
	}
	
	private static final String SQL_UPDATE_INCREASE_ANSWER_COUNT = "UPDATE "
			+ "DRIP_USER_STATISTICS "
			+ "SET "
			+ "ANSWER_COUNT = ANSWER_COUNT + 1 "
			+ "WHERE "
			+ "USER_ID=?";
	@Override
	public void increaseAnswerCount(Connection con, Long userId) throws SQLException {
		DatabaseUtil.update(con, SQL_UPDATE_INCREASE_ANSWER_COUNT, userId);
	}
	
	private static final String SQL_UPDATE_DECREASE_EXERCISE_COUNT = "UPDATE "
			+ "DRIP_USER_STATISTICS "
			+ "SET "
			+ "EXER_PUBLISH_COUNT = EXER_PUBLISH_COUNT - 1 "
			+ "WHERE "
			+ "USER_ID=?";
	@Override
	public void decreaseExerciseCount(Connection con, Long userId) throws SQLException {
		DatabaseUtil.update(con, SQL_UPDATE_DECREASE_EXERCISE_COUNT, userId);
	}
	
	private static final String SQL_UPDATE_DECREASE_ANSWER_COUNT = "UPDATE "
			+ "DRIP_USER_STATISTICS "
			+ "SET "
			+ "ANSWER_COUNT = ANSWER_COUNT - 1 "
			+ "WHERE "
			+ "USER_ID=?";
	@Override
	public void decreaseAnswerCount(Connection con, Long userId) throws SQLException {
		DatabaseUtil.update(con, SQL_UPDATE_DECREASE_ANSWER_COUNT, userId);
	}
	
	private static final String SQL_GET_USER_STATISTICS = "SELECT "
			+ "DBID,"
			+ "FAN_COUNT,"
			+ "FOLLOW_COUNT,"
			+ "EXER_DRAFT_COUNT,"
			+ "EXER_PUBLISH_COUNT, "
			+ "ANSWER_COUNT,"
			+ "DOC_COMMIT_COUNT "
			+ "FROM "
			+ "DRIP_USER_STATISTICS "
			+ "WHERE "
			+ "USER_ID=?";
	@Override
	public UserStatistics getUserStatistics(Long userId) {
		return DatabaseUtil.queryForObject(getDataSource(), SQL_GET_USER_STATISTICS,new RowMapper<UserStatistics>() {
			@Override
			public UserStatistics mapRow(ResultSet rs, int rowNum) throws SQLException {
				UserStatistics statistics = new UserStatistics();
				statistics.setId(rs.getLong(1));
				statistics.setFanCount(rs.getLong(2));
				statistics.setFollowCount(rs.getLong(3));
				statistics.setExerDraftCount(rs.getLong(4));
				statistics.setExerPublishCount(rs.getLong(5));
				statistics.setAnswerCount(rs.getLong(6));
				statistics.setDocCommitCount(rs.getLong(7));
				return statistics;
			}
		}, userId);
	}
	
	private static final String SQL_UPDATE_INCREASE_FOLLOWER_COUNT = "UPDATE "
			+ "DRIP_USER_STATISTICS "
			+ "SET "
			+ "FAN_COUNT = FAN_COUNT + 1 "
			+ "WHERE "
			+ "USER_ID=?";
	@Override
	public void increaseFollowerCount(Connection con, Long userId) throws SQLException {
		DatabaseUtil.update(con, SQL_UPDATE_INCREASE_FOLLOWER_COUNT, userId);
	}
	
	private static final String SQL_UPDATE_DECREASE_FOLLOWER_COUNT = "UPDATE "
			+ "DRIP_USER_STATISTICS "
			+ "SET "
			+ "FAN_COUNT = FAN_COUNT-1 "
			+ "WHERE "
			+ "USER_ID=?";
	@Override
	public void decreaseFollowerCount(Connection con, Long userId)
			throws SQLException {
		DatabaseUtil.update(con, SQL_UPDATE_DECREASE_FOLLOWER_COUNT, userId);
	}
	
	private static final String SQL_UPDATE_INCREASE_FOLLOWING_COUNT = "UPDATE "
			+ "DRIP_USER_STATISTICS "
			+ "SET "
			+ "FOLLOW_COUNT=FOLLOW_COUNT+1 "
			+ "WHERE "
			+ "USER_ID=?";
	@Override
	public void increaseFollowingCount(Connection con, Long userId) throws SQLException {
		DatabaseUtil.update(con, SQL_UPDATE_INCREASE_FOLLOWING_COUNT, userId);
	}
	
	private static final String SQL_UPDATE_DECREASE_FOLLOWING_COUNT = "UPDATE "
			+ "DRIP_USER_STATISTICS "
			+ "SET "
			+ "FOLLOW_COUNT = FOLLOW_COUNT-1 "
			+ "WHERE "
			+ "USER_ID=?";
	@Override
	public void decreaseFollowingCount(Connection con, Long userId) throws SQLException {
		DatabaseUtil.update(con, SQL_UPDATE_DECREASE_FOLLOWING_COUNT, userId);
	}
}
