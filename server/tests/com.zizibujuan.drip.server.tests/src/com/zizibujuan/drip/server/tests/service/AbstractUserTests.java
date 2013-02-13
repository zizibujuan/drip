package com.zizibujuan.drip.server.tests.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import com.zizibujuan.drip.server.dao.mysql.DaoHolder;
import com.zizibujuan.drip.server.service.UserService;
import com.zizibujuan.drip.server.servlet.ServiceHolder;
import com.zizibujuan.drip.server.servlet.authentication.Oauth2Helper;
import com.zizibujuan.drip.server.util.OAuthConstants;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;

/**
 * 用户相关测试用例的抽象类
 * @author jzw
 * @since 0.0.1
 */
public abstract class AbstractUserTests {

	protected UserService userService = ServiceHolder.getDefault().getUserService();
	
	protected Long localUserId = null;
	protected Long connectUserId = null;
	
	protected int siteId = OAuthConstants.RENREN;
	protected String oauthUserId = "X1234567890";
	protected String nickName = "xman_nickName";
	protected String loginName = "xman_loginName";
	protected String sex = "1";
	protected String homeCityCode = "156130100";
	protected Date birthDay = null;
	
	public AbstractUserTests() {
		Calendar calendar = Calendar.getInstance();
		calendar.set(2013, 1, 1);
		birthDay = calendar.getTime();
	}
	
	/**
	 * 删除用户信息
	 * @param userId 第三方网站的用户标识
	 */
	protected void reset(){
		DataSource dataSource = DaoHolder.getDefault().getDataSourceService().getDataSource();
		
		// 删除关联信息标识
		String sql = "DELETE FROM DRIP_OAUTH_USER_MAP WHERE LOCAL_USER_ID=? AND CONNECT_USER_ID = ?";
		DatabaseUtil.update(dataSource, sql, localUserId, connectUserId);
		
		// 删除存储的第三方网站用户信息
		sql = "DELETE FROM DRIP_CONNECT_USER_INFO WHERE USER_ID = ?";
		DatabaseUtil.update(dataSource, sql, oauthUserId);
		
		// 删除本网站用户信息
		sql = "DELETE FROM DRIP_USER_INFO WHERE DBID = ?";
		DatabaseUtil.update(dataSource, sql, localUserId);
		
		sql = "DELETE FROM DRIP_USER_ATTRIBUTES WHERE USER_ID = ? AND IS_LOCAL_USER = ?";
		DatabaseUtil.update(dataSource, sql, connectUserId, false);
		
		// 取消关注自己
		sql = "DELETE FROM DRIP_USER_RELATION WHERE USER_ID = ? AND WATCH_USER_ID = ?";
		DatabaseUtil.update(dataSource, sql, connectUserId, connectUserId);
		
		// 删除用户头像
		sql = "DELETE FROM DRIP_USER_AVATAR WHERE USER_ID = ? AND IS_LOCAL_USER = ?";
		DatabaseUtil.update(dataSource, sql, connectUserId, false);
	}
	
	protected Map<String, Object> importUser() {
		Map<String, Object> userInfo = new HashMap<String, Object>();
		userInfo.put("siteId", siteId);
		userInfo.put("userId", oauthUserId);
		userInfo.put("loginName", loginName);
		userInfo.put("nickName", nickName);
		userInfo.put("sex", sex);
		userInfo.put("birthDay", birthDay);
		userInfo.put("homeCityCode", homeCityCode);
		
		// 头像
		List<Map<String,Object>> avatarList = new ArrayList<Map<String,Object>>();
		Oauth2Helper.addUserImage(avatarList,"tinyUrl","http://a",50,50);
		Oauth2Helper.addUserImage(avatarList,"headUrl","http://b",100,100);
		Oauth2Helper.addUserImage(avatarList,"mainUrl","http://c",200,200);
		userInfo.put("avatar", avatarList);
		
		
		// 确认一下数据都已经插入到各自的表中。
		return userService.importUser(userInfo);
	}
}
