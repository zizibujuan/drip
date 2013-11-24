package com.zizibujuan.drip.server.configurator.servlet;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.core.runtime.IPath;
import org.eclipse.core.runtime.Path;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.zizibujuan.drip.server.model.UserInfo;
import com.zizibujuan.drip.server.service.UserService;
import com.zizibujuan.drip.server.servlet.ServiceHolder;
import com.zizibujuan.drip.server.util.CookieConstants;
import com.zizibujuan.drip.server.util.servlet.CookieUtil;
import com.zizibujuan.drip.server.util.servlet.RequestUtil;
import com.zizibujuan.drip.server.util.servlet.ResponseUtil;
import com.zizibujuan.drip.server.util.servlet.UserSession;

/**
 * 对于只有登录用户才可以访问的页面，判断用户是否已经登录，如何没有登录，则跳转到公共首页。
 * @author jzw
 * @since 0.0.1
 */
public class SessionFilter implements Filter {
	private static final Logger logger = LoggerFactory.getLogger(SessionFilter.class);
	
	private UserService userService;
	private UrlMapper urlMapper;
	
	@Override
	public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse,
			FilterChain filterChain) throws IOException, ServletException {
		final HttpServletRequest httpRequest = (HttpServletRequest) servletRequest;
		final HttpServletResponse httpResponse = (HttpServletResponse)servletResponse;
		
		if(!UserSession.isLogged(httpRequest)){
			tryAutoLogin(httpRequest);
		}
		
		if(!UserSession.isLogged(httpRequest)){
			if(RequestUtil.isAjax(httpRequest)){
				String servletPath = httpRequest.getServletPath();
				String httpMethod = httpRequest.getMethod();
				if(urlMapper.isAuthAction(servletPath, httpMethod)){
					// 跳转到登录界面
					String script = "window.location.href='/';";
					ResponseUtil.toHTML(httpRequest, httpResponse, script, HttpServletResponse.SC_UNAUTHORIZED);
					return;
				}
			}else{
				if(this.isAuthenticatedPage(httpRequest)){
					httpResponse.setHeader("Cache-Control", "no-cache"); //$NON-NLS-1$ //$NON-NLS-2$
					httpResponse.setHeader("Cache-Control", "no-store"); //$NON-NLS-1$ //$NON-NLS-2$
					httpResponse.sendRedirect("/");
					return;
				}
			}
		}
		
		filterChain.doFilter(servletRequest, servletResponse);
	}

	private void tryAutoLogin(final HttpServletRequest httpRequest) {
		// 如果cookie中有logged_in和token，则执行登录操作
		Cookie loggedInCookie = CookieUtil.get(httpRequest, CookieConstants.LOGGED_IN);
		// TODO:用户每次登录，都自动分配一个token
		if(loggedInCookie != null){
			String loggedInValue = loggedInCookie.getValue();
			if(loggedInValue.equals("1")){
				Cookie tokenCookie = CookieUtil.get(httpRequest, CookieConstants.ZZBJ_USER_TOKEN);
				if(tokenCookie != null){
					String token = tokenCookie.getValue();
					// 自动登录
					UserInfo userInfo = userService.getByToken(token);
					if(userInfo == null){
						logger.error("自动登录失败，这个时候页面上会显示LoggedInHeader，出现不一致的情况");
					}else{
						UserSession.setUser(httpRequest, userInfo);
					}
				}
				
			}
		}
	}

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		userService = ServiceHolder.getDefault().getUserService();
		urlMapper = new UrlMapper();
	}
	
	/**
	 * 判断是否只有登录用户才可以访问
	 * @param httpRequest
	 * @return 如果该页面之后登录用户才可以访问，则返回<code>true</code>;否则返回<code>false</code>
	 */
	private boolean isAuthenticatedPage(HttpServletRequest httpRequest) {
		String pathInfo = httpRequest.getPathInfo();
		IPath path = (pathInfo == null ? Path.ROOT : new Path(pathInfo));
		// 通过Ipath解析各种不安常规写的路径，如//a//b这种写两个/，也是合法路径，但是直接equal却与/a/b不同，实际上是一回事。
		
		return urlMapper.isAuthPage(httpRequest.getServletPath(), path);
	}

	@Override
	public void destroy() {
		urlMapper = null;
		userService = null;
	}
}
