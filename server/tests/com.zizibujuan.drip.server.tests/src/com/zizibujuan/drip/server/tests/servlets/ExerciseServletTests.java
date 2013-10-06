package com.zizibujuan.drip.server.tests.servlets;

import static org.junit.Assert.assertNotNull;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import com.zizibujuan.drip.server.service.ExerciseService;
import com.zizibujuan.drip.server.servlet.ServiceHolder;
import com.zizibujuan.drip.server.tests.AbstractServletTests;
import com.zizibujuan.drip.server.util.CourseType;
import com.zizibujuan.drip.server.util.ExerciseType;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;

/**
 * 习题维护测试用例
 * 
 * @author jzw
 * @since 0.0.1
 */
public class ExerciseServletTests extends AbstractServletTests {
	
	private ExerciseService exerciseService = ServiceHolder.getDefault().getExerciseService();
	
	@Before
	public void setUp(){
		super.setUp();
		setUpAuthorization();
	}
	
	@After
	public void tearDown(){
		tearDownAuthorization();
		super.tearDown();
	}
	
	
	@Test
	public void post_add_exercise_success() throws IOException{
		
		try{
			// TODO:需要先登录
			Map<String, Object> exercise = new HashMap<String, Object>();
			exercise.put("exerciseType", ExerciseType.MULTI_OPTION);
			exercise.put("content", "content_");
			exercise.put("course", CourseType.HIGHER_MATH);
			postData.put("exercise", exercise);
			initPostServlet("exercises");
			// 只返回dbid 
			Long dbid = Long.valueOf(response.getText());
			assertNotNull(dbid);
			//exerciseService.get
			
		}finally{
			// TODO: 表之间添加级联删除操作。
			DatabaseUtil.update(dataSource, "DELETE FROM DRIP_EXERCISE");
		}
		
	}
	
	@Test
	public void post_add_and_answer_exercise_success(){
		
	}
}
