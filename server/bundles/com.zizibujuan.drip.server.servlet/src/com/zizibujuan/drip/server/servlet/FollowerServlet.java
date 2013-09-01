package com.zizibujuan.drip.server.servlet;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.core.runtime.IPath;

import com.zizibujuan.drip.server.model.UserInfo;
import com.zizibujuan.drip.server.service.UserRelationService;
import com.zizibujuan.drip.server.util.PageInfo;
import com.zizibujuan.drip.server.util.servlet.BaseServlet;
import com.zizibujuan.drip.server.util.servlet.ResponseUtil;
import com.zizibujuan.drip.server.util.servlet.UserSession;

/**
 * 获取关注我的用户
 * @author jzw
 * @since 0.0.1
 */
public class FollowerServlet extends BaseServlet {

	private static final long serialVersionUID = -5926652228934942552L;
	
	private UserRelationService userRelationService;
	
	public FollowerServlet(){
		userRelationService = ServiceHolder.getDefault().getUserRelationService();
	}
	
	/**
	 * 获取关注指定用户的人，如果没有指定用户，则获取关注当前登录用户的人
	 */
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		traceRequest(req);
		IPath path = getPath(req);
		if(path.segmentCount() == 1){
			Long followerUserId = Long.valueOf(path.segment(0));
			
			// TODO:改为userId
			UserInfo userInfo = (UserInfo) UserSession.getUser(req);
			Long curUserId = userInfo.getId();
			
			PageInfo pageInfo = getPageInfo(req);
			List<Map<String, Object>> result = userRelationService.getFollowers(pageInfo, curUserId, followerUserId);
			ResponseUtil.toJSON(req, resp, pageInfo, result);
			return;
		}
		super.doGet(req, resp);
	}

}
