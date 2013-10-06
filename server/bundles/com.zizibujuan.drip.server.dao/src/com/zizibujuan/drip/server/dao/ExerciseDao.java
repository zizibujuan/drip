package com.zizibujuan.drip.server.dao;

import java.util.List;
import java.util.Map;

import com.zizibujuan.drip.server.model.Exercise;
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
	 * 获取习题内容
	 * 
	 * @param exerciseId 习题标识
	 * @return 习题内容
	 */
	Exercise get(Long exerciseId);
}
