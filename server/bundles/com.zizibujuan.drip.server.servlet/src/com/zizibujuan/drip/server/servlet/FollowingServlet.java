package com.zizibujuan.drip.server.servlet;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.core.runtime.IPath;

import com.zizibujuan.useradmin.server.model.UserInfo;
import com.zizibujuan.useradmin.server.service.UserRelationService;
import com.zizibujuan.useradmin.server.servlets.UserAdminServiceHolder;
import com.zizibujuan.drip.server.util.PageInfo;
import com.zizibujuan.drip.server.util.servlet.BaseServlet;
import com.zizibujuan.drip.server.util.servlet.ResponseUtil;
import com.zizibujuan.drip.server.util.servlet.UserSession;

/**
 * 获取我关注的用户信息
 * @author jzw
 * @since 0.0.1
 */
public class FollowingServlet extends BaseServlet {

	private static final long serialVersionUID = -8471536554670550568L;

	private UserRelationService userRelationService;
	
	public FollowingServlet(){
		userRelationService = UserAdminServiceHolder.getDefault().getUserRelationService();
	}
	
	/**
	 * 获取指定用户关注的人，如果没有指定用户，则获取当前登录用户关注的人
	 */
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		traceRequest(req);
		IPath path = getPath(req);
		if(path.segmentCount() == 1){
			Long followUserId = Long.valueOf(path.segment(0));
			// TODO:改为userId
			UserInfo userInfo = (UserInfo) UserSession.getUser(req);
			Long curUserId = userInfo.getId();
			PageInfo pageInfo = getPageInfo(req);
			List<Map<String, Object>> result = userRelationService.getFollowing(pageInfo, curUserId, followUserId);
			ResponseUtil.toJSON(req, resp, pageInfo, result);
			return;
		}
		super.doGet(req, resp);
	}
	
}
