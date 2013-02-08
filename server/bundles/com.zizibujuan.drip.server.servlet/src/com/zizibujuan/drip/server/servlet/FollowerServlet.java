package com.zizibujuan.drip.server.servlet;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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
		String pathInfo = req.getPathInfo();
		if(pathInfo != null && !pathInfo.equals("/")){
			
			Long localUserId = null;
			String[] infos = pathInfo.split("/");
			if(infos.length == 3){
				localUserId = Long.valueOf(infos[2]);
			}else{
				localUserId = UserSession.getLocalUserId(req);
			}
			
			PageInfo pageInfo = getPageInfo(req);
			List<Map<String, Object>> result = userRelationService.getFollowers(pageInfo, localUserId);
			ResponseUtil.toJSON(req, resp, pageInfo, result);
			return;
		}
		super.doGet(req, resp);
	}

}
