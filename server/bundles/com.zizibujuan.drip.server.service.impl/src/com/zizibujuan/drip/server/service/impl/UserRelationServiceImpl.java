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
import com.zizibujuan.drip.server.util.RelationType;

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
	
	// TODO:获取直接把第三方的用户信息为本网站用户copy一份，查询的时候就没有那么绕了。
	@Override
	public List<Map<String, Object>> getFollowing(PageInfo pageInfo, Long loginDigitalId, Long digitalId) {
		// 获取本地用户帐号所有关联的用户关注的人
		// 然后获取每个用户的显示用户信息的帐号
		// 获取用户详细信息。
		List<Map<String, Object>> userIds = userRelationDao.getFollowing(pageInfo, digitalId);
		List<Map<String, Object>> users = new ArrayList<Map<String,Object>>();
		for(Map<String, Object> each : userIds){
			Long followingConnectUserId = Long.valueOf(each.get("following").toString());
			// 获取connectUserId关联的本地用户标识
			Long followingLocalUserId = userBindDao.getLocalUserId(followingConnectUserId);
			// 获取本地用户引用的第三方用户标识（使用该用户的详细信息在界面上显示）
			Map<String,Object> userInfo = userService.getPublicInfo(followingLocalUserId);
			String watched = null;
			if(loginDigitalId.equals(digitalId)){
				watched = RelationType.FOLLOWED;// 这里查的都是我关注的人，所以都为true
			}else{
				// 登录用户查看其他人关注的人
				Long watchedDigitalId = Long.valueOf(userInfo.get("digitalId").toString());
				if(loginDigitalId.equals(watchedDigitalId)){
					watched = RelationType.SELF; //自我不显式关注
				}else{
					// 查看digitalId关注的人，我有没有关注
					if(userRelationDao.isWatched(loginDigitalId, followingConnectUserId)){
						watched = RelationType.FOLLOWED;
					}else{
						watched = RelationType.UNFOLLOWED;
					}
				}
				
			}
			userInfo.put("watched", watched);// 这里查的都是我关注的人，所以都为true
			
			users.add(userInfo);
		}
		return users;
	}

	// TODO:添加测试用例
	@Override
	public List<Map<String, Object>> getFollowers(PageInfo pageInfo, Long loginDigitalId, Long digitalId) {
		List<Map<String, Object>> userIds = userRelationDao.getFollowers(pageInfo, digitalId);
		List<Map<String, Object>> users = new ArrayList<Map<String,Object>>();
		for(Map<String, Object> each : userIds){
			Long connectUserId = Long.valueOf(each.get("follower").toString());
			// 获取connectUserId关联的本地用户标识
			Long localUserId = userBindDao.getLocalUserId(connectUserId);
			// 获取本地用户引用的第三方用户标识（使用该用户的详细信息在界面上显示）
			Map<String,Object> userInfo = userService.getPublicInfo(localUserId);
			String watched = "";
			if(loginDigitalId.equals(digitalId)){
				// 我查看我的粉丝
				if(userRelationDao.isWatched(loginDigitalId, connectUserId)){
					watched = RelationType.FOLLOWED;
				}else{
					watched = RelationType.UNFOLLOWED;
				}
			}else{
				// 我查看别人的粉丝
				Long watchedDigitalId = Long.valueOf(userInfo.get("digitalId").toString());
				if(loginDigitalId.equals(watchedDigitalId)){
					watched = RelationType.SELF; //自我不显式关注
				}else{
					if(userRelationDao.isWatched(loginDigitalId, connectUserId)){
						watched = RelationType.FOLLOWED;
					}else{
						watched = RelationType.UNFOLLOWED;
					}
				}
			}
			
			userInfo.put("watched", watched);
			users.add(userInfo);
		}
		return users;
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
