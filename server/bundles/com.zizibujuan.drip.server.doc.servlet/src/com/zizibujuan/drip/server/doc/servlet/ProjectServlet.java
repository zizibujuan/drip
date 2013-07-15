package com.zizibujuan.drip.server.doc.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.core.runtime.IPath;
import org.eclipse.core.runtime.Path;

import com.zizibujuan.drip.server.doc.model.ProjectInfo;
import com.zizibujuan.drip.server.doc.service.ProjectService;
import com.zizibujuan.drip.server.util.servlet.BaseServlet;
import com.zizibujuan.drip.server.util.servlet.RequestUtil;
import com.zizibujuan.drip.server.util.servlet.ResponseUtil;
import com.zizibujuan.drip.server.util.servlet.UserSession;

/**
 * 项目管理
 * @author jzw
 *
 */
public class ProjectServlet extends BaseServlet {

	private static final long serialVersionUID = -2474647543970725994L;

	private ProjectService projectService;
	public ProjectServlet(){
		projectService = ServiceHolder.getDefault().getProjectServicee();
	}
	
	/**
	 * 新建项目,并存放在git仓库中
	 */
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		traceRequest(req);
		String pathInfo = req.getPathInfo();
		IPath path = (pathInfo == null ? Path.ROOT : new Path(pathInfo));
		if(path.segmentCount() == 0){
			ProjectInfo projectInfo = RequestUtil.fromJsonObject(req, ProjectInfo.class);
			Long localUserId = UserSession.getLocalUserId(req);
			Long projectId = projectService.create(localUserId, projectInfo);
			ResponseUtil.toHTML(req, resp, projectId.toString());
			return;
		}
		super.doPost(req, resp);
	}

	
}