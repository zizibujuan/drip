package com.zizibujuan.drip.server.servlet;

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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.zizibujuan.cm.server.service.ApplicationPropertyService;
import com.zizibujuan.cm.server.servlets.CMServiceHolder;
import com.zizibujuan.drip.server.service.AccessLogService;
import com.zizibujuan.drip.server.util.constant.WebConstants;
import com.zizibujuan.drip.server.util.servlet.UserSession;
import com.zizibujuan.useradmin.server.model.UserInfo;
import com.zizibujuan.useradmin.server.model.constant.ApplicationPropertyKey;

import eu.bitwalker.useragentutils.Browser;
import eu.bitwalker.useragentutils.OperatingSystem;
import eu.bitwalker.useragentutils.UserAgent;
import eu.bitwalker.useragentutils.Version;

/**
 * 用户访问日志过滤器
 * 
 * @author jinzw
 * @since 0.0.1
 */
public class AccessLogFilter implements Filter {

	private static Logger logger = LoggerFactory.getLogger(AccessLogFilter.class);
	
	private AccessLogService accessLogService;
	private ApplicationPropertyService applicationPropertyService;
	
	private static final String COKIE_NAME = "zzbjusercookieid";
	
	@Override
	public void init(FilterConfig arg0) throws ServletException {
		accessLogService = ServiceHolder.getDefault().getAccessLogService();
		applicationPropertyService = CMServiceHolder.getDefault().getApplicationPropertyService();
	}
	
	@Override
	public void destroy() {
		accessLogService = null;
		applicationPropertyService = null;
	}

	@Override
	public void doFilter(ServletRequest servletRequest,
			ServletResponse servletResponse, FilterChain filterChain)
			throws IOException, ServletException {
		HttpServletRequest httpServletRequest = (HttpServletRequest)servletRequest;
		HttpServletResponse httpServletResponse = (HttpServletResponse)servletResponse;
		
		String pathInfo = httpServletRequest.getPathInfo();
		
		// TODO：提取常量
		if(pathInfo != null && isValidPath(pathInfo)){
			String userAgentString = httpServletRequest.getHeader("User-Agent");
			if(userAgentString == null){
				userAgentString = httpServletRequest.getHeader("user-agent");
			}
			if(userAgentString == null || userAgentString.contains("aliyun")){
				// 包含aliyun字样的不计入访问日志
				filterChain.doFilter(servletRequest, servletResponse);
				return;
			}
				
			// 获取用户标识
			//		如果用户没有登录，则从cookie中获取
			//		如果用户登录，则从session中获取
			boolean anonymous = true;
			Long userId = null;
			if(UserSession.isLogged(httpServletRequest)){
				UserInfo userInfo = (UserInfo) UserSession.getUser(httpServletRequest);
				userId = userInfo.getId();
				anonymous = false;
			}else{
				Cookie[] cookies = httpServletRequest.getCookies();
				
				// 判断是否存在cookie，如果不存在的话，则新建一个
				if(cookies == null){
					userId = addCookieUserId(httpServletResponse);
				}else{
					for(Cookie c : cookies){
						if(c.getName().equals(COKIE_NAME)){
							userId = Long.valueOf(c.getValue());
							break;
						}
					}
					if(userId == null){
						userId = addCookieUserId(httpServletResponse);
					}
				}
			}
			
			// 获取访问者ip
			String ip = httpServletRequest.getRemoteAddr();
						
			// 获取用户访问的上一个页面
			String urlFrom = httpServletRequest.getHeader("Referer");
			logger.info("上一个访问的页面是：" + urlFrom);
			
			// 获取用户当前访问的一个页面
			String urlAccess = httpServletRequest.getRequestURI();
			
			// FIXME: 到底需不需要引入实体类呢？
			// FIXME: 是存入数据库好呢，还是存入文本文件好呢？
			logger.info("user agent string:" + userAgentString);
			UserAgent userAgent = UserAgent.parseUserAgentString(userAgentString);
			Browser browser = userAgent.getBrowser();
			String browserString = null;
			String browserVersion = null;
			if(browser != Browser.UNKNOWN){
				browserString = browser.getName();
				Version version = userAgent.getBrowserVersion();
				if(version != null){
					browserVersion = version.getVersion();
				}
			}
			
			String osString = null;
			OperatingSystem os = userAgent.getOperatingSystem();
			if(os != OperatingSystem.UNKNOWN){
				osString = os.getName();
			}
			accessLogService.log(ip, anonymous, userId, urlFrom, urlAccess,browserString,browserVersion,osString, userAgentString);
		}
				
				
		filterChain.doFilter(servletRequest, servletResponse);
	}

	private Long addCookieUserId(HttpServletResponse httpServletResponse) {
		Long userId = null;
		userId = applicationPropertyService.getNextLong(ApplicationPropertyKey.DRIP_COOKIE_MAX_USER_ID);
		Cookie cookie = new Cookie(COKIE_NAME, userId.toString());
		cookie.setMaxAge(365*24*60*60);//一年有效
		httpServletResponse.addCookie(cookie);
		return userId;
	}

	private boolean isValidPath(String pathInfo) {
		return pathInfo.endsWith(WebConstants.PRIVATE_WELCOME_FILE_NAME)
				|| pathInfo.endsWith(WebConstants.PUBLIC_WELCOME_FILE_NAME)
				|| pathInfo.indexOf(".") == -1;
	}

}
