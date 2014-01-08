package com.zizibujuan.drip.server.service.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.zizibujuan.drip.server.dao.ExerciseDao;
import com.zizibujuan.drip.server.model.Exercise;
import com.zizibujuan.drip.server.model.ExerciseForm;
import com.zizibujuan.drip.server.service.ExerciseService;
import com.zizibujuan.drip.server.util.PageInfo;

/**
 * 维护习题 服务实现类
 * @author jinzw
 * @since 0.0.1
 */
public class ExerciseServiceImpl implements ExerciseService {
	
	private static final Logger logger = LoggerFactory.getLogger(ExerciseServiceImpl.class);
	private ExerciseDao exerciseDao;
	
	@Override
	public List<Exercise> get(PageInfo pageInfo) {
		return exerciseDao.get(pageInfo);
	}

	/**
	 * @deprecated 不再提供录入习题时，给出习题答案的功能
	 */
	@Override
	public Long add(ExerciseForm exerciseForm) {
		return exerciseDao.add(exerciseForm);
	}
	
	@Override
	public Long add(Exercise exercise) {
		return exerciseDao.add(exercise);
	}
	
	@Override
	public ExerciseForm get(Long userId, Long exerciseId) {
		return exerciseDao.get(userId, exerciseId);
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
