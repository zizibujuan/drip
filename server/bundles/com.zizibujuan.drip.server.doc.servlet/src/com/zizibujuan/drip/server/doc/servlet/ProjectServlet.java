package com.zizibujuan.drip.server.doc.servlet;

import java.io.IOException;
import java.util.List;

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
		projectService = ServiceHolder.getDefault().getProjectService();
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
			// 判断项目名称是否已经被使用
			Long localUserId = UserSession.getLocalUserId(req);
			if(projectService.nameIsUsed(localUserId, projectInfo.getName())){
				// TODO:统一返回json对象
				// 前置条件校验失败
				ResponseUtil.toHTML(req, resp, "", HttpServletResponse.SC_PRECONDITION_FAILED);
				return;
			}
			
			Long projectId = projectService.create(localUserId, projectInfo);
			ResponseUtil.toHTML(req, resp, projectId.toString());
			return;
		}
		super.doPost(req, resp);
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		traceRequest(req);
		String pathInfo = req.getPathInfo();
		IPath path = (pathInfo == null ? Path.ROOT : new Path(pathInfo));
		if(path.segmentCount() == 0){
			Long localUserId = UserSession.getLocalUserId(req);
			List<ProjectInfo> myProjects = projectService.get(localUserId);
			ResponseUtil.toJSON(req, resp, myProjects);
			return;
		}else if(path.segmentCount() == 2){
			Long userId = Long.valueOf(path.segment(0));
			String projectName = path.segment(1);
			// 获取项目根目录下的内容
//			IFileStore rootStore = EFS.getLocalFileSystem().getStore(location);
//			try {
//				rootStore.mkdir(EFS.NONE, null);
//				rootStoreURI = rootStore.toURI();
//			} catch (CoreException e) {
//				throw new RuntimeException("Instance location is read only: " + rootStore, e); //$NON-NLS-1$
//			}
			
			
			return;
		}else if(path.segmentCount() > 2){
			// 获取项目某个文件夹下的内容
			return;
		}
		super.doGet(req, resp);
	}

	
}
