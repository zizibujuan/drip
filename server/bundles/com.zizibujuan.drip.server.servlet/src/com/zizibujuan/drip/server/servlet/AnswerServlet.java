package com.zizibujuan.drip.server.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.core.runtime.IPath;

import com.zizibujuan.drip.server.model.Answer;
import com.zizibujuan.drip.server.service.AnswerService;
import com.zizibujuan.drip.server.util.servlet.BaseServlet;
import com.zizibujuan.drip.server.util.servlet.RequestUtil;
import com.zizibujuan.drip.server.util.servlet.ResponseUtil;
import com.zizibujuan.drip.server.util.servlet.UserSession;
import com.zizibujuan.useradmin.server.model.UserInfo;

/**
 * 习题答案
 * 
 * @author jinzw
 * @since 0.0.1
 */
public class AnswerServlet extends BaseServlet {

	private static final long serialVersionUID = -1785829869948967937L;
	private AnswerService answerService = null;
	

	public AnswerServlet() {
		answerService = ServiceHolder.getDefault().getAnswerService();
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		traceRequest(req);
		IPath path = getPath(req);
		if(path.segmentCount() == 0){
			// TODO:从query parameters中获取参数
			String sExerId = req.getParameter("exerId");
			Long exerciseId = Long.valueOf(sExerId);
			UserInfo userInfo = (UserInfo) UserSession.getUser(req);
			Long userId = userInfo.getId();
			Answer answer = answerService.get(userId, exerciseId);
			ResponseUtil.toJSON(req, resp, answer);
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
			Answer data = RequestUtil.fromJsonObject(req, Answer.class);
			// FIXME:修改这段逻辑，不再使用映射标识
			UserInfo userInfo = (UserInfo) UserSession.getUser(req);
			Long userId = userInfo.getId();
			data.setCreateUserId(userId);
			answerService.insert(data);
			return;
		}
		super.doPost(req, resp);
	}

	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		traceRequest(req);
		IPath path = getPath(req);
		if(path.segmentCount() == 1){
			Long answerId = Long.valueOf(path.segment(0));
			Answer newAnswer = RequestUtil.fromJsonObject(req, Answer.class);
			UserInfo userInfo = (UserInfo) UserSession.getUser(req);
			Long userId = userInfo.getId();
			newAnswer.setLastUpdateUserId(userId);
			newAnswer.setId(answerId);
			answerService.update(answerId, newAnswer);
			// TODO:显示返回
			return;
		}
		super.doPut(req, resp);
	}
	
	

	
}
