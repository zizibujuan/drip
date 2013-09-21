package com.zizibujuan.drip.server.model;

import java.util.List;

import com.zizibujuan.drip.server.util.model.LogModel;

/**
 * 习题信息
 * 
 * @author jzw
 * @since 0.0.1
 */
public class Exercise extends LogModel{

	private Long id;
	private String questionType;
	private String content;
	private String course;
	
	private String imageId; // 一个习题只能有一个附图
	private List<ExerciseOption> options;
	
	/**
	 * 获取习题标识
	 * @return 习题标识
	 */
	public Long getId() {
		return id;
	}

	/**
	 * 设置习题标识
	 * @param id 习题标识
	 */
	public void setId(Long id) {
		this.id = id;
	}

	/**
	 * 获取题型编码
	 * 
	 * @return 题型编码
	 */
	public String getQuestionType() {
		return questionType;
	}

	/**
	 * 设置题型编码
	 * 
	 * @param questionType 题型编码
	 */
	public void setQuestionType(String questionType) {
		this.questionType = questionType;
	}

	/**
	 * 获取习题内容
	 * 
	 * @return 习题内容
	 */
	public String getContent() {
		return content;
	}

	/**
	 * 设置习题内容
	 * 
	 * @param content 习题内容
	 */
	public void setContent(String content) {
		this.content = content;
	}

	/**
	 * 获取习题所属科目代码
	 * 
	 * @return 客户代码
	 */
	public String getCourse() {
		return course;
	}

	/**
	 * 设置习题所属科目代码
	 * 
	 * @param course 客户代码
	 */
	public void setCourse(String course) {
		this.course = course;
	}

	/**
	 * 获取附图标识，附图存在文件系统中，这个id对应文件系统的文件名，
	 * 文件名是动态生成的唯一标识。
	 * 
	 * @return 附图标识
	 */
	public String getImageId() {
		return imageId;
	}

	/**
	 * 设置附图标识
	 * 
	 * @param imageId 附图标识
	 */
	public void setImageId(String imageId) {
		this.imageId = imageId;
	}

	/**
	 * 获取习题选项，只有选择题才有这个值
	 * 
	 * @return 习题选项列表，如果没有，则返回null
	 */
	public List<ExerciseOption> getOptions() {
		return options;
	}

	/**
	 * 设置习题选项，只有选择题才需要设置这个值。
	 * 
	 * @param options 习题选项列表
	 */
	public void setOptions(List<ExerciseOption> options) {
		this.options = options;
	}
	
	
}
