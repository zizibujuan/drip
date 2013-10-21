package com.zizibujuan.drip.server.tests.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import javax.sql.DataSource;

import com.zizibujuan.dbaccess.mysql.service.DataSourceHolder;
import com.zizibujuan.drip.server.model.Avatar;
import com.zizibujuan.drip.server.model.UserBindInfo;
import com.zizibujuan.drip.server.model.UserInfo;
import com.zizibujuan.drip.server.service.UserService;
import com.zizibujuan.drip.server.servlet.ServiceHolder;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;

/**
 * 用户相关测试用例的抽象类
 * @author jzw
 * @since 0.0.1
 */
public abstract class AbstractUserTests{

	protected UserService userService = ServiceHolder.getDefault().getUserService();
	protected DataSource dataSource = DataSourceHolder.getDefault().getDataSourceService().getDataSource();
	
//	protected int siteId = OAuthConstants.RENREN;
//	protected String openId = "X1234567890";
//	protected String nickName = "xman_nickName";
//	protected String loginName = "xman_loginName";
//	protected String sex = "1";
//	protected String homeCityCode = "156130100";
//	protected Date birthday = null;
	
	public AbstractUserTests() {
		Calendar calendar = Calendar.getInstance();
		calendar.set(2013, 1, 1);
		//birthday = calendar.getTime();
	}
	
	protected Long importUser(int siteId, String openId, String nickName, String sex) {
		UserInfo userInfo = new UserInfo();
		userInfo.setNickName(nickName);
		userInfo.setSex(sex);
		
		UserBindInfo userBindInfo = new UserBindInfo();
		userBindInfo.setOpenId(openId);
		userBindInfo.setSiteId(siteId);
		
		List<Avatar> avatars = new ArrayList<Avatar>();
		Avatar a1 = new Avatar();
		a1.setUrl("http://a");
		a1.setUrlName("tinyUrl");
		a1.setHeight(50);
		a1.setWidth(50);
		avatars.add(a1);
		Avatar a2 = new Avatar();
		a2.setUrl("http://b");
		a2.setUrlName("headUrl");
		a2.setHeight(100);
		a2.setWidth(100);
		avatars.add(a2);
		
		// 确认一下数据都已经插入到各自的表中。
		Long userId = userService.importUser(userInfo, userBindInfo, avatars);
		return userId;
	}
	
	/**
	 * 删除用户信息
	 * @param userId 第三方网站的用户标识
	 */
	protected void deleteTestUser(Long userId){
		if(userId == null)return;
		
		// 删除关联信息标识
		String sql = "DELETE FROM DRIP_USER_BIND WHERE USER_ID = ?";
		DatabaseUtil.update(dataSource, sql, userId);
		
		// 删除存储的第三方网站用户信息
		sql = "DELETE FROM DRIP_USER_INFO WHERE DBID = ?";
		DatabaseUtil.update(dataSource, sql, userId);
		
		sql = "DELETE FROM DRIP_USER_ATTRIBUTES WHERE USER_ID = ?";
		DatabaseUtil.update(dataSource, sql, userId);
		
		// 取消关注自己
		sql = "DELETE FROM DRIP_USER_RELATION WHERE USER_ID = ? AND WATCH_USER_ID = ?";
		DatabaseUtil.update(dataSource, sql, userId, userId);
		
		// 删除用户头像
		sql = "DELETE FROM DRIP_USER_AVATAR WHERE USER_ID = ?";
		DatabaseUtil.update(dataSource, sql, userId);
		
		// 删除为本网站用户生成的初始统计信息
		sql = "DELETE FROM DRIP_USER_STATISTICS WHERE USER_ID = ?";
		DatabaseUtil.update(dataSource, sql, userId);
	}
	
}
