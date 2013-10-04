package com.zizibujuan.drip.server.dao;

import java.util.List;
import java.util.Map;

import com.zizibujuan.drip.server.model.ExerciseForm;

/**
 * 维护习题 数据访问接口
 * @author jinzw
 * @since 0.0.1
 */
public interface ExerciseDao {

	/**
	 * 获取系统中的所有习题
	 * @return 习题列表，如果没有习题，则返回空列表。习题按照录入的时间倒序排列。
	 * <pre>
	 * 	Map中存储的key值
	 * 		content:习题内容
	 * </pre>
	 */
	List<Map<String,Object>> get();

	/**
	 * 新增习题。
	 * 
	 * @param exerciseForm 包含习题信息和录入习题人提供的答案信息
	 * @return 新增习题的标识, 如果新增习题失败，则返回null
	 */
	Long add(ExerciseForm exerciseForm);

	/**
	 * 获取习题详情
	 * @param exerciseId 习题标识
	 * @return 习题详情，如果没有找到，则返回空的map对象。
	 * <pre>
	 * map的结构为：
	 * 		id: 习题标识
	 * 		exerType: 题型
	 * 		exerCategory: 习题所属科目
	 * 		content: 习题内容
	 * 		options: 习题选项
	 * 			id：	习题选项标识
	 * 			exerId: 所属习题标识
	 * 			content： 选项内容
	 * 			seq： 选项显示顺序，TODO:支持随机模式，可在客户端处理
	 * 		createTime: 创建时间
	 * 		updateTime: 更新时间
	 * 		createUserId: 创建用户标识
	 * 		updateUserId: 更新用户标识
	 * </pre>
	 */
	Map<String, Object> get(Long exerciseId);
}
