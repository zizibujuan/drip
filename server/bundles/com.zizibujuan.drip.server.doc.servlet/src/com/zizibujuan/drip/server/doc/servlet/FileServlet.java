package com.zizibujuan.drip.server.doc.servlet;

import java.io.File;
import java.io.IOException;
import java.io.StringReader;
import java.net.URI;
import java.net.URISyntaxException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.eclipse.core.filesystem.EFS;
import org.eclipse.core.filesystem.IFileStore;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.IPath;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.ConcurrentRefUpdateException;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.api.errors.NoFilepatternException;
import org.eclipse.jgit.api.errors.NoHeadException;
import org.eclipse.jgit.api.errors.NoMessageException;
import org.eclipse.jgit.api.errors.UnmergedPathsException;
import org.eclipse.jgit.api.errors.WrongRepositoryStateException;
import org.eclipse.jgit.errors.RevisionSyntaxException;
import org.eclipse.jgit.lib.Constants;
import org.eclipse.jgit.lib.Repository;
import org.eclipse.jgit.storage.file.FileRepositoryBuilder;

import com.zizibujuan.drip.server.doc.model.NewFileForm;
import com.zizibujuan.drip.server.model.UserInfo;
import com.zizibujuan.drip.server.service.ApplicationPropertyService;
import com.zizibujuan.drip.server.util.GitConstants;
import com.zizibujuan.drip.server.util.servlet.BaseServlet;
import com.zizibujuan.drip.server.util.servlet.RequestUtil;
import com.zizibujuan.drip.server.util.servlet.ResponseUtil;
import com.zizibujuan.drip.server.util.servlet.UserSession;

/**
 * 文件管理
 * 
 * @author jzw
 * @since 0.0.1
 */
public class FileServlet extends BaseServlet {

	private static final long serialVersionUID = 3134000969079271759L;
	
	private ApplicationPropertyService applicationPropertyService;
	
	public FileServlet(){
		applicationPropertyService = ServiceHolder.getDefault().getApplicationPropertyService();
	}

	/**
	 * 新建文件
	 */
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		traceRequest(req);
		
		IPath path = getPath(req); // files/userName/projectName/[filePath]
		if(path.segmentCount() >= 2){
			// 获取仓库名称
			String repoPath = path.uptoSegment(2).toString();
			// 获取相对仓库根目录的目录路径
			String relativePath = path.removeFirstSegments(2).toString();
			// 获取提交的form内容
			NewFileForm newFileForm = RequestUtil.fromJsonObject(req, NewFileForm.class);
			// 判断文件名称有没有被使用
			String rootPath = applicationPropertyService.getForString(GitConstants.KEY_GIT_ROOT);
			if(rootPath.endsWith("/")){
				rootPath = rootPath.substring(0, rootPath.length()-1);
			}
			
			URI parentLocation;
			try {
				parentLocation = new URI(rootPath + path.toString());
			} catch (URISyntaxException e) {
				handleException(resp, "路径语法错误", e);
				return;
			}
			IFileStore dirStore = EFS.getLocalFileSystem().getStore(parentLocation);
			IFileStore fileStore = dirStore.getChild(newFileForm.getFileInfo().getName());
			if(fileStore.fetchInfo().exists()){
				handleException(resp, "文件名已被使用，请重新取一个文件名。", null);
				return;
			}
			
			try {
				// 创建文件
				IOUtils.write(newFileForm.getFileInfo().getContent(), fileStore.openOutputStream(EFS.NONE, null));
				UserInfo currentUser = (UserInfo) UserSession.getUser(req);
				// 获取git仓库
				Repository repo = FileRepositoryBuilder.create(new File(rootPath + repoPath, Constants.DOT_GIT));
				repo.resolve(Constants.HEAD);
				Git git = new Git(repo);
				// 往git仓库中提交新建的文件
				git.add().addFilepattern(relativePath + fileStore.fetchInfo().getName()).call();
				// loginName和email在这里是必须要输入的
				git.commit().setAuthor(currentUser.getLoginName(), currentUser.getEmail())
					.setMessage(newFileForm.getCommitInfo().getSummary())// 加一个空行，追加详细信息？ 暂时不支持录入扩展的提交信息
					.call();
				ResponseUtil.toJSON(req, resp);
			} catch (RevisionSyntaxException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (NoFilepatternException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (NoHeadException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (NoMessageException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (UnmergedPathsException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (ConcurrentRefUpdateException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (WrongRepositoryStateException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (CoreException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (GitAPIException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
			
			return;
		}
		super.doPost(req, resp);
	}

	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		traceRequest(req);
		IPath path = getPath(req);
		if(path.segmentCount() > 2){
			NewFileForm fileForm = RequestUtil.fromJsonObject(req, NewFileForm.class);
			// files/userName/projectName/[filePath]
			String rootPath = applicationPropertyService.getForString(GitConstants.KEY_GIT_ROOT);
			// 文件信息
			URI fileLocation;
			try {
				fileLocation = new URI(rootPath + path.toString());
			} catch (URISyntaxException e) {
				handleException(resp, "路径语法错误", e);
				return;
			}
			IFileStore fileStore = EFS.getLocalFileSystem().getStore(fileLocation);
			StringReader reader = new StringReader(fileForm.getFileInfo().getContent());
			
			
			try {
				IOUtils.copy(reader, fileStore.openOutputStream(EFS.NONE, null));
				
				// 获取仓库名称
				String repoPath = path.uptoSegment(2).toString();
				// 获取相对仓库根目录的目录路径
				String relativePath = path.removeFirstSegments(2).toString();
				UserInfo currentUser = (UserInfo) UserSession.getUser(req);
				// 获取git仓库
				Repository repo = FileRepositoryBuilder.create(new File(rootPath + repoPath, Constants.DOT_GIT));
				repo.resolve(Constants.HEAD);
				Git git = new Git(repo);
				// 往git仓库中提交新建的文件
				git.add().addFilepattern(relativePath + fileStore.fetchInfo().getName()).call();
				// loginName和email在这里是必须要输入的
				git.commit().setAuthor(currentUser.getLoginName(), currentUser.getEmail())
					.setMessage(fileForm.getCommitInfo().getSummary())// 加一个空行，追加详细信息？ 暂时不支持录入扩展的提交信息
					.call();
				
				// 保存成功之后跳转到项目首页
				ResponseUtil.toJSON(req, resp);
			} catch (CoreException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			} catch (NoHeadException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (NoMessageException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (UnmergedPathsException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (ConcurrentRefUpdateException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (WrongRepositoryStateException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (GitAPIException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return;
		}
		super.doPut(req, resp);
	}


}
