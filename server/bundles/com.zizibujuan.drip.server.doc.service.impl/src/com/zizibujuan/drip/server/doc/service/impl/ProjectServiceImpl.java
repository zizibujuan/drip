package com.zizibujuan.drip.server.doc.service.impl;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.InitCommand;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.lib.ConfigConstants;
import org.eclipse.jgit.lib.Repository;
import org.eclipse.jgit.lib.StoredConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.zizibujuan.drip.server.dao.ApplicationPropertyDao;
import com.zizibujuan.drip.server.dao.UserDao;
import com.zizibujuan.drip.server.doc.dao.ProjectDao;
import com.zizibujuan.drip.server.doc.model.ProjectInfo;
import com.zizibujuan.drip.server.doc.service.ProjectService;
import com.zizibujuan.drip.server.model.UserInfo;
import com.zizibujuan.drip.server.util.Environment;
import com.zizibujuan.drip.server.util.GitConstants;

/**
 * 项目维护服务实现类
 * 
 * @author jzw
 * @since 0.0.1
 */
public class ProjectServiceImpl implements ProjectService {
	private Logger logger = LoggerFactory.getLogger(ProjectServiceImpl.class);
	
	private static final String DEFAULT_FILE_NAME = "README";

	private UserDao userDao;
	private ApplicationPropertyDao applicationPropertyDao;
	private ProjectDao projectDao;
	
	/**
	 * 获取存放所有仓库的根目录（在系统参数中配置，该版本使用cm服务）,
	 * 然后在根目录下的某个用户下创建一个项目仓库，并自动在这个仓库中创建一个readme文件，
	 * 然后导出这个仓库
	 */
	@Override
	public Long create(ProjectInfo projectInfo) {
		// 在后台为项目生成一个标识，标识名称不可变，作为仓库的名称，这样虽然没有生成一个数字做仓库名称灵活，但是迁移起来比较方便。
		// 将仓库放在以用户名作为名称的目录下，所以前提是要确定一个稳定的昵称，如果发生了变化，就要整个彻底改变.
		// 路径: 用户名/仓库名 或 仓库名，然后在数据库上将用户名和仓库名关联起来，这样更灵活。这样当有将仓库转移给别人时，操作起来更方便。
		
		// TODO: 抽象用户接口
		UserInfo userInfo = userDao.getByLoginName(projectInfo.getCreateUserName());
		// 首先确定放git仓库的根目录。
		String root = applicationPropertyDao.getForString(GitConstants.KEY_GIT_ROOT);
		InitCommand command = new InitCommand();
		// 还是使用项目名称作为仓库的名称，并将仓库放在登录名（固定不变）下面
		File directory = new File(root + userInfo.getLoginName() + "/" + projectInfo.getName()); 
		command.setDirectory(directory);
		Repository repository;
		try {
			repository = command.call().getRepository();
			Git git = new Git(repository);
			
			//先创建一个仓库，给仓库配置用户名和邮箱信息
			configGit(userInfo, git);
			//新建一个README.md文件
			File file = new File(directory, DEFAULT_FILE_NAME);
			file.createNewFile();
			FileWriter fw = new FileWriter(file);
			IOUtils.write(projectInfo.getName() + Environment.newLine() + StringUtils.repeat('=', 10),fw);
			fw.close();
			//初始化commit
			git.add().addFilepattern(".").call();
			git.commit().setMessage("初始化提交").call();
			
			// 需要一张表存储用户创建的项目列表，注意如果创建仓库失败，则不往project数据库中插入数据
			// 获取直接通过目录结构获取,当前是将元数据存到数据库中，然后根据数据库中的信息判断。
			return projectDao.create(projectInfo);
		} catch (GitAPIException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return null;
	}
	
	@Override
	public boolean nameIsUsed(Long localUserId, String projectName) {
		ProjectInfo projectInfo = projectDao.get(localUserId, projectName);
		return projectInfo == null ? false : true;
	}
	
	@Override
	public List<ProjectInfo> get(Long userId) {
		return projectDao.get(userId);
	}

	private void configGit(UserInfo userInfo, Git git) throws IOException {
		StoredConfig config = git.getRepository().getConfig();
		String gitUserName = userInfo.getLoginName();
		String gitUserEmail = userInfo.getEmail();
		if (gitUserName != null){
			config.setString(ConfigConstants.CONFIG_USER_SECTION, null, ConfigConstants.CONFIG_KEY_NAME, gitUserName);
		}
		if (gitUserEmail != null){
			config.setString(ConfigConstants.CONFIG_USER_SECTION, null, ConfigConstants.CONFIG_KEY_EMAIL, gitUserEmail);
		}
		config.setBoolean(ConfigConstants.CONFIG_CORE_SECTION, null, ConfigConstants.CONFIG_KEY_FILEMODE, false);
		config.save();
	}
	

	@Override
	public List<ProjectInfo> filterByName(String projectNamePreifx) {
		return projectDao.filterByName(projectNamePreifx);
	}
	
	public void setUserDao(UserDao userDao) {
		logger.info("注入userDao");
		this.userDao = userDao;
	}

	public void unsetUserDao(UserDao userDao) {
		if (this.userDao == userDao) {
			logger.info("注销userDao");
			this.userDao = null;
		}
	}
	
	public void setApplicationPropertyDao(ApplicationPropertyDao applicationPropertyDao) {
		logger.info("注入applicationPropertyDao");
		this.applicationPropertyDao = applicationPropertyDao;
	}

	public void unsetApplicationPropertyDao(ApplicationPropertyDao applicationPropertyDao) {
		if (this.applicationPropertyDao == applicationPropertyDao) {
			logger.info("注销applicationPropertyDao");
			this.applicationPropertyDao = null;
		}
	}
	
	public void setProjectDao(ProjectDao projectDao) {
		logger.info("注入projectDao");
		this.projectDao = projectDao;
	}

	public void unsetProjectDao(ProjectDao projectDao) {
		if (this.projectDao == projectDao) {
			logger.info("注销projectDao");
			this.projectDao = null;
		}
	}

}
