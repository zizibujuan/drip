package com.zizibujuan.drip.server.doc.servlet;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.eclipse.core.filesystem.EFS;
import org.eclipse.core.filesystem.IFileInfo;
import org.eclipse.core.filesystem.IFileStore;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.IPath;

import com.zizibujuan.drip.server.doc.model.ProjectInfo;
import com.zizibujuan.drip.server.doc.service.ProjectService;
import com.zizibujuan.drip.server.service.ApplicationPropertyService;
import com.zizibujuan.drip.server.util.GitConstants;
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
	private ApplicationPropertyService applicationPropertyService;
	
	public ProjectServlet(){
		projectService = ServiceHolder.getDefault().getProjectService();
		applicationPropertyService = ServiceHolder.getDefault().getApplicationPropertyService();
	}
	
	/**
	 * 新建项目,并存放在git仓库中
	 */
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		traceRequest(req);
		IPath path = getPath(req);
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
		IPath path = getPath(req); 
		if(path.segmentCount() == 0){
			Long localUserId = UserSession.getLocalUserId(req);
			List<ProjectInfo> myProjects = projectService.get(localUserId);
			ResponseUtil.toJSON(req, resp, myProjects);
			return;
		}else if(path.segmentCount() >= 2){
			// 父目录
			// 根据登录用户与项目名获取
			// projects/userName/projectName/directory/file/...
			String rootPath = applicationPropertyService.getForString(GitConstants.KEY_GIT_ROOT);
			if(rootPath.endsWith("/")){
				rootPath = rootPath.substring(0, rootPath.length()-1);
			}
			URI parentLocation;
			try {
				parentLocation = new URI(rootPath + req.getPathInfo());
			} catch (URISyntaxException e) {
				handleException(resp, "路径语法错误", e);
				return;
			}
			
			IFileStore fileStore = EFS.getLocalFileSystem().getStore(parentLocation);
			IFileInfo fileInfo = fileStore.fetchInfo();
			if(fileInfo.isDirectory()){
				IFileInfo[] files;
				try {
					files = fileStore.childInfos(EFS.NONE, null);
				} catch (CoreException e) {
					handleException(resp, "获取目录下的文件列表失败", e);
					return;
				}
				ResponseUtil.toJSON(req, resp, files);
			}else{
				try {
					IOUtils.copy(fileStore.openInputStream(EFS.NONE, null), resp.getOutputStream());
				} catch (CoreException e) {
					handleException(resp, "获取文件内容失败", e);
					return;
				}
			}
			return;
		}
		super.doGet(req, resp);
	}

	
}
