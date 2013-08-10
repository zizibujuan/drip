package com.zizibujuan.drip.server.doc.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.core.runtime.IPath;

import com.zizibujuan.drip.server.service.ApplicationPropertyService;
import com.zizibujuan.drip.server.util.GitConstants;
import com.zizibujuan.drip.server.util.servlet.BaseServlet;

/**
 * 查看文件内容
 * @author jzw
 * @since 0.0.2
 */
public class BlobServlet extends BaseServlet {
	private static final long serialVersionUID = -2241539925566713677L;

	private ApplicationPropertyService applicationPropertyService;
	
	public BlobServlet(){
		applicationPropertyService = ServiceHolder.getDefault().getApplicationPropertyService();
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		traceRequest(req);
		IPath path = getPath(req);
		if(path.segmentCount() > 2){
			// blob/user/project/file
			String rootPath = applicationPropertyService.getForString(GitConstants.KEY_GIT_ROOT);
		}
		super.doGet(req, resp);
	}

}
