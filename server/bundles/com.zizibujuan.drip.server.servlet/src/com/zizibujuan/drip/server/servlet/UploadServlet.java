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
import org.eclipse.core.runtime.IPath;

import com.zizibujuan.drip.server.model.UserInfo;
import com.zizibujuan.drip.server.service.ApplicationPropertyService;
import com.zizibujuan.drip.server.util.servlet.BaseServlet;
import com.zizibujuan.drip.server.util.servlet.ResponseUtil;
import com.zizibujuan.drip.server.util.servlet.UserSession;

/**
 * 习题图片.
 * 将图片管理功能专门做一个项目，使用专门的域名维护。
 * 并可以将这个管理图片的服务公开，供外部使用。
 * @author jzw
 * @since 0.0.1
 */
public class UploadServlet extends BaseServlet {

	private static final long serialVersionUID = 8688828330683061302L;
	
	private ApplicationPropertyService applicationPropertyService;
	
	public UploadServlet(){
		applicationPropertyService = ServiceHolder.getDefault().getApplicationPropertyService();
	}

	/**
	 * items.length=5
	 * 
	 * name:jbpm.png 
	 * fieldName:uploadedfiles[]
	 * 
	 * name:null 
	 * fieldName:index 
	 * string:0
	 * 
	 * name:null 
	 * fieldName:name 
	 * string:jbpm.png
	 * 
	 * name:null 
	 * fieldName:size 
	 * string:164548
	 * 
	 * name:null 
	 * fieldName:type 
	 * string:image/png
	 */
	@SuppressWarnings("unchecked")
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		traceRequest(req);
		IPath path = getPath(req);
		if(path.segmentCount() == 1){
			String action = path.segment(0);
			if(action.equals("exerciseImage")){
				List<Map<String,Object>> result = new ArrayList<Map<String,Object>>();
				
				// 图片都存在一个ApplicationData的目录中,该目录放在部署根目录的外面。
				// 使用绝对路径好些。
				FileItemFactory factory = new DiskFileItemFactory();
				ServletFileUpload upload = new ServletFileUpload(factory);
				
				try {
					List<FileItem> items = upload.parseRequest(req);
					// 放到配置文件中。
					// 如果没有赋值，默认放在workspace下。
					
					// 根目录 TODO:改为可配置
					String dataFilePath = applicationPropertyService.getForString("exercise.image.path.root");
					// 放置习题配图 FIXME：是否需要在路径中再加一层，mapUserId
					UserInfo userInfo = (UserInfo) UserSession.getUser(req);
					Long curUserId = userInfo.getId();
					// TODO：用profile放置用户上传的头像
					// FIXME：是否使用用户标识分组图像，如果使用的话，便于管理；但是不利于底层共享。
					// 因为在检索图片时，还需要在路径中增加上传用户的信息。
					
					File dir = new File(dataFilePath + curUserId + "/");
					if(!dir.exists()){
						dir.mkdirs();
					}
					
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
							Map<String,Object> map = new HashMap<String, Object>();
							map.put("name", item.getName());
							// map.put("file", null); 
							map.put("type", ext != null?ext.substring(1).toUpperCase():null);
							map.put("size", item.getSize());
							map.put("fieldName", item.getFieldName());
							map.put("url", "/userImages/" + curUserId + "/"+newFileName);
							map.put("fileId", newFileName);
							result.add(map);
							File file = new File(dir, newFileName);
							item.write(file);
						}
					}
				} catch (FileUploadException e) {
					e.printStackTrace();
				} catch (Exception e) {
					e.printStackTrace();
				}
				
				ResponseUtil.toJSON(req, resp, result);
				return;
			}
		}
		super.doPost(req, resp);
	}
}
