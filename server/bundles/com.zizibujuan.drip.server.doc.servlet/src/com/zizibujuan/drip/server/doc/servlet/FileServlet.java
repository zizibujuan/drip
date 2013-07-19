package com.zizibujuan.drip.server.doc.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.zizibujuan.drip.server.doc.model.NewFileForm;
import com.zizibujuan.drip.server.util.servlet.BaseServlet;
import com.zizibujuan.drip.server.util.servlet.RequestUtil;

/**
 * 文件管理
 * @author jzw
 * @since 0.0.1
 */
public class FileServlet extends BaseServlet {

	private static final long serialVersionUID = 3134000969079271759L;

	/**
	 * 新建文件
	 */
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		traceRequest(req);
		
		String pathInfo = req.getPathInfo();
		if(pathInfo == null || pathInfo.equals("/")){
			NewFileForm newFileForm = RequestUtil.fromJsonObject(req, NewFileForm.class);
			// 判断文件名是否被使用
			// TODO：往git仓库中写
			// 1. 获取git仓库
			
			return;
		}
		
		super.doPost(req, resp);
	}

}
