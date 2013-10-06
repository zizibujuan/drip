package com.zizibujuan.drip.server.service.impl;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.zizibujuan.drip.server.dao.ExerciseDao;
import com.zizibujuan.drip.server.model.Exercise;
import com.zizibujuan.drip.server.model.ExerciseForm;
import com.zizibujuan.drip.server.service.ExerciseService;

/**
 * 维护习题 服务实现类
 * @author jinzw
 * @since 0.0.1
 */
public class ExerciseServiceImpl implements ExerciseService {
	
	private static final Logger logger = LoggerFactory.getLogger(ExerciseServiceImpl.class);
	private ExerciseDao exerciseDao;
	
	@Override
	public List<Map<String, Object>> get() {
		return exerciseDao.get();
	}

	@Override
	public Long add(ExerciseForm exerciseForm) {
		return exerciseDao.add(exerciseForm);
	}
	
	@Override
	public Exercise get(Long exerciseId) {
		return exerciseDao.get(exerciseId);
	}

	public void setExerciseDao(ExerciseDao exerciseDao) {
		logger.info("注入exerciseDao");
		this.exerciseDao = exerciseDao;
	}

	public void unsetExerciseDao(ExerciseDao exerciseDao) {
		if (this.exerciseDao == exerciseDao) {
			logger.info("注销exerciseDao");
			this.exerciseDao = null;
		}
	}
}
