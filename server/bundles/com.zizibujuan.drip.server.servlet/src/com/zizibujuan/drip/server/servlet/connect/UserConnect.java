package com.zizibujuan.drip.server.servlet.connect;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.zizibujuan.drip.server.model.Avatar;

/**
 * 使用第三方网站帐号登录的抽象类
 * 
 * @author jzw
 * @since 0.0.1
 */
public abstract class UserConnect {

	/**
	 * 登录功能被第三方网站托管
	 * 
	 * @param req
	 * @param resp
	 * @throws IOException 
	 */
	public void manager(HttpServletRequest req, HttpServletResponse resp) throws IOException{
		String code = req.getParameter("code");
		if(code != null && !code.isEmpty()){
			login(req, resp, code);
		}else{
			toLoginPage(req, resp);
		}
	}

	protected abstract void toLoginPage(HttpServletRequest req, HttpServletResponse resp);

	protected abstract void login(HttpServletRequest req, HttpServletResponse resp, String code) throws IOException;

	protected void addAvatar(List<Avatar> avatars, String urlName, String url,
			int width, int height) {
		Avatar avatar = new Avatar();
		avatar.setHeight(height);
		avatar.setWidth(width);
		avatar.setUrlName(urlName);
		avatar.setUrl(url);
		avatars.add(avatar);
	}
}
