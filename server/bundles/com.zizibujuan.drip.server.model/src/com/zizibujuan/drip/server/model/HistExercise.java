package com.zizibujuan.drip.server.model;

import com.zizibujuan.drip.server.util.DBAction;

/**
 * 习题历史记录
 * 
 * @author jzw
 * @since 0.0.1
 */
public class HistExercise extends Exercise{

	private Long originId;
	private String action;

	/**
	 * 获取习题的原标识
	 * 
	 * @return 习题原标识
	 */
	public Long getOriginId() {
		return originId;
	}

	/**
	 * 设置习题的原标识
	 * 
	 * @param originId 习题原标识
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
	
	
	
}
