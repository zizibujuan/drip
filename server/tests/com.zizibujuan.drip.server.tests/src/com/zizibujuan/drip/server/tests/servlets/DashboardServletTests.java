package com.zizibujuan.drip.server.tests.servlets;

import static org.junit.Assert.assertEquals;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import com.zizibujuan.drip.server.model.Exercise;
import com.zizibujuan.drip.server.model.ExerciseForm;
import com.zizibujuan.drip.server.service.ExerciseService;
import com.zizibujuan.drip.server.service.UserRelationService;
import com.zizibujuan.drip.server.servlet.ServiceHolder;
import com.zizibujuan.drip.server.tests.AbstractServletTests;
import com.zizibujuan.drip.server.util.ExerciseType;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;

/**
 * 个人首页中获取用户好友活动列表的测试用例
 * 
 * @author jzw
 * @since 0.0.1
 */
public class DashboardServletTests extends AbstractServletTests {

	private UserRelationService userRelationService = ServiceHolder.getDefault().getUserRelationService();
	private ExerciseService exerciseService = ServiceHolder.getDefault().getExerciseService();
	
	@Before
	public void setUp(){
		super.setUp();
		super.setUpAuthorization();
		super.activeTestUser();
	}
	
	@After
	public void tearDown(){
		super.tearDownAuthorization();
		super.tearDown();
	}
	
	@Test
	public void test_get_watch_user_activities_no_watch_other_user() throws IOException{
		params = new HashMap<String, String>();
		params.put("type", "following");
		initGetServlet("activities");
		assertEquals(HttpServletResponse.SC_OK, response.getResponseCode());
		List<Map<String, Object>> activities = getResponseArray();
		assertEquals(0, activities.size());
	}
	
	@Test
	public void test_get_watch_user_activities_has_watch_other_user_but_no_activities() throws IOException{
		Long userId1 = null;
		try{
			userId1 = createUser("a@a.com", "abc123", "a");
			activeUser(userId1);
			
			userRelationService.follow(testUserId, userId1);
			
			params = new HashMap<String, String>();
			params.put("type", "following");
			initGetServlet("activities");
			assertEquals(HttpServletResponse.SC_OK, response.getResponseCode());
			List<Map<String, Object>> activities = getResponseArray();
			assertEquals(0, activities.size());
		}finally{
			removeUser(userId1);
		}
	}
	
	@Test
	public void test_get_watch_user_activities_self_has_activities() throws IOException{
		ExerciseForm exerciseForm = new ExerciseForm();
		Exercise exercise = new Exercise();
		exercise.setContent("a");
		exercise.setExerciseType(ExerciseType.ESSAY_QUESTION);
		exercise.setCreateUserId(testUserId);
		exerciseForm.setExercise(exercise);
		
		try{
			exerciseService.add(exerciseForm);
			
			params = new HashMap<String, String>();
			params.put("type", "following");
			initGetServlet("activities");
			assertEquals(HttpServletResponse.SC_OK, response.getResponseCode());
			List<Map<String, Object>> activities = getResponseArray();
			assertEquals(1, activities.size());
		}finally{
			// 删除习题信息
			DatabaseUtil.update(dataSource, "DELETE FROM DRIP_EXERCISE");
			// 删除活动列表信息
			DatabaseUtil.update(dataSource, "DELETE FROM DRIP_ACTIVITY");
			// 删除统计信息列表
			DatabaseUtil.update(dataSource, "DELETE FROM DRIP_USER_STATISTICS");
		}
	}
	
	@Test
	public void test_get_watch_user_activities_has_watch_other_user_and_has_activities() throws IOException{
		Long userId1 = null;
		try{
			userId1 = createUser("a@a.com", "abc123", "a");
			activeUser(userId1);
			
			userRelationService.follow(testUserId, userId1);
			
			ExerciseForm exerciseForm = new ExerciseForm();
			Exercise exercise = new Exercise();
			exercise.setContent("a");
			exercise.setExerciseType(ExerciseType.ESSAY_QUESTION);
			exercise.setCreateUserId(testUserId);
			exerciseForm.setExercise(exercise);
			exerciseService.add(exerciseForm);
			
			params = new HashMap<String, String>();
			params.put("type", "following");
			initGetServlet("activities");
			assertEquals(HttpServletResponse.SC_OK, response.getResponseCode());
			List<Map<String, Object>> activities = getResponseArray();
			assertEquals(0, activities.size());
		}finally{
			// 删除习题信息
			DatabaseUtil.update(dataSource, "DELETE FROM DRIP_EXERCISE");
			// 删除活动列表信息
			DatabaseUtil.update(dataSource, "DELETE FROM DRIP_ACTIVITY");
			// 删除统计信息列表
			DatabaseUtil.update(dataSource, "DELETE FROM DRIP_USER_STATISTICS");
			removeUser(userId1);
		}
	}
}
