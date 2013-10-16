package com.zizibujuan.drip.server.tests;

import com.zizibujuan.drip.server.service.EmailService;

/**
 * 放置服务实例
 * 
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
	
	private EmailService emailService;
	public EmailService getEmailService() {
		return emailService;
	}
	public void setEmailService(EmailService emailService) {
		System.out.println("注入emailService");
		this.emailService = emailService;
	}

	public void unsetEmailService(EmailService emailService) {
		System.out.println("注销emailService");
		if (this.emailService == emailService) {
			this.emailService = null;
		}
	}
}
