package com.zizibujuan.drip.server.dao;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Map;

import com.zizibujuan.drip.server.model.Answer;

/**
 * 答案 数据访问接口
 * 
 * @author jinzw
 * @since 0.0.1
 */
public interface AnswerDao {

	/**
	 * 根据答案标识获取答案详情。不单独提供录入习题解析，而是与录入答案的界面绑在一起。
	 * 但是允许只输入习题解析，而不输入答案。
	 * @param answerId 答案标识
	 * @return 答案,	确保习题解析和答案一直在一个界面中捆绑。
	 * <pre>
	 * map结构为：
	 * 		id: 答案标识
	 * 		exerId: 答案所属习题标识
	 * 		guide: 习题解析
	 * 		createTime: 创建时间
	 * 		updateTime: 更新时间
	 * 		createUserId: 创建用户标识
	 * 		updateUserId: 更新用户标识
	 * 		detail：支持1到多个可选答案
	 * 			id：答案详情标识
	 * 			answerId: 所属答案标识
	 * 			optionId: 所选选项标识（习题为选择题时使用）
	 * 			content: 所填答案内容
	 * </pre>
	 */
	Answer get(Long answerId);
	
	/**
	 * 获取某用户对某道习题的答案
	 * 
	 * @param userId 用户标识
	 * @param exerciseId 习题标识
	 * @return 答案信息，其中带上了习题解析内容。如果没有找到对应的答案，则返回null
	 */
	Answer get(Long userId, Long exerciseId);

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
	 * @deprecated
	 */
	void saveOpUpdate(Long userId, Map<String, Object> answer);

	/**
	 * 新增习题答案和习题解析
	 * @param localGlobalUserId 本网站为本网站用户生成的全局用户标识
	 * @param connectGlobalUserId 本网站为关联的网站用户生成的全局用户标识
	 * @param answerInfo 答案信息
	 * <pre>
	 * map结构：
	 * 		exerId: 习题标识
	 * 		guide: 习题解析
	 * 		detail：答案详情 Array
	 * 			optionId：选项标识
	 * 			content: 答案内容
	 * </pre>
	 * @deprecated
	 */
	void save(Long localGlobalUserId, Long connectGlobalUserId, Map<String, Object> answerInfo);
	
	/**
	 * 新增习题答案和习题解析
	 * 
	 * @param con 数据库链接
	 * @param histExerciseId 新增的答案对应习题的历史版本标识，
	 * 		因为允许用户编辑习题(这样会不会出现很多错误的习题？或许大家在回答问题前会给出很多反馈)
	 * 		TODO: 提供用户对习题质量打分的功能。
	 * @param answer 答案信息
	 * @return 答案标识
	 * @throws SQLException 
	 */
	Long insert(Connection con, Long histExerciseId, Answer answer) throws SQLException;
	
	/**
	 * 新增习题答案和习题解析
	 * 
	 * @param histExerciseId 新增的答案对应习题的历史版本标识
	 * @param answer 答案信息
	 * @return 答案标识
	 */
	Long insert(Long histExerciseId, Answer answer);
	
	/**
	 * 编辑习题答案和习题解析
	 * 
	 * @param histExerciseId 新增的答案对应习题的历史版本标识
	 * @param answerId 答案标识
	 * @param newAnswer 答案信息
	 */
	void update(Long histExerciseId, Long answerId, Answer newAnswer);

}
