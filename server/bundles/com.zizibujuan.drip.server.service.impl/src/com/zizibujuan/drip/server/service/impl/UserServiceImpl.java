package com.zizibujuan.drip.server.service.impl;

import java.io.IOException;
import java.io.StringWriter;
import java.text.MessageFormat;
import java.util.Map;
import java.util.UUID;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.zizibujuan.drip.server.dao.ConnectUserDao;
import com.zizibujuan.drip.server.dao.UserStatisticsDao;
import com.zizibujuan.drip.server.dao.UserAttributesDao;
import com.zizibujuan.drip.server.dao.UserAvatarDao;
import com.zizibujuan.drip.server.dao.UserBindDao;
import com.zizibujuan.drip.server.dao.UserDao;
import com.zizibujuan.drip.server.model.UserInfo;
import com.zizibujuan.drip.server.model.UserStatistics;
import com.zizibujuan.drip.server.service.ApplicationPropertyService;
import com.zizibujuan.drip.server.service.EmailService;
import com.zizibujuan.drip.server.service.UserService;

/**
 * 用户服务实现类
 * 
 * @author jinzw
 * @since 0.0.1
 */
public class UserServiceImpl implements UserService {

	private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);
	private UserDao userDao;
	private EmailService emailService;
	

	// FIXME:学习如何加入salt，明白加入salt有哪些具体好处
	@Override
	public Long register(UserInfo userInfo) {
		// 加密密码
		String salt = "";
		String password = userInfo.getPassword();
		String md5Password = DigestUtils.md5Hex(password+salt);
		userInfo.setPassword(md5Password);
		// userInfo.put("salt", salt);
		
		String confirmKey = DigestUtils.md5Hex(userInfo.getLoginName() + System.nanoTime());
		userInfo.setConfirmKey(confirmKey);
		Long userId = userDao.add(userInfo);
		if(applicationPropertyService.getForString("email.active.user.auto").equals("1")){
			this.sendActiveEmail(userInfo.getEmail(), userInfo.getLoginName(), confirmKey);
		}
		
		return userId;
	}
	
	@Override
	public boolean emailIsUsed(String email) {
		return userDao.emailIsUsed(email);
	}

	@Override
	public boolean loginNameIsUsed(String loginName) {
		return userDao.loginNameIsUsed(loginName);
	}
	
	// TODO: 改为异步发送，使用新线程完成。
	// 发送激活邮件
	// 邮件发送完成后，记录发送时间
	@Override
	public void sendActiveEmail(String email, String loginName, String confirmKey) {
		StringWriter sw = new StringWriter();
		try {
			IOUtils.copy(getClass().getResourceAsStream("/active_user_template.html"), sw);
			String content = MessageFormat.format(sw.toString(), loginName, confirmKey);
			emailService.send(email, loginName, content);
			userDao.logSendEmailTime(loginName);
		} catch (IOException e) {
			logger.error("没有找到模板文件:active_user_template.html", e);
		}
	}
	
	@Override
	public UserInfo login(String login, String password) {
		// 根据邮箱和密码查找用户信息
		// 如果查到了，则保存在session中。
		String md5Password = DigestUtils.md5Hex(password);
		UserInfo userInfo = userDao.get(login, md5Password);
		
		if(userInfo == null){
			return null;
		}
		// 添加用户头像
		setAvatars(userInfo);
		// 更新用户登录状态
		String token = UUID.randomUUID().toString().replace("-", "");
		userAttributesDao.updateLoginState(userInfo.getId(),token);
		userInfo.setAccessToken(token);
		return userInfo;
	}

	private void setAvatars(UserInfo userInfo) {
		Map<String, String> avatars = userAvatarDao.get(userInfo.getId());
		userInfo.setSmallImageUrl(avatars.get("smallImageUrl"));
		userInfo.setLargeImageUrl(avatars.get("largeImageUrl"));
		userInfo.setLargerImageUrl(avatars.get("largerImageUrl"));
		userInfo.setxLargeImageUrl(avatars.get("xLargeImageUrl"));
	}
	
	
	
	@Override
	public UserInfo getByLoginName(String loginName) {
		UserInfo userInfo = userDao.getByLoginName(loginName);
		if(userInfo == null){
			return null;
		}
		setAvatars(userInfo);
		return userInfo;
	}
	
	@Override
	public void active(Long userId) {
		userDao.active(userId);
	}

	@Override
	public UserInfo getByConfirmKey(String confirmKey) {
		return userDao.getByConfirmKey(confirmKey);
	}
	
	@Override
	public UserInfo getByToken(String token) {
		return userDao.getByToken(token);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	
	private UserAttributesDao userAttributesDao;
	private UserAvatarDao userAvatarDao;
	private ConnectUserDao connectUserDao;
	private ApplicationPropertyService applicationPropertyService;
	private UserBindDao userBindDao;
	private UserStatisticsDao userStatisticsDao;
	
	
	
	//TODO:需要将获取本地用户信息和获取第三方用户信息的接口统一。
	@Override
	public Map<String, Object> login(Long localUserId, Long connectUserId) {
		String token = null;// TODO:获取第三方网站的token
		userAttributesDao.updateLoginState(connectUserId, token);
		
		// 第三方网站注册用户
		// 获取基本信息
		Map<String,Object> userInfo = connectUserDao.getPublicInfo(connectUserId);
		userInfo.put("localUserId", localUserId);
		// 获取头像信息
		Map<String,String> avatarInfo = userAvatarDao.get(connectUserId);
		userInfo.putAll(avatarInfo);

		return userInfo;
	}
	
	// 获取基本信息
	// 获取统计信息
	// 获取头像信息
	@Override
	public Map<String, Object> getPublicInfo(Long userId) {
		// TODO：需要缓存, 但是统计信息不适合缓存
		Map<String,Object> userInfo = null;
		// TODO:获取用户家乡所在地和用户性别代码。将用户家乡所在地缓存
		// 从propertyService中获取城市名称，该方法要支持缓存。
		// FIXME:直接读取本网站用户的可公开信息
		userInfo = userDao.getPublicInfo(userId);
		String cityCode = (String) userInfo.get("homeCityCode");
		if(cityCode != null && !cityCode.isEmpty()){
			userInfo.put("homeCity", applicationPropertyService.getCity(cityCode));
		}
		// 这个统计数据是所有关联用户和本网站用户的数据之和。
		UserStatistics statistics = userStatisticsDao.getUserStatistics(userId);
		userInfo.put("statistics", statistics);
		
		Map<String,String> avatarInfo = userAvatarDao.get(userId);
		userInfo.putAll(avatarInfo);
		return userInfo;
	}
	
	@Override
	public Map<String, Object> getSimpleInfo(Long digitalId) {
		Long localUserId = userDao.getLocalUserIdByDigitalId(digitalId);
		
		Map<String, Object> mapUserInfo = userBindDao.getRefUserMapperInfo(localUserId);
		if(mapUserInfo.isEmpty()){
			return mapUserInfo;
		}
		// 注意，该connectUserId是与本地用户引用用户信息的帐号，与参数中的connectGlobalUserId可能不是同一个帐号
		Long connectUserId = Long.valueOf(mapUserInfo.get("connectUserId").toString());
		Map<String, Object>userInfo = connectUserDao.getPublicInfo(connectUserId);
		userInfo.put("localUserId", localUserId);
		Map<String,String> avatarInfo = userAvatarDao.get(connectUserId);
		userInfo.putAll(avatarInfo);
		UserStatistics statistics = userStatisticsDao.getUserStatistics(localUserId);
		userInfo.put("statistics", statistics);
		return userInfo;
	}
	
	@Override
	public Map<String,Object> importUser(Map<String, Object> userInfo) {
		return userDao.importUser(userInfo);
	}
	
	@Override
	public Map<String, Object> syncUserInfo(Map<String, Object> userInfo) {
		throw new UnsupportedOperationException();
	}

	@Override
	public Map<String, Object> getLoginInfo(Long userId) {
		return userDao.getLoginInfo(userId);
	}
	
	@Override
	public UserStatistics getUserStatistics(Long userId) {
		return userStatisticsDao.getUserStatistics(userId);
	}

	public void setUserDao(UserDao userDao) {
		logger.info("注入userDao");
		this.userDao = userDao;
	}

	public void unsetUserDao(UserDao userDao) {
		if (this.userDao == userDao) {
			logger.info("注销userDao");
			this.userDao = null;
		}
	}
	
	public void setEmailService(EmailService emailService) {
		logger.info("注入emailService");
		this.emailService = emailService;
	}

	public void unsetEmailService(EmailService emailService) {
		if (this.emailService == emailService) {
			logger.info("注销emailService");
			this.emailService = null;
		}
	}
	
	
	
	
	public void setUserAttributesDao(UserAttributesDao userAttributesDao) {
		logger.info("注入userAttributesDao");
		this.userAttributesDao = userAttributesDao;
	}

	public void unsetUserAttributesDao(UserAttributesDao userAttributesDao) {
		if (this.userAttributesDao == userAttributesDao) {
			logger.info("注销userAttributesDao");
			this.userAttributesDao = null;
		}
	}
	
	public void setUserAvatarDao(UserAvatarDao userAvatarDao) {
		logger.info("注入userAvatarDao");
		this.userAvatarDao = userAvatarDao;
	}

	public void unsetUserAvatarDao(UserAvatarDao userAvatarDao) {
		if (this.userAvatarDao == userAvatarDao) {
			logger.info("注销userAvatarDao");
			this.userAvatarDao = null;
		}
	}
	
	public void setConnectUserDao(ConnectUserDao connectUserDao) {
		logger.info("注入connectUserDao");
		this.connectUserDao = connectUserDao;
	}

	public void unsetConnectUserDao(ConnectUserDao connectUserDao) {
		if (this.connectUserDao == connectUserDao) {
			logger.info("注销connectUserDao");
			this.connectUserDao = null;
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
	
	public void setUserBindDao(UserBindDao userBindDao) {
		logger.info("注入userBindDao");
		this.userBindDao = userBindDao;
	}

	public void unsetUserBindDao(UserBindDao userBindDao) {
		if (this.userBindDao == userBindDao) {
			logger.info("注销userBindDao");
			this.userBindDao = null;
		}
	}
	
	public void setUserStatisticsDao(UserStatisticsDao userStatisticsDao) {
		logger.info("注入userStatisticsDao");
		this.userStatisticsDao = userStatisticsDao;
	}

	public void unsetUserStatisticsDao(UserStatisticsDao userStatisticsDao) {
		if (this.userStatisticsDao == userStatisticsDao) {
			logger.info("注销userStatisticsDao");
			this.userStatisticsDao = null;
		}
	}

}
