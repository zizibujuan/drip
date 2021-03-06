package com.zizibujuan.drip.server.tests.service;

import static org.junit.Assert.assertNotNull;

import java.util.List;
import java.util.Map;

import junit.framework.Assert;

import org.apache.commons.lang3.math.NumberUtils;
import org.junit.Test;

import com.zizibujuan.drip.server.model.UserInfo;
import com.zizibujuan.drip.server.util.ApplicationPropertyKey;
import com.zizibujuan.drip.server.util.Gender;
import com.zizibujuan.drip.server.util.OAuthConstants;
import com.zizibujuan.drip.server.util.dao.DatabaseUtil;

/**
 * 用户服务测试用例
 * 
 * @author jzw
 * @since 0.0.1
 */
public class UserServiceTests extends AbstractUserTests{
	
	private static final String SQL_GET_USER = "SELECT "
			+ "LOGIN_PWD,"
			+ "LOGIN_NAME,"
			+ "NICK_NAME,"
			+ "EMAIL,"
			+ "MOBILE,"
			+ "ACCESS_TOKEN,"
			+ "EXPIRES_TIME,"
			+ "REAL_NAME,"
			+ "ID_CARD,"
			+ "SEX,"
			+ "BLOOD,"
			+ "BIRTHDAY, "
			+ "INTRODUCE,"
			+ "LIVE_CITY_CODE,"
			+ "HOME_CITY_CODE,"
			+ "HOME_CITY,"
			+ "CREATE_TIME,"
			+ "UPDATE_TIME,"
			+ "ACTIVITY "
			+ "FROM "
			+ "DRIP_USER_INFO "
			+ "WHERE "
			+ "DBID = ?";
	
	private static final String SQL_LIST_AVATAR = "SELECT "
			+ "URL_NAME, "
			+ "WIDTH, "
			+ "HEIGHT, "
			+ "URL, "
			+ "CREATE_TIME, "
			+ "UPDATE_TIME "
			+ "FROM "
			+ "DRIP_USER_AVATAR "
			+ "WHERE "
			+ "USER_ID = ? "
			+ "ORDER BY WIDTH";
	
	private static final String SQL_GET_USER_STATISTICS = "SELECT "
			+ "FAN_COUNT,"
			+ "FOLLOW_COUNT,"
			+ "EXER_DRAFT_COUNT,"
			+ "EXER_PUBLISH_COUNT,"
			+ "ANSWER_COUNT "
			+ "FROM "
			+ "DRIP_USER_STATISTICS "
			+ "WHERE "
			+ "USER_ID = ?";
	
	private static final String SQL_LIST_USER_ATTRIBUTES = "SELECT "
			+ "ATTR_NAME,"
			+ "ATTR_VALUE "
			+ "FROM "
			+ "DRIP_USER_ATTRIBUTES "
			+ "WHERE "
			+ "USER_ID = ? "
			+ "ORDER BY ATTR_NAME";
	
	private static final String SQL_GET_USER_BIND = "SELECT "
			+ "DBID,"
			+ "USER_ID "
			+ "FROM "
			+ "DRIP_USER_BIND "
			+ "WHERE "
			+ "OPEN_ID = ? AND "
			+ "SITE_ID = ?";
	
	private static final String SQL_GET_USER_RELATION = "SELECT "
			+ "DBID, "
			+ "CRT_TM "
			+ "FROM "
			+ "DRIP_USER_RELATION "
			+ "WHERE "
			+ "USER_ID = ? AND "
			+ "WATCH_USER_ID = ?";
	@Test
	public void testImportUser(){
		Long userId = null;
		try{
			int siteId = OAuthConstants.QQ;
			String openId = "a";
			String nickName = "b";
			String sex = Gender.MALE;
					
			userId = importUser(siteId, openId, nickName, sex);
			
			Map<String,Object> localUserInfo = DatabaseUtil.queryForMap(dataSource, SQL_GET_USER, userId);
		
			Assert.assertNull(localUserInfo.get("LOGIN_PWD"));
			Assert.assertNull(localUserInfo.get("LOGIN_NAME"));
			Assert.assertEquals(nickName, localUserInfo.get("NICK_NAME"));
			Assert.assertNull(localUserInfo.get("EMAIL"));
			Assert.assertNull(localUserInfo.get("MOBILE"));
			Assert.assertNull(localUserInfo.get("ACCESS_TOKEN"));
			Assert.assertNull(localUserInfo.get("EXPIRES_TIME"));
			Assert.assertNull(localUserInfo.get("REAL_NAME"));
			Assert.assertNull(localUserInfo.get("ID_CARD"));
			Assert.assertEquals(sex, localUserInfo.get("SEX"));
			Assert.assertNull(localUserInfo.get("BLOOD"));
			Assert.assertNull(localUserInfo.get("BIRTHDAY"));
			Assert.assertNull(localUserInfo.get("INTRODUCE"));
			Assert.assertNull(localUserInfo.get("LIVE_CITY_CODE"));
			Assert.assertNull(localUserInfo.get("HOME_CITY_CODE"));
			Assert.assertNull(localUserInfo.get("HOME_CITY"));
			Assert.assertNotNull(localUserInfo.get("CREATE_TIME"));
			Assert.assertNull(localUserInfo.get("UPDATE_TIME"));
			Assert.assertTrue(Boolean.valueOf(localUserInfo.get("ACTIVITY").toString()));
			
			// 在DRIP_USER_AVATAR中插入第三方用户的头像信息
			
			List<Map<String,Object>> avatars = DatabaseUtil.queryForList(dataSource, SQL_LIST_AVATAR, userId);
			Assert.assertTrue(avatars.size() == 3);
			
			Assert.assertEquals("tinyUrl", avatars.get(0).get("URL_NAME").toString());
			Assert.assertEquals(50, Integer.valueOf(avatars.get(0).get("WIDTH").toString()).intValue());
			Assert.assertEquals(50, Integer.valueOf(avatars.get(0).get("HEIGHT").toString()).intValue());
			Assert.assertEquals("http://a", avatars.get(0).get("URL").toString());
			
			Assert.assertEquals("headUrl", avatars.get(1).get("URL_NAME").toString());
			Assert.assertEquals(100, Integer.valueOf(avatars.get(1).get("WIDTH").toString()).intValue());
			Assert.assertEquals(100, Integer.valueOf(avatars.get(1).get("HEIGHT").toString()).intValue());
			Assert.assertEquals("http://b", avatars.get(1).get("URL").toString());
			
			Assert.assertEquals("mainUrl", avatars.get(2).get("URL_NAME").toString());
			Assert.assertEquals(200, Integer.valueOf(avatars.get(2).get("WIDTH").toString()).intValue());
			Assert.assertEquals(200, Integer.valueOf(avatars.get(2).get("HEIGHT").toString()).intValue());
			Assert.assertEquals("http://c", avatars.get(2).get("URL").toString());
			
			// 在DRIP_USER_ATTRIBUTES中插入第三方用户的其他属性信息。
			List<Map<String, Object>> attrs = DatabaseUtil.queryForList(dataSource, SQL_LIST_USER_ATTRIBUTES, userId);
			Assert.assertTrue(attrs.size() == 3);
			
			Assert.assertEquals(ApplicationPropertyKey.INVALID_PASSWORD_ATTEMPTS, attrs.get(0).get("ATTR_NAME").toString());
			Assert.assertEquals("0", attrs.get(0).get("ATTR_VALUE").toString());
			
			Assert.assertEquals(ApplicationPropertyKey.LOGIN_COUNT, attrs.get(1).get("ATTR_NAME").toString());
			Assert.assertEquals("0", attrs.get(1).get("ATTR_VALUE").toString());
			
			Assert.assertEquals(ApplicationPropertyKey.LOGIN_LAST_LOGIN_MILLIS, attrs.get(2).get("ATTR_NAME").toString());
			Assert.assertNotNull(attrs.get(2).get("ATTR_VALUE"));
			  
			// 在DRIP_LOCAL_USER_STATISTICS中插入本网站用户的初始统计信息，值都为0
			Map<String,Object> statistics = DatabaseUtil.queryForMap(dataSource, SQL_GET_USER_STATISTICS, userId);
			Assert.assertEquals(0, Integer.valueOf(statistics.get("FAN_COUNT").toString()).intValue());
			Assert.assertEquals(0, Integer.valueOf(statistics.get("FOLLOW_COUNT").toString()).intValue());
			Assert.assertEquals(0, Integer.valueOf(statistics.get("EXER_DRAFT_COUNT").toString()).intValue());
			Assert.assertEquals(0, Integer.valueOf(statistics.get("EXER_PUBLISH_COUNT").toString()).intValue());
			Assert.assertEquals(0, Integer.valueOf(statistics.get("ANSWER_COUNT").toString()).intValue());
			
			// 在DRIP_USER_BIND中绑定前面插入的两个帐号
			
			Map<String,Object> bindInfo = DatabaseUtil.queryForMap(dataSource, SQL_GET_USER_BIND, openId, siteId);
			Assert.assertNotNull(bindInfo.get("DBID"));
			Assert.assertEquals(userId, Long.valueOf(bindInfo.get("USER_ID").toString()));
			
			// 在DRIP_USER_RELATION中插入第三方用户自我关注信息
			Map<String,Object> relationInfo = DatabaseUtil.queryForMap(dataSource, SQL_GET_USER_RELATION, userId, userId);
			Assert.assertNotNull(relationInfo.get("DBID"));
			Assert.assertNotNull(relationInfo.get("CRT_TM"));
		}finally{
			deleteTestUser(userId);
		}
	}
	

	// FIXME：导入后发现缺少信息，则提示补充。
	/**
	 *  如果本地帐号只与一个帐号关联，则直接引用第三方帐号信息；
	 *  如果有多个关联，则先把第一次关联的复制到本地帐号中，然后再提示用户是否合并多个第三方帐号的信息。
	 */
	
	/*
	 * 暴力清除数据脚本
delete from DRIP_USER_BIND;
delete from DRIP_GLOBAL_USER_INFO;
delete from DRIP_USER_RELATION;
DELETE FROM DRIP_USER_ATTRIBUTES;
DELETE FROM DRIP_USER_AVATAR;
DELETE FROM DRIP_USER_AVATAR;
delete from DRIP_LOCAL_USER_STATISTICS;
	 */
	/**
	 * TODO:没有测试和实现用户教育和工作经历
	 */
	@Test
	public void testGetPublicInfo(){
		Long userId = null;
		try{
			int siteId = OAuthConstants.QQ;
			String openId = "a";
			String nickName = "b";
			String sex = Gender.MALE;
					
			userId = importUser(siteId, openId, nickName, sex);
			
			Map<String,Object> result = userService.getPublicInfo(userId);
			
			// 这里查出的是第三方用户的信息，因此无法获得digitalId的值
			Assert.assertNull(result.get("digitalId"));
			Assert.assertEquals(userId.longValue(), NumberUtils.toLong(result.get("userId").toString()));
			Assert.assertEquals(siteId, NumberUtils.toInt(result.get("siteId").toString()));
			Assert.assertEquals(nickName, result.get("nickName").toString());
			Assert.assertEquals(sex, result.get("sex").toString());
			Assert.assertNull(result.get("loginName"));
			
			@SuppressWarnings("unchecked")
			Map<String, Object> homeCity = (Map<String, Object>) result.get("homeCity");
			Assert.assertEquals("中国", homeCity.get("country").toString());
			Assert.assertEquals("河北省", homeCity.get("province").toString());
			Assert.assertEquals("石家庄", homeCity.get("city").toString());
			
			// 对比头像信息
			Assert.assertEquals("http://a", result.get("smallImageUrl").toString());
			Assert.assertEquals("http://b", result.get("largeImageUrl").toString());
			Assert.assertEquals("http://c", result.get("largerImageUrl").toString());
			
			// 统计信息
			Assert.assertEquals(0, Integer.valueOf(result.get("fanCount").toString()).intValue());
			Assert.assertEquals(0, Integer.valueOf(result.get("followCount").toString()).intValue());
			Assert.assertEquals(0, Integer.valueOf(result.get("exerDraftCount").toString()).intValue());
			Assert.assertEquals(0, Integer.valueOf(result.get("exerPublishCount").toString()).intValue());
			Assert.assertEquals(0, Integer.valueOf(result.get("answerCount").toString()).intValue());
		}finally{
			super.deleteTestUser(userId);
		}
		
	}
	/**
	 * 导入第三网站的用户信息
	 * @param userInfo 用户详细信息
	 * <pre>
	 * map结构
	 * 		loginName:登录名
	 * 		nickName:昵称
	 * 		sex:性别代码
	 * 		homeCityCode:家乡所在城市编码
	 * 		homeCity:家乡所在城市名称
	 * 		siteId：第三方网站标识 {@link OAuthConstants}
	 * 					如果是使用第三方网站的用户登录，则是第三方网站用户标识；如果是用本网站用户登录，则是本网站用户标识
	 * 		authUserId: 第三方网站的用户标识
	 * 		avatar：用户头像列表
	 * 			urlName:头像名称
	 * 			url：头像链接
	 * 			width：头像宽度
	 * 			height：头像高度
	 * </pre>
	 * @return 该网站的用户标识
	 * <pre>
	 *  返回map的结构
	 * 		LOCAL_USER_ID: 本网站用户标识
	 * 		MAP_USER_ID: 映射标识
	 * </pre>
	 */

	 /**
	 * 获取用户基本信息，是用户可以对外公开的信息，剔除掉了用户的隐私信息。
	 * 因为用户信息存储在多个表中，这里将一些基本的可公开的用户信息组合在一起。<br/>
	 * 返回的信息包含三类信息:
	 * <ul>
	 * 	<li>基本信息</li>
	 * 	<li>统计信息</li>
	 *  <li>头像信息</li>
	 * </ul>
	 * 
	 * <p>在界面上可以直接通过mapUserId获取用户信息，无需id</p>
	 * @param localUserId 本网站用户标识
	 * @param mapUserId 本网站用户与第三方用户的映射标识
	 * @return 如果系统中存在该用户信息则返回，否则返回空的map对象。
	 * <pre>
	 * 	map结构为：
	 * 		id: 本地用户标识，即localUserId
	 * 		mapUserId：用户映射标识
	 * 		displayName: 显示名
	 * 		fanCount：粉丝数
	 * 		followCount: 关注人数
	 * 		exerDraftCount： 习题草稿数
	 * 		exerPublishCount：发布的习题数
	 * 		answerCount： 习题总数 = 习题草稿数+发布的习题数
	 * 		smallImageUrl: 小头像
	 * 		largeImageUrl: 
	 * 		largerImageUrl:
	 * 		xLargeImageUrl:
	 * 
	 * 		sex: 性别代码
	 * 		homeCityCode:家乡所在地代码
	 * 		homeCity：家乡所在地
	 * 			country：国家
	 * 			province：省
	 * 			city：市
	 * 			county：县
	 * 		fromSite:网站标识
	 * </pre>
	 */

	/**
	 * 测试使用第三方网站用户登录
	 */
	@Test
	public void testLogin_Oauth(){
		Long userId = null;
		try{
			int siteId = OAuthConstants.QQ;
			String openId = "a";
			String nickName = "b";
			String sex = Gender.MALE;
					
			userId = importUser(siteId, openId, nickName, sex);
			
			/**
			 * 用户登录，主要是记录使用第三方网站进行登录。注意第三方用户的所有信息都是从本地获取，每天晚上定时从第三方同步用户信息。
			 * @param localUserId 本网站用户标识
			 * @param connectUserId 本网站为第三方网站用户生成的用户标识
			 * @param siteId 网站标识，参考 {@link OAuthConstants}
			 * @return 如果系统中存在该用户信息则返回，否则返回空的map对象。
			 * <pre>
			 * 	map结构为：
			 * 		id: 本地用户标识
			 * 		siteId：与哪个网站的用户关联
			 *  这些信息，如果是本地用户从数据库中获取，如果是第三方用户，则从返回的记录中直接获取，不走后台
			 * 		email: 邮箱
			 * 		mobile：手机号
			 * 		nickName: 显示名
			 * 这些字段是按照网站提供的图片尺寸大小从小到大排列的
			 * 		smallImageUrl: 小头像
			 * 		largeImageUrl: 
			 * 		largerImageUrl:
			 * 		xLargeImageUrl:
			 * 
			 * 以下字段从本地用户信息中获取
			 * 		fanCount：粉丝数
			 * 		followCount: 关注人数
			 * 		exerDraftCount： 习题草稿数
			 * 		exerPublishCount：发布的习题数
			 * 		answerCount： 习题总数 = 习题草稿数+发布的习题数
			 * </pre>
			 */
			UserInfo result = userService.login(userId);
			assertNotNull(result);
			
//			Assert.assertEquals(localGlobalUserId.longValue(), NumberUtils.toLong(result.get("localUserId").toString()));
//			Assert.assertEquals(siteId, NumberUtils.toInt(result.get("siteId").toString()));
//			Assert.assertNull(result.get("email"));
//			Assert.assertNull(result.get("mobile"));
//			Assert.assertEquals(nickName, result.get("nickName").toString());
//			Assert.assertNull(result.get("realName"));
//			
//			// 对比头像信息
//			Assert.assertEquals("http://a", result.get("smallImageUrl").toString());
//			Assert.assertEquals("http://b", result.get("largeImageUrl").toString());
//			Assert.assertEquals("http://c", result.get("largerImageUrl").toString());
			
			// 统计信息
			// 最新版本的方法中没有返回用户统计信息
//			Assert.assertEquals(0, Integer.valueOf(result.get("fanCount").toString()).intValue());
//			Assert.assertEquals(0, Integer.valueOf(result.get("followCount").toString()).intValue());
//			Assert.assertEquals(0, Integer.valueOf(result.get("exerDraftCount").toString()).intValue());
//			Assert.assertEquals(0, Integer.valueOf(result.get("exerPublishCount").toString()).intValue());
//			Assert.assertEquals(0, Integer.valueOf(result.get("answerCount").toString()).intValue());
			
		}finally{
			super.deleteTestUser(userId);
		}
	}
}
