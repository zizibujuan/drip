package com.zizibujuan.drip.server.servlet;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.validator.routines.EmailValidator;
import org.apache.commons.validator.routines.RegexValidator;
import org.eclipse.core.runtime.IPath;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.zizibujuan.drip.server.model.UserInfo;
import com.zizibujuan.drip.server.service.UserService;
import com.zizibujuan.drip.server.util.servlet.BaseServlet;
import com.zizibujuan.drip.server.util.servlet.RequestUtil;
import com.zizibujuan.drip.server.util.servlet.ResponseUtil;
import com.zizibujuan.drip.server.util.servlet.UserSession;

/**
 * 用户注册
 * @author jzw
 * @since 0.0.1
 */
public class UserServlet extends BaseServlet {

	private static final long serialVersionUID = 5222934801942017724L;
	
	private static final Logger logger = LoggerFactory.getLogger(UserServlet.class);
	
	private UserService userService;
	private List<String> errors;
	
	public UserServlet(){
		errors = new ArrayList<String>();
		userService = ServiceHolder.getDefault().getUserService();
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		if(!errors.isEmpty()){
			logger.warn("errors列表不为空，说明servlet只初始化一次");
			errors.clear();
		}
		
		traceRequest(req);
		IPath path = getPath(req);
		if(path.segmentCount() == 0){
			UserInfo userInfo = RequestUtil.fromJsonObject(req, UserInfo.class);
			String password = userInfo.getPassword();
			this.validate(userInfo);
			if(hasErrors()){
				ResponseUtil.toJSON(req, resp, errors, HttpServletResponse.SC_PRECONDITION_FAILED);
				return;
			}
			
			// 注册时会对密码加密，修改了userInfo#password的值
			userService.register(userInfo);
			// 注册成功之后，添加一个cookie，标识使用该电脑注册成功过
			// 以后每登录一次都修改一下这个cookie
			// XXX:暂时不提供记住密码功能
			Cookie cookie = new Cookie("zzbj_user", userInfo.getLoginName());
			cookie.setMaxAge(365*24*60*60);//一年有效
			resp.addCookie(cookie);
			// 注册成功之后，直接登录
			userInfo = userService.login(userInfo.getEmail(), password);
			if(userInfo != null){
				// 登录成功
				UserSession.setUser(req, userInfo);
				ResponseUtil.toJSON(req, resp, new HashMap<String, Object>());
			}else{
				// 注册成功，登录失败，返回登录页面
				//ResponseUtil.toJSON(req,
			}
			
			return;
		}
		super.doPost(req, resp);
	}

	private void validate(UserInfo userInfo) {
		String email = userInfo.getEmail().trim();
		if(email.isEmpty()){
			errors.add("请输入常用邮箱");
		}else if(email.length() > 50){
			errors.add("邮箱不能超过50个字符");
		}else if(!EmailValidator.getInstance().isValid(email)){
			errors.add("邮箱格式不正确");
		}else if(userService.emailIsUsed(email)){
			errors.add("该邮箱已注册，<a href=\"javascript:\">直接登录</a>");
		}
		
		
		String password = userInfo.getPassword();
		if(password.isEmpty()){
			errors.add("请输入密码");
		}else if(password.length() > 0 && password.trim().isEmpty()){
			errors.add("密码不能全为空格");
		}else if(password.length() < 6 || password.length() > 20){
			errors.add("密码长度应为6到20个字符");
		}else if(new RegexValidator("^\\d+$").isValid(password)){
			errors.add("密码不能全为数字");
		}else if(new RegexValidator("^[A-Za-z]+$").isValid(password)){
			errors.add("密码不能全为字母");
		}
		
		String loginName = userInfo.getLoginName().trim();
		if(loginName.isEmpty()){
			errors.add("请输入用户名");
		}else if(getChineseLength(loginName) > 20){
			errors.add("用户名不能多于20个字符");
		}else if(!new RegexValidator("^(?![-_])[a-zA-Z0-9_-]+$").isValid(loginName)){
			// 有关正则表达式的测试用例，LoginNameRegexTests.java
			errors.add("用户名只能包含英文字母，数字,-或_，不能以-或_开头，不区分大小写");
		}else if(userService.loginNameIsUsed(loginName)){
			errors.add("该用户名已注册，<a href=\"javascript:\">直接登录</a>");
		}
		
	}

	private int getChineseLength(String str){
		try {
			return str.getBytes("gb2312").length;
		} catch (UnsupportedEncodingException e) {
			return str.length();
		}
	}
	
	private boolean hasErrors(){
		return !errors.isEmpty();
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		traceRequest(req);
		IPath path = getPath(req);
		if(path.segmentCount() == 0) {
			// 从session中获取用户登录信息
			UserInfo loginInfo = (UserInfo) UserSession.getUser(req);
			if(loginInfo == null){
				// 用户未登录
				ResponseUtil.toJSON(req, resp, new HashMap<String, Object>(), HttpServletResponse.SC_UNAUTHORIZED);
				return;
			}
			ResponseUtil.toJSON(req, resp, loginInfo);
			return;
		}
		
		if(path.segmentCount() == 1){
			String loginName = path.segment(0);
			UserInfo loginInfo = userService.getByLoginName(loginName);
			ResponseUtil.toJSON(req, resp, loginInfo);
			return;
		}
		
		super.doGet(req, resp);
	}

	
}
