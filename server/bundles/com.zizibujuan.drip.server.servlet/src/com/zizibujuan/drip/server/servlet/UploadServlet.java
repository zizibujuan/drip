package com.zizibujuan.drip.server.servlet;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import com.zizibujuan.drip.server.util.servlet.DripServlet;
import com.zizibujuan.drip.server.util.servlet.ResponseUtil;

/**
 * 删除图片
 * @author jzw
 * @since 0.0.1
 */
public class UploadServlet extends DripServlet {

	private static final long serialVersionUID = 8688828330683061302L;

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {

		String pathInfo = req.getPathInfo();
		if(pathInfo != null && !pathInfo.equals("/")){
			System.out.println(pathInfo);
			if(pathInfo.equals("/exerciseImage")){
				List<Map<String,Object>> result = new ArrayList<Map<String,Object>>();
				
				// 图片都存在一个ApplicationData的目录中,该目录放在部署根目录的外面。
				// 使用绝对路径好些。
				FileItemFactory factory = new DiskFileItemFactory();
				ServletFileUpload upload = new ServletFileUpload(factory);
				
				try {
					List<FileItem> items = upload.parseRequest(req);
					// 放到配置文件中。
					// 如果没有赋值，默认放在workspace下。
					
					// 根目录
					String dataFilePath = "/home/jzw/drip/";
					// 放置习题配图
					String exercisePath = "exercise/users/";
					// TODO：用profile放置用户上传的头像
					// FIXME：是否使用用户标识分组图像，如果使用的话，便于管理；但是不利于底层共享。
					// 因为在检索图片时，还需要在路径中增加上传用户的信息。
					
					// TODO:加上文件名后缀
					
					File dir = new File(dataFilePath+ exercisePath);
					if(!dir.exists()){
						dir.mkdirs();
					}
					
					
					//File file = new File("/home/jzw/a.jpg");
					
					
					
					System.out.println("items.length="+items.size());
					
					/*
					 /exerciseImage
items.length=5

name:jbpm.png
fieldName:uploadedfiles[]

name:null
fieldName:index
string:0

name:null
fieldName:name
string:jbpm.png

name:null
fieldName:size
string:164548

name:null
fieldName:type
string:image/png
					 */
					
					/*
					 result.put("name", "a.jpg");
				result.put("file", "path/a.jpg");
				// width; height;
				result.put("type", "JPG");
					 */
					List<File> files = new ArrayList<File>();
					
					for(FileItem item : items){
						System.out.println();
						if(item.isFormField()){
							System.out.println("name:"+item.getName());
							System.out.println("fieldName:"+item.getFieldName());
							System.out.println("string:"+item.getString());
							System.out.println("size:"+item.getSize());
						}else{
							String newFileName = UUID.randomUUID().toString().replace("-", "");
							String fileName = item.getName();
							String ext = null;
							int dotIndex = fileName.indexOf(".");
							if(dotIndex >-1){
								ext = fileName.substring(dotIndex);
							}
							if(ext!=null){
								newFileName += ext;
							}
							
							/*
							 result.put("name", "a.jpg");
						result.put("file", "path/a.jpg");
						// width; height;
						result.put("type", "JPG");
							 */
							Map<String,Object> map = new HashMap<String, Object>();
							map.put("name", item.getName());
							// map.put("file", null); 
							
							System.out.println("name:"+item.getName());
							System.out.println("fieldName:"+item.getFieldName());
							System.out.println("size:"+item.getSize());
							//System.out.println("string:"+item.getString());
							File file = new File(dir, newFileName);
							item.write(file);
							
							//item.write(file);
						}
						
						
						
					}
				} catch (FileUploadException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				
				ResponseUtil.toJSON(req, resp, result);
				return;
			}
		}
		super.doPost(req, resp);
	}
}
