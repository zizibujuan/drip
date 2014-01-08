package com.zizibujuan.drip.server.service;

import com.zizibujuan.drip.server.model.HistExercise;

/**
 * 记录习题修改历史的服务接口
 * 
 * @author jinzw
 * @since 0.0.1
 */
public interface HistExerciseService {

	HistExercise get(Long exerciseId, Integer version);
}
