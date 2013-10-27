package com.zizibujuan.drip.server.dao.mysql;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Types;
import java.util.List;

import com.zizibujuan.drip.server.dao.HistAnswerDao;
import com.zizibujuan.drip.server.model.Answer;
import com.zizibujuan.drip.server.model.AnswerDetail;
import com.zizibujuan.drip.server.util.DBAction;
import com.zizibujuan.drip.server.util.dao.BatchPreparedStatementSetter;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;
import com.zizibujuan.drip.server.util.dao.PreparedStatementSetter;

/**
 * 记录答案更新历史的数据访问实现类
 * 
 * @author jzw
 * @since 0.0.1
 */
public class HistAnswerDaoImpl implements HistAnswerDao {

	private static final String SQL_INSERT_HIST_ANSWER = "INSERT INTO "
			+ "DRIP_HIST_ANSWER "
			+ "(ANSWER_ID,"
			+ "GUIDE,"
			+ "ACTION,"
			+ "UPT_TM,"
			+ "UPT_USER_ID) "
			+ "VALUES "
			+ "(?, ?, ?, now(), ?)";
	private static final String SQL_INSERT_HIST_ANSWER_DETAIL = "INSERT INTO "
			+ "DRIP_HIST_ANSWER_DETAIL "
			+ "(HIST_ANSWER_ID, "
			+ "OPT_ID, "
			+ "CONTENT) "
			+ "VALUES "
			+ "(?, ?, ?)";
	@Override
	public Long insert(Connection con, final String dbAction, final Answer answer)
			throws SQLException {
		Long histAnswerId = DatabaseUtil.insert(con, SQL_INSERT_HIST_ANSWER, new PreparedStatementSetter() {
			
			@Override
			public void setValues(PreparedStatement ps) throws SQLException {
				ps.setLong(1, answer.getId());
				ps.setString(2, answer.getGuide());
				ps.setString(3, dbAction);
				if(dbAction.equals(DBAction.CREATE)){
					ps.setLong(4, answer.getCreateUserId());
				}else{
					ps.setLong(4, answer.getLastUpdateUserId());
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

}
