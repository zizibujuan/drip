package com.zizibujuan.drip.server.doc.servlet;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.validator.routines.RegexValidator;
import org.eclipse.core.filesystem.EFS;
import org.eclipse.core.filesystem.IFileInfo;
import org.eclipse.core.filesystem.IFileStore;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.IPath;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.api.errors.NoHeadException;
import org.eclipse.jgit.lib.Constants;
import org.eclipse.jgit.lib.Repository;
import org.eclipse.jgit.revwalk.RevCommit;
import org.eclipse.jgit.storage.file.FileRepositoryBuilder;

import com.zizibujuan.drip.server.doc.model.CommitInfo;
import com.zizibujuan.drip.server.doc.model.LastLogInfo;
import com.zizibujuan.drip.server.doc.model.ProjectInfo;
import com.zizibujuan.drip.server.doc.service.ProjectService;
import com.zizibujuan.drip.server.model.UserInfo;
import com.zizibujuan.drip.server.service.ApplicationPropertyService;
import com.zizibujuan.drip.server.util.GitConstants;
import com.zizibujuan.drip.server.util.servlet.BaseServlet;
import com.zizibujuan.drip.server.util.servlet.RequestUtil;
import com.zizibujuan.drip.server.util.servlet.ResponseUtil;
import com.zizibujuan.drip.server.util.servlet.UserSession;

/**
 * 项目管理  TODO:名称改为 主题？
 * 
 * @author jzw
 * @since 0.0.1
 */
public class ProjectServlet extends BaseServlet {

	private static final long serialVersionUID = -2474647543970725994L;

	private ProjectService projectService;
	private ApplicationPropertyService applicationPropertyService;
	private List<String> errors;
	
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
			errors = new ArrayList<String>();
			ProjectInfo projectInfo = RequestUtil.fromJsonObject(req, ProjectInfo.class);
			// 判断项目名称是否已经被使用
			UserInfo userInfo = (UserInfo) UserSession.getUser(req);
			if(userInfo == null){
				errors.add("只有登录用户,才能创建项目");
				ResponseUtil.toJSON(req, resp, errors, HttpServletResponse.SC_UNAUTHORIZED);
				return;
			}
			if(!new RegexValidator("^[A-Za-z0-9_\\.-]+$").isValid(projectInfo.getName())){
				errors.add("项目名称只能包含英文字母,数字,-,_或.");
				ResponseUtil.toJSON(req, resp, errors, HttpServletResponse.SC_PRECONDITION_FAILED);
				return;
			}
			
			Long userId = userInfo.getId();
			if(projectService.nameIsUsed(userId, projectInfo.getName())){
				errors.add("您已有一个同名项目");
				ResponseUtil.toJSON(req, resp, errors, HttpServletResponse.SC_PRECONDITION_FAILED);
				return;
			}
			
			// 创建成功后，跳转到项目首页
			projectInfo.setCreateUserId(userId);
			projectInfo.setCreateUserName(userInfo.getLoginName());
			Long projectId = projectService.create(projectInfo);
			projectInfo.setId(projectId);
			ResponseUtil.toJSON(req, resp, projectInfo);
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
			String search = req.getParameter("search");
			if(search != null){
				if(search.equals("*")){
					search = "";
				}
				// 条件查询所有项目列表， TODO：支持分页查询
				// 根据项目名称查询
				List<ProjectInfo> projects = projectService.filterByName(search);
				// TODO: 获取项目内容的最后提交时间
				// TODO: 需不需要获取项目参与者列表呢？
				ResponseUtil.toJSON(req, resp, projects);
				return;
			}
			
			// 获取登录用户的项目列表
			UserInfo userInfo = (UserInfo) UserSession.getUser(req);
			List<ProjectInfo> myProjects = projectService.get(userInfo.getId());
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
			
			// 获取目录下的所有文件			
			URI parentLocation;
			try {
				parentLocation = new URI(rootPath + req.getPathInfo());
			} catch (URISyntaxException e) {
				handleException(resp, "路径语法错误", e);
				return;
			}
			
			String parentPath = path.removeFirstSegments(2).toString();
			
			String repoPath = path.uptoSegment(2).toString();
			IFileStore fileStore = EFS.getLocalFileSystem().getStore(parentLocation);
			IFileInfo fileInfo = fileStore.fetchInfo();
			if(fileInfo.isDirectory()){
				// 获取指定目录下的最近提交信息
				Repository repo = FileRepositoryBuilder.create(new File(rootPath + repoPath, Constants.DOT_GIT));
				repo.resolve(Constants.HEAD);
				Git git = new Git(repo);
				List<LastLogInfo> result = new ArrayList<LastLogInfo>();
				IFileInfo[] files;
				
				if(!parentPath.equals("") && !parentPath.endsWith("/")){
					parentPath += "/";
				}
				try {
					files = fileStore.childInfos(EFS.NONE, null);
					for(IFileInfo file : files){
						if(file.getName().equals(".git"))continue;
						LastLogInfo fileAndLogInfo = new LastLogInfo();
						fileAndLogInfo.setFileInfo(file);
						CommitInfo commitInfo = getLastCommitInfo(git, parentPath, file);
						fileAndLogInfo.setCommitInfo(commitInfo);
						result.add(fileAndLogInfo);
					}
				} catch (CoreException e) {
					handleException(resp, "获取目录下的文件列表失败", e);
					return;
				} catch (NoHeadException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} catch (GitAPIException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} finally{
					repo.close();
				}
				ResponseUtil.toJSON(req, resp, result);
				return;
			}
		}
		super.doGet(req, resp);
	}

	private CommitInfo getLastCommitInfo(Git git, String parentPath, IFileInfo file) throws NoHeadException, GitAPIException {
		Iterable<RevCommit> logs = git.log().addPath(parentPath + file.getName()).setMaxCount(1).call();
		Iterator<RevCommit> logIterator = logs.iterator();
		if(logIterator.hasNext()){
			RevCommit revCommit = logIterator.next();
			CommitInfo commitInfo = new CommitInfo();
			commitInfo.setSummary(revCommit.getShortMessage());
			commitInfo.setCommitTime(((long)revCommit.getCommitTime()) * 1000);
			return commitInfo;
		}
		return null;
	}
	
}
