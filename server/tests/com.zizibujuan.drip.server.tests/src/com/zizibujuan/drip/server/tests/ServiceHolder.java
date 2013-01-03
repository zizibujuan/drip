package com.zizibujuan.drip.server.tests;


/**
 * 放置服务实例
 * @author jzw
 * @since 0.0.1
 */
public class ServiceHolder {

	private static ServiceHolder singleton;

	public static ServiceHolder getDefault() {
		return singleton;
	}

	public void activate() {
		singleton = this;
	}

	public void deactivate() {
		singleton = null;
	}
	/*
	private ApplicationPropertyService applicationPropertyService;
	public ApplicationPropertyService getApplicationPropertyService() {
		return applicationPropertyService;
	}
	public void setApplicationPropertyService(ApplicationPropertyService applicationPropertyService) {
		System.out.println("注入ApplicationPropertyService");
		System.out.println("applicationPropertyService In ServiceHolder:"+applicationPropertyService);
		this.applicationPropertyService = applicationPropertyService;
	}

	public void unsetApplicationPropertyService(ApplicationPropertyService applicationPropertyService) {
		System.out.println("注销ApplicationPropertyService");
		if (this.applicationPropertyService == applicationPropertyService) {
			this.applicationPropertyService = null;
		}
	}
	*/
}
