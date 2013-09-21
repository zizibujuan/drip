package com.zizibujuan.drip.server.model;

/**
 * 答案详情，主要存储答案
 * 
 * @author jzw
 * @since 0.0.1
 */
public class AnswerDetail {

	private Long id;
	private Long answerId;
	private Long optionId;
	private String content;

	/**
	 * 获取答案内容标识
	 * 
	 * @return 答案内容标识
	 */
	public Long getId() {
		return id;
	}

	/**
	 * 设置答案内容标识
	 * 
	 * @param id 答案内容标识
	 */
	public void setId(Long id) {
		this.id = id;
	}

	/**
	 * 获取所属答案标识
	 * 
	 * @return 答案标识
	 */
	public Long getAnswerId() {
		return answerId;
	}

	/**
	 * 设置所属答案标识
	 * 
	 * @param answerId 答案标识
	 */
	public void setAnswerId(Long answerId) {
		this.answerId = answerId;
	}

	/**
	 * 获取答案项对应的习题选项标识，用于选择题
	 * 
	 * @return 习题选项标识
	 */
	public Long getOptionId() {
		return optionId;
	}

	/**
	 * 设置答案项对应的习题选项标识，用于选择题
	 * 
	 * @param optionId 习题选项标识
	 */
	public void setOptionId(Long optionId) {
		this.optionId = optionId;
	}

	/**
	 * 获取答案的内容，用于解答题或填空题
	 * 
	 * @return 答案的详细内容
	 */
	public String getContent() {
		return content;
	}

	/**
	 * 设置答案的内容，用于解答题或填空题
	 * 
	 * @param content 答案的详细内容
	 */
	public void setContent(String content) {
		this.content = content;
	}

}
