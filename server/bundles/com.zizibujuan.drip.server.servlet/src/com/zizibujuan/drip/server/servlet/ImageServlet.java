package com.zizibujuan.drip.server.servlet;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;

import com.zizibujuan.drip.server.util.servlet.BaseServlet;

/**
 * 获取图片
 * @author jzw
 * @since 0.0.1
 */
public class ImageServlet extends BaseServlet {

	private static final long serialVersionUID = 8065790517880160407L;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		traceRequest(req);
		String pathInfo = req.getPathInfo();
		if(pathInfo != null && !pathInfo.equals("/")){
			String[] imageInfos = pathInfo.split("/");
			// TODO:重复放置了，提取到配置文件中
			// 根目录
			String dataFilePath = "/home/jzw/drip/";
			// 放置习题配图
			String exercisePath = "exercise/users/";
			
			File file = new File(dataFilePath+exercisePath+imageInfos[2]+"/"+imageInfos[3]);
			IOUtils.copy(new FileInputStream(file), resp.getOutputStream());
			return;
		}
		
		super.doGet(req, resp);
	}

}
