package com.zizibujuan.drip.server.util.servlet;

import org.eclipse.core.runtime.IStatus;
import org.eclipse.core.runtime.Status;

import com.zizibujuan.drip.server.util.ServerConstants;

/**
 * servlet端操作返回的状态信息,使用这个对象统一封装，以json对象返回ajax请求的处理信息
 * @author jzw
 * @since 0.0.1
 */
public class ServerStatus<T> extends Status{

	private int httpCode;
	private T jsonData;
	
	public ServerStatus(int severity, int httpCode, String message, Throwable exception) {
		super(severity, ServerConstants.PI_SERVER_CORE, message, exception);
		this.httpCode = httpCode;
	}
	
	public ServerStatus(int severity, int httpCode, String message, T jsonData, Throwable exception) {
		super(severity, ServerConstants.PI_SERVER_CORE, message, exception);
		this.httpCode = httpCode;
		this.jsonData = jsonData;
	}

	public ServerStatus(IStatus status, int httpCode) {
		super(status.getSeverity(), status.getPlugin(), status.getCode(), status.getMessage(), status.getException());
		this.httpCode = httpCode;
	}
	
	public ServerStatus(IStatus status, int httpCode, T jsonData) {
		super(status.getSeverity(), status.getPlugin(), status.getCode(), status.getMessage(), status.getException());
		this.httpCode = httpCode;
		this.jsonData = jsonData;
	}
	
	

}
