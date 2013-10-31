package com.zizibujuan.drip.server.dao.mysql;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.List;

import com.zizibujuan.drip.server.dao.HistAnswerDao;
import com.zizibujuan.drip.server.model.Answer;
import com.zizibujuan.drip.server.model.AnswerDetail;
import com.zizibujuan.drip.server.model.HistAnswer;
import com.zizibujuan.drip.server.util.DBAction;
import com.zizibujuan.drip.server.util.dao.AbstractDao;
import com.zizibujuan.drip.server.util.dao.BatchPreparedStatementSetter;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;
import com.zizibujuan.drip.server.util.dao.PreparedStatementSetter;
import com.zizibujuan.drip.server.util.dao.RowMapper;

/**
 * 记录答案更新历史的数据访问实现类
 * 
 * @author jzw
 * @since 0.0.1
 */
public class HistAnswerDaoImpl extends AbstractDao implements HistAnswerDao {

	private static final String SQL_INSERT_HIST_ANSWER = "INSERT INTO "
			+ "DRIP_HIST_ANSWER "
			+ "(ANSWER_ID, "
			+ "HIST_EXER_ID,"
			+ "GUIDE,"
			+ "ACTION,"
			+ "UPT_TM,"
			+ "UPT_USER_ID) "
			+ "VALUES "
			+ "(?, ?, ?, ?, now(), ?)";
	private static final String SQL_INSERT_HIST_ANSWER_DETAIL = "INSERT INTO "
			+ "DRIP_HIST_ANSWER_DETAIL "
			+ "(HIST_ANSWER_ID, "
			+ "OPT_ID, "
			+ "CONTENT) "
			+ "VALUES "
			+ "(?, ?, ?)";
	@Override
	public Long insert(Connection con, final String dbAction, final Long histExerciseId, final Answer answer)
			throws SQLException {
		
		Long histAnswerId = DatabaseUtil.insert(con, SQL_INSERT_HIST_ANSWER, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement ps) throws SQLException {
				ps.setLong(1, answer.getId());
				ps.setLong(2, histExerciseId);
				ps.setString(3, answer.getGuide());
				ps.setString(4, dbAction);
				if(dbAction.equals(DBAction.CREATE)){
					ps.setLong(5, answer.getCreateUserId());
				}else{
					ps.setLong(5, answer.getLastUpdateUserId());
				}
			}
		});
		
		final Long finalHistAnswerId = histAnswerId;
		final List<AnswerDetail> details = answer.getDetail();
		if(details != null && !details.isEmpty()){
			DatabaseUtil.batchUpdate(con, SQL_INSERT_HIST_ANSWER_DETAIL, new BatchPreparedStatementSetter() {
				
				@Override
				public void setValues(PreparedStatement ps, int index) throws SQLException {
					AnswerDetail detail = details.get(index);
					ps.setLong(1, finalHistAnswerId);
					if(detail.getOptionId() == null){
						ps.setNull(2, Types.INTEGER);
					}else{
						ps.setLong(2, detail.getOptionId());
					}
					ps.setString(3, detail.getContent());
				}
				
				@Override
				public int getBatchSize() {
					return details.size();
				}
			});
		}
		
		return histAnswerId;
	}
	
	private static final String SQL_GET_HIST_ANSWER_BY_ID = "SELECT "
			+ "DBID,"
			+ "ANSWER_ID,"
			+ "HIST_EXER_ID,"
			+ "GUIDE,"
			+ "ACTION,"
			+ "UPT_TM,"
			+ "UPT_USER_ID "
			+ "FROM "
			+ "DRIP_HIST_ANSWER "
			+ "WHERE DBID=? ";
	
	private static final String SQL_LIST_HIST_ANSWER_DETAIL = "SELECT "
			+ "DBID,"
			+ "HIST_ANSWER_ID,"
			+ "OPT_ID,"
			+ "CONTENT "
			+ "FROM "
			+ "DRIP_HIST_ANSWER_DETAIL "
			+ "WHERE "
			+ "HIST_ANSWER_ID=?";

	@Override
	public HistAnswer get(final Long histAnswerId) {

		HistAnswer result = DatabaseUtil.queryForObject(getDataSource(), SQL_GET_HIST_ANSWER_BY_ID, new RowMapper<HistAnswer>() {
			@Override
			public HistAnswer mapRow(ResultSet rs, int rowNum) throws SQLException {
				HistAnswer answer = new HistAnswer();
				answer.setId(rs.getLong(1));
				answer.setOriginId(rs.getLong(2));
				answer.setHistExerciseId(rs.getLong(3));
				answer.setGuide(rs.getString(4));
				answer.setAction(rs.getString(5));
				answer.setCreateTime(rs.getTimestamp(5)); 
				answer.setCreateUserId(rs.getLong(6));
				return answer;
			}
		}, histAnswerId);
		
		List<AnswerDetail> detail = DatabaseUtil.query(getDataSource(), SQL_LIST_HIST_ANSWER_DETAIL, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement ps) throws SQLException {
				ps.setLong(1, histAnswerId);
				
			}
		}, new RowMapper<AnswerDetail>() {
			@Override
			public AnswerDetail mapRow(ResultSet rs, int rowNum) throws SQLException {
				AnswerDetail d = new AnswerDetail();
				d.setId(rs.getLong(1));
				d.setAnswerId(rs.getLong(2));
				d.setOptionId(rs.getLong(3));
				d.setContent(rs.getString(4));
				return d;
			}
		});
		System.out.println(histAnswerId);
		result.setDetail(detail);
		return result;
	
	}

}
