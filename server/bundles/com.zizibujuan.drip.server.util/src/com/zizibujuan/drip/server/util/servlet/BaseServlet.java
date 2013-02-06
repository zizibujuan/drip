package com.zizibujuan.drip.server.util.servlet;

import java.util.Enumeration;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.zizibujuan.drip.server.util.PageInfo;

/**
 * 项目中所有servlet的基类
 * @author jinzw
 * @since 0.0.1
 */
public class BaseServlet extends HttpServlet {
	private static final long serialVersionUID = -2711038339229482918L;
	private static final Logger logger = LoggerFactory.getLogger(BaseServlet.class);
	protected static final String REST_SEPARATOR = "/"; //$NON-NLS-1$
	private static final boolean DEBUG_VEBOSE = true;
	
	protected void traceRequest(HttpServletRequest req) {
		StringBuffer result = new StringBuffer("\n");
		result.append("pathInfo:").append(req.getPathInfo()).append("\n");
		result.append(req.getMethod());
		result.append(' ');
		result.append(req.getRequestURI());
		String query = req.getQueryString();
		if (query != null)
			result.append('?').append(query);
		if (DEBUG_VEBOSE){
			printHeaders(req, result);
		}
		logger.debug(result.toString());
	}
	
	private void printHeaders(HttpServletRequest req, StringBuffer out) {
		out.append(' ');
		Enumeration<?> headNames =  req.getHeaderNames();
		while(headNames.hasMoreElements()){
			String header = (String)headNames.nextElement();
			out.append(header + ": " + req.getHeader(header) + "\n"); //$NON-NLS-1$ //$NON-NLS-2$
		}
	}
	
	// FIXME:对这个方法名不太满意，重命名
	protected boolean isNullOrSeparator(String pathInfo) {
		return pathInfo == null || pathInfo.equals(REST_SEPARATOR);
	}
	
	protected PageInfo getPageInfo(HttpServletRequest req){
		String range = req.getHeader("Range");
		if(range == null){
			range = req.getHeader("range");
		}
		if(range != null){
			return new PageInfo(range);
		}
		return null;
	}
}
