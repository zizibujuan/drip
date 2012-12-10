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

import com.zizibujuan.drip.server.util.WebConstants;
import com.zizibujuan.drip.server.util.servlet.UserSession;

/**
 * 指向欢迎页面的过滤器。
 * 当访问首页时，如果用户没有登录，则跳转到公共首页；如果用户已经登录，则跳转到个人首页。
 * 
 * @author jinzw
 * @since 0.0.1
 */
public class WelcomeFileFilter implements Filter {

	@Override
	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
		final HttpServletRequest httpRequest = (HttpServletRequest) request;
		final HttpServletResponse httpResponse = (HttpServletResponse)response;
		final String requestPath = httpRequest.getServletPath() + (httpRequest.getPathInfo() == null ? "" : httpRequest.getPathInfo()); //$NON-NLS-1$
		
		// 判断是否访问首页地址
		if (requestPath.equals("/")) { //$NON-NLS-1$
			String fileName = "";
			if(UserSession.getUser(httpRequest)==null){
				fileName = requestPath + WebConstants.PUBLIC_WELCOME_FILE_NAME;
			}else{
				fileName = requestPath + WebConstants.PRIVATE_WELCOME_FILE_NAME;
			}
			httpResponse.setHeader("Cache-Control", "no-cache"); //$NON-NLS-1$ //$NON-NLS-2$
			httpResponse.setHeader("Cache-Control", "no-store"); //$NON-NLS-1$ //$NON-NLS-2$
			
			httpRequest.getRequestDispatcher(fileName).forward(httpRequest, response);
			
			return;
		}
		
		chain.doFilter(request, response);
	}

	@Override
	public void destroy() {
		// do nothing
	}

	@Override
	public void init(FilterConfig arg0) throws ServletException {
		// do nothing
	}

}
