package com.zizibujuan.drip.server.util.servlet;

import java.io.IOException;
import java.util.Enumeration;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.core.runtime.IPath;
import org.eclipse.core.runtime.IStatus;
import org.eclipse.core.runtime.Path;
import org.eclipse.core.runtime.Status;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.zizibujuan.drip.server.util.Activator;
import com.zizibujuan.drip.server.util.HttpConstants;
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
	
	protected IPath getPath(HttpServletRequest req){
		String pathInfo = req.getPathInfo();
		return (pathInfo == null ? Path.ROOT : new Path(pathInfo));
	}
	
	/**
	 * Generic handler for exceptions.
	 */
	protected void handleException(HttpServletResponse resp, IStatus error) throws ServletException {
		int httpCode = HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
		ServerStatus serverStatus;
		if (error instanceof ServerStatus) {
			serverStatus = (ServerStatus) error;
			httpCode = serverStatus.getHttpCode();
		} else {
			serverStatus = new ServerStatus(error, httpCode);
		}
		resp.setCharacterEncoding("UTF-8");
		resp.setStatus(httpCode);
		resp.setContentType(HttpConstants.CONTENT_TYPE_JSON);
		try {
			resp.getWriter().print(serverStatus.toJSONString());
		} catch (IOException ioe) {
			//just throw a servlet exception
			throw new ServletException(error.getMessage(), error.getException());
		}
	}

	/**
	 * Generic handler for exceptions.
	 */
	protected void handleException(HttpServletResponse resp, IStatus status, int httpCode) throws ServletException {
		handleException(resp, new ServerStatus(status, httpCode));
	}

	/**
	 * Generic handler for exceptions. 
	 */
	protected void handleException(HttpServletResponse resp, String msg, Exception e) throws ServletException {
		handleException(resp, msg, e, HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
	}

	/**
	 * Generic handler for exceptions. 
	 */
	protected void handleException(HttpServletResponse resp, String msg, Exception e, int httpCode) throws ServletException {
		handleException(resp, new Status(IStatus.ERROR, Activator.PI_SERVER_SERVLETS, msg, e), httpCode);
	}
}
