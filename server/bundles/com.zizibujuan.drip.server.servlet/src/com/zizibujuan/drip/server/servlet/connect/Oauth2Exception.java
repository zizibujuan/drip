package com.zizibujuan.drip.server.servlet.connect;

/**
 * oauth处理异常
 * @author jzw
 * @since 0.0.1
 */
public class Oauth2Exception extends RuntimeException {
	
	private static final long serialVersionUID = 1295630873544048509L;

	public Oauth2Exception(String message) {
		super(message);
	}

	public Oauth2Exception(Throwable cause) {
		super(cause.getMessage(), cause);
	}

}
