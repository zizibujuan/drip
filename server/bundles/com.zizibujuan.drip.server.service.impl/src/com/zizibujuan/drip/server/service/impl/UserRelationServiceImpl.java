package com.zizibujuan.drip.server.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.zizibujuan.drip.server.dao.UserBindDao;
import com.zizibujuan.drip.server.dao.UserRelationDao;
import com.zizibujuan.drip.server.service.UserRelationService;
import com.zizibujuan.drip.server.service.UserService;
import com.zizibujuan.drip.server.util.PageInfo;

/**
 * 用户关系实现类
 * @author jzw
 * @since 0.0.1
 */
public class UserRelationServiceImpl implements UserRelationService {
	private static final Logger logger = LoggerFactory.getLogger(UserRelationServiceImpl.class);
	private UserRelationDao userRelationDao;
	private UserBindDao userBindDao;
	private UserService userService;
	
	@Override
	public Long getRelationId(Long userId, Long watchUserId) {
		return userRelationDao.getRelationId(userId, watchUserId);
	}
	
	@Override
	public void follow(Long userId, Long followUserId) {
		// 判断用户是否已被关注，如果已被关注，则不再重复关注
		if(userRelationDao.getRelationId(userId, followUserId) == null){
			userRelationDao.watch(userId, followUserId);
		}
	}

	@Override
	public void unFollow(Long userId, Long followUserId) {
		userRelationDao.delete(userId, followUserId);
	}
	
	@Override
	public List<Map<String, Object>> getFollowing(PageInfo pageInfo, Long localUserId) {
		List<Map<String, Object>> userIds = userRelationDao.getFollowing(pageInfo, localUserId);
		List<Map<String, Object>> users = new ArrayList<Map<String,Object>>();
		for(Map<String, Object> each : userIds){
			Long _localUserId = Long.valueOf(each.get("following").toString());
			// 获取用户详情。注意会有多个第三方网站用户与本地用户关联，需要设置一个获取用户详情的关联帐号。
			
		}
		return users;
	}

	@Override
	public List<Map<String, Object>> getFollowers(PageInfo pageInfo, Long localUserId) {
		// TODO：添加根据用户标识，获取用户详细信息的方法
		return userRelationDao.getFollowers(pageInfo, localUserId);
	}

	public void setUserRelationDao(UserRelationDao userRelationDao) {
		logger.info("注入userRelationDao");
		this.userRelationDao = userRelationDao;
	}
	
	public void unsetUserRelationDao(UserRelationDao userRelationDao) {
		if (this.userRelationDao == userRelationDao) {
			logger.info("注销userRelationDao");
			this.userRelationDao = null;
		}
	}

	public void setUserBindDao(UserBindDao userBindDao) {
		logger.info("注入userBindDao");
		this.userBindDao = userBindDao;
	}
	
	public void unsetUserBindDao(UserBindDao userBindDao) {
		if (this.userBindDao == userBindDao) {
			logger.info("注销userBindDao");
			this.userBindDao = null;
		}
	}
	
	public void setUserService(UserService userService) {
		logger.info("注入userService");
		this.userService = userService;
	}

	public void unsetUserService(UserService userService) {
		if (this.userService == userService) {
			logger.info("注销userService");
			this.userService = null;
		}
	}
}
