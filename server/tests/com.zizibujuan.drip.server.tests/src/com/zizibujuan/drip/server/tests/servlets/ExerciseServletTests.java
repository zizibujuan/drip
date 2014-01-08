package com.zizibujuan.drip.server.tests.servlets;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.After;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

import com.zizibujuan.drip.server.model.Answer;
import com.zizibujuan.drip.server.model.AnswerDetail;
import com.zizibujuan.drip.server.model.Exercise;
import com.zizibujuan.drip.server.model.HistExercise;
import com.zizibujuan.drip.server.service.AnswerService;
import com.zizibujuan.drip.server.service.ExerciseService;
import com.zizibujuan.drip.server.service.HistExerciseService;
import com.zizibujuan.drip.server.servlet.ServiceHolder;
import com.zizibujuan.drip.server.tests.AbstractServletTests;
import com.zizibujuan.drip.server.util.CourseType;
import com.zizibujuan.drip.server.util.DBAction;
import com.zizibujuan.drip.server.util.ExerciseType;
import com.zizibujuan.drip.server.util.constant.ExerciseStatus;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;

/**
 * 习题维护测试用例
 * 
 * @author jzw
 * @since 0.0.1
 */
public class ExerciseServletTests extends AbstractServletTests {
	
	private ExerciseService exerciseService = ServiceHolder.getDefault().getExerciseService();
	private AnswerService answerService = ServiceHolder.getDefault().getAnswerService();
	private HistExerciseService histExerciseService = ServiceHolder.getDefault().getHistExerciseService();
	
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
			Map<String, Object> exercise = prepareMultiOptionExercise();
			postData.putAll(exercise);
			initPostServlet("exercises");
			// 只返回dbid 
			Long dbid = Long.valueOf(response.getText());
			assertNotNull(dbid);
			
			Exercise result = exerciseService.get(dbid);
			assertEquals(dbid, result.getId());
			assertEquals(ExerciseType.MULTI_OPTION, result.getExerciseType());
			assertEquals("content_", result.getContent());
			assertEquals(1, result.getVersion().intValue());
			assertEquals(ExerciseStatus.DRAFT, result.getStatus());
			assertEquals(2, result.getOptions().size());
			assertNotNull(result.getOptions().get(0).getId());
			assertEquals("option_1", result.getOptions().get(0).getContent());
			
			// 判断习题历史的表中也有一条记录
			int histCount = DatabaseUtil.queryForInt(dataSource, "SELECT COUNT(*) FROM DRIP_HIST_EXERCISE");
			assertEquals(1, histCount);
			HistExercise histExercise = histExerciseService.get(result.getId(), 1);
			assertNotNull(histExercise.getId());
			assertEquals("content_", histExercise.getContent());
			assertEquals(ExerciseType.MULTI_OPTION, histExercise.getExerciseType());
			assertNull(histExercise.getImageName());
			assertEquals(DBAction.CREATE, histExercise.getAction());
			
		}finally{
			DatabaseUtil.update(dataSource, "DELETE FROM DRIP_EXERCISE");
			DatabaseUtil.update(dataSource, "DELETE FROM DRIP_HIST_EXERCISE");
		}
	}

	private Map<String, Object> prepareMultiOptionExercise() {
		Map<String, Object> exercise = new HashMap<String, Object>();
		exercise.put("exerciseType", ExerciseType.MULTI_OPTION);
		exercise.put("content", "content_");
		exercise.put("status", ExerciseStatus.DRAFT);
		
		List<Map<String, Object>> options = new ArrayList<Map<String,Object>>();
		
		Map<String, Object> option1 = new HashMap<String, Object>();
		option1.put("content", "option_1");
		options.add(option1);
		
		Map<String, Object> option2 = new HashMap<String, Object>();
		option2.put("content", "option_2");
		options.add(option2);
		
		exercise.put("options", options);
		return exercise;
	}
	
	private Map<String, Object> prepareMultiOptionAnswer() {
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("guide", "guide_1");
		List<Map<String, Object>> details = new ArrayList<Map<String, Object>>();
		Map<String, Object> detail1 = new HashMap<String, Object>();
		detail1.put("seq", 1);
		details.add(detail1);
		result.put("detail", details);
		return result;
	}
	
	@Test
	@Ignore
	public void post_add_exercise_and_answer_success() throws NumberFormatException, IOException{
		Map<String, Object> exercise = prepareMultiOptionExercise();
		Map<String, Object> answer = prepareMultiOptionAnswer();
		
		postData.put("exercise", exercise);
		postData.put("answer", answer);
		
		initPostServlet("exercises");
		Long exerciseId = Long.valueOf(response.getText());
		assertNotNull(exerciseId);
		
		Answer result = answerService.get(testUserId, exerciseId);
		assertEquals(exerciseId, result.getExerciseId());
		assertNotNull(result.getId());
		assertEquals("guide_1", result.getGuide());
		List<AnswerDetail> details = result.getDetail();
		assertEquals(1, details.size());
		assertNotNull(details.get(0).getOptionId());
		assertNotNull(details.get(0).getId());
		assertEquals(result.getId(), details.get(0).getAnswerId());
	}

	// TODO:服务器端校验，习题内容必输，如果是选择题，则必须选项个数大于2
	
	@Test
	@Ignore
	public void post_public_exercise(){
		
	}
	
}
