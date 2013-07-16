package com.zizibujuan.drip.server.doc.servlet;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.zizibujuan.drip.server.doc.service.ProjectService;


/**
 * 放置servlet层需要的所有service实例
 * @author jzw
 * @since 0.0.1
 */
public class ServiceHolder {
	
	private static final Logger logger = LoggerFactory.getLogger(ServiceHolder.class);

	private static ServiceHolder singleton;

	public static ServiceHolder getDefault() {
		return singleton;
	}

	public void activate() {
		singleton = this;
	}

	public void deactivate() {
		singleton = null;
	}
	
	private ProjectService projectService;

	public void setProjectService(ProjectService projectService) {
		logger.info("注入projectService");
		this.projectService = projectService;
	}

	public void unsetProjectService(ProjectService projectService) {
		logger.info("注销projectService");
		if (this.projectService == projectService) {
			this.projectService = null;
		}
	}

	public ProjectService getProjectService() {
		return this.projectService;
	}
}
