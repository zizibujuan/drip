package com.zizibujuan.drip.server.doc.service;

import java.util.List;

import com.zizibujuan.drip.server.doc.model.ProjectInfo;

/**
 * 项目维护服务接口
 * @author jzw
 * @since 0.0.1
 */
public interface ProjectService {

	/**
	 * 新建一个新的项目
	 * 
	 * @param localUserId 本网站用户标识，这里不管是用哪个网站的用户登录的，都使用关联的本网站用户信息。
	 * 			这样就可以保证所有的项目都放在一个用户目录下面。
	 * @param projectInfo 项目信息
	 * @return 新项目的标识
	 */
	Long create(Long localUserId, ProjectInfo projectInfo);

	/**
	 * 判断某用户是否已经使用了指定的项目名称。一个用户不能创建两个名称相同的项目。
	 * 
	 * @param localUserId 用户标识
	 * @param projectName 项目名称
	 * @return 如果已经使用则返回<code>true</code>；否则返回<code>false</code>
	 */
	boolean nameIsUsed(Long localUserId, String projectName);

	/**
	 * 获取指定用户发起的项目列表
	 * 
	 * @param localUserId 本地用户标识
	 * @return 项目列表，如果没有则返回空的list
	 */
	List<ProjectInfo> get(Long localUserId);
	
}
