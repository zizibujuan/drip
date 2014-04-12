package com.zizibujuan.drip.server.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.core.runtime.IPath;

import com.zizibujuan.drip.server.model.HistExercise;
import com.zizibujuan.useradmin.server.model.UserInfo;
import com.zizibujuan.drip.server.service.ExerciseService;
import com.zizibujuan.drip.server.util.servlet.BaseServlet;
import com.zizibujuan.drip.server.util.servlet.RequestUtil;
import com.zizibujuan.drip.server.util.servlet.UserSession;

/**
 * 发布习题
 * 
 * @author jinzw
 * @since 0.0.1
 */
public class ExercisePublishServlet extends BaseServlet{

	private static final long serialVersionUID = -4919794218330849048L;
	private ExerciseService exerciseService;
	
	public ExercisePublishServlet(){
		exerciseService = ServiceHolder.getDefault().getExerciseService();
	}

	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		traceRequest(req);
		IPath path = getPath(req);
		if(path.segmentCount() == 0){
			HistExercise exercise = RequestUtil.fromJsonObject(req, HistExercise.class);
			UserInfo user = (UserInfo)UserSession.getUser(req);
			exercise.setLastUpdateUserId(user.getId());
			exerciseService.publish(exercise);
			return;
		}
		super.doPut(req, resp);
	}
	
}
