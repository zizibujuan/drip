package com.zizibujuan.drip.server.model;

import com.zizibujuan.drip.server.util.constant.DBAction;

/**
 * 习题历史记录， FIXME:添加一个historyable父类怎样?
 * 
 * @author jzw
 * @since 0.0.1
 */
public class HistExercise extends Exercise{

	private Long histId; // 历史答案的代理主键
	private String action;
	private Integer histVersion; // 历史版本号

	public Long getHistId() {
		return histId;
	}

	public void setHistId(Long histId) {
		this.histId = histId;
	}
	
	/**
	 * 获取习题的历史版本号注意{@link Exercise#getVersion()}获取的是最新版本号。
	 * 
	 * @return 当前历史版本习题的历史版本号
	 */
	public Integer getHistVersion() {
		return histVersion;
	}

	/**
	 * 设置习题的历史版本号，注意{@link Exercise#setVersion(Integer)}设置的是最新版本号。
	 * 
	 * @param histVersion 当前历史版本习题的历史版本号
	 */
	public void setHistVersion(Integer histVersion) {
		this.histVersion = histVersion;
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
