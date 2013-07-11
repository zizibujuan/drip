package com.zizibujuan.drip.server.doc.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.zizibujuan.drip.server.doc.model.NewFileForm;
import com.zizibujuan.drip.server.util.servlet.BaseServlet;
import com.zizibujuan.drip.server.util.servlet.RequestUtil;

public class FileServlet extends BaseServlet {

	private static final long serialVersionUID = 3134000969079271759L;

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		traceRequest(req);
		
		String pathInfo = req.getPathInfo();
		if(pathInfo == null || pathInfo.equals("/")){
			RequestUtil.fromJsonObject(req, NewFileForm.class);
			return;
		}
		
		super.doPost(req, resp);
	}

}
