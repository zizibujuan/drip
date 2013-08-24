package com.zizibujuan.drip.server.tests.service;

import org.junit.Test;

import com.zizibujuan.drip.server.service.EmailService;
import com.zizibujuan.drip.server.tests.ServiceHolder;


/**
 * 发送邮件测试用例
 * @author jzw
 * @since 0.0.1
 */
public class EmailServiceTests {
	
	private EmailService emailService = ServiceHolder.getDefault().getEmailService();
	
	// 这个测试用例需要去查看邮件，除非修改，不经常执行
	@Test
	public void testSendHtmlEmail_success(){
		emailService.send("zhengwei.jin@qq.com", "name", "<html><body><div style=\"color:red\">你好</div></body></html>");
	}

}