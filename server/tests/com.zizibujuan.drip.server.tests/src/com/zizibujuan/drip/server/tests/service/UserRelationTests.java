package com.zizibujuan.drip.server.tests.service;

import java.util.HashMap;
import java.util.Map;

import javax.sql.DataSource;

import junit.framework.Assert;

import org.junit.Test;

import com.zizibujuan.dbaccess.mysql.service.DataSourceHolder;
import com.zizibujuan.drip.server.service.UserRelationService;
import com.zizibujuan.drip.server.service.UserService;
import com.zizibujuan.drip.server.servlet.ServiceHolder;
import com.zizibujuan.drip.server.util.OAuthConstants;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;

/**
 * 用户关系测试用例
 * @author jzw
 * @since 0.0.1
 */
public class UserRelationTests {

	private UserService userService = ServiceHolder.getDefault().getUserService();
	private UserRelationService userRelationService = ServiceHolder.getDefault().getUserRelationService();
	protected DataSource dataSource = DataSourceHolder.getDefault().getDataSourceService().getDataSource();
	// 三个本地用户
	@Test
	public void testFollow_Three_Local_User(){
		Long userId1 = null;
		Long userId2 = null;
		Long userId3 = null;
		Long digitalId1 = null;
		Long digitalId2 = null;
		Long digitalId3 = null;
		try{
			Map<String, Object> user1 = new HashMap<String, Object>();
			user1.put("login", "XXXaaa@aaa.com");
			user1.put("password", "123qaz");
			user1.put("repassword", "123qaz");
			user1.put("realName", "XXXaaa");
			user1.put("siteId", OAuthConstants.ZIZIBUJUAN);
			userId1 = userService.add(user1);
			digitalId1 = getDigitalId(dataSource,userId1);
			
			Map<String, Object> user2 = new HashMap<String, Object>();
			user2.put("login", "XXXbbb@bbb.com");
			user2.put("password", "123qaz");
			user2.put("repassword", "123qaz");
			user2.put("realName", "XXXbbb");
			user2.put("siteId", OAuthConstants.ZIZIBUJUAN);
			userId2 = userService.add(user2);
			digitalId2 = getDigitalId(dataSource,userId2);
			
			Map<String, Object> user3 = new HashMap<String, Object>();
			user3.put("login", "XXXccc@ccc.com");
			user3.put("password", "123qaz");
			user3.put("repassword", "123qaz");
			user3.put("realName", "XXXccc");
			user3.put("siteId", OAuthConstants.ZIZIBUJUAN);
			userId3 = userService.add(user3);
			digitalId3 = getDigitalId(dataSource,userId3);
			
			assertNoFanAndNoFollow(digitalId1, digitalId2, digitalId3);
			
			// 因为本地用户localUserId == connectUserId
			// userId1关注user2
			try{
				userRelationService.follow(userId1, userId2);
				// user2有一个粉丝
				Assert.assertTrue(userRelationService.getFollowers(null, digitalId1, digitalId1).size()==0);
				Assert.assertTrue(userRelationService.getFollowers(null, digitalId1, digitalId2).size()==1);
				Assert.assertTrue(userRelationService.getFollowers(null, digitalId1, digitalId3).size()==0);
				
				Assert.assertTrue(userRelationService.getFollowers(null, digitalId2, digitalId1).size()==0);
				Assert.assertTrue(userRelationService.getFollowers(null, digitalId2, digitalId2).size()==1);
				Assert.assertTrue(userRelationService.getFollowers(null, digitalId2, digitalId3).size()==0);
				
				Assert.assertTrue(userRelationService.getFollowers(null, digitalId3, digitalId1).size()==0);
				Assert.assertTrue(userRelationService.getFollowers(null, digitalId3, digitalId2).size()==1);
				Assert.assertTrue(userRelationService.getFollowers(null, digitalId3, digitalId3).size()==0);
				// user1有一个关注的人
				Assert.assertTrue(userRelationService.getFollowing(null, digitalId1, digitalId1).size()==1);
				Assert.assertTrue(userRelationService.getFollowing(null, digitalId1, digitalId2).size()==0);
				Assert.assertTrue(userRelationService.getFollowing(null, digitalId1, digitalId3).size()==0);
				
				Assert.assertTrue(userRelationService.getFollowing(null, digitalId2, digitalId1).size()==1);
				Assert.assertTrue(userRelationService.getFollowing(null, digitalId2, digitalId2).size()==0);
				Assert.assertTrue(userRelationService.getFollowing(null, digitalId2, digitalId3).size()==0);
				
				Assert.assertTrue(userRelationService.getFollowing(null, digitalId3, digitalId1).size()==1);
				Assert.assertTrue(userRelationService.getFollowing(null, digitalId3, digitalId2).size()==0);
				Assert.assertTrue(userRelationService.getFollowing(null, digitalId3, digitalId3).size()==0);
			}finally{
				// user1取消对user2的关注
				userRelationService.unFollow(userId1, userId2);
			}
			assertNoFanAndNoFollow(digitalId1, digitalId2, digitalId3);
			
			try{
				// user2关注user1， user3关注user1
				userRelationService.follow(userId2, userId1);
				userRelationService.follow(userId3, userId1);
				// user1有两个粉丝
				Assert.assertTrue(userRelationService.getFollowers(null, digitalId1, digitalId1).size()==2);
				Assert.assertTrue(userRelationService.getFollowers(null, digitalId1, digitalId2).size()==0);
				Assert.assertTrue(userRelationService.getFollowers(null, digitalId1, digitalId3).size()==0);
				
				Assert.assertTrue(userRelationService.getFollowers(null, digitalId2, digitalId1).size()==2);
				Assert.assertTrue(userRelationService.getFollowers(null, digitalId2, digitalId2).size()==0);
				Assert.assertTrue(userRelationService.getFollowers(null, digitalId2, digitalId3).size()==0);
				
				Assert.assertTrue(userRelationService.getFollowers(null, digitalId3, digitalId1).size()==2);
				Assert.assertTrue(userRelationService.getFollowers(null, digitalId3, digitalId2).size()==0);
				Assert.assertTrue(userRelationService.getFollowers(null, digitalId3, digitalId3).size()==0);
				// user2和user3各有一个关注的人
				Assert.assertTrue(userRelationService.getFollowing(null, digitalId1, digitalId1).size()==0);
				Assert.assertTrue(userRelationService.getFollowing(null, digitalId1, digitalId2).size()==1);
				Assert.assertTrue(userRelationService.getFollowing(null, digitalId1, digitalId3).size()==1);
				
				Assert.assertTrue(userRelationService.getFollowing(null, digitalId2, digitalId1).size()==0);
				Assert.assertTrue(userRelationService.getFollowing(null, digitalId2, digitalId2).size()==1);
				Assert.assertTrue(userRelationService.getFollowing(null, digitalId2, digitalId3).size()==1);
				
				Assert.assertTrue(userRelationService.getFollowing(null, digitalId3, digitalId1).size()==0);
				Assert.assertTrue(userRelationService.getFollowing(null, digitalId3, digitalId2).size()==1);
				Assert.assertTrue(userRelationService.getFollowing(null, digitalId3, digitalId3).size()==1);
			}finally{
				userRelationService.unFollow(userId2, userId1);
				userRelationService.unFollow(userId3, userId1);
			}
			assertNoFanAndNoFollow(digitalId1, digitalId2, digitalId3);
			try{
				// 互粉
				userRelationService.follow(userId2, userId1);
				userRelationService.follow(userId3, userId1);
				userRelationService.follow(userId1, userId2);
				userRelationService.follow(userId1, userId3);
				// user1有两个粉丝
				Assert.assertTrue(userRelationService.getFollowers(null, digitalId1, digitalId1).size()==2);
				Assert.assertTrue(userRelationService.getFollowers(null, digitalId1, digitalId2).size()==1);
				Assert.assertTrue(userRelationService.getFollowers(null, digitalId1, digitalId3).size()==1);
				
				Assert.assertTrue(userRelationService.getFollowers(null, digitalId2, digitalId1).size()==2);
				Assert.assertTrue(userRelationService.getFollowers(null, digitalId2, digitalId2).size()==1);
				Assert.assertTrue(userRelationService.getFollowers(null, digitalId2, digitalId3).size()==1);
				
				Assert.assertTrue(userRelationService.getFollowers(null, digitalId3, digitalId1).size()==2);
				Assert.assertTrue(userRelationService.getFollowers(null, digitalId3, digitalId2).size()==1);
				Assert.assertTrue(userRelationService.getFollowers(null, digitalId3, digitalId3).size()==1);
				// user2和user3各有一个关注的人
				Assert.assertTrue(userRelationService.getFollowing(null, digitalId1, digitalId1).size()==2);
				Assert.assertTrue(userRelationService.getFollowing(null, digitalId1, digitalId2).size()==1);
				Assert.assertTrue(userRelationService.getFollowing(null, digitalId1, digitalId3).size()==1);
				
				Assert.assertTrue(userRelationService.getFollowing(null, digitalId2, digitalId1).size()==2);
				Assert.assertTrue(userRelationService.getFollowing(null, digitalId2, digitalId2).size()==1);
				Assert.assertTrue(userRelationService.getFollowing(null, digitalId2, digitalId3).size()==1);
				
				Assert.assertTrue(userRelationService.getFollowing(null, digitalId3, digitalId1).size()==2);
				Assert.assertTrue(userRelationService.getFollowing(null, digitalId3, digitalId2).size()==1);
				Assert.assertTrue(userRelationService.getFollowing(null, digitalId3, digitalId3).size()==1);
			}finally{
				userRelationService.unFollow(userId2, userId1);
				userRelationService.unFollow(userId3, userId1);
				userRelationService.unFollow(userId1, userId2);
				userRelationService.unFollow(userId1, userId3);
			}
			assertNoFanAndNoFollow(digitalId1, digitalId2, digitalId3);
			
		}finally{
			// 删除三个用户
			deleteLoacalUser(userId1, digitalId1);
			deleteLoacalUser(userId2, digitalId2);
			deleteLoacalUser(userId3, digitalId3);
		}
	}

	private void assertNoFanAndNoFollow(Long digitalId1, Long digitalId2,
			Long digitalId3) {
		// 没有粉丝
		Assert.assertTrue(userRelationService.getFollowers(null, digitalId1, digitalId1).size()==0);
		Assert.assertTrue(userRelationService.getFollowers(null, digitalId1, digitalId2).size()==0);
		Assert.assertTrue(userRelationService.getFollowers(null, digitalId1, digitalId3).size()==0);
		
		Assert.assertTrue(userRelationService.getFollowers(null, digitalId2, digitalId1).size()==0);
		Assert.assertTrue(userRelationService.getFollowers(null, digitalId2, digitalId2).size()==0);
		Assert.assertTrue(userRelationService.getFollowers(null, digitalId2, digitalId3).size()==0);
		
		Assert.assertTrue(userRelationService.getFollowers(null, digitalId3, digitalId1).size()==0);
		Assert.assertTrue(userRelationService.getFollowers(null, digitalId3, digitalId2).size()==0);
		Assert.assertTrue(userRelationService.getFollowers(null, digitalId3, digitalId3).size()==0);
		
		// 没有关注的人
		Assert.assertTrue(userRelationService.getFollowing(null, digitalId1, digitalId1).size()==0);
		Assert.assertTrue(userRelationService.getFollowing(null, digitalId1, digitalId2).size()==0);
		Assert.assertTrue(userRelationService.getFollowing(null, digitalId1, digitalId3).size()==0);
		
		Assert.assertTrue(userRelationService.getFollowing(null, digitalId2, digitalId1).size()==0);
		Assert.assertTrue(userRelationService.getFollowing(null, digitalId2, digitalId2).size()==0);
		Assert.assertTrue(userRelationService.getFollowing(null, digitalId2, digitalId3).size()==0);
		
		Assert.assertTrue(userRelationService.getFollowing(null, digitalId3, digitalId1).size()==0);
		Assert.assertTrue(userRelationService.getFollowing(null, digitalId3, digitalId2).size()==0);
		Assert.assertTrue(userRelationService.getFollowing(null, digitalId3, digitalId3).size()==0);
	}
	
	// TODO:三个renren用户
	
	// TODO:一个本地用户，一个renren用户，一个qq用户
	
	private void deleteLoacalUser(Long localUserId, Long digitalId){
		if(localUserId == null)return;
		
		// 删除关联信息标识
		String sql = "DELETE FROM DRIP_USER_BIND WHERE LOCAL_USER_ID=? AND BIND_USER_ID = ?";
		DatabaseUtil.update(dataSource, sql, localUserId, localUserId);
		
		// 删除本网站用户信息
		sql = "DELETE FROM DRIP_GLOBAL_USER_INFO WHERE DBID = ?";
		DatabaseUtil.update(dataSource, sql, localUserId);
		
		sql = "DELETE FROM DRIP_USER_ATTRIBUTES WHERE GLOBAL_USER_ID = ?";
		DatabaseUtil.update(dataSource, sql, localUserId);
		
		// 取消关注自己
		sql = "DELETE FROM DRIP_USER_RELATION WHERE USER_ID = ? AND WATCH_USER_ID = ?";
		DatabaseUtil.update(dataSource, sql, localUserId, localUserId);
		
		// 删除用户头像
		sql = "DELETE FROM DRIP_USER_AVATAR WHERE GLOBAL_USER_ID = ?";
		DatabaseUtil.update(dataSource, sql, localUserId);
		
		// 删除为本网站用户生成的初始统计信息
		sql = "DELETE FROM DRIP_LOCAL_USER_STATISTICS WHERE GLOBAL_USER_ID = ?";
		DatabaseUtil.update(dataSource, sql, localUserId);
		
		// 将被使用的数字帐号置为未使用
		sql = "UPDATE DRIP_USER_NUMBER SET USE_TOKEN = ?, APPLY_TIME = ?  WHERE NUM = ?";
		DatabaseUtil.update(dataSource, sql,null,null, digitalId);
	}

	private Long getDigitalId(DataSource dataSource, Long localUserId) {
		String sqlGetDigitalId = "SELECT DIGITAL_ID FROM DRIP_GLOBAL_USER_INFO WHERE DBID=?";
		Long digitalId = DatabaseUtil.queryForLong(dataSource, sqlGetDigitalId, localUserId);
		return digitalId;
	}
}
