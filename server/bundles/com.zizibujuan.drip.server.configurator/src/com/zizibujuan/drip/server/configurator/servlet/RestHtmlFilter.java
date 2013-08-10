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
	private static final String NEW_PATHINFO = "new";
	private static final String HTML = ".html";
	
	private Map<String,String> listActions; // 跳转到查询列表页面，如果是单条记录，则跳转到视图页面
	private Map<String,String> newActions; // 跳转到新建资源页面

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		listActions = new HashMap<String, String>();
		listActions.put("/following", "/drip/relation.html");
		listActions.put("/followers", "/drip/relation.html");
		listActions.put("/users", "/drip/profile.html");
		listActions.put("/projects", "/doc/projects/list.html");
		listActions.put("/blob", "/doc/files/blob.html");
		
		newActions = new HashMap<String, String>();
		newActions.put("/files", "/doc/files/new.html");
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
			System.out.println("ServletPath:'"+httpRequest.getServletPath()+"'");
			System.out.println("PathInfo:'"+httpRequest.getPathInfo()+"'");
			System.out.println("ContextPath:'"+httpRequest.getContextPath()+"'");
			
			if(isRegistedServlet(servletPath)){
				if(path.lastSegment().equals(NEW_PATHINFO)){
					if(path.segmentCount() == 1){
						String fileName = ROOT_WEB + servletPath + pathInfo + HTML;
						httpRequest.getRequestDispatcher(fileName).forward(httpRequest, httpResponse);
					}else if(newActions.containsKey(servletPath)){
						String realFilePath = newActions.get(servletPath);
						httpRequest.getRequestDispatcher(realFilePath).forward(httpRequest, httpResponse);
					}
					return;
				}
				
				if(listActions.containsKey(servletPath)){
					String realFilePath = listActions.get(servletPath);
					httpRequest.getRequestDispatcher(realFilePath).forward(httpRequest, httpResponse);
					return;
				}
				
				if(pathInfo == null || pathInfo.equals("/")){			
					//FIXME:暂时支持一级路径。即把所有的list的html容器都放在根目录下
					String fileName = ROOT_WEB + servletPath + LIST_HTML;
					httpRequest.getRequestDispatcher(fileName).forward(httpRequest, httpResponse);
					return;
				}
			}else{
				// 放在根目录下的html文件
				if(pathInfo !=null && !pathInfo.equals("/")&& pathInfo.indexOf(".")==-1){
					String fileName = pathInfo + HTML;
					httpRequest.getRequestDispatcher(fileName).forward(httpRequest, httpResponse);
					return;
				}
			}
		}
		
		chain.doFilter(req, resp);
	}

	private boolean isRegistedServlet(String servletPath) {
		// 该servletPath是已经注册过的servlet别名
		return !servletPath.equals("");
	}

	@Override
	public void destroy() {
		if(listActions!=null){
			listActions.clear();
			listActions = null;
		}
		if(newActions!=null){
			newActions.clear();
			newActions = null;
		}
	}

}
