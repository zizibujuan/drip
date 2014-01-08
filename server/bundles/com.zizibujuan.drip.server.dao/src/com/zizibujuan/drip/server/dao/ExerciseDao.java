package com.zizibujuan.drip.server.dao;

import java.util.List;

import com.zizibujuan.drip.server.model.Exercise;
import com.zizibujuan.drip.server.model.ExerciseForm;
import com.zizibujuan.drip.server.util.PageInfo;

/**
 * 维护习题 数据访问接口
 * @author jinzw
 * @since 0.0.1
 */
public interface ExerciseDao {

	/**
	 * 获取系统中的所有习题
	 * 
	 * @param pageInfo 分页信息
	 * @return 习题列表，如果没有习题，则返回空列表。习题按照录入的时间倒序排列。
	 */
	List<Exercise> get(PageInfo pageInfo);

	/**
	 * 新增习题。
	 * 
	 * @param exerciseForm 包含习题信息和录入习题人提供的答案信息
	 * @return 新增习题的标识, 如果新增习题失败，则返回null
	 * @deprecated 暂时不支持在新增习题的同时，录入习题答案
	 */
	Long add(ExerciseForm exerciseForm);
	
	/**
	 * 新增习题。
	 * 
	 * @param exercise 习题信息
	 * @return 新增习题的标识
	 */
	Long add(Exercise exercise);
	
	/**
	 * 获取习题内容
	 * 
	 * @param userId 用户标识
	 * @param exerciseId 习题标识
	 * @return 习题内容和答案信息
	 */
	ExerciseForm get(Long userId, Long exerciseId);
	
	/**
	 * 获取习题信息
	 * 
	 * @param exerciseId 习题标识
	 * @return 习题信息，如果没有则返回null
	 */
	Exercise get(Long exerciseId);
}
