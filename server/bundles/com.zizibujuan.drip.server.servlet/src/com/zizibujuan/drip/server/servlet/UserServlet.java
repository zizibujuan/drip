package com.zizibujuan.drip.server.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.core.runtime.IPath;

import com.zizibujuan.drip.server.util.servlet.BaseServlet;

/**
 * 用户注册
 * @author jzw
 * @since 0.0.1
 */
public class UserServlet extends BaseServlet {

	private static final long serialVersionUID = 5222934801942017724L;

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		traceRequest(req);
		IPath path = getPath(req);
		if(path.segmentCount() == 0){
			
			return;
		}
		super.doPost(req, resp);
	}

	
}
