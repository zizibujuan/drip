package com.zizibujuan.drip.server.configurator.servlet;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.eclipse.core.runtime.IPath;

/**
 * rest api与网站资源映射器
 * 
 * @author jzw
 * @since 0.0.1
 */
public class UrlMapper {

	private static final String ROOT_WEB = "/drip";
	private static final String LIST_HTML = "/list.html";
	private static final String HTML = ".html";
	
	private static final String ACTION_NEW = "new";
	private static final String ACTION_EDIT = "edit";
	
	private Map<String, String> listUrlMap; // 跳转到查询列表页面，如果是单条记录，则跳转到视图页面
	private Map<String, String> newUrlMap; // 跳转到新建资源页面
	private Map<String, String> editUrlMap; // 跳转到编辑页面
	
	private Map<String, String> homeUrlMap; // 放置各种内容的内容首页链接，如题库首页，笔记项目首页等
	
	// 保存需要授权的页面和操作，而默认凡是new和edit操作，都需要用户登录。
	// 有两种访问页面的方式，一是直接访问html页面，另一种是通过rest url间接跳转。
	private List<String> authPageRestUrls = new ArrayList<String>();
	
	public UrlMapper(){
		listUrlMap = new HashMap<String, String>();
		listUrlMap.put("/following", "/drip/relation.html");
		listUrlMap.put("/followers", "/drip/relation.html");
		listUrlMap.put("/users", "/drip/profile.html");
		listUrlMap.put("/projects", "/doc/projects/list.html");
		listUrlMap.put("/blob", "/doc/files/blob.html");
				
		// new的一个约定，就是最后一个字母是new，TODO：此时要确保用户不会使用这个关键字
		newUrlMap = new HashMap<String, String>();
		newUrlMap.put("/files", "/doc/files/new.html");
		newUrlMap.put("/projects", "/doc/projects/new.html");
		
		
		// edit
		editUrlMap = new HashMap<String, String>();
		editUrlMap.put("/files", "/doc/files/edit.html");
		
		homeUrlMap = new HashMap<String, String>();
		// 所有项目页面,项目首页， key为path segment
		homeUrlMap.put("explore_projects", "/doc/projects.html");
		// 所有习题页面，可进一步在这个页面中分门别类
		homeUrlMap.put("explore_exercises", "/drip/exercises.html");
		
		
		authPageRestUrls.add("/drip/dashboard.html");
	}
	
	/**
	 * 根据restful url获取实际资源的路径。
	 * 先从配置信息中查找，如果查找不到，则按照默认的逻辑生成一个资源名，
	 * 然后尝试获取这个资源。
	 * 注意，如果捕获到js,html,和css等静态文件，要返回null，因为这些文件不需要跳转。
	 * 
	 * @param servletPath 注册的servlet别名
	 * @param path 封装pathInfo信息
	 * @return 物理资源的路径,如果没有找到则返回null
	 */
	public String getResourcePath(String servletPath, IPath path){
		if(servletPath.isEmpty() && path.segmentCount() == 0){
			return null;
		}
		
		if(servletPath.isEmpty()){
			if(path.segmentCount() == 1){
				String firstSegment = path.segment(0);
				if(homeUrlMap.containsKey(firstSegment)){
					return homeUrlMap.get(firstSegment);
				}
			}
			if(path.getFileExtension() == null){
				return path.toString() + HTML;
			}
			return null;
		}
		
		int segmentCount = path.segmentCount();
		if(segmentCount == 0){
			// 默认寻找list.html文件
			return ROOT_WEB + servletPath + LIST_HTML;
		}
		
		String firstSegment = path.segment(0);
		if(firstSegment.equals(ACTION_NEW)){
			// TODO：需要授权
			if(newUrlMap.containsKey(servletPath)){
				return newUrlMap.get(servletPath);
			}
		}
		
		if(firstSegment.equals(ACTION_EDIT)){
			// TODO：需要授权
			if(editUrlMap.containsKey(servletPath)){
				return editUrlMap.get(servletPath);
			}
		}
		
		if(listUrlMap.containsKey(servletPath)){
			return listUrlMap.get(servletPath);
		}
		
		return null;
	}
	
	/**
	 * 判断要访问的页面是否需要授权。约定在servletPath后面直接放操作名。
	 * 注意，所有servlet后面带action名称的都是要跳转到html页面，并不是ajax操作。
	 * ajax操作，并不包含action，而是直接通过http method进行区分。
	 * 
	 * @param requestPath 完整的访问路径
	 * @return 如果需要授权则返回<code>true</code>；否则返回<code>false</code>
	 */
	public boolean isAuthPage(String servletPath, IPath path){
		String requestPath = servletPath + path.makeUNC(false).toString();
		if(authPageRestUrls.contains(requestPath)){
			return true;
		}
		
		if(path.segmentCount() == 0){
			return false;
		}
		
		String firstSegment = path.segment(0);
		if(firstSegment.equals(ACTION_NEW)){
			return newUrlMap.containsKey(servletPath);
		}
		
		if(firstSegment.equals(ACTION_EDIT)){
			return editUrlMap.containsKey(servletPath);
		}
		// 即使第一个segment是以new或edit开头，但是如果没有在map中配置，依然看作是不需要授权的操作。
		return false;
	}
	
	/**
	 *  
	 *  判断ajax操作是否需要授权，主要是针对已配置的新增和更新操作
	 *  TODO：添加删除操作。
	 *  
	 * @param servletPath
	 * @param path
	 * @return 如果是需要授权的操作，则返回<code>true</code>；否则返回<code>false</code>
	 */
	public boolean isAuthAction(String servletPath, String httpMethod){
		if(httpMethod.equals("POST")){
			return newUrlMap.containsKey(servletPath);
		}
		if(httpMethod.equals("PUT")){
			return editUrlMap.containsKey(servletPath);
		}
		
		return false;
	}
}
