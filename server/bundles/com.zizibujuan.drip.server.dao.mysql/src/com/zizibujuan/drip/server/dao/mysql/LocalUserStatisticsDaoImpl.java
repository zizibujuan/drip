package com.zizibujuan.drip.server.dao.mysql;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Map;

import com.zizibujuan.drip.server.dao.LocalUserStatisticsDao;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;

/**
 * 本地用户的统计信息 数据访问实现类
 * @author jzw
 * @since 0.0.1
 */
public class LocalUserStatisticsDaoImpl extends AbstractDao implements
		LocalUserStatisticsDao {

	private static final String SQL_INSERT_LOCAL_USER_STATISTICS = "INSERT INTO DRIP_LOCAL_USER_STATISTICS " +
			"(GLOBAL_USER_ID) " +
			"VALUES " +
			"(?)";
	@Override
	public void init(Connection con, Long localGlobalUserId) throws SQLException {
		DatabaseUtil.update(con, SQL_INSERT_LOCAL_USER_STATISTICS, localGlobalUserId);
	}

	private static final String SQL_UPDATE_INCREASE_EXERCISE_COUNT = "UPDATE DRIP_LOCAL_USER_STATISTICS SET " +
			"EXER_PUBLISH_COUNT=EXER_PUBLISH_COUNT+1 " +
			"where GLOBAL_USER_ID=?";
	@Override
	public void increaseExerciseCount(Connection con, Long localGlobalUserId) throws SQLException {
		DatabaseUtil.update(con, SQL_UPDATE_INCREASE_EXERCISE_COUNT, localGlobalUserId);
	}
	
	private static final String SQL_UPDATE_INCREASE_ANSWER_COUNT = "UPDATE DRIP_LOCAL_USER_STATISTICS SET " +
			"ANSWER_COUNT=ANSWER_COUNT+1 " +
			"where GLOBAL_USER_ID=?";
	@Override
	public void increaseAnswerCount(Connection con, Long localGlobalUserId) throws SQLException {
		DatabaseUtil.update(con, SQL_UPDATE_INCREASE_ANSWER_COUNT, localGlobalUserId);
	}
	
	private static final String SQL_UPDATE_DECREASE_EXERCISE_COUNT = "UPDATE DRIP_LOCAL_USER_STATISTICS SET " +
			"EXER_PUBLISH_COUNT=EXER_PUBLISH_COUNT-1 " +
			"where GLOBAL_USER_ID=?";
	@Override
	public void decreaseExerciseCount(Connection con, Long localGlobalUserId)
			throws SQLException {
		DatabaseUtil.update(con, SQL_UPDATE_DECREASE_EXERCISE_COUNT, localGlobalUserId);
	}
	
	private static final String SQL_UPDATE_DECREASE_ANSWER_COUNT = "UPDATE DRIP_LOCAL_USER_STATISTICS SET " +
			"ANSWER_COUNT=ANSWER_COUNT-1 " +
			"where GLOBAL_USER_ID=?";
	@Override
	public void decreaseAnswerCount(Connection con, Long localGlobalUserId)
			throws SQLException {
		DatabaseUtil.update(con, SQL_UPDATE_DECREASE_ANSWER_COUNT, localGlobalUserId);
	}
	
	private static final String SQL_GET_USER_STATISTICS = "SELECT " +
			"DBID \"id\"," +
			"FAN_COUNT \"fanCount\","+
			"FOLLOW_COUNT \"followCount\","+
			"EXER_DRAFT_COUNT \"exerDraftCount\","+
			"EXER_PUBLISH_COUNT \"exerPublishCount\", "+
			"ANSWER_COUNT \"answerCount\", "+
			"EXER_DRAFT_COUNT+EXER_PUBLISH_COUNT \"exerciseCount\" " +
			"FROM DRIP_LOCAL_USER_STATISTICS WHERE GLOBAL_USER_ID=?";
	@Override
	public Map<String, Object> getUserStatistics(Long localGlobalUserId) {
		return DatabaseUtil.queryForMap(getDataSource(), SQL_GET_USER_STATISTICS, localGlobalUserId);
	}
	
	private static final String SQL_UPDATE_INCREASE_FOLLOWER_COUNT = "UPDATE DRIP_LOCAL_USER_STATISTICS SET " +
			"FAN_COUNT=FAN_COUNT+1 " +
			"where GLOBAL_USER_ID=?";
	@Override
	public void increaseFollowerCount(Connection con, Long localGlobalUserId)
			throws SQLException {
		DatabaseUtil.update(con, SQL_UPDATE_INCREASE_FOLLOWER_COUNT, localGlobalUserId);
	}
	
	private static final String SQL_UPDATE_DECREASE_FOLLOWER_COUNT = "UPDATE DRIP_LOCAL_USER_STATISTICS SET " +
			"FAN_COUNT=FAN_COUNT-1 " +
			"where GLOBAL_USER_ID=?";
	@Override
	public void decreaseFollowerCount(Connection con, Long localGlobalUserId)
			throws SQLException {
		DatabaseUtil.update(con, SQL_UPDATE_DECREASE_FOLLOWER_COUNT, localGlobalUserId);
	}
	
	private static final String SQL_UPDATE_INCREASE_FOLLOWING_COUNT = "UPDATE DRIP_LOCAL_USER_STATISTICS SET " +
			"FOLLOW_COUNT=FOLLOW_COUNT+1 " +
			"where GLOBAL_USER_ID=?";
	@Override
	public void increaseFollowingCount(Connection con, Long localGlobalUserId)
			throws SQLException {
		DatabaseUtil.update(con, SQL_UPDATE_INCREASE_FOLLOWING_COUNT, localGlobalUserId);
	}
	
	private static final String SQL_UPDATE_DECREASE_FOLLOWING_COUNT = "UPDATE DRIP_LOCAL_USER_STATISTICS SET " +
			"FOLLOW_COUNT=FOLLOW_COUNT-1 " +
			"where GLOBAL_USER_ID=?";
	@Override
	public void decreaseFollowingCount(Connection con, Long localGlobalUserId)
			throws SQLException {
		DatabaseUtil.update(con, SQL_UPDATE_DECREASE_FOLLOWING_COUNT, localGlobalUserId);
	}
}
