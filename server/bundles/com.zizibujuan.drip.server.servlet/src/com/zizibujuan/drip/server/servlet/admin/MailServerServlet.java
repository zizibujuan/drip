package com.zizibujuan.drip.server.servlet.admin;

import java.io.IOException;
import java.net.UnknownHostException;
import java.util.HashMap;
import java.util.Map;

import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMultipart;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.apache.commons.mail.DefaultAuthenticator;
import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.HtmlEmail;
import org.eclipse.core.runtime.IPath;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.zizibujuan.drip.server.util.servlet.BaseServlet;
import com.zizibujuan.drip.server.util.servlet.RequestUtil;
import com.zizibujuan.drip.server.util.servlet.ResponseUtil;

/**
 * 测试邮件服务器
 * 
 * @author jzw
 * @since 0.0.1
 */
public class MailServerServlet extends BaseServlet {

	private static final long serialVersionUID = -9033812596979187100L;
	
	private static final Logger logger = LoggerFactory.getLogger(MailServerServlet.class);

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		traceRequest(req);
		IPath path = getPath(req);
		if(path.segmentCount() == 0){
			Map<String, Object> map = RequestUtil.fromJsonObject(req);
			String hostName = ObjectUtils.toString(map.get("hostName"));
			int smtpPort = NumberUtils.toInt(ObjectUtils.toString(map.get("smtpPort")));
			String userName = "";
			String password = null;
			String fromEmail = ObjectUtils.toString(map.get("fromEmail"));
			String displayUserName = ObjectUtils.toString(map.get("fromEmailDisplayName"));
			String toEmail = ObjectUtils.toString(map.get("toEmail"));
			String toName = ObjectUtils.toString(map.get("toName"));
			String subject = ObjectUtils.toString(map.get("subject"));
			String content = ObjectUtils.toString(map.get("content"));
			try {
				HtmlEmail email = new HtmlEmail();
				email.setHostName(hostName);
				email.setSmtpPort(smtpPort);
				if(userName != null && !userName.trim().isEmpty()){
					email.setAuthenticator(new DefaultAuthenticator(userName, password));
					email.setSSLOnConnect(true);
				}
				
				email.setFrom(fromEmail, displayUserName);
				email.addTo(toEmail, toName);
				
				email.setSubject(subject);
				
				email.buildMimeMessage();
				
				MimeBodyPart body = new MimeBodyPart();
				body.setContent(content, "text/html;charset=UTF-8");
				
				Multipart mp = new MimeMultipart();
				mp.addBodyPart(body);
				
				email.getMimeMessage().setContent(mp);
				email.sendMimeMessage();
				ResponseUtil.toJSON(req, resp);
			} catch (EmailException e) {
				logger.error("邮件发送失败", e);
				ResponseUtil.toJSON(req, resp, new HashMap<String, Object>(), HttpServletResponse.SC_FORBIDDEN);
			} catch (MessagingException e) {
				logger.error("添加邮件内容失败", e);
				ResponseUtil.toJSON(req, resp, new HashMap<String, Object>(), HttpServletResponse.SC_FORBIDDEN);
			}
			return;
		}
		super.doPost(req, resp);
	}
	
}
