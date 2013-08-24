package com.zizibujuan.drip.server.service;

/**
 * 本网站通用的邮件发送服务
 * @author jzw
 * @since 0.0.1
 */
public interface EmailService {

	/**
	 * 发送邮件
	 * @param toEmail 接受人邮箱
	 * @param toName 接受人名称
	 * @param content 邮件内容
	 */
	void send(String toEmail, String toName, String content);
}
