package com.zizibujuan.drip.server.servlet;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.validator.routines.EmailValidator;
import org.apache.commons.validator.routines.RegexValidator;

import com.zizibujuan.useradmin.server.service.UserRelationService;
import com.zizibujuan.useradmin.server.service.UserService;
import com.zizibujuan.useradmin.server.servlets.UserAdminServiceHolder;
import com.zizibujuan.drip.server.util.servlet.BaseServlet;
import com.zizibujuan.drip.server.util.servlet.ResponseUtil;

/**
 * 用户
 * @author jinzw
 * @since 0.0.1
 */
public class UserServlet_OLD extends BaseServlet {

	private static final long serialVersionUID = -2073647707822751410L;
	private UserService userService = null;
	private UserRelationService userRelationService = null;
	
	public UserServlet_OLD() {
		this.userService = UserAdminServiceHolder.getDefault().getUserService();
		this.userRelationService = UserAdminServiceHolder.getDefault().getUserRelationService();
	}

	/**
	 * <pre>
	 * 传入的用户信息的格式为:
	 * 		email: 注册邮箱
	 * 		password: 登录密码
	 * 		repassword: 确认密码
	 * 		realName: 真实姓名
	 * </pre>
	 * 密码加密：MD5+salt
	 * TODO:注册用户，需要从邮箱中激活（还差一步功能）
	 * FIXME:注册用户的时候，用户名不能与email相同
	 */
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
//		traceRequest(req);
//		String pathInfo = req.getPathInfo();
//		if(isNullOrSeparator(pathInfo)){
//			Map<String,Object> userInfo = RequestUtil.fromJsonObject(req);
//			// 先做服务器端检验
//			if(isValid(req, resp, userInfo)){
//				// 通过校验之后再保存
//				userInfo.put("siteId", OAuthConstants.ZIZIBUJUAN);
//				userService.add(userInfo);
//				// 登录
//				LoginCommand.handleCommand(req, resp, userService, userInfo);
//			}else{
//				// 什么也不做
//			}
//			return;
//		}
		super.doPost(req, resp);
	}

	/**
	 * 服务器端校验用户注册信息是否有效
	 * @param req
	 * @param resp
	 * @param userInfo 注册信息
	 * @return 通过校验，则返回<code>true</code>；否则返回<code>false</code>
	 * @throws IOException 
	 */
	private boolean isValid(HttpServletRequest req, HttpServletResponse resp, Map<String, Object> userInfo) throws IOException {
		// 在该方法中，逐个校验，记录下所有的错误，然后一次性的输入到客户端
		// trim后都不为空,trim之后往map中再存一份
		Map<String,Object> result = new HashMap<String, Object>();
		Map<String,Object> login = checkLogin(userInfo);
		if(!login.isEmpty()){
			result.put("login", login);
		}
		Map<String,Object> password = checkPassword(userInfo);
		if(!password.isEmpty()){
			result.put("password", password);
		}
		Map<String,Object> repassword = checkRePassword(userInfo);
		if(!repassword.isEmpty()){
			result.put("repassword", repassword);
		}
		Map<String,Object> realName = checkRealName(userInfo);
		if(!realName.isEmpty()){
			result.put("realName", realName);
		}
		if(!result.isEmpty()){
			ResponseUtil.toJSON(req, resp, result, HttpServletResponse.SC_PRECONDITION_FAILED);
			return false;
		}else{
			return true;
		}
	}

	// 校验注册邮箱:
	//		注册邮箱不能为空
	//		是否有效的邮箱地址
	//		该邮箱是否已经被使用
	//		邮箱长度不能超过50个字符
	private Map<String,Object> checkLogin(Map<String,Object> userInfo){
		Map<String,Object> login = new HashMap<String, Object>();
		Object oEmail = userInfo.get("login");
		if(oEmail == null){
			login.put("missingMessage", "请输入正确的邮箱");
			login.put("promptMessage", "请输入正确的邮箱");
			login.put("invalidMessage", "请输入正确的邮箱");
		}else{
			String email = oEmail.toString().trim();
			if(email.isEmpty()){
				login.put("missingMessage", "请输入正确的邮箱");
				login.put("promptMessage", "请输入正确的邮箱");
				login.put("invalidMessage", "请输入正确的邮箱");
			}else if(!EmailValidator.getInstance().isValid(email)){
				login.put("missingMessage", "请输入正确的邮箱");
				login.put("promptMessage", "请输入正确的邮箱");
				login.put("invalidMessage", "请输入正确的邮箱");
			}else if(userService.emailIsUsed(email)){
				login.put("missingMessage", "请输入正确的邮箱");
				login.put("promptMessage", "该邮箱已被使用");
				login.put("invalidMessage", "该邮箱已被使用");
			}else if(email.length() > 50){
				login.put("missingMessage", "请输入正确的邮箱");
				login.put("promptMessage", "邮箱长度不能超过50个字符");
				login.put("invalidMessage", "邮箱长度不能超过50个字符");
			}
		}
		return login;
	}
	
	// 校验登录密码：
	//		密码不能为空
	//		密码不能全为空字符串
	//		密码长度在6到20位之间
	//		密码不能全为数字
	//		密码不能全为字母
	private Map<String,Object> checkPassword(Map<String,Object> userInfo){
		Map<String,Object> result = new HashMap<String, Object>();
		Object oPassword = userInfo.get("password");
		if(oPassword == null){
			result.put("missingMessage", "请输入登录密码");
			result.put("promptMessage", "密码长度应该在6到20位之间");
			result.put("invalidMessage", "请输入登录密码");
		}else{
			String password = oPassword.toString();
			if(oPassword.toString().trim().isEmpty()){
				result.put("missingMessage", "请输入登录密码");
				result.put("promptMessage", "密码不能全为空字符串");
				result.put("invalidMessage", "密码不能全为空字符串");
			}else if(password.isEmpty()){
				result.put("missingMessage", "请输入登录密码");
				result.put("promptMessage", "密码长度应该在6到20位之间");
				result.put("invalidMessage", "请输入登录密码");
			}else if(password.length()< 6 || password.length() > 20){
				result.put("missingMessage", "请输入登录密码");
				result.put("promptMessage", "密码长度应该在6到20位之间");
				result.put("invalidMessage", "密码长度应该在6到20位之间");
			}else if(new RegexValidator("^\\d+$").isValid(password)){
				result.put("missingMessage", "请输入登录密码");
				result.put("promptMessage", "密码不能全为数字");
				result.put("invalidMessage", "密码不能全为数字");
			}else if(new RegexValidator("^[A-Za-z]+$").isValid(password)){
				result.put("missingMessage", "请输入登录密码");
				result.put("promptMessage", "密码不能全为字母");
				result.put("invalidMessage", "密码不能全为字母");
			}
		}
		return result;
	}
	
	// 校验确认密码
	//		密码不能为空
	//		确认密码的值要与登录密码的值相同
	private Map<String, Object> checkRePassword(Map<String, Object> userInfo) {
		Map<String,Object> result = new HashMap<String, Object>();
		Object oRePassword = userInfo.get("repassword");
		if(oRePassword == null){
			result.put("missingMessage", "请输入确认密码");
			result.put("promptMessage", "请输入确认密码");
			result.put("invalidMessage", "两次密码不一致");
		}else{
			String repassword = oRePassword.toString();
			if(repassword.isEmpty()){
				result.put("missingMessage", "请输入确认密码");
				result.put("promptMessage", "请输入确认密码");
				result.put("invalidMessage", "两次密码不一致");
			}else if(!repassword.equals(userInfo.get("password"))){
				result.put("missingMessage", "请输入确认密码");
				result.put("promptMessage", "请输入确认密码");
				result.put("invalidMessage", "两次密码不一致");
			}
		}
		return result;
	}
		
	// 校验真实姓名
	//		真实姓名不能为空
	//		真实姓名不能全为空格
	//		真实姓名的字符必须大于1， 小于10
	private Map<String, Object> checkRealName(Map<String, Object> userInfo) {
		Map<String,Object> result = new HashMap<String, Object>();
		Object oRealName = userInfo.get("realName");
		if(oRealName == null){
			result.put("missingMessage", "请输入您的姓名,便于同学找到您");
			result.put("promptMessage", "请输入您的姓名,便于同学找到您");
			result.put("invalidMessage", "姓名无效");
		}else{
			String realName = oRealName.toString();
			if(realName.isEmpty() || realName.trim().isEmpty()){
				result.put("missingMessage", "请输入您的姓名,便于同学找到您");
				result.put("promptMessage", "请输入您的姓名,便于同学找到您");
				result.put("invalidMessage", "姓名无效");
			}else if(realName.trim().length() <2 || realName.trim().length() > 10){
				result.put("missingMessage", "请输入您的姓名,便于同学找到您");
				result.put("promptMessage", "请输入您的姓名,便于同学找到您");
				result.put("invalidMessage", "姓名无效");
			}
		}
		return result;
	}

	/**
	 * 根据用户的数字帐号获取可以公开的用户信息，如果没有传入数字帐号，则获取登录用户信息。
	 * 只有登录用户才可以使用该服务。
	 */
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
//		traceRequest(req);
//		String pathInfo = req.getPathInfo();
//		Map<String,Object> userInfo = null;
//		if(pathInfo == null || pathInfo.equals("/")){
//			String type = req.getParameter("type");
//			if(type.endsWith("statistics")){
//				// 获取用户信息，其中包含该用户的所有统计信息
//				Long localUserId = UserSession.getLocalUserId(req);
//				userInfo = userService.getLocalUserStatistics(localUserId);
//			}else{
//				userInfo = UserSession.getUser(req);
//			}
//			ResponseUtil.toJSON(req, resp, userInfo);
//			return;
//		}else if(pathInfo != null && !pathInfo.equals("/")){
//			String type = req.getParameter("type");
//			Long digitalId = Long.valueOf(pathInfo.split("/")[1]);
//			if(type != null && type.equals("simple")){
//				userInfo = userService.getSimpleInfo(digitalId);
//			}else{
//				// 根据数字帐号获取使用用户信息的用户帐号
//				userInfo = userService.getSimpleInfo(digitalId);
//				Long watchedLocalUserId = Long.valueOf(userInfo.get("localUserId").toString());
//				// 获取登录用户与该用户之间的关系,这里还缺少参数。因为一个帐号绑定多个网站帐号，或者只需要本帐号与用户的任一帐号关联即可。
//				// 以下代码只有获取关联关系时才用。
//				Long userRelationId = userRelationService.getRelationId(UserSession.getLocalUserId(req),watchedLocalUserId);
//				if(userRelationId != null){
//					userInfo.put("userRelationId", userRelationId);
//				}
//			}
//			
//			ResponseUtil.toJSON(req, resp, userInfo);
//			return;
//		}
		super.doGet(req, resp);
	}
	
	
}
