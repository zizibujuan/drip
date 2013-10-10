package com.zizibujuan.drip.server.dao;

import java.util.Map;

import com.zizibujuan.drip.server.model.UserInfo;
import com.zizibujuan.drip.server.util.OAuthConstants;

/**
 * 用户数据访问接口
 * 
 * @author jinzw
 * @since 0.0.1
 */
public interface UserDao {

	/**
	 * 新增用户。
	 * 
	 * <pre>
	 * 用户信息的格式为:
	 * 	 	email: 注册邮箱
	 * 		password: 登录密码(已加过密)
	 * 		loginName: 登录用户名
	 *		siteId: 网站标识 {@link OAuthConstants}
	 * </pre>
	 * @param userInfo 用户信息
	 * @return 新增用户的标识
	 */
	Long add(UserInfo userInfo);
	
	/**
	 * 判断邮箱是否已被使用,不管用户有没有被激活，只要已存在于用户表中，就是被使用。
	 * TODO: 如果已经超过了激活期限，则可以在这个方法中执行删除未激活用户的操作。
	 * 
	 * @param email 有效的邮箱地址
	 * @return 已被使用则返回<code>true</code>；否则返回<code>false</code>
	 */
	boolean emailIsUsed(String email);
	
	/**
	 * 判断用户名是否已被使用
	 * 
	 * @param loginName 登录名
	 * @return 已被使用则返回<code>true</code>；否则返回<code>false</code>
	 */
	boolean loginNameIsUsed(String loginName);
	
	/**
	 * 记录发送激活邮件时间
	 * 
	 * @param loginName 登录名
	 */
	void logSendEmailTime(String loginName);
	
	
	/**
	 * 获取用户基本信息，主要往用户session中保存。
	 * 
	 * @param email 电子邮箱
	 * @param md5Password 加密后的密码
	 * @return 如果系统中存在该用户信息则返回，否则返回null
	 */
	UserInfo get(String email, String md5Password);
	
	/**
	 * 根据登录名获取用户的基本信息
	 * 
	 * @param loginName 登录名
	 * @return 用户的基本信息，如果没有查到，返回null
	 */
	UserInfo getByLoginName(String loginName);
	
	/**
	 * 激活用户
	 * 
	 * @param userId 用户标识
	 */
	void active(Long userId);
	
	/**
	 * 根据confirmKey值获取用户的基本信息，其中不包含用户头像信息，主要是通过邮件激活帐号时，
	 * 获取用户信息。
	 * @param confirmKey
	 * @return 用户基本信息
	 */
	UserInfo getByConfirmKey(String confirmKey);
	
	/**
	 * 根据token获取用户信息
	 * 
	 * @param token
	 * @return 用户信息
	 */
	UserInfo getByToken(String token);
	
	
	/**
	 * 获取本网站用户的基本信息。只包含页面显示信息，不包含用户隐私信息。
	 * 
	 * @param userId 本网站用户标识
	 * @return 用户基本信息，不包含敏感数据，因为第三方传过来的数据基本都过滤了敏感数据的，所以可以全部查出。
	 * <pre>
	 * map结构：
	 *		userId：用户标识
	 *		nickName：用户昵称
	 *		loginName: 登录名
	 *		digitalId: 为本网站用户分配的数字帐号
	 *		homeCityCode：用户家乡所在城市编码
	 *		sex：用户性别
	 *		siteId：来自哪个网站的标识
	 * </pre>
	 */
	Map<String, Object> getPublicInfo(Long userId);
	
	
	
	
	
	
	
	
	
	
	
	
	

	/**
	 * 获取用户登录信息，返回到客户端的，所以不能包含用户隐私信息。
	 * @param userId 用户标识
	 * @return <pre>用户登录信息
	 * 		realName : 用户真实姓名
	 * 		userId : 用户标识
	 * </pre> 
	 */
	Map<String, Object> getLoginInfo(Long userId);

	/**
	 * 导入第三网站的用户信息
	 * @param userInfo 用户详细信息
	 * <pre>
	 * map结构
	 * 		loginName:登录名
	 * 		nickName:昵称
	 * 		realName:真实姓名
	 * 		sex:性别代码
	 * 		headUrl:头像链接
	 * 		homeCityCode:家乡所在城市编码
	 * 		homeCity:家乡所在城市名称
	 * 		authSiteId：第三方网站标识 {@link OAuthConstants}
	 * 					如果是使用第三方网站的用户登录，则是第三方网站用户标识；如果是用本网站用户登录，则是本网站用户标识
	 * 		authUserId: 第三方网站的用户标识
	 * 		avatar：用户头像列表
	 * 			urlName:头像名称
	 * 			url：头像链接
	 * 			width：头像宽度
	 * 			height：头像高度
	 * </pre>
	 * 
	 * @return 该网站生成的用户标识
	 * <pre>
	 *  返回map的结构
	 * 		localUserId: 本网站用户标识
	 * 		connectUserId: 本网站为第三方网站用户统一生成的用户标识
	 * 		digitalId: 本网站产生的数字帐号
	 * </pre>
	 */
	Map<String, Object> importUser(Map<String, Object> userInfo);

	/**
	 * 根据数字帐号获取本网站用户的全局用户标识
	 * @param digitalId 数字帐号
	 * @return 本网站用户的全局用户标识
	 */
	Long getLocalUserIdByDigitalId(Long digitalId);


	/**
	 * 根据本网站用户标识获取用户的基本信息。
	 * 如果引用第三方用户信息，则获取第三方用户信息；否则获取本地用户信息
	 * @param localUserId 为在本网站注册的用户，或者为第三方网站用户生成的本网站用户的用户标识
	 * @return 基本用户信息，包括用户名，登录名，邮箱地址和数字帐号等
	 */
	UserInfo getBaseInfoByLocalUserId(Long localUserId);


}
