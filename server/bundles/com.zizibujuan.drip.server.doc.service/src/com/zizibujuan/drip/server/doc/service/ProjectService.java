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
	 * @param localUserId 为在本网站注册的用户，或者为第三方网站用户生成的本网站用户标识
	 * @param projectInfo 项目信息
	 * @return 新项目的标识
	 */
	Long create(Long localUserId, ProjectInfo projectInfo);
}
