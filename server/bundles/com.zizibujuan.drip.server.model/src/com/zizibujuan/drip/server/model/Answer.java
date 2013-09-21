package com.zizibujuan.drip.server.model;

import java.util.List;

import com.zizibujuan.drip.server.util.model.LogModel;

/**
 * 习题答案基本信息，主要存储与习题的关系
 * 
 * @author jzw
 * @since 0.0.1
 */
public class Answer extends LogModel{

	private Long id;
	private Long exerciseId;
	private String guide;
	private List<AnswerDetail> detail;
	
	/**
	 * 获取答案标识
	 * 
	 * @return 答案标识
	 */
	public Long getId() {
		return id;
	}

	/**
	 * 设置答案标识
	 * 
	 * @param id 答案标识
	 */
	public void setId(Long id) {
		this.id = id;
	}
	
	/**
	 * 获取所属习题标识
	 * 
	 * @return 习题标识
	 */
	public Long getExerciseId() {
		return exerciseId;
	}

	/**
	 * 设置所属习题标识
	 * 
	 * @param exerciseId 习题标识
	 */
	public void setExerciseId(Long exerciseId) {
		this.exerciseId = exerciseId;
	}

	/**
	 * 获取习题解析。每个人都可以做习题解析，所以并不是习题的属性，是解答相关的属性。
	 * 或者说是解答的一部分。
	 * 
	 * @return 习题解析
	 */
	public String getGuide() {
		return guide;
	}

	/**
	 * 设置习题解析
	 * 
	 * @param guide 习题解析
	 */
	public void setGuide(String guide) {
		this.guide = guide;
	}

	/**
	 * 获取答案详情，支持多选题，多个答案的填空题等
	 * 
	 * @return 答案详情
	 */
	public List<AnswerDetail> getDetail() {
		return detail;
	}

	/**
	 * 设置答案详情
	 * 
	 * @param detail 答案详情
	 */
	public void setDetail(List<AnswerDetail> detail) {
		this.detail = detail;
	}
}
