package com.zizibujuan.drip.server.doc.service.impl;

import com.zizibujuan.drip.server.doc.model.ProjectInfo;
import com.zizibujuan.drip.server.doc.service.ProjectService;

/**
 * 项目维护服务实现类
 * @author jzw
 * @since 0.0.1
 */
public class ProjectServiceImpl implements ProjectService {

	/**
	 * 获取存放所有仓库的根目录（在系统参数中配置，该版本使用cm服务）,
	 * 然后在根目录下的某个用户下创建一个项目仓库，并自动在这个仓库中创建一个readme文件，
	 * 然后导出这个仓库
	 */
	@Override
	public Long create(ProjectInfo projectInfo) {
		// TODO Auto-generated method stub
		return null;
	}

}
