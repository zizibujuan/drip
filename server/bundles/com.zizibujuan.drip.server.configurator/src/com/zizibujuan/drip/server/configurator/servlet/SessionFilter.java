package com.zizibujuan.drip.server.configurator.servlet;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.zizibujuan.drip.server.util.WebConstants;
import com.zizibujuan.drip.server.util.servlet.RequestUtil;
import com.zizibujuan.drip.server.util.servlet.ResponseUtil;
import com.zizibujuan.drip.server.util.servlet.UserSession;

/**
 * 对于只有登录用户才可以访问的页面，判断用户是否已经登录，如何没有登录，则跳转到公共首页。
 * @author jzw
 * @since 0.0.1
 */
public class SessionFilter implements Filter {
	
	// 存放不需要授权的页面
	private final List<String> excludes = new ArrayList<String>();

	@Override
	public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse,
			FilterChain filterChain) throws IOException, ServletException {
		final HttpServletRequest httpRequest = (HttpServletRequest) servletRequest;
		final HttpServletResponse httpResponse = (HttpServletResponse)servletResponse;
		final String requestPath = httpRequest.getServletPath() + (httpRequest.getPathInfo() == null ? "" : httpRequest.getPathInfo()); //$NON-NLS-1$
		if(this.isAuthenticatedPage(requestPath)){
			if(!UserSession.isLogged(httpRequest)){
				// 跳转到登录界面
				String fileName = "/" + WebConstants.PUBLIC_WELCOME_FILE_NAME;
				if(RequestUtil.isAjax(httpRequest)){
					String script = "<script>window.location.href='/';</script>";
					ResponseUtil.toHTML(httpRequest, httpResponse, script);
				}else{
					httpResponse.setHeader("Cache-Control", "no-cache"); //$NON-NLS-1$ //$NON-NLS-2$
					httpResponse.setHeader("Cache-Control", "no-store"); //$NON-NLS-1$ //$NON-NLS-2$
					httpResponse.sendRedirect(fileName);
				}
				return;
			}
		}
		
		
		filterChain.doFilter(servletRequest, servletResponse);
	}

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		String excludesParameter = filterConfig.getInitParameter("excludes"); //$NON-NLS-1$
		if (excludesParameter != null) {
			StringTokenizer tokenizer = new StringTokenizer(excludesParameter, ",", false); //$NON-NLS-1$
			while (tokenizer.hasMoreTokens()) {
				String token = tokenizer.nextToken().trim();
				excludes.add(token);
			}
		}
	}
	
	/**
	 * 判断是否只有登录用户才可以访问
	 * @param requestPath
	 * @return 如果该页面之后登录用户才可以访问，则返回<code>true</code>;否则返回<code>false</code>
	 */
	private boolean isAuthenticatedPage(String requestPath) {
		// 只要不在排除列表中的页面，都是需要授权访问的页面
		//String excludePattern = "^(js|css|png|jpg|ico)";
		System.out.println(requestPath);
		if(!requestPath.endsWith(".html"))return false;
		if(requestPath.endsWith(".html") && requestPath.contains("/templates/")) return false;
		
		
		return !excludes.contains(requestPath);
	}

	@Override
	public void destroy() {
		// do nothing
	}
}
