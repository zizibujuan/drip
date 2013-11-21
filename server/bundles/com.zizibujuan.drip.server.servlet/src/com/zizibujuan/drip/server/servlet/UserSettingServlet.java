package com.zizibujuan.drip.server.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.validator.routines.EmailValidator;
import org.eclipse.core.runtime.IPath;

import com.zizibujuan.drip.server.model.UserInfo;
import com.zizibujuan.drip.server.service.UserService;
import com.zizibujuan.drip.server.util.servlet.BaseServlet;
import com.zizibujuan.drip.server.util.servlet.RequestUtil;
import com.zizibujuan.drip.server.util.servlet.ResponseUtil;
import com.zizibujuan.drip.server.util.servlet.UserSession;
import com.zizibujuan.drip.server.util.servlet.Validator;

/**
 * 用户账号设置
 * 
 * @author jzw
 * @since 0.0.1
 */
public class UserSettingServlet extends BaseServlet {

	private static final long serialVersionUID = 4251818469536193583L;
	
	private UserService userService;
	
	public UserSettingServlet(){
		userService = ServiceHolder.getDefault().getUserService();
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		traceRequest(req);
		IPath path = getPath(req);
		if(path.segmentCount() == 1){
			String type = path.segment(0);
			if(type.equals("profile")){
				
			}
			return;
		}
		super.doGet(req, resp);
	}

	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		traceRequest(req);
		IPath path = getPath(req);
		if(path.segmentCount() == 1){
			String type = path.segment(0);
			if(type.equals("profile")){
				UserInfo newUserInfo = RequestUtil.fromJsonObject(req, UserInfo.class);
				// TODO: 需不需要校验昵称的唯一性呢?
				// 校验邮箱的有效性
				Validator validator = new Validator();
				if(!EmailValidator.getInstance().isValid(newUserInfo.getEmail())){
					validator.addFieldError("email", "邮箱格式不正确");
				}
				if(validator.hasErrors()){
					ResponseUtil.toJSON(req, resp, validator.getFieldErrors(), HttpServletResponse.SC_PRECONDITION_FAILED);
					return;
				}
				UserInfo userInfo = (UserInfo) UserSession.getUser(req);
				newUserInfo.setId(userInfo.getId());
				userService.update(newUserInfo);
				// 修改完用户信息后，就修改session中缓存的用户信息
				UserSession.setUser(req, userService.getById(userInfo.getId()));
				ResponseUtil.toJSON(req, resp, null);
				return;
			}
		}
		super.doPut(req, resp);
	}

	
	
}
