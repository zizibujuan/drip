package com.zizibujuan.drip.server.servlet.connect;

import java.io.IOException;
import java.net.URLEncoder;
import java.text.MessageFormat;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.time.DateUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.renren.api.AuthorizationException;
import com.renren.api.RennClient;
import com.renren.api.RennException;
import com.renren.api.service.BasicInformation;
import com.renren.api.service.HomeTown;
import com.renren.api.service.Image;
import com.renren.api.service.ImageSize;
import com.renren.api.service.Sex;
import com.renren.api.service.User;
import com.zizibujuan.drip.server.model.Avatar;
import com.zizibujuan.drip.server.model.UserBindInfo;
import com.zizibujuan.drip.server.model.UserInfo;
import com.zizibujuan.drip.server.service.ApplicationPropertyService;
import com.zizibujuan.drip.server.service.UserBindService;
import com.zizibujuan.drip.server.service.UserService;
import com.zizibujuan.drip.server.servlet.ServiceHolder;
import com.zizibujuan.drip.server.util.Gender;
import com.zizibujuan.drip.server.util.constant.OAuthConstants;

/**
 * 使用人人帐号登录
 * 
 * @author jzw
 * @since 0.0.1
 */
public class RenrenUserConnect extends UserConnect {
	
	private static final Logger logger = LoggerFactory.getLogger(RenrenUserConnect.class);

	@Override
	protected void toLoginPage(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		// TODO:改为一次数据库请求，获取一组参数
		ApplicationPropertyService applicationPropertyService = ServiceHolder.getDefault().getApplicationPropertyService();
		String appId = applicationPropertyService.getForString(OAuthConstants.KEY_RENREN_APP_ID);
		String hrefTemplate = applicationPropertyService.getForString(OAuthConstants.KEY_RENREN_LOGIN_PAGE_URL_TMPL);
		String redirectUri = applicationPropertyService.getForString(OAuthConstants.KEY_RENREN_REDIRECT_URL);
		redirectUri = URLEncoder.encode(redirectUri, "UTF-8");
		
		String href = MessageFormat.format(hrefTemplate, appId,redirectUri);
		resp.sendRedirect(href);
	}

	@Override
	protected void login(HttpServletRequest req, HttpServletResponse resp,
			String code) throws IOException {

		UserService userService = ServiceHolder.getDefault().getUserService();
		ApplicationPropertyService applicationPropertyService = ServiceHolder.getDefault().getApplicationPropertyService();
		UserBindService userBindService = ServiceHolder.getDefault().getUserBindService();
		
		String redirectUri = applicationPropertyService.getForString(OAuthConstants.KEY_RENREN_REDIRECT_URL);
		
		String key = applicationPropertyService.getForString(OAuthConstants.KEY_RENREN_APP_KEY);
		String secret = applicationPropertyService.getForString(OAuthConstants.KEY_RENREN_APP_SECRET);
		
		RennClient client = new RennClient(key, secret);
		try {
			client.authorizeWithAuthorizationCode(code, redirectUri);
		} catch (AuthorizationException e) {
			logger.error("从人人网获取access token失败", e);
			// 跳转到错误页面
			return;
		}
		User user = null;
		try {
			user = client.getUserService().getUserLogin();
		} catch (RennException e) {
			logger.error("从人人网获取当前登录用户失败", e);
			return;
		}
		Long dripUserId = null;
		UserBindInfo userBindInfo = userBindService.get(OAuthConstants.RENREN, user.getId());
		if(userBindInfo == null){
			userBindInfo = new UserBindInfo();
			userBindInfo.setOpenId(String.valueOf(user.getId()));
			userBindInfo.setSiteId(OAuthConstants.RENREN);
			
			UserInfo dripUser = new UserInfo();
			dripUser.setNickName(user.getName());
			BasicInformation basicInformation = user.getBasicInformation();
			if(basicInformation != null){
				Sex sex = basicInformation.getSex();
				String sexString = null;
				if(sex == null){
					sexString = Gender.UNKNOWN;
				}else if(sex.equals(Sex.MALE)){
					sexString = Gender.MALE;
				}else if(sex.equals(Sex.FEMALE)){
					sexString = Gender.FEMALE;
				}else{
					sexString = Gender.UNKNOWN;
				}
				dripUser.setSex(sexString);
				
				String birthday = basicInformation.getBirthday();
				dripUser.setBirthday(convertBirthdayOfRenren(birthday));
				HomeTown homeTown = basicInformation.getHomeTown();
				if(homeTown != null){
					dripUser.setHomeCityCode(getLocalCityCodeByRenren(null, homeTown.getProvince(), homeTown.getCity()));
					String homeCity = homeTown.getProvince()+ " " +homeTown.getCity();
					if(homeCity.trim().isEmpty()){
						homeCity = null;
					}else{
						homeCity = "中国 " + homeCity;
					}
					dripUser.setHomeCity(homeCity);
				}
			}

			List<Avatar> avatars = new ArrayList<Avatar>();
			List<Image> rennAvatars = user.getAvatar();
			for(Image image : rennAvatars){
				String urlName = null;
				String url = image.getUrl();
				Integer width = null;
				Integer height = null;
				// 为何不直接返回大小呢
				ImageSize imageSize = image.getSize();
				if(imageSize.equals(ImageSize.MAIN)){
					// 单位为pt
					urlName = "main";
					width = 200;
					height = 600;
				}else if(imageSize.equals(ImageSize.TINY)){
					urlName = "tiny";
					width = 50;
					height = 50;
				}else if(imageSize.equals(ImageSize.LARGE)){
					urlName = "large";
					width = 720;
					height = 720;
				}else if(imageSize.equals(ImageSize.HEAD)){
					urlName = "head";
					width = 100;
					height = 300;
				}
				
				addAvatar(avatars, urlName, url, width, height);
			}
			dripUserId = userService.importUser(dripUser, userBindInfo, avatars);
		}else{
			dripUserId = userBindInfo.getUserId();
		}
		
		internLogin(req, resp, dripUserId);
		resp.sendRedirect("/");
	}
	
	/**
	 * 根据城市名称获取城市代码。如果province和city为null，则获取contry的编码；
	 * 如果city为null，则获取province的编码；否则获取city的编码。
	 * 
	 * 以下实现的一个假设是城市名称没有重名，需要优化，如果contry为null，则默认指中国。
	 * 
	 * @param country 国家
	 * @param province 省份
	 * @param city 城市
	 * @return 国家/省份/城市编码，如果找不到则返回null
	 */
	private String getLocalCityCodeByRenren(
			String country, 
			String province,
			String city) {
		
		String value = null; 
		if(city != null && !city.isEmpty()){
			// 找到城市对应的编码
			value = city;
		}else if(province != null && !province.isEmpty()){
			value = province;
		}else if(country != null && !country.isEmpty()){
			value = country;
		}else if(country == null){
			value = "中国";
		}
		
		ApplicationPropertyService applicationPropertyService = ServiceHolder.getDefault().getApplicationPropertyService();
		return applicationPropertyService.getCityCodeByValue(value);
	}
	
	/**
	 * 人人的日期使用字符串表示，这里转换为日期类型。
	 * 对于各种后的这种奇葩表示，一律使用17xx-01-01表示。
	 * 在注册时，不就应该让用户可以选择60后或70后等，因为这是一个分组，不是一个选项。
	 * 
	 * @param birthday 用户生日，格式为'yyyy-mm-dd'或'y0后-mm-dd'，需要自行格式化日期显示格式。
	 * 注：年份60后，实际返回1760-mm-dd；70后，返回1770-mm-dd；80后，返回1780-mm-dd；90后，返回1790-mm-dd
	 * @return 日期类型的生日
	 */
	private Date convertBirthdayOfRenren(String birthday) {
		if(birthday == null || birthday.isEmpty())return null;
		if(birthday.endsWith("-mm-dd")){
			birthday = birthday.replace("-mm-dd", "-01-01");
		}
		Date date = null;
		try {
			date = DateUtils.parseDate(birthday, "yyyy-MM-dd");
		} catch (ParseException e) {
			logger.error("无效的日期字符串："+birthday,e);
		}
		return date;
	}
}
