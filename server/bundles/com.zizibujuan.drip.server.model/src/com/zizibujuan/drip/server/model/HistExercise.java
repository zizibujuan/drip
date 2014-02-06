package com.zizibujuan.drip.server.model;

import com.zizibujuan.drip.server.util.constant.DBAction;

/**
 * 习题历史记录
 * 
 * @author jzw
 * @since 0.0.1
 */
public class HistExercise extends Exercise{
	
	private Long histId;
	private String action;
	
	/**
	 * 获取习题历史标识
	 * 
	 * @return 习题历史标识
	 */
	public Long getHistId() {
		return histId;
	}

	/**
	 * 设置习题历史标识
	 * 
	 * @param histId 习题历史标识
	 */
	public void setHistId(Long histId) {
		this.histId = histId;
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
