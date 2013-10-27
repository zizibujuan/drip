package com.zizibujuan.drip.server.util.servlet;

import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * 服务器端校验器
 * 
 * @author jzw
 * @since 0.0.1
 */
public class Validator {

	// 以下代码借鉴自struts2
	private Collection<String> servletErrors; // 存储servlet级别的错误信息
	private Collection<String> servletMessages; // 存储servlet级别的提示信息
	private Map<String, List<String>> fieldErrors; // 存储字段级别的错误信息

	public Collection<String> getServletErrors() {
		if (servletErrors == null) {
			servletErrors = new ArrayList<String>();
		}
		return servletErrors;
	}

	public Collection<String> getServletMessages() {
		if (servletMessages == null) {
			servletMessages = new ArrayList<String>();
		}
		return servletMessages;
	}

	public Map<String, List<String>> getFieldErrors() {
		if (fieldErrors == null) {
			fieldErrors = new LinkedHashMap<String, List<String>>();
		}
		return fieldErrors;
	}

	// 判断是否有错误信息
	public boolean hasServletErrors() {
		return servletErrors != null && !servletErrors.isEmpty();
	}

	public boolean hasFieldErrors() {
		return fieldErrors != null && !fieldErrors.isEmpty();
	}

	public boolean hasErrors() {
		return hasServletErrors() || hasFieldErrors();
	}

	public boolean hasServletMessages() {
		return servletMessages != null && !servletMessages.isEmpty();
	}

	// 添加错误或提示信息
	public void addServletError(String error) {
		getServletErrors().add(error);
	}

	public void addServletMessage(String message) {
		getServletMessages().add(message);
	}

	public void addFieldError(String fieldName, String error) {
		Map<String, List<String>> errors = getFieldErrors();
		List<String> fieldError = errors.get(fieldName);
		if (fieldError == null) {
			fieldError = new ArrayList<String>();
			errors.put(fieldName, fieldError);
		}
		fieldError.add(error);
	}

}
