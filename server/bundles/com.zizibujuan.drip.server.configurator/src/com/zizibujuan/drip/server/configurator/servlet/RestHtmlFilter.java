package com.zizibujuan.drip.server.configurator.servlet;

import java.io.IOException;

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
	
	private UrlMapper urlMapper;

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		urlMapper = new UrlMapper();
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
			
			String realFilePath = urlMapper.getResourcePath(servletPath, path);
			if(realFilePath != null){
				httpRequest.getRequestDispatcher(realFilePath).forward(httpRequest, httpResponse);
				return;
			}
		}
		
		chain.doFilter(req, resp);
	}

	@Override
	public void destroy() {
		urlMapper = null;
	}

}
