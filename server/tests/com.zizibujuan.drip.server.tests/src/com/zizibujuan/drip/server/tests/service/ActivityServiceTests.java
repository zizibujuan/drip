package com.zizibujuan.drip.server.tests.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import junit.framework.Assert;

import org.junit.Test;

import com.zizibujuan.drip.server.dao.mysql.DaoHolder;
import com.zizibujuan.drip.server.service.ActivityService;
import com.zizibujuan.drip.server.service.ExerciseService;
import com.zizibujuan.drip.server.servlet.ServiceHolder;
import com.zizibujuan.drip.server.util.ExerciseType;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;

/**
 * 活动列表测试用例
 * @author jzw
 * @since 0.0.1
 */
public class ActivityServiceTests extends AbstractUserTests{

	@Test
	public void testGetActivity(){
		Long exerciseId = null;
		try{
			ActivityService activityService = ServiceHolder.getDefault().getActivityService();
			ExerciseService exerciseService = ServiceHolder.getDefault().getExerciseService();
			
			importUser();
			List<Map<String,Object>> activities = activityService.get(localUserId, null);
			Assert.assertTrue(activities.isEmpty());
			
			/**
			 * localUserId: 本地用户标识
	 * 		connectUserId: 本网站为第三方网站用户产生的用户标识
	 * 		exerType: 题型
	 * 		exerCategory: 习题所属科目中的分类
	 * 		content： 习题内容
	 * 		options：Array  题目选项
	 * 		answers: Array  习题答案列表
	 * 		guide: 习题解析
			 */
			Map<String, Object> exerciseInfo = new HashMap<String, Object>();
			exerciseInfo.put("localUserId", localUserId);
			exerciseInfo.put("connectUserId", connectUserId);
			exerciseInfo.put("exerType", ExerciseType.SINGLE_OPTION);
			exerciseInfo.put("content", "习题a");
			List<String> options = new ArrayList<String>();
			options.add("答案a");
			options.add("答案b");
			exerciseInfo.put("options", options);
			exerciseId = exerciseService.add(exerciseInfo);
			activities = activityService.get(localUserId, null);
			Assert.assertEquals(1, activities.size());
			
		}finally{
			// 删除添加的习题和活动
			DataSource dataSource = DaoHolder.getDefault().getDataSourceService().getDataSource();
			
			String sql = "DELETE FROM DRIP_EXER_OPTION WHERE EXER_ID=?";
			DatabaseUtil.update(dataSource, sql, exerciseId);
			sql = "DELETE FROM DRIP_EXERCISE WHERE DBID = ?";
			DatabaseUtil.update(dataSource, sql, exerciseId);
			
			
			sql = "UPDATE DRIP_USER_INFO SET " +
					"EXER_PUBLISH_COUNT=EXER_PUBLISH_COUNT-1 " +
					"where DBID=?";
			DatabaseUtil.update(dataSource, sql, localUserId);
			
			sql = "UPDATE DRIP_USER_INFO SET " +
					"ANSWER_COUNT=ANSWER_COUNT-1 " +
					"where DBID=?";
			
			DatabaseUtil.update(dataSource, sql, localUserId);
			
			sql = "DELETE FROM DRIP_ACTIVITY WHERE CONNECT_USER_ID = ?";
			DatabaseUtil.update(dataSource, sql, connectUserId);
			
			super.reset();
		}
	}
}
