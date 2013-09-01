package com.zizibujuan.drip.server.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.core.runtime.IPath;

import com.zizibujuan.drip.server.model.UserInfo;
import com.zizibujuan.drip.server.service.UserService;
import com.zizibujuan.drip.server.util.servlet.BaseServlet;
import com.zizibujuan.drip.server.util.servlet.UserSession;

/**
 * 使用邮箱中的链接激活用户
 * @author jzw
 * @since 0.0.1
 */
public class EmailConfirmServlet extends BaseServlet {

	private static final long serialVersionUID = -6668002663924575641L;
	
	private UserService userService;
	
	public EmailConfirmServlet(){
		userService = ServiceHolder.getDefault().getUserService();
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		traceRequest(req);
		IPath path = getPath(req);
		if(path.segmentCount() == 1){
//			resp.setContentType(HttpConstants.CONTENT_TYPE_HTML);
//			resp.setCharacterEncoding("UTF-8");
			String confirmKey = path.segment(0);
			UserInfo userInfo = userService.getByConfirmKey(confirmKey);
			if(userInfo == null){
				resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
				req.getRequestDispatcher("/drip/errors/404.html").forward(req, resp);
				return;
			}
			if(userInfo.isActive()){
				if(UserSession.isLogged(req)){
					resp.sendRedirect("/");
				}else{
					resp.sendRedirect("/drip/mixLogin/confirm_again.html");
				}
				return;
			}
			userService.active(userInfo.getId());
			if(UserSession.isLogged(req)){
				resp.sendRedirect("/");
			}else{
				resp.sendRedirect("/drip/mixLogin/confirm_success.html");
			}
			return;
		}
		super.doGet(req, resp);
	}

}
