package com.zizibujuan.drip.server.servlet;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.core.runtime.IPath;

import com.zizibujuan.drip.server.model.ExerciseForm;
import com.zizibujuan.drip.server.model.ExerciseOption;
import com.zizibujuan.drip.server.model.UserInfo;
import com.zizibujuan.drip.server.service.ExerciseService;
import com.zizibujuan.drip.server.util.ExerciseType;
import com.zizibujuan.drip.server.util.servlet.BaseServlet;
import com.zizibujuan.drip.server.util.servlet.RequestUtil;
import com.zizibujuan.drip.server.util.servlet.ResponseUtil;
import com.zizibujuan.drip.server.util.servlet.UserSession;
import com.zizibujuan.drip.server.util.servlet.Validator;

/**
 * 习题,修改完习题后，需要对修改的内容进行审批。
 * 如果要修改习题的选项，则要记录历史的选项列表。并将答案与这些习题的具体版本相关联。
 * 
 * @author jinzw
 * @since 0.0.1
 */
public class ExerciseServlet extends BaseServlet{
	private static final long serialVersionUID = 3368960336480220523L;
	
	private ExerciseService exerciseService = ServiceHolder.getDefault().getExerciseService();

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		traceRequest(req);
		IPath path = getPath(req);
		if(path.segmentCount() == 0){
			List<Map<String,Object>> exercises = exerciseService.get();
			ResponseUtil.toJSON(req, resp, exercises);
			return;
		}
		super.doGet(req, resp);
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		traceRequest(req);
		IPath path = getPath(req);
		if(path.segmentCount() == 0){
			ExerciseForm exerciseForm = RequestUtil.fromJsonObject(req, ExerciseForm.class);
			Validator validator = new Validator();
			this.validate(validator, exerciseForm);
			if(validator.hasFieldErrors()){
				ResponseUtil.toJSON(req, resp, validator.getFieldErrors(), HttpServletResponse.SC_PRECONDITION_FAILED);
				return;
			}
			UserInfo userInfo = (UserInfo) UserSession.getUser(req);
			exerciseForm.getExercise().setCreateUserId(userInfo.getId());
			Long dbid = exerciseService.add(exerciseForm);
			ResponseUtil.toHTML(req, resp, dbid.toString());
			return;
		}
		super.doPost(req, resp);
	}

	private void validate(Validator validator, ExerciseForm exerciseForm) {
		String exerciseType = exerciseForm.getExercise().getExerciseType();
		String content = exerciseForm.getExercise().getContent();
		List<ExerciseOption> options = exerciseForm.getExercise().getOptions();
		if(exerciseType.equals(ExerciseType.ESSAY_QUESTION)){
			if(content == null || content.trim().isEmpty()){
				validator.addFieldError("content", "请输入习题内容");
			}
			return;
		}
		
		if(exerciseType.equals(ExerciseType.SINGLE_OPTION) || exerciseType.equals(ExerciseType.MULTI_OPTION)){
			if(content == null || content.trim().isEmpty()){
				validator.addFieldError("content", "请输入习题内容");
			}
			if(options == null || options.size() < 2){
				validator.addFieldError("exerOption", "请输入至少两个选项");
			}
			return;
		}
	}
}
