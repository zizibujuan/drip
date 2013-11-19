package com.zizibujuan.drip.server.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.core.runtime.IPath;

import com.zizibujuan.drip.server.util.servlet.BaseServlet;

/**
 * 用户账号设置
 * 
 * @author jzw
 * @since 0.0.1
 */
public class UserSettingServlet extends BaseServlet {

	private static final long serialVersionUID = 4251818469536193583L;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		traceRequest(req);
		IPath path = getPath(req);
		if(path.segmentCount() == 1){
			String type = path.segment(0);
			if(type.equals("profile")){
				
			}
			return;
		}
		super.doGet(req, resp);
	}

	
}
