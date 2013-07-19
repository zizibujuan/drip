package com.zizibujuan.drip.server.doc.dao.mysql.rowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import com.zizibujuan.drip.server.doc.model.ProjectInfo;
import com.zizibujuan.drip.server.util.dao.RowMapper;

/**
 * 
 * @author jzw
 *
 */
public class ProjectInfoRowMapper implements RowMapper<ProjectInfo> {

	@Override
	public ProjectInfo mapRow(ResultSet rs, int rowNum) throws SQLException {
		ProjectInfo projectInfo = new ProjectInfo();
		projectInfo.setName(rs.getString(1));
		projectInfo.setLabel(rs.getString(2));
		projectInfo.setDescription(rs.getString(3));
		projectInfo.setCreateTime(rs.getTimestamp(4));
		projectInfo.setCreateUserId(rs.getLong(5));
		return projectInfo;
	}

}
