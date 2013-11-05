package com.zizibujuan.drip.server.model;

import com.zizibujuan.drip.server.util.DBAction;

/**
 * 答案历史信息
 * 
 * @author jzw
 * @since 0.0.1
 */
public class HistAnswer extends Answer{

	private Long histId; // 历史答案的代理主键
	private String action;

	
	public Long getHistId() {
		return histId;
	}

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
