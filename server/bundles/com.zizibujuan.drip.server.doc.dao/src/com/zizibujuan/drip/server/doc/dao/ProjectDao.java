package com.zizibujuan.drip.server.doc.dao;

import com.zizibujuan.drip.server.doc.model.ProjectInfo;

/**
 * 项目信息数据访问接口。将项目信息在数据库表中记录一份。
 * @author jzw
 * @since 0.0.1
 */
public interface ProjectDao {

	/**
	 * 在数据库中登记项目信息
	 * 
	 * @param projectInfo 项目信息
	 * @return 项目标识
	 */
	Long create(ProjectInfo projectInfo);
	
	/**
	 * 根据创建人和项目名获取项目信息。
	 * 由创建人和项目名称能够唯一标识一个项目，
	 * 即不同用户的项目名称允许同名，但是同一个用户下的项目不允许同名。
	 * 
	 * @param createUserId 项目创建者标识
	 * @param projectName 项目名称
	 * @return 项目信息，如果找不到则返回null
	 */
	ProjectInfo get(Long createUserId, String projectName);
}
