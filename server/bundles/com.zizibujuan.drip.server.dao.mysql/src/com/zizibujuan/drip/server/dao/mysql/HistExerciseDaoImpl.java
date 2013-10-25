package com.zizibujuan.drip.server.dao.mysql;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import com.zizibujuan.drip.server.dao.HistExerciseDao;
import com.zizibujuan.drip.server.model.Exercise;
import com.zizibujuan.drip.server.model.ExerciseOption;
import com.zizibujuan.drip.server.util.DBAction;
import com.zizibujuan.drip.server.util.dao.BatchPreparedStatementSetter;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;
import com.zizibujuan.drip.server.util.dao.PreparedStatementSetter;

/**
 * 记录更新习题的历史的数据访问实现类
 * 
 * @author jzw
 * @since 0.0.1
 */
public class HistExerciseDaoImpl implements HistExerciseDao {

	private static final String SQL_INSERT_HIST_EXERCISE = "INSERT INTO "
			+ "DRIP_HIST_EXERCISE "
			+ "(EXER_ID,"
			+ "CONTENT,"
			+ "EXER_TYPE,"
			+ "EXER_CATEGORY,"
			+ "ACTION,"
			+ "UPT_TM,"
			+ "UPT_USER_ID) "
			+ "VALUES "
			+ "(?, ?, ?, ?, ?, now(), ?)";
	private static final String SQL_INSERT_HIST_EXER_OPTION = "INSERT INTO "
			+ "DRIP_HIST_EXER_OPTION "
			+ "(HIST_EXER_ID,"
			+ "CONTENT,"
			+ "OPT_SEQ) "
			+ "VALUES "
			+ "(?, ?, ?)";
	@Override
	public Long insert(Connection con, final String dbAction, final Exercise exercise) throws SQLException {
		Long histExerId = DatabaseUtil.insert(con, SQL_INSERT_HIST_EXERCISE, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement ps) throws SQLException {
				ps.setLong(1, exercise.getId());
				ps.setString(2, exercise.getContent());
				ps.setString(3, exercise.getExerciseType());
				ps.setString(4, exercise.getCourse());
				ps.setString(5, dbAction);
				if(dbAction.equals(DBAction.CREATE)){
					ps.setLong(6, exercise.getCreateUserId());
				}else{
					// 删除操作完成后，把操作人记录在更新用户里
					ps.setLong(6, exercise.getLastUpdateUserId());
				}
			}
		});
		
		final Long finalHistExerId = histExerId;
		final List<ExerciseOption> options = exercise.getOptions();
		if(options != null && !options.isEmpty()){
			DatabaseUtil.batchUpdate(con, SQL_INSERT_HIST_EXER_OPTION, new BatchPreparedStatementSetter() {
				
				@Override
				public void setValues(PreparedStatement ps, int index) throws SQLException {
					ExerciseOption opt = options.get(index);
					ps.setLong(1, finalHistExerId);
					ps.setString(2, opt.getContent());
					ps.setInt(3, index + 1);
				}
				
				@Override
				public int getBatchSize() {
					return options.size();
				}
			});
		}
		
		return histExerId;
	}

}
