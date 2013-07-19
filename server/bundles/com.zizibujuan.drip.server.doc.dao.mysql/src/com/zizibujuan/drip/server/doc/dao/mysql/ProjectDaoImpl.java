package com.zizibujuan.drip.server.doc.dao.mysql;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import com.zizibujuan.drip.server.doc.dao.ProjectDao;
import com.zizibujuan.drip.server.doc.dao.mysql.rowMapper.ProjectInfoRowMapper;
import com.zizibujuan.drip.server.doc.model.ProjectInfo;
import com.zizibujuan.drip.server.util.dao.AbstractDao;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;
import com.zizibujuan.drip.server.util.dao.DripDateUtils;
import com.zizibujuan.drip.server.util.dao.PreparedStatementSetter;

/**
 * 项目信息数据访问实现类
 *
 * @author jzw
 * @since 0.0.1
 */
public class ProjectDaoImpl extends AbstractDao implements ProjectDao {

	private static final String SQL_INSERT_PROJECT = "INSERT INTO "
			+ "DRIP_DOC_PROJECT "
			+ "(PROJECT_NAME,"
			+ "PROJECT_LABEL,"
			+ "PROJECT_DESC,"
			+ "CRT_TM,"
			+ "CRT_USER_ID) "
			+ "VALUES "
			+ "(?,?,?,?,?)";
	@Override
	public Long create(final ProjectInfo projectInfo) {
		return DatabaseUtil.update(getDataSource(), SQL_INSERT_PROJECT, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement ps) throws SQLException {
				ps.setString(1, projectInfo.getName());
				ps.setString(2, projectInfo.getLabel());
				ps.setString(3, projectInfo.getDescription());
				ps.setTimestamp(4, DripDateUtils.now());
				ps.setLong(5, projectInfo.getCreateUserId());
			}
		});
	}
	
	private static final String SQL_GET_PROJECT_BY_USER_AND_NAME = "SELECT "
			+ "PROJECT_NAME,"
			+ "PROJECT_LABEL,"
			+ "PROJECT_DESC,"
			+ "CRT_TM,"
			+ "CRT_USER_ID "
			+ "FROM "
			+ "DRIP_DOC_PROJECT "
			+ "WHERE "
			+ "CRT_USER_ID=? AND "
			+ "PROJECT_NAME = ?";
	@Override
	public ProjectInfo get(final Long createUserId, final String projectName) {
		return DatabaseUtil.queryForObject(getDataSource(), SQL_GET_PROJECT_BY_USER_AND_NAME, 
				new ProjectInfoRowMapper(), createUserId, projectName); 
	}
	
	private static final String SQL_GET_PROJECT_BY_USER = "SELECT "
			+ "PROJECT_NAME,"
			+ "PROJECT_LABEL,"
			+ "PROJECT_DESC,"
			+ "CRT_TM,"
			+ "CRT_USER_ID "
			+ "FROM "
			+ "DRIP_DOC_PROJECT "
			+ "WHERE "
			+ "CRT_USER_ID=?";
	@Override
	public List<ProjectInfo> get(final Long createUserId) {
		return DatabaseUtil.query(getDataSource(), SQL_GET_PROJECT_BY_USER, new PreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement ps) throws SQLException {
				ps.setLong(1, createUserId);
				
			}
		},new ProjectInfoRowMapper());
	}

}
