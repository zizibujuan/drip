package com.zizibujuan.drip.server.service.impl;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.zizibujuan.drip.server.dao.ActivityDao;
import com.zizibujuan.drip.server.dao.AnswerDao;
import com.zizibujuan.drip.server.dao.ExerciseDao;
import com.zizibujuan.drip.server.service.ActivityService;
import com.zizibujuan.drip.server.service.UserService;
import com.zizibujuan.drip.server.util.ActionType;
import com.zizibujuan.drip.server.util.PageInfo;

/**
 * 活动列表实现类
 * @author jinzw
 * @since 0.0.1
 */
public class ActivityServiceImpl implements ActivityService {

	private static final Logger logger = LoggerFactory.getLogger(ActivityServiceImpl.class);
	private ActivityDao activityDao;
	private ExerciseDao exerciseDao;
	private AnswerDao answerDao;
	private UserService userService;
	
	@Override
	public List<Map<String, Object>> getFollowing(PageInfo pageInfo, Long localUserId) {
		// 获取关注用户的活动列表
		List<Map<String,Object>> list = activityDao.getFollowing(pageInfo,localUserId);
		// TODO:然后循环着获取每个活动的详情,如果缓存中已存在，则从缓存中获取。
		// 用户的详细信息也从缓存中获取
		// 注意，新增的习题和答案，都要缓存起来。
		
		logger.info(list.toString());
		for(Map<String,Object> each : list){
			// 这些用户信息，都是被关注人的信息
			Long localGlobalUserId = Long.valueOf(each.get("localGlobalUserId").toString());
			
			// 1.获取关联的用户标识connectGlobalUserId
			// 2.获取第三方用户标识关联的本网站用户标识
			// 3.获取本网站用户引用用户信息的用户标识
			Map<String,Object> userInfo = userService.getPublicInfo(localGlobalUserId);
			each.put("userInfo", userInfo);
			
			Long contentId = Long.valueOf(each.get("contentId").toString());
			String actionType = each.get("actionType").toString();
			if(actionType.equals(ActionType.SAVE_EXERCISE)){
				Map<String,Object> exercise = getExercise(contentId);
				each.put("exercise", exercise);
			}else if(actionType.equals(ActionType.ANSWER_EXERCISE)){
				// 将答案和习题解析看作一体，是用户在答题时写下的做题思路
				Map<String,Object> answer = getAnswer(contentId);
				Long exerciseId = Long.valueOf(answer.get("exerciseId").toString());
				Map<String,Object> exercise = getExercise(exerciseId);
				each.put("exercise", exercise);
				each.put("answer", answer);
			}
			
		}
		return list;
	}
	
	@Override
	public List<Map<String, Object>> getMyAnswers(PageInfo pageInfo, Long localUserId) {
		List<Map<String, Object>> list = activityDao.getMyAnswers(pageInfo, localUserId);
		for(Map<String,Object> each : list){
			// 这些用户信息，都是被关注人的信息
			Long localGlobalUserId = Long.valueOf(each.get("localGlobalUserId").toString());
			
			// 1.获取关联的用户标识connectGlobalUserId
			// 2.获取第三方用户标识关联的本网站用户标识
			// 3.获取本网站用户引用用户信息的用户标识
			Map<String,Object> userInfo = userService.getPublicInfo(localGlobalUserId);
			each.put("userInfo", userInfo);
			
			Long contentId = Long.valueOf(each.get("contentId").toString());
		
			Map<String,Object> answer = getAnswer(contentId);
			Long exerciseId = Long.valueOf(answer.get("exerciseId").toString());
			Map<String,Object> exercise = getExercise(exerciseId);
			each.put("exercise", exercise);
			each.put("answer", answer);
		}
		return list;
	}

	@Override
	public List<Map<String, Object>> getMyExercises(PageInfo pageInfo, Long localUserId) {
		List<Map<String, Object>> list = activityDao.getMyExercises(pageInfo, localUserId);
		for(Map<String,Object> each : list){
			// 这些用户信息，都是被关注人的信息
			Long localGlobalUserId = Long.valueOf(each.get("localGlobalUserId").toString());
			
			// 1.获取关联的用户标识connectGlobalUserId
			// 2.获取第三方用户标识关联的本网站用户标识
			// 3.获取本网站用户引用用户信息的用户标识
			Map<String,Object> userInfo = userService.getPublicInfo(localGlobalUserId);
			each.put("userInfo", userInfo);
			
			Long contentId = Long.valueOf(each.get("contentId").toString());
			Map<String,Object> exercise = getExercise(contentId);
			each.put("exercise", exercise);
		}
		return list;
	}
	
	private Map<String,Object> getExercise(Long dbid){
		// TODO: 改为从缓存中获取。
		Map<String,Object> result = exerciseDao.get(dbid);
		return result;
	}
	
	private Map<String,Object> getAnswer(Long answerId){
		// TODO: 改为从缓存中获取
		Map<String,Object> result = answerDao.get(answerId);
		return result;
	}

	public void setActivityDao(ActivityDao activityDao) {
		logger.info("注入ActivityDao");
		this.activityDao = activityDao;
	}

	public void unsetActivityDao(ActivityDao activityDao) {
		if (this.activityDao == activityDao) {
			logger.info("注销ActivityDao");
			this.activityDao = null;
		}
	}
	
	public void setExerciseDao(ExerciseDao exerciseDao) {
		logger.info("注入ExerciseDao");
		this.exerciseDao = exerciseDao;
	}

	public void unsetExerciseDao(ExerciseDao exerciseDao) {
		if (this.exerciseDao == exerciseDao) {
			logger.info("注销exerciseDao");
			this.exerciseDao = null;
		}
	}
	
	public void setAnswerDao(AnswerDao answerDao) {
		logger.info("注入answerDao");
		this.answerDao = answerDao;
	}

	public void unsetAnswerDao(AnswerDao answerDao) {
		if (this.answerDao == answerDao) {
			logger.info("注销answerDao");
			this.answerDao = null;
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
