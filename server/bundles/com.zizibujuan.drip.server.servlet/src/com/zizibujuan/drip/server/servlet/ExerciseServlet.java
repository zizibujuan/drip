package com.zizibujuan.drip.server.servlet;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.zizibujuan.drip.server.service.ExerciseService;
import com.zizibujuan.drip.server.util.servlet.BaseServlet;
import com.zizibujuan.drip.server.util.servlet.RequestUtil;
import com.zizibujuan.drip.server.util.servlet.ResponseUtil;
import com.zizibujuan.drip.server.util.servlet.UserSession;

/**
 * 习题,修改完习题后，需要对修改的内容进行审批。
 * 如果要修改习题的选项，则要记录历史的选项列表。并将答案与这些习题的具体版本相关联。
 * @author jinzw
 * @since 0.0.1
 */
public class ExerciseServlet extends BaseServlet{
	private static final long serialVersionUID = 3368960336480220523L;
	
	private ExerciseService exerciseService = ServiceHolder.getDefault().getExerciseService();

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		String pathInfo = req.getPathInfo();
		
		if(isNullOrSeparator(pathInfo)){
			List<Map<String,Object>> exercises = exerciseService.get();
			ResponseUtil.toJSON(req, resp, exercises);
			return;
		}
		super.doGet(req, resp);
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		String pathInfo = req.getPathInfo();
		if(isNullOrSeparator(pathInfo)){
			Map<String,Object> exerciseInfo = RequestUtil.fromJsonObject(req);
			// 如果保存成功，则返回一个成功的状态码
			exerciseInfo.put("localUserId", UserSession.getLocalUserId(req));
			// 如果页面没有传过来connectUserId,则从当前session中获取
			// 但是新增习题必须是登录用户自己操作，所以不会出现从页面传过来connectUserId的情况
			exerciseInfo.put("connectUserId", UserSession.getConnectUserId(req));
			exerciseService.add(exerciseInfo);
			return;
		}
		super.doPost(req, resp);
	}
}
