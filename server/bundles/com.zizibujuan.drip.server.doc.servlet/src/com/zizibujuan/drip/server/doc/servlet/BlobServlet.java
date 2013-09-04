package com.zizibujuan.drip.server.doc.servlet;

import java.io.IOException;
import java.io.StringWriter;
import java.net.URI;
import java.net.URISyntaxException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.eclipse.core.filesystem.EFS;
import org.eclipse.core.filesystem.IFileInfo;
import org.eclipse.core.filesystem.IFileStore;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.IPath;

import com.zizibujuan.drip.server.doc.model.FileInfo;
import com.zizibujuan.drip.server.service.ApplicationPropertyService;
import com.zizibujuan.drip.server.util.GitConstants;
import com.zizibujuan.drip.server.util.servlet.BaseServlet;
import com.zizibujuan.drip.server.util.servlet.ResponseUtil;

/**
 * 查看文件内容
 * 
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
			// blob/userName/projectName/[filePath]
			String rootPath = applicationPropertyService.getForString(GitConstants.KEY_GIT_ROOT);
			// 文件信息
			URI fileLocation;
			try {
				fileLocation = new URI(rootPath + path.toString());
			} catch (URISyntaxException e) {
				handleException(resp, "路径语法错误", e);
				return;
			}
			IFileStore fileStore = EFS.getLocalFileSystem().getStore(fileLocation);
			StringWriter writer = new StringWriter();
			try {
				IOUtils.copy(fileStore.openInputStream(EFS.NONE, null), writer);
				IFileInfo fileInfo = fileStore.fetchInfo();
				FileInfo fileDetail = new FileInfo();
				fileDetail.setContent(writer.toString());
				fileDetail.setName(fileInfo.getName());
				fileDetail.setLongSize(fileInfo.getLength());
				
				ResponseUtil.toJSON(req, resp, fileDetail);
			} catch (CoreException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
			
			
			// 提交信息
			
			// 所有参与编写文件的用户
			return;
		}
		super.doGet(req, resp);
	}

}
