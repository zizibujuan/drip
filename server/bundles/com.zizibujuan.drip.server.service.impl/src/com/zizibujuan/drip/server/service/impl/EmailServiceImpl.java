package com.zizibujuan.drip.server.service.impl;

import java.util.Properties;

import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMultipart;

import org.apache.commons.mail.DefaultAuthenticator;
import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.HtmlEmail;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.zizibujuan.drip.server.service.ApplicationPropertyService;
import com.zizibujuan.drip.server.service.EmailService;

/**
 * 本网站通用的邮件发送服务实现类
 * @author jzw
 * @since 0.0.1
 */
public class EmailServiceImpl implements EmailService {

	private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);
	
	private ApplicationPropertyService applicationPropertyService;
	
	// 从系统参数中获取邮件服务器的配置信息，
	// 并不需要用户即时收到邮件发送成功或失败的消息，因为耗时较长
	// 当用户没有收到邮件，提供一个重新发送邮件的功能
	@Override
	public void send(String toEmail, String toName, String content) {
		// 使用一个分组，查询出email的所有相关属性
		Properties emailProps = applicationPropertyService.getProperties("drip.email");
		if(emailProps == null){
			logger.error("没有配置发送邮箱信息");
			return;
		}
		HtmlEmail email = new HtmlEmail();
		String hostName = emailProps.getProperty("email.host.name");
		int smtpPort = Integer.valueOf(emailProps.getProperty("email.host.port")).intValue();
		String fromEmail = emailProps.getProperty("email.support.email");
		String displayUserName = emailProps.getProperty("email.support.displayName");
		String userName = emailProps.getProperty("email.support.auth.userName");
		String password = emailProps.getProperty("email.support.auth.password");
		String subject = emailProps.getProperty("email.support.subject.activeUser");
		
		try {
			email.setHostName(hostName);
			email.setSmtpPort(smtpPort);
			if(userName != null && !userName.trim().isEmpty()){
				email.setAuthenticator(new DefaultAuthenticator(fromEmail, password));
				email.setSSLOnConnect(true);
			}
			
			email.addTo(toEmail, toName);
			email.setFrom(fromEmail, displayUserName);
			email.setSubject(subject);
			
			email.buildMimeMessage();
			
			MimeBodyPart body = new MimeBodyPart();
			body.setContent(content, "text/html;charset=UTF-8");
			
			Multipart mp = new MimeMultipart();
			mp.addBodyPart(body);
			
			email.getMimeMessage().setContent(mp);
			email.sendMimeMessage();
		} catch (EmailException e) {
			logger.error("邮件发送失败", e);
		} catch (MessagingException e) {
			logger.error("添加邮件内容失败", e);
		}

	}
	
	public void setApplicationPropertyService(ApplicationPropertyService applicationPropertyService) {
		logger.info("注入applicationPropertyService");
		this.applicationPropertyService = applicationPropertyService;
	}

	public void unsetApplicationPropertyService(ApplicationPropertyService applicationPropertyService) {
		if (this.applicationPropertyService == applicationPropertyService) {
			logger.info("注销applicationPropertyService");
			this.applicationPropertyService = null;
		}
	}
}
