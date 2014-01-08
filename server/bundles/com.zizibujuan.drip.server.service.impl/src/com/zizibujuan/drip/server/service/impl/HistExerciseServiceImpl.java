package com.zizibujuan.drip.server.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.zizibujuan.drip.server.dao.HistExerciseDao;
import com.zizibujuan.drip.server.model.HistExercise;
import com.zizibujuan.drip.server.service.HistExerciseService;

/**
 * 记录习题修改历史的服务接口实现类
 * 
 * @author jinzw
 * @since 0.0.1
 */
public class HistExerciseServiceImpl implements HistExerciseService {
	private static final Logger logger = LoggerFactory.getLogger(HistExerciseServiceImpl.class);
	
	private HistExerciseDao histExerciseDao;
	
	@Override
	public HistExercise get(Long exerciseId, Integer version) {
		return histExerciseDao.get(exerciseId, version);
	}
	
	public void setHistExerciseDao(HistExerciseDao histExerciseDao) {
		logger.info("注入histExerciseDao");
		this.histExerciseDao = histExerciseDao;
	}

	public void unsetHistExerciseDao(HistExerciseDao histExerciseDao) {
		if (this.histExerciseDao == histExerciseDao) {
			logger.info("注销histExerciseDao");
			this.histExerciseDao = null;
		}
	}

}
