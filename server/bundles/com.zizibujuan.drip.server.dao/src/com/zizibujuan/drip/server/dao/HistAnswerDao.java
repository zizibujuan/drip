package com.zizibujuan.drip.server.dao;

import java.sql.Connection;
import java.sql.SQLException;

import com.zizibujuan.drip.server.model.Answer;
import com.zizibujuan.drip.server.model.HistAnswer;
import com.zizibujuan.drip.server.util.constant.DBAction;

/**
 * 记录答案更新历史的数据访问接口
 * 
 * @author jzw
 * @since 0.0.1
 */
public interface HistAnswerDao {

	/**
	 * 在历史表中保存答案，只记录新增，更新和删除三种操作。
	 * 
	 * @param con 数据库连接
	 * @param dbAction 数据库操作类型，参见{@link DBAction}
	 * @param histExerciseId 历史习题标识
	 * @param answer 答案信息
	 * @return 历史记录标识
	 * @throws SQLException 
	 */
	Long insert(Connection con, String dbAction, Long histExerciseId, Answer answer) throws SQLException;

	HistAnswer get(Long histAnswerId);
}
