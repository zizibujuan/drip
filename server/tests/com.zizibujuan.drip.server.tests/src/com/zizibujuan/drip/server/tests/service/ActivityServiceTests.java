package com.zizibujuan.drip.server.tests.service;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.junit.Test;

import com.zizibujuan.drip.server.model.Answer;
import com.zizibujuan.drip.server.model.AnswerDetail;
import com.zizibujuan.drip.server.model.Exercise;
import com.zizibujuan.drip.server.model.ExerciseForm;
import com.zizibujuan.drip.server.model.HistAnswer;
import com.zizibujuan.drip.server.model.HistExercise;
import com.zizibujuan.drip.server.service.ActivityService;
import com.zizibujuan.drip.server.service.ExerciseService;
import com.zizibujuan.drip.server.servlet.ServiceHolder;
import com.zizibujuan.drip.server.util.ExerciseType;
import com.zizibujuan.drip.server.util.Gender;
import com.zizibujuan.drip.server.util.OAuthConstants;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;

/**
 * 活动列表测试用例
 * 
 * @author jzw
 * @since 0.0.1
 */
public class ActivityServiceTests extends AbstractUserTests{
	
	@Test
	public void test_insert_exercise_then_get_activity(){
		Long userId = null;
		Long exerciseId = null;
		try{
			ActivityService activityService = ServiceHolder.getDefault().getActivityService();
			ExerciseService exerciseService = ServiceHolder.getDefault().getExerciseService();
			
			userId = importUser(OAuthConstants.RENREN, "a", "b", Gender.MALE);
			List<Map<String,Object>> activities = activityService.getFollowing(null, userId);
			assertEquals(0, activities.size());
			
			ExerciseForm exerciseForm = new ExerciseForm();
			Exercise exercise = new Exercise();
			exercise.setContent("a");
			exercise.setExerciseType(ExerciseType.ESSAY_QUESTION);
			exercise.setVersion(1);
			exercise.setCreateUserId(userId);
			exerciseForm.setExercise(exercise);
			exerciseService.add(exerciseForm);
			
			activities = activityService.getFollowing(null, userId);
			assertEquals(1, activities.size());
			Map<String, Object> activity = activities.get(0);
			// 活动列表中显示的是历史习题中的信息
			HistExercise result = (HistExercise) activity.get("exercise");
			assertEquals("a", result.getContent());
			assertEquals(1, result.getVersion().intValue());
			assertEquals(ExerciseType.ESSAY_QUESTION, result.getExerciseType());
			assertNotNull(result.getHistId());
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
//			String content = "习题a";
//			String exerType = ExerciseType.SINGLE_OPTION;
//			String opContent1 = "答案a";
//			String opContent2 = "答案b";
//			
//			Map<String, Object> exerciseInfo = new HashMap<String, Object>();
//			exerciseInfo.put("localUserId", localGlobalUserId);
//			exerciseInfo.put("connectUserId", connectGlobalUserId);
//			exerciseInfo.put("exerType", exerType);
//			exerciseInfo.put("content", content);
//			List<String> options = new ArrayList<String>();
//			options.add(opContent1);
//			options.add(opContent2);
//			exerciseInfo.put("options", options);
//			exerciseId = exerciseService.add(exerciseInfo);
//			
//			activities = activityService.getFollowing(null, localGlobalUserId);
//			Assert.assertEquals(1, activities.size());
//			
//			Map<String,Object> firstActivity = activities.get(0);
//			Assert.assertNotNull(firstActivity.get("createTime"));
//			// 问：这两个用户信息与userInfo中的用户信息重复吗？
//			// 答：貌似重复了。因为这两个信息都是登录用户的信息，而不是每个发起动作的人的信息。
//			Assert.assertEquals(localGlobalUserId, Long.valueOf(firstActivity.get("localGlobalUserId").toString()));
//			Assert.assertEquals(connectGlobalUserId, Long.valueOf(firstActivity.get("connectGlobalUserId").toString()));
//			Assert.assertEquals(ActionType.SAVE_EXERCISE, firstActivity.get("actionType").toString());
//			Assert.assertNotNull(firstActivity.get("contentId"));
//			Assert.assertNotNull(firstActivity.get("DBID"));// 活动标识
//			// 活动内容，这里是习题新增的习题详情
//			Map<String,Object> exercise = (Map<String, Object>) firstActivity.get("exercise");
//			Assert.assertNotNull(exercise);
//			Assert.assertNotNull(exercise.get("id"));
//			Assert.assertEquals(content, exercise.get("content").toString());
//			Assert.assertEquals(connectGlobalUserId, Long.valueOf(exercise.get("createUserId").toString()));
//			Assert.assertNotNull(exercise.get("createTime"));
//			Assert.assertEquals(exerType, exercise.get("exerType").toString());
//			Assert.assertNull(exercise.get("exerCategory"));
//			Assert.assertNull(exercise.get("updateUserId"));
//			Assert.assertNull(exercise.get("updateTime"));
//			
//			List<Map<String,Object>> optionList = (List<Map<String, Object>>) exercise.get("options");
//			Assert.assertEquals(2, optionList.size());
//			Map<String,Object> op1 = optionList.get(0);
//			Assert.assertEquals(opContent1, op1.get("content").toString());
//			Assert.assertNotNull(op1.get("id"));
//			Assert.assertEquals(exercise.get("id"), op1.get("exerId"));
//			Map<String,Object> op2 = optionList.get(1);
//			Assert.assertEquals(opContent2, op2.get("content").toString());
//			Assert.assertNotNull(op2.get("id"));
//			Assert.assertEquals(exercise.get("id"), op2.get("exerId"));
//			
//			// 操作用户详情， 用户详情在userService中测试，因为后面调用的是同一个方法。
//			Map<String,Object> userInfo = (Map<String, Object>) firstActivity.get("userInfo");
//			Assert.assertNotNull(userInfo);
//			// 答案详情
//			Assert.assertNull(firstActivity.get("answer"));
			
			//[{createTime=2013-02-19 15:18:06.0, connectGlobalUserId=52, 
			//localGlobalUserId=51, 
			// exercise={content=习题a, id=10, updateUserId=null, 
			// createTime=2013-02-19 15:18:06.0, exerType=01, updateTime=null, 
			// options=[{content=答案a, id=19, exerId=10, seq=1}, {content=答案b, id=20, exerId=10, seq=2}], 
			// createUserId=52, exerCategory=null}, 
			
			// actionType=0001, 
			// userInfo={id=26, largerImageUrl=http://c, answerCount=0, exerPublishCount=1, fanCount=0, largeImageUrl=http://b, 
			//smallImageUrl=http://a, followCount=0, exerDraftCount=0, exerciseCount=1},
			// contentId=10, DBID=8}]
			// FIXME：缺少显示用的用户信息。
			
		}finally{
			// 删除添加的习题和活动
			deleteExercise(exerciseId);
			
			
			String sql = "UPDATE DRIP_USER_STATISTICS SET " +
					"EXER_PUBLISH_COUNT=EXER_PUBLISH_COUNT-1 " +
					"WHERE USER_ID=?";
			DatabaseUtil.update(dataSource, sql, userId);
			
//			sql = "UPDATE DRIP_LOCAL_USER_STATISTICS SET " +
//					"ANSWER_COUNT=ANSWER_COUNT-1 " +
//					"where GLOBAL_USER_ID=?";
//			DatabaseUtil.update(dataSource, sql, localGlobalUserId);
			
			sql = "DELETE FROM DRIP_ACTIVITY WHERE USER_ID = ?"; // 删除用户的所有活动
			DatabaseUtil.update(dataSource, sql, userId);
			
			deleteTestUser(userId);
		}
	}

	@Test
	public void test_insert_exercise_with_answer_then_get_activity(){
		Long userId = null;
		Long exerciseId = null;
		try{
			ActivityService activityService = ServiceHolder.getDefault().getActivityService();
			ExerciseService exerciseService = ServiceHolder.getDefault().getExerciseService();
			
			userId = importUser(OAuthConstants.RENREN, "a", "b", Gender.MALE);
			List<Map<String,Object>> activities = activityService.getFollowing(null, userId);
			assertEquals(0, activities.size());
			
			ExerciseForm exerciseForm = new ExerciseForm();
			Exercise exercise = new Exercise();
			exercise.setContent("a");
			exercise.setExerciseType(ExerciseType.ESSAY_QUESTION);
			exercise.setVersion(1);
			exercise.setCreateUserId(userId);
			exerciseForm.setExercise(exercise);
			
			Answer answer = new Answer();
			answer.setAnswerVersion(1);
			answer.setCreateUserId(userId);
			answer.setExerciseId(exerciseId);
			answer.setExerVersion(1);
			answer.setGuide("guide");
			List<AnswerDetail> answerDetails = new ArrayList<AnswerDetail>();
			AnswerDetail detail = new AnswerDetail();
			detail.setContent("answer");
			answerDetails.add(detail);
			answer.setDetail(answerDetails);
			exerciseForm.setAnswer(answer);
			
			exerciseService.add(exerciseForm);
			
			activities = activityService.getFollowing(null, userId);
			assertEquals(2, activities.size());
			Map<String, Object> activity = activities.get(0);
			// 活动列表中显示的是历史习题中的信息
			HistExercise result = (HistExercise) activity.get("exercise");
			assertEquals("a", result.getContent());
			assertEquals(1, result.getVersion().intValue());
			assertEquals(ExerciseType.ESSAY_QUESTION, result.getExerciseType());
			assertNotNull(result.getHistId());
			// 显示习题信息
			HistAnswer histAnswer = (HistAnswer) activity.get("answer");
			assertNotNull(histAnswer.getHistId());
			assertEquals(1, histAnswer.getAnswerVersion().intValue());
			assertNotNull(histAnswer.getExerciseId()); // 存的是习题历史版本标识
			assertEquals("guide", histAnswer.getGuide());
			assertEquals("answer", histAnswer.getDetail().get(0).getContent());
		}finally{
			deleteAnswer(exerciseId);
			deleteExercise(exerciseId);
			
			String sql = "UPDATE DRIP_USER_STATISTICS SET " +
					"EXER_PUBLISH_COUNT=EXER_PUBLISH_COUNT-1 " +
					"WHERE USER_ID=?";
			DatabaseUtil.update(dataSource, sql, userId);
			
			sql = "UPDATE DRIP_USER_STATISTICS SET " +
					"ANSWER_COUNT=ANSWER_COUNT-1 " +
					"where USER_ID=?";
			DatabaseUtil.update(dataSource, sql, userId);
			
			sql = "DELETE FROM DRIP_ACTIVITY WHERE USER_ID = ?"; // 删除用户的所有活动
			DatabaseUtil.update(dataSource, sql, userId);
			
			deleteTestUser(userId);
		}
	}

	private void deleteExercise(Long exerciseId) {
		// 删除历史习题
		DatabaseUtil.update(dataSource, "DELETE FROM DRIP_HIST_EXER_OPTION");
		DatabaseUtil.update(dataSource, "DELETE FROM DRIP_HIST_EXERCISE");
				
		String sql = "DELETE FROM DRIP_EXER_OPTION WHERE EXER_ID=?";
		DatabaseUtil.update(dataSource, sql, exerciseId);
		sql = "DELETE FROM DRIP_EXERCISE WHERE DBID = ?";
		DatabaseUtil.update(dataSource, sql, exerciseId);
	}
	
	private void deleteAnswer(Long exerciseId) {
		DatabaseUtil.update(dataSource, "DELETE FROM DRIP_HIST_ANSWER_DETAIL");
		DatabaseUtil.update(dataSource, "DELETE FROM DRIP_HIST_ANSWER");
		
		DatabaseUtil.update(dataSource, "DELETE FROM DRIP_ANSWER");
		DatabaseUtil.update(dataSource, "DELETE FROM DRIP_ANSWER_DETAIL");
	}
}
