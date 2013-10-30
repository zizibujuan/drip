package com.zizibujuan.drip.server.service.impl;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.zizibujuan.drip.server.dao.AnswerDao;
import com.zizibujuan.drip.server.dao.ExerciseGuideDao;
import com.zizibujuan.drip.server.model.Answer;
import com.zizibujuan.drip.server.service.AnswerService;

/**
 * 答题服务实现类
 * @author jinzw
 * @since 0.0.1
 */
public class AnswerServiceImpl implements AnswerService {
	private static final Logger logger = LoggerFactory.getLogger(AnswerServiceImpl.class);
	private AnswerDao answerDao;
	private ExerciseGuideDao exerciseGuideDao;
	
	@Override
	public void saveOrUpdate(Long userId, Map<String, Object> answer) {
		answerDao.saveOpUpdate(userId, answer);
	}

	@Override
	public Long insert(Answer answer) {
		return answerDao.insert(answer);
	}

	@Override
	public void update(Long answerId, Long userId,
			Map<String, Object> answerInfo) {
		// TODO Auto-generated method stub
		
	}
	
	@Override
	public Answer get(Long userId, Long exerciseId) {
		return answerDao.get(userId, exerciseId);
	}

	public void setAnswerDao(AnswerDao answerDao) {
		logger.info("注入AnswerDao");
		this.answerDao = answerDao;
	}

	public void unsetAnswerDao(AnswerDao answerDao) {
		if (this.answerDao == answerDao) {
			logger.info("注销AnswerDao");
			this.answerDao = null;
		}
	}
	
	public void setExerciseGuideDao(ExerciseGuideDao exerciseGuideDao) {
		logger.info("注入ExerciseGuideDao");
		this.exerciseGuideDao = exerciseGuideDao;
	}

	public void unsetExerciseGuideDao(ExerciseGuideDao exerciseGuideDao) {
		if (this.exerciseGuideDao == exerciseGuideDao) {
			logger.info("注销ExerciseGuideDao");
			this.exerciseGuideDao = null;
		}
	}

}
