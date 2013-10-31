package com.zizibujuan.drip.server.model;

import com.zizibujuan.drip.server.util.DBAction;

/**
 * 答案历史信息
 * 
 * @author jzw
 * @since 0.0.1
 */
public class HistAnswer extends Answer{

	private Long originId;
	private String action;
	private Long histExerciseId;

	/**
	 * 获取答案的原标识
	 * 
	 * @return 答案原标识
	 */
	public Long getOriginId() {
		return originId;
	}

	/**
	 * 设置答案的原标识
	 * 
	 * @param originId 答案原标识
	 */
	public void setOriginId(Long originId) {
		this.originId = originId;
	}

	/**
	 * 获取数据库操作 {@link DBAction}
	 * 
	 * @return 数据库操作
	 */
	public String getAction() {
		return action;
	}

	/**
	 * 设置数据库操作 {@link DBAction}
	 * 
	 * @param action 数据库操作
	 */
	public void setAction(String action) {
		this.action = action;
	}

	/**
	 * 获取习题历史标识
	 * 
	 * @return 习题历史标识
	 */
	public Long getHistExerciseId() {
		return histExerciseId;
	}

	/**
	 * 设置习题历史标识
	 * 
	 * @param histExerciseId 习题历史标识
	 */
	public void setHistExerciseId(Long histExerciseId) {
		this.histExerciseId = histExerciseId;
	}
	
	
}
