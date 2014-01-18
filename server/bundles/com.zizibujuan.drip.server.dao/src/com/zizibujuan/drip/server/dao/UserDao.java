package com.zizibujuan.drip.server.dao;

import java.util.List;
import java.util.Map;

import com.zizibujuan.drip.server.model.Avatar;
import com.zizibujuan.drip.server.model.UserBindInfo;
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
	 * 新增用户，用户添加成功后就添加初始化统计信息和自我关注
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
	 * @param login 电子邮箱或登录用户名
	 * @param md5Password 加密后的密码
	 * @return 如果系统中存在该用户信息则返回，否则返回null
	 */
	UserInfo get(String login, String md5Password);
	
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
	 * 根据用户标识，获取用户信息。注意包含用户的一些不允许公开的信息，如邮箱等。
	 * 即会有一些隐私数据，如果需要公开显示用户信息，则请使用{@link #getPublicInfo(Long)}
	 * 
	 * @param userId
	 * @return 用户信息，包含隐私数据
	 */
	UserInfo getById(Long userId);
	
	
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
	 * 导入第三网站的用户信息
	 * 
	 * @param userInfo 从第三方网站获取的用户信息
	 * @param userBindInfo 第三方网站用户的绑定信息
	 * @param avatars 用户头像信息
	 * @return 本网站的用户标识
	 */
	Long importUser(UserInfo userInfo, UserBindInfo userBindInfo, List<Avatar> avatars);
	
	/**
	 * 更新用户信息，当前版本，只允许更新用户的昵称，用户的邮箱与用户的性别
	 * 
	 * @param userInfo 用户信息
	 */
	void update(UserInfo userInfo);
	
	
	
	
	
	
	
	
	

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
