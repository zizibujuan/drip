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
	public List<Map<String, Object>> get(Long userId, PageInfo pageInfo) {
		// 获取关注用户的活动列表
		List<Map<String,Object>> list = activityDao.get(userId, pageInfo);
		// TODO:然后循环着获取每个活动的详情,如果缓存中已存在，则从缓存中获取。
		// 用户的详细信息也从缓存中获取
		// 注意，新增的习题和答案，都要缓存起来。
		
		logger.info(list.toString());
		for(Map<String,Object> each : list){
			Long mapUserId = Long.valueOf(each.get("mapUserId").toString());
			// FIXME:错误，这里不能传递mapUserId
			// 这里既要考虑获取本地用户的信息，更要考虑获取第三方网站的用户信息。
			Map<String,Object> userInfo = userService.getPublicInfo(mapUserId);
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

	public void unsetExerciseDao(ActivityDao activityDao) {
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
