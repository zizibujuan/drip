package com.zizibujuan.drip.server.dao.mysql;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import com.zizibujuan.drip.server.dao.HistExerciseDao;
import com.zizibujuan.drip.server.model.Exercise;
import com.zizibujuan.drip.server.model.ExerciseOption;
import com.zizibujuan.drip.server.model.HistExercise;
import com.zizibujuan.drip.server.util.DBAction;
import com.zizibujuan.drip.server.util.ExerciseType;
import com.zizibujuan.drip.server.util.dao.AbstractDao;
import com.zizibujuan.drip.server.util.dao.BatchPreparedStatementSetter;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;
import com.zizibujuan.drip.server.util.dao.PreparedStatementSetter;
import com.zizibujuan.drip.server.util.dao.RowMapper;

/**
 * 记录更新习题的历史的数据访问实现类
 * 
 * @author jzw
 * @since 0.0.1
 */
public class HistExerciseDaoImpl extends AbstractDao implements HistExerciseDao {

	private static final String SQL_INSERT_HIST_EXERCISE = "INSERT INTO "
			+ "DRIP_HIST_EXERCISE "
			+ "(EXER_ID,"
			+ "VERSION,"
			+ "CONTENT,"
			+ "EXER_TYPE,"
			+ "EXER_COURSE,"
			+ "ACTION,"
			+ "UPT_TM,"
			+ "UPT_USER_ID) "
			+ "VALUES "
			+ "(?, ?, ?, ?, ?, ?, now(), ?)";
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
				ps.setInt(2, exercise.getVersion());
				ps.setString(3, exercise.getContent());
				ps.setString(4, exercise.getExerciseType());
				ps.setString(5, exercise.getCourse());
				ps.setString(6, dbAction);
				if(dbAction.equals(DBAction.CREATE)){
					ps.setLong(7, exercise.getCreateUserId());
				}else{
					// 删除操作完成后，把操作人记录在更新用户里
					ps.setLong(7, exercise.getLastUpdateUserId());
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
	
	private static final String SQL_GET_HIST_EXERCISE = "SELECT "
			+ "DBID,"
			+ "EXER_ID, "
			+ "VERSION,"
			+ "CONTENT,"
			+ "EXER_TYPE,"
			+ "EXER_COURSE,"
			+ "ACTION,"
			+ "UPT_TM,"
			+ "UPT_USER_ID "
			+ "FROM "
			+ "DRIP_HIST_EXERCISE "
			+ "WHERE "
			+ "DBID=?";
	@Override
	public HistExercise get(Long histExerciseId) {

		HistExercise result = DatabaseUtil.queryForObject(getDataSource(), SQL_GET_HIST_EXERCISE, new RowMapper<HistExercise>() {
			@Override
			public HistExercise mapRow(ResultSet rs, int rowNum)
					throws SQLException {
				HistExercise exercise = new HistExercise();
				exercise.setHistId(rs.getLong(1));
				exercise.setId(rs.getLong(2));
				exercise.setVersion(rs.getInt(3));
				exercise.setContent(rs.getString(4));
				exercise.setExerciseType(rs.getString(5));
				exercise.setCourse(rs.getString(6));
				exercise.setAction(rs.getString(7));
				exercise.setCreateTime(rs.getTimestamp(8));
				exercise.setCreateUserId(rs.getLong(9));
				return exercise;
			}
		}, histExerciseId);
				
		if(result == null){
			return result;
		}
		
		String exerType = result.getExerciseType();
		if (ExerciseType.SINGLE_OPTION.equals(exerType)
				|| ExerciseType.MULTI_OPTION.equals(exerType)
				|| ExerciseType.FILL.equals(exerType)) {
			List<ExerciseOption> options = this.getHistExerciseOptions(histExerciseId);
			result.setOptions(options);
		}
		
		return result;
	}
	
	private final static String SQL_LIST_HIST_EXERCISE_OPTION = "SELECT "
			+ "DBID,"
			+ "HIST_EXER_ID,"
			+ "CONTENT,"
			+ "OPT_SEQ "
			+ "FROM "
			+ "DRIP_HIST_EXER_OPTION "
			+ "WHERE "
			+ "HIST_EXER_ID=? "
			+ "ORDER BY OPT_SEQ";
	private List<ExerciseOption> getHistExerciseOptions(final Long histExerciseId) {
		return DatabaseUtil.query(getDataSource(), SQL_LIST_HIST_EXERCISE_OPTION, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement ps) throws SQLException {
				ps.setLong(1, histExerciseId);
			}
		}, new RowMapper<ExerciseOption>() {
			@Override
			public ExerciseOption mapRow(ResultSet rs, int rowNum) throws SQLException {
				ExerciseOption option = new ExerciseOption();
				option.setId(rs.getLong(1));
				option.setContent(rs.getString(3));
				// seq与list中元素的顺序相同
				return option;
			}
		});
	}

}
