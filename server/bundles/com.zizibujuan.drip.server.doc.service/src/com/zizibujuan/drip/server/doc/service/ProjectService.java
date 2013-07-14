package com.zizibujuan.drip.server.doc.service;

import com.zizibujuan.drip.server.doc.model.ProjectInfo;

/**
 * 项目维护服务接口
 * @author jzw
 * @since 0.0.1
 */
public interface ProjectService {

	/**
	 * 新建一个新的项目
	 * @param projectInfo 项目信息
	 * @return 新项目的标识
	 */
	Long create(ProjectInfo projectInfo);
}
