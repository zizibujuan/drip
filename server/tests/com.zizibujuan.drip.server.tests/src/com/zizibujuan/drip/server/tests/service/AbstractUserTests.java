package com.zizibujuan.drip.server.tests.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import com.zizibujuan.dbaccess.mysql.service.DataSourceHolder;
import com.zizibujuan.drip.server.service.UserService;
import com.zizibujuan.drip.server.servlet.ServiceHolder;
import com.zizibujuan.drip.server.servlet.connect.Oauth2Helper;
import com.zizibujuan.drip.server.util.OAuthConstants;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;

/**
 * 用户相关测试用例的抽象类
 * @author jzw
 * @since 0.0.1
 */
public abstract class AbstractUserTests{

	protected UserService userService = ServiceHolder.getDefault().getUserService();
	protected DataSource dataSource = DataSourceHolder.getDefault().getDataSourceService().getDataSource();
	
	protected Long localGlobalUserId = null;
	protected Long connectGlobalUserId = null;
	protected Long digitalId = null;
	
	protected int siteId = OAuthConstants.RENREN;
	protected String openId = "X1234567890";
	protected String nickName = "xman_nickName";
	protected String loginName = "xman_loginName";
	protected String sex = "1";
	protected String homeCityCode = "156130100";
	protected Date birthday = null;
	
	public AbstractUserTests() {
		Calendar calendar = Calendar.getInstance();
		calendar.set(2013, 1, 1);
		birthday = calendar.getTime();
	}
	
	protected Map<String, Object> importUser() {
		Map<String, Object> userInfo = new HashMap<String, Object>();
		userInfo.put("siteId", siteId);
		userInfo.put("openId", openId);
		userInfo.put("loginName", loginName);
		userInfo.put("nickName", nickName);
		userInfo.put("sex", sex);
		userInfo.put("birthday", birthday);
		userInfo.put("homeCityCode", homeCityCode);
		
		// 头像
		List<Map<String,Object>> avatarList = new ArrayList<Map<String,Object>>();
		Oauth2Helper.addUserImage(avatarList,"tinyUrl","http://a",50,50);
		Oauth2Helper.addUserImage(avatarList,"headUrl","http://b",100,100);
		Oauth2Helper.addUserImage(avatarList,"mainUrl","http://c",200,200);
		userInfo.put("avatar", avatarList);
		
		
		// 确认一下数据都已经插入到各自的表中。
		Map<String,Object> result = userService.importUser(userInfo);
		localGlobalUserId = Long.valueOf(result.get("localUserId").toString());
		connectGlobalUserId = Long.valueOf(result.get("connectUserId").toString());
		digitalId = Long.valueOf(result.get("digitalId").toString());
		return result;
	}
	
	/**
	 * 删除用户信息
	 * @param userId 第三方网站的用户标识
	 */
	protected void deleteTestUser(){
		
		// 删除关联信息标识
		String sql = "DELETE FROM DRIP_USER_BIND WHERE LOCAL_USER_ID=? AND BIND_USER_ID = ?";
		DatabaseUtil.update(dataSource, sql, localGlobalUserId, connectGlobalUserId);
		
		// 删除存储的第三方网站用户信息
		sql = "DELETE FROM DRIP_GLOBAL_USER_INFO WHERE DBID = ?";
		DatabaseUtil.update(dataSource, sql, connectGlobalUserId);
		
		// 删除本网站用户信息
		sql = "DELETE FROM DRIP_GLOBAL_USER_INFO WHERE DBID = ?";
		DatabaseUtil.update(dataSource, sql, localGlobalUserId);
		
		sql = "DELETE FROM DRIP_USER_ATTRIBUTES WHERE GLOBAL_USER_ID = ?";
		DatabaseUtil.update(dataSource, sql, connectGlobalUserId);
		
		// 取消关注自己
		sql = "DELETE FROM DRIP_USER_RELATION WHERE USER_ID = ? AND WATCH_USER_ID = ?";
		DatabaseUtil.update(dataSource, sql, connectGlobalUserId, connectGlobalUserId);
		
		// 删除用户头像
		sql = "DELETE FROM DRIP_USER_AVATAR WHERE GLOBAL_USER_ID = ?";
		DatabaseUtil.update(dataSource, sql, connectGlobalUserId);
		
		// 删除为本网站用户生成的初始统计信息
		sql = "DELETE FROM DRIP_LOCAL_USER_STATISTICS WHERE GLOBAL_USER_ID = ?";
		DatabaseUtil.update(dataSource, sql, localGlobalUserId);
		
		// 将被使用的数字帐号置为未使用
		sql = "UPDATE DRIP_USER_NUMBER SET USE_TOKEN = ?, APPLY_TIME = ?  WHERE NUM = ?";
		DatabaseUtil.update(dataSource, sql,null,null, digitalId);
	}
	
}
