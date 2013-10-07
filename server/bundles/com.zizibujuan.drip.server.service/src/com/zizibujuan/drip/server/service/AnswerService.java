package com.zizibujuan.drip.server.service;

import java.util.Map;

import com.zizibujuan.drip.server.model.Answer;

/**
 * 答题服务接口
 * @author jinzw
 * @since 0.0.1
 */
public interface AnswerService {

	/**
	 * 执行用户新增或更新指定习题的答案
	 * @param userId 用户标识
	 * @param answer 答案内容，包括习题解析
	 * <pre>
	 * map结构为：
	 * 		exerId: 习题标识
	 * 		guide: 习题解析内容
	 * 		detail：Array
	 * 			content：答案内容
	 * 			optionId:选项标识
	 * </pre>
	 */
	@Deprecated
	void saveOrUpdate(Long userId, Map<String, Object> answer);

	/**
	 * 新增习题答案和习题解析
	 * @param localUserId 本网站用户标识
	 * @param mapUserId 与第三方网站用户映射的关联标识
	 * @param answerInfo 答案信息
	 * <pre>
	 * map结构：
	 * 		exerId: 习题标识
	 * 		guide: 习题解析
	 * 		detail：答案详情 Array
	 * 			optionId：选项标识
	 * 			content: 答案内容
	 * </pre>
	 */
	void save(Long localUserId, Long mapUserId, Map<String, Object> answerInfo);

	/**
	 * 编辑习题答案和习题解析
	 * @param answerId 答案标识
	 * @param userId 用户标识
	 * @param answerInfo 答案信息
	 */
	void update(Long answerId, Long userId, Map<String, Object> answerInfo);

	/**
	 * 获取某用户对某道习题的答案
	 * 
	 * @param userId 用户标识
	 * @param exerciseId 习题标识
	 * 
	 * @return 答案内容
	 * <pre>
	 * map结构为：
	 * 		exerId: 习题标识
	 * 		guide: 习题解析内容
	 * 		detail：Array
	 * 			content：答案内容
	 * 			optionId:选项标识
	 * </pre>
	 */
	Answer get(Long userId, Long exerciseId);
}