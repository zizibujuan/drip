package com.zizibujuan.drip.server.dao;

import java.sql.Connection;
import java.sql.SQLException;

import com.zizibujuan.drip.server.model.Exercise;
import com.zizibujuan.drip.server.model.HistExercise;
import com.zizibujuan.drip.server.util.constant.DBAction;

/**
 * 记录更新习题的历史的数据访问接口
 * 
 * @author jzw
 * @since 0.0.1
 */
public interface HistExerciseDao {
	
	/**
	 * 在历史表中保存习题，只记录新增，更新和删除三种操作。
	 * 
	 * @param con 数据库连接
	 * @param dbAction 数据库操作类型，参见{@link DBAction}
	 * @param exercise 习题信息
	 * @return 历史记录标识
	 * @throws SQLException 
	 */
	Long insert(Connection con, String dbAction, Exercise exercise) throws SQLException;

	/**
	 * 获取习题的历史版本
	 * @param histExerciseId 习题历史版本的标识
	 * @return 习题信息，如果没有则返回null
	 */
	HistExercise get(Long histExerciseId);
	
	/**
	 * 获取习题的历史版本
	 * 
	 * @param exerciseId 习题标识
	 * @param version 习题版本号
	 * @return 习题信息，如果没有则返回null
	 */
	HistExercise get(Long exerciseId, Integer version);
}
