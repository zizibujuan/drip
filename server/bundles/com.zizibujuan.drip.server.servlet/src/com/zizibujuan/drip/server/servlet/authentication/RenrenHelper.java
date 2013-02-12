package com.zizibujuan.drip.server.servlet.authentication;

import java.io.IOException;
import java.net.URLEncoder;
import java.text.MessageFormat;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.time.DateUtils;
import org.apache.log4j.Logger;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;

import com.renren.api.client.RenrenApiClient;
import com.renren.api.client.RenrenApiConfig;
import com.renren.api.client.utils.HttpURLUtils;
import com.zizibujuan.drip.server.service.ApplicationPropertyService;
import com.zizibujuan.drip.server.service.OAuthUserMapService;
import com.zizibujuan.drip.server.service.UserService;
import com.zizibujuan.drip.server.servlet.ServiceHolder;
import com.zizibujuan.drip.server.util.OAuthConstants;
import com.zizibujuan.drip.server.util.servlet.UserSession;

/**
 * 用人人帐号登录跳转到登录页面和处理登录结果的方法
 * @author jzw
 * @since 0.0.1
 */
public class RenrenHelper {
	private static final Logger logger = Logger.getLogger(RenrenHelper.class);
	
	public static void redirectToOauthProvider(HttpServletRequest req,
			HttpServletResponse resp) throws IOException{
		ApplicationPropertyService applicationPropertyService = ServiceHolder.getDefault().getApplicationPropertyService();
		String appId = applicationPropertyService.getForString(OAuthConstants.KEY_RENREN_APP_ID);
		String hrefTemplate= applicationPropertyService.getForString(OAuthConstants.KEY_RENREN_LOGIN_PAGE_URL_TMPL);
		String redirectUri = applicationPropertyService.getForString(OAuthConstants.KEY_RENREN_REDIRECT_URL);
		redirectUri = URLEncoder.encode(redirectUri, "UTF-8");
		
		String href=MessageFormat.format(hrefTemplate, appId,redirectUri);
		resp.sendRedirect(href);
	}
	
	public static void handleOauthReturnAndLogin(HttpServletRequest req,
			HttpServletResponse resp, String code) throws IOException{
		
		UserService userService = ServiceHolder.getDefault().getUserService();
		ApplicationPropertyService applicationPropertyService = ServiceHolder.getDefault().getApplicationPropertyService();
		OAuthUserMapService oAuthUserMapService = ServiceHolder.getDefault().getOAuthUserMapService();
		
		String redirectUri = applicationPropertyService.getForString(OAuthConstants.KEY_RENREN_REDIRECT_URL);
		String renrenOAuthTokenEndPoint = applicationPropertyService.getForString(OAuthConstants.KEY_RENREN_OAUTH_TOKEN_END_POINT);
		
		Map<String,String> parameters = new HashMap<String, String>();
		parameters.put("client_id",RenrenApiConfig.renrenApiKey);
		parameters.put("client_secret", RenrenApiConfig.renrenApiSecret);
		parameters.put("redirect_uri", redirectUri);
		parameters.put("grant_type", "authorization_code");
		parameters.put("code", code);
		String tokenResult = HttpURLUtils.doPost(renrenOAuthTokenEndPoint, parameters);
		JSONObject tokenJson = (JSONObject)JSONValue.parse(tokenResult);
		
		if(tokenJson == null){
			logger.error("从人人网获取access token失败");
			throw new Oauth2Exception("从人人网获取access token失败");
		}
		
		// TODO:在数据库中存储acess token
		// TODO:将从人人网查出的所有信息都保存起来
		// TODO：在晚上固定时间同步用户信息，可能需要传入access_token
		// access_token在数据库和session中都保存一份
		String accessToken = (String) tokenJson.get("access_token");
		Long expiresIn = (Long) tokenJson.get("expires_in");//距离过期时的时间段（秒数）
		long currentTime = System.currentTimeMillis() / 1000;
		long expiresTime = currentTime + expiresIn;//即将过期的时间点（秒数）
		
		req.getSession().setAttribute("expiresTime", expiresTime);
		req.getSession().setAttribute("accessToken", accessToken);
		
		//调用人人网API获得用户信息
		RenrenApiClient apiClient = new RenrenApiClient(accessToken, true);
		int rrUid = apiClient.getUserService().getLoggedInUser();
		String fields = "name,sex,birthday,tinyurl,headurl,mainurl,hometown_location,work_history,university_history";
		JSONArray userInfoArray = apiClient.getUserService().getInfo(String.valueOf(rrUid), fields);
		logger.info("fields:"+userInfoArray.toJSONString());
		
		if(userInfoArray == null || userInfoArray.size() == 0){
			logger.error("从人人网获取与access token相关联的用户信息失败");
			throw new Oauth2Exception("从人人网获取与access token相关联的用户信息失败");
		}
		
		JSONObject currentUser = (JSONObject) userInfoArray.get(0);
		//判断帐号关联表里有没有现成的关联
		Map<String,Object> userMapperInfo = oAuthUserMapService.getUserMapperInfo(OAuthConstants.RENREN, rrUid);
		
		if(userMapperInfo.isEmpty()){
			Map<String, Object> renrenUserInfo = renrenUserToDripUser(currentUser);
			userMapperInfo = userService.importUser(renrenUserInfo);
		}
		Long localUserId = Long.valueOf(userMapperInfo.get("localUserId").toString());
		Long mapUserId = Long.valueOf(userMapperInfo.get("MAP_USER_ID").toString());
		
		// 记录登录次数，哪个帐号登录的就记在哪个下面。
		// 这里调用肯定是用renren登录的。
		// 采取晚上
		Map<String,Object> userInfo = userService.login(localUserId, mapUserId, OAuthConstants.RENREN);
		// 在用户session中保存从第三方网站过来的最新数据，而不是从本地的数据库中获取这些数据，
		// 避免用户已经在第三方网站修改了用户信息，但是drip没能及时更新的问题。
		// session中存储的值一部分来自drip，一部分来自第三方网站
		UserSession.setUser(req, userInfo);
		logger.info("使用人人帐号登录成功，人人标识是:"+rrUid+",用户名是:"+userInfo.get("displayName")+"。");
		// 跳转到个人首页
		resp.sendRedirect("/");
	}
	
	/**
	 * 将人人上的用户信息的格式转换为drip用户的格式。
	 * @param renrenUser 人人用户信息
	 * @return drip用户信息
	 */
	private static Map<String, Object> renrenUserToDripUser(JSONObject renrenUser) {
		//name,sex,birthday,tinyurl,headurl,mainurl,hometown_location,work_history,university_history
		int rrUid = Integer.valueOf(renrenUser.get("uid").toString());
		String name = (String)renrenUser.get("name");
		int sex = Integer.valueOf(renrenUser.get("sex").toString());
		String birthday = (String)renrenUser.get("birthday");
		String headurl = (String) renrenUser.get("headurl");
		JSONObject homeTownLocation = (JSONObject) renrenUser.get("hometown_location");
		JSONArray workHistory = (JSONArray) renrenUser.get("work_history");
		JSONArray universityHistory = (JSONArray) renrenUser.get("university_history");
		
		// 以下城市信息的值都用中文描述，不是编码
		String country = (String)homeTownLocation.get("country"); //表示所在国家
		String province = (String)homeTownLocation.get("province"); //表示所在省份
		String city = (String)homeTownLocation.get("city");//表示所在城市
		
		//在帐号关联表里没有记录，用户是第一次来；为这个用户创建一个User对象
		Map<String,Object> renrenUserInfo = new HashMap<String, Object>();
		renrenUserInfo.put("nickName", name);
		renrenUserInfo.put("loginName", name);
		renrenUserInfo.put("sex", getLocalSexCodeByRenren(sex)); //表示性别，值1表示男性；值0表示女性
		renrenUserInfo.put("birthDay", convertBirthdayOfRenren(birthday));
		renrenUserInfo.put("headUrl", headurl);
		renrenUserInfo.put("homeCityCode", getLocalCityCodeByRenren(country, province, city));
		
		String homeCity = (country==null?"":country+" ")+province+ " " +city;
		if(homeCity.trim().isEmpty()){
			homeCity = null;
		}
		renrenUserInfo.put("homeCity", homeCity);
		renrenUserInfo.put("authSiteId", OAuthConstants.RENREN);
		renrenUserInfo.put("authUserId", rrUid);
		
		// 用户头像列表
		String tinyurl = (String)renrenUser.get("tinyurl");
		String mainurl = (String)renrenUser.get("mainurl");
		List<Map<String,Object>> avatarList = new ArrayList<Map<String,Object>>();
		addUserImage(avatarList,"tinyUrl",tinyurl,50,50);
		addUserImage(avatarList,"headUrl",headurl,100,100);
		addUserImage(avatarList,"mainUrl",mainurl,200,200);
		renrenUserInfo.put("avatar", avatarList);
		
		return renrenUserInfo;
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
	private static String getLocalCityCodeByRenren(
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
	 * @param birthday 表示出生时间，格式为：yyyy-mm-dd，需要自行格式化日期显示格式。
	 * 注：年份60后，实际返回1760-mm-dd；70后，返回1770-mm-dd；80后，返回1780-mm-dd；90后，返回1790-mm-dd
	 * @return 日期类型的生日
	 */
	private static Date convertBirthdayOfRenren(String birthday) {
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

	/**
	 * 将人人的性别代码映射到本网站的性别代码
	 * @param sex 表示性别，值1表示男性；值0表示女性
	 * @return 本网站的性别代码,如果没有找到，则返回null
	 */
	private static String getLocalSexCodeByRenren(int sex) {
		if(sex == 1){
			return "1";
		}else if(sex == 0){
			return "0";
		}
		logger.error("没有为“"+sex+"”找到对应的编码");
		return null;
	}
	
	private static void addUserImage(List<Map<String, Object>> avatarList,
			String urlName,
			String url,
			int width,
			int height) {
		Map<String,Object> tinyUrlMap = new HashMap<String, Object>();
		tinyUrlMap.put("urlName", urlName);
		tinyUrlMap.put("url", url);
		tinyUrlMap.put("width", width);
		tinyUrlMap.put("height", height);
		avatarList.add(tinyUrlMap);
	}
}