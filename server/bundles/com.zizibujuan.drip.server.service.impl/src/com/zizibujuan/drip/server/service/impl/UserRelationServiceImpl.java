package com.zizibujuan.drip.server.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.zizibujuan.drip.server.dao.UserRelationDao;
import com.zizibujuan.drip.server.service.UserRelationService;

/**
 * 用户关系实现类
 * @author jzw
 * @since 0.0.1
 */
public class UserRelationServiceImpl implements UserRelationService {
	private static final Logger logger = LoggerFactory.getLogger(UserRelationServiceImpl.class);
	private UserRelationDao userRelationDao;
	
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
}
