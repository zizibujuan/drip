package com.zizibujuan.drip.server.servlet;

import java.io.IOException;
import java.net.URLEncoder;

import javax.security.auth.login.AppConfigurationEntry;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.renren.api.client.RenrenApiConfig;
import com.zizibujuan.drip.server.util.servlet.DripServlet;

/**
 * 邀请好友
 * @author jzw
 * @since 0.0.1
 */
public class InviteServlet extends DripServlet {

	private static final long serialVersionUID = 4161652961146512580L;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		String pathInfo = req.getPathInfo();
		if(pathInfo != null && !pathInfo.equals("/")){
			
			if(pathInfo.equals("/renren")){
				String appId = "";
				String diaplay = "iframe";
				String acceptUrl = "http://www.zizibujuan.com/request";
				String acceptLabel = URLEncoder.encode("好的", "UTF-8");
				String actionText = URLEncoder.encode("邀请好友一起学习", "UTF-8");
				//String redirectUri
				/*
				http://widget.renren.com/dialog/request?app_id=
			         ${requestScope.appId}&display=${requestScope.display}&accept_url=
			                ${requestScope.acceptUrl}&accept_label=${requestScope.acceptLabel}&actiontext=
			                      ${requestScope.actionText}&redirect_uri=${requestScope.redirectUri}
				*/
			}
			
			return;
		}
		super.doGet(req, resp);
	}
	
	

}
