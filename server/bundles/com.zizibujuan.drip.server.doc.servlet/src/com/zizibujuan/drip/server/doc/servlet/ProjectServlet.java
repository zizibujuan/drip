package com.zizibujuan.drip.server.doc.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.core.runtime.IPath;
import org.eclipse.core.runtime.Path;

import com.zizibujuan.drip.server.util.servlet.BaseServlet;

/**
 * 项目管理
 * @author jzw
 *
 */
public class ProjectServlet extends BaseServlet {

	private static final long serialVersionUID = -2474647543970725994L;

	/**
	 * 新建项目,并存放在git仓库中
	 */
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		traceRequest(req);
		String pathInfo = req.getPathInfo();
		IPath path = (pathInfo == null ? Path.ROOT : new Path(pathInfo));
		if(path.segmentCount() == 0){
			// TODO:需要添加一个service层
			// TODO:获取存放所有仓库的根目录（在系统参数中配置，该版本使用cm服务）
			return;
		}
		super.doPost(req, resp);
	}

	
}
