package com.zizibujuan.drip.server.servlet;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.eclipse.core.runtime.IPath;

import com.zizibujuan.cm.server.service.ApplicationPropertyService;
import com.zizibujuan.cm.server.servlets.CMServiceHolder;
import com.zizibujuan.drip.server.util.servlet.BaseServlet;

/**
 * 获取图片
 * @author jzw
 * @since 0.0.1
 */
public class ImageServlet extends BaseServlet {

	private static final long serialVersionUID = 8065790517880160407L;
	
	private ApplicationPropertyService applicationPropertyService;
	
	public ImageServlet(){
		applicationPropertyService = CMServiceHolder.getDefault().getApplicationPropertyService();
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		traceRequest(req);
		IPath path = getPath(req);
		if(path.segmentCount() == 2){
			String userId = path.segment(0);
			String imageName = path.segment(1);
			// 根目录
			String exerImgRootPath = applicationPropertyService.getForString("exercise.image.path.root");
			File file = new File(exerImgRootPath + userId + "/" + imageName);
//			String contentType = "image/";
//			String imageType = imageName.split("\\.")[1].toLowerCase();
//			if(imageType == "png"){
//				contentType += "png";
//			}else if(imageType == "gif"){
//				contentType += "gif";
//			}else{
//				contentType += "jpeg";
//			}
//			resp.setContentType(contentType);
			IOUtils.copy(new FileInputStream(file), resp.getOutputStream());
			return;
		}
		
		super.doGet(req, resp);
	}

}
