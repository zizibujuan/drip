package com.zizibujuan.drip.server.servlet.connect;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.qq.connect.QQConnectException;
import com.qq.connect.api.OpenID;
import com.qq.connect.api.qzone.UserInfo;
import com.qq.connect.javabeans.AccessToken;
import com.qq.connect.javabeans.Avatar;
import com.qq.connect.javabeans.qzone.UserInfoBean;
import com.qq.connect.oauth.Oauth;
import com.zizibujuan.drip.server.model.UserBindInfo;
import com.zizibujuan.drip.server.service.UserBindService;
import com.zizibujuan.drip.server.service.UserService;
import com.zizibujuan.drip.server.servlet.ServiceHolder;
import com.zizibujuan.drip.server.util.CookieConstants;
import com.zizibujuan.drip.server.util.Gender;
import com.zizibujuan.drip.server.util.OAuthConstants;
import com.zizibujuan.drip.server.util.servlet.CookieUtil;
import com.zizibujuan.drip.server.util.servlet.UserSession;

/**
 * qq用户登录
 * 
 * @author jzw
 * @since 0.0.1
 */
public class QQUserConnect extends UserConnect {
	
	private static final Logger logger = LoggerFactory.getLogger(QQUserConnect.class);
	private UserService userService = ServiceHolder.getDefault().getUserService();
	private UserBindService userBindService = ServiceHolder.getDefault().getUserBindService();

	@Override
	protected void toLoginPage(HttpServletRequest req, HttpServletResponse resp) {
		try {
        	resp.sendRedirect(new Oauth().getAuthorizeURL(req));
        } catch (QQConnectException e) {
            logger.error("获取qq登录页面失败", e);
            
        } catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}

	@Override
	protected void login(HttpServletRequest req, HttpServletResponse resp,
			String code) throws IOException {
		try {
			AccessToken accessTokenObj = new Oauth().getAccessTokenByRequest(req);
			String accessToken = null;
			String openID = null;
			long tokenExpireIn = 0L;
			
			accessToken = accessTokenObj.getAccessToken();
			if(accessToken.equals("")){
				logger.error("没有获取到响应参数");
				return;
			}
		
			tokenExpireIn = accessTokenObj.getExpireIn();
			req.getSession().setAttribute("qq_access_token", accessToken);
			req.getSession().setAttribute("qq_token_expirein", tokenExpireIn);
			
			OpenID openIDObj = new OpenID(accessToken);
			openID = openIDObj.getUserOpenID();
			UserInfo qzoneUserInfo = new UserInfo(accessToken, openID);
			UserInfoBean qzoneUserInfoBean = qzoneUserInfo.getUserInfo();
			
			if(qzoneUserInfoBean.getRet() != 0){
				logger.error(qzoneUserInfoBean.getMsg());
				return;
			}
			
			Long dripUserId = null;
			// 判断第三方帐号是否与本网站帐号建立关联，如果没有，则先建立关联
			UserBindInfo userBindInfo = userBindService.get(OAuthConstants.QQ, openID);
			if(userBindInfo == null){
				userBindInfo = new UserBindInfo();
				userBindInfo.setOpenId(openID);
				userBindInfo.setSiteId(OAuthConstants.QQ);
				com.zizibujuan.drip.server.model.UserInfo dripUser = new com.zizibujuan.drip.server.model.UserInfo();
				dripUser.setNickName(qzoneUserInfoBean.getNickname());
				
				String sex = "";
				String qqGender = qzoneUserInfoBean.getGender();
				if(qqGender.equals("男")){
					sex = Gender.MALE;
				}else if(qqGender.equals("女")){
					sex = Gender.FEMALE;
				}else{
					sex = Gender.UNKNOWN;
				}
				
				dripUser.setSex(sex);
				
				Avatar qqAvatar = qzoneUserInfoBean.getAvatar();
				List<com.zizibujuan.drip.server.model.Avatar> avatars = new ArrayList<com.zizibujuan.drip.server.model.Avatar>();
				addAvatar(avatars, "figureurl", qqAvatar.getAvatarURL30(), 30, 30);
				addAvatar(avatars, "figureurl_1", qqAvatar.getAvatarURL50(), 50, 50);
				addAvatar(avatars, "figureurl_2", qqAvatar.getAvatarURL100(), 100, 100);
				dripUserId = userService.importUser(dripUser, userBindInfo, avatars);
			}else{
				dripUserId = userBindInfo.getUserId();
			}
			
			// FIXME:注意，暂时不支持第三方用户自动登录
			// 是不是应该在每次登录时，都记录下token和过期时间呢?
			com.zizibujuan.drip.server.model.UserInfo dripUserInfo = userService.login(dripUserId);
			UserSession.setUser(req, dripUserInfo);
			CookieUtil.set(resp, CookieConstants.LOGGED_IN, "1", null, -1);
			// 防止同一台电脑先使用drip用户登录，然后使用qq用户登录，要删除本网站的token
			// 这样就不会使用其他人的帐号自动登录
			// 同时也可以设置第三方网站的token，这样可以使用这些token自动登录
			CookieUtil.remove(req, resp, CookieConstants.ZZBJ_USER_TOKEN);
		} catch (QQConnectException e) {
			e.printStackTrace();
		}
		resp.sendRedirect("/");
	}
	
}
