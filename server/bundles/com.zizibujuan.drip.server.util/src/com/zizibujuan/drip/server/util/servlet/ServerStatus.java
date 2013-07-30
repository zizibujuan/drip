package com.zizibujuan.drip.server.util.servlet;

import java.util.HashMap;
import java.util.Map;

import org.eclipse.core.runtime.IStatus;
import org.eclipse.core.runtime.Status;

import com.zizibujuan.drip.server.util.ServerConstants;
import com.zizibujuan.drip.server.util.json.JsonUtil;

/**
 * servlet端操作返回的状态信息,使用这个对象统一封装，以json对象返回ajax请求的处理信息
 * @author jzw
 * @since 0.0.1
 */
public class ServerStatus extends Status{

	private static final String PROP_HTTP_CODE = "HttpCode";
	private static final String PROP_CODE = "Code";
	private static final String PROP_MESSAGE = "Message";
	private static final String PROP_DETAILED_MESSAGE = "DetailedMessage";
	
	private static final String JSON_DATA = "JsonData";
	
	/**
	 * A string representing the status severity. The value is one of the 
	 * <code>SEVERITY_*</code> constants defined in this class.
	 */
	static final String PROP_SEVERITY = "Severity"; //$NON-NLS-1$
	static final String SEVERITY_CANCEL = "Cancel"; //$NON-NLS-1$
	static final String SEVERITY_ERROR = "Error"; //$NON-NLS-1$
	static final String SEVERITY_INFO = "Info"; //$NON-NLS-1$
	static final String SEVERITY_OK = "Ok"; //$NON-NLS-1$
	static final String SEVERITY_WARNING = "Warning"; //$NON-NLS-1$
	
	
	private int httpCode;
	private Object jsonData;
	
	public ServerStatus(int severity, int httpCode, String message, Throwable exception) {
		super(severity, ServerConstants.PI_SERVER_CORE, message, exception);
		this.httpCode = httpCode;
	}
	
	public ServerStatus(int severity, int httpCode, String message, Object jsonData, Throwable exception) {
		super(severity, ServerConstants.PI_SERVER_CORE, message, exception);
		this.httpCode = httpCode;
		this.jsonData = jsonData;
	}

	public ServerStatus(IStatus status, int httpCode) {
		super(status.getSeverity(), status.getPlugin(), status.getCode(), status.getMessage(), status.getException());
		this.httpCode = httpCode;
	}
	
	public ServerStatus(IStatus status, int httpCode, Object jsonData) {
		super(status.getSeverity(), status.getPlugin(), status.getCode(), status.getMessage(), status.getException());
		this.httpCode = httpCode;
		this.jsonData = jsonData;
	}

	public int getHttpCode() {
		return httpCode;
	}

	public String toJSONString() {
		Map<String,Object> result = new HashMap<String, Object>();
		result.put(PROP_HTTP_CODE, httpCode);
		result.put(PROP_CODE, getCode());
		result.put(PROP_MESSAGE, getMessage());
		result.put(PROP_SEVERITY, getSeverityString());
		if (jsonData != null){
			result.put(JSON_DATA, jsonData);
		}
		Throwable exception = getException();
		if (exception != null){
			result.put(PROP_DETAILED_MESSAGE, exception.getMessage());
		}
		return JsonUtil.toJson(result);
	}

	private String getSeverityString() {
		//note the severity string should not be translated
		switch (getSeverity()) {
			case IStatus.ERROR :
				return SEVERITY_ERROR;
			case IStatus.WARNING :
				return SEVERITY_WARNING;
			case IStatus.INFO :
				return SEVERITY_INFO;
			case IStatus.CANCEL :
				return SEVERITY_CANCEL;
			case IStatus.OK :
				return SEVERITY_OK;
		}
		return null;
	}
	
	

}
