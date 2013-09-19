package com.zizibujuan.drip.server.configurator.servlet;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.core.runtime.IPath;
import org.eclipse.core.runtime.Path;

import com.zizibujuan.drip.server.util.servlet.RequestUtil;

/**
 * 为了使用rest风格的资源连接，所有请求html页面，都不使用html后缀，而是后台自动解析。 只要请求非ajax请求，没有后缀的就加上html。
 * 暂时搁置，因为这种解决方案无法满足有子资源的情况，即显示一个访问某班某个学生的详情页面时，没有办法定位。
 * 
 * @author jinzw
 * @since 0.0.1
 */
// TODO：添加测试用例。
public class RestHtmlFilter implements Filter {

	private static final String ROOT_WEB = "/drip";
	private static final String LIST_HTML = "/list.html";
	private static final String HTML = ".html";
	
	private static final String ACTION_NEW = "new";
	private static final String ACTION_EDIT = "edit";
	
	private Map<String, String> listUrlMap; // 跳转到查询列表页面，如果是单条记录，则跳转到视图页面
	private Map<String, String> newUrlMap; // 跳转到新建资源页面
	private Map<String, String> editUrlMap; // 跳转到编辑页面
	
	private Map<String, String> homeUrlMap; // 放置各种内容的内容首页链接，如题库首页，笔记项目首页等

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
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
	}

	/**
	 * 
	 * 如果是跳转请求：<br/>
	 * 跳转请求，只用于请求资源。而注销操作，并没有请求资源，因此使用ajax请求。
	 * 
	 * 新建项目的url规范
	 * 在url的最后追加一个/new,  对应的html的命名为new.html， 如servletPath+"/new",
	 * 在servletPath和“/new”之间可以添加参数，主要为路径参数
	 * 
	 * 如果是ajax请求:<br/>
	 */
	@Override
	public void doFilter(ServletRequest req, ServletResponse resp,
			FilterChain chain) throws IOException, ServletException {
		HttpServletRequest httpRequest = (HttpServletRequest) req;
		HttpServletResponse httpResponse = (HttpServletResponse) resp;

		
		// TODO:先从map中查找，找不到之后，走默认的规则。
		
		// 判断contextPath/ServletPath与第一个pathInfo是否一致。
		
		// 因为约定rest名与文件夹名相同，所以servletPath中存储的通常是servlet的别名。
		if(!RequestUtil.isAjax(httpRequest)){
			String servletPath = httpRequest.getServletPath();
			String pathInfo = httpRequest.getPathInfo();
			IPath path = (pathInfo == null ? Path.ROOT : new Path(pathInfo));
			
			if(!servletPath.isEmpty()){
				int segmentCount = path.segmentCount();
				if(segmentCount == 0){
					//FIXME:暂时支持一级路径。即把所有的list的html容器都放在根目录下
					String fileName = ROOT_WEB + servletPath + LIST_HTML;
					httpRequest.getRequestDispatcher(fileName).forward(httpRequest, httpResponse);
					return;
				}
				
				String firstSegment = path.segment(0);
				if(firstSegment.equals(ACTION_NEW)){
					// TODO：需要授权
					if(newUrlMap.containsKey(servletPath)){
						String realFilePath = newUrlMap.get(servletPath);
						httpRequest.getRequestDispatcher(realFilePath).forward(httpRequest, httpResponse);
					}else{
						String fileName = ROOT_WEB + servletPath + pathInfo + HTML;
						httpRequest.getRequestDispatcher(fileName).forward(httpRequest, httpResponse);
					}
					return;
				}
				
				if(firstSegment.equals(ACTION_EDIT)){
					// TODO：需要授权
					if(editUrlMap.containsKey(servletPath)){
						String realFilePath = editUrlMap.get(servletPath);
						httpRequest.getRequestDispatcher(realFilePath).forward(httpRequest, httpResponse);
					}
					return;
				}
				
				
				if(listUrlMap.containsKey(servletPath)){
					String realFilePath = listUrlMap.get(servletPath);
					httpRequest.getRequestDispatcher(realFilePath).forward(httpRequest, httpResponse);
					return;
				}
				
				
			}else{
				if(path.segmentCount() == 1){
					String firstSegment = path.segment(0);
					if(homeUrlMap.containsKey(firstSegment)){
						String realFilePath = homeUrlMap.get(firstSegment);
						httpRequest.getRequestDispatcher(realFilePath).forward(httpRequest, httpResponse);
					}else{
						// 寻找放在根目录下的html文件
						String fileName = pathInfo + HTML;
						httpRequest.getRequestDispatcher(fileName).forward(httpRequest, httpResponse);
					}
					
					return;
				}
			}
		}
		
		chain.doFilter(req, resp);
	}

	@Override
	public void destroy() {
		
		if (listUrlMap != null) {
			listUrlMap.clear();
			listUrlMap = null;
		}
		if (newUrlMap != null) {
			newUrlMap.clear();
			newUrlMap = null;
		}
		if (editUrlMap != null) {
			editUrlMap.clear();
			editUrlMap = null;
		}
		if(homeUrlMap != null){
			homeUrlMap.clear();
			homeUrlMap = null;
		}
		
		
	}

}
