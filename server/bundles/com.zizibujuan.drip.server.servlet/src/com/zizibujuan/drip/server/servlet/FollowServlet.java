package com.zizibujuan.drip.server.servlet;

import java.io.IOException;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.core.runtime.IPath;

import com.zizibujuan.drip.server.model.UserInfo;
import com.zizibujuan.drip.server.service.UserRelationService;
import com.zizibujuan.drip.server.util.servlet.BaseServlet;
import com.zizibujuan.drip.server.util.servlet.ResponseUtil;
import com.zizibujuan.drip.server.util.servlet.UserSession;

/**
 * 关注用户
 * @author jzw
 * @since 0.0.1
 */
public class FollowServlet extends BaseServlet {
	private static final long serialVersionUID = 8554979680061295443L;
	private UserRelationService userRelationService;
	
	public FollowServlet(){
		userRelationService = ServiceHolder.getDefault().getUserRelationService();
	}

	/**
	 * 避免重复关注
	 */
	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		traceRequest(req);
		IPath path = getPath(req);
		if(path.segmentCount() == 1){
			Long followUserId = Long.valueOf(path.segment(0));
			UserInfo userInfo = (UserInfo) UserSession.getUser(req);
			Long userId = userInfo.getId();
			String op = req.getParameter("op");
			if(op.equals("on")){
				// 加关注
				userRelationService.follow(userId, followUserId);
			}else if(op.equals("off")){
				// 取消关注
				userRelationService.unFollow(userId, followUserId);
			}
			ResponseUtil.toJSON(req, resp, new HashMap<String,Object>());
			return;
		}
		super.doPost(req, resp);
	}

}
