package com.zizibujuan.drip.server.model;

/**
 * 单选，多选等选择题的选项
 * 
 * @author jzw
 * @since 0.0.1
 */
public class ExerciseOption {

	private Long id;
	private String content;

	/**
	 * 获取习题选项标识
	 * 
	 * @return 习题选项标识
	 */
	public Long getId() {
		return id;
	}

	/**
	 * 设置习题选项标识
	 * 
	 * @param id 习题选项标识
	 */
	public void setId(Long id) {
		this.id = id;
	}

	/**
	 * 获取选项内容
	 * 
	 * @return 选项内容
	 */
	public String getContent() {
		return content;
	}

	/**
	 * 设置选项内容
	 * 
	 * @param content 选项内容
	 */
	public void setContent(String content) {
		this.content = content;
	}

}
