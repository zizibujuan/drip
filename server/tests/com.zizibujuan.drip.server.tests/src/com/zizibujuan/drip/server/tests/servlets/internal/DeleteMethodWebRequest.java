package com.zizibujuan.drip.server.tests.servlets.internal;

import java.net.URL;

import com.meterware.httpunit.GetMethodWebRequest;

/**
 * 对httpUnit的MethodWebRequest系列类的扩充
 * @author jzw
 * @since 0.0.1
 *
 */
public class DeleteMethodWebRequest extends GetMethodWebRequest {
	
	public DeleteMethodWebRequest(URL urlBase, String urlString, String target) {
		super(urlBase, urlString, target);
	}

	public DeleteMethodWebRequest(URL urlBase, String urlString) {
		super(urlBase, urlString);
	}

	public DeleteMethodWebRequest(String urlString) {
		super(urlString);
	}

	@Override
	public String getMethod() {
		return "DELETE";
	}

}
