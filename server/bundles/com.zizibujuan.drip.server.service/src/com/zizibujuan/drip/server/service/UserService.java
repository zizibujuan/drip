package com.zizibujuan.drip.server.service;

import java.util.Map;

import com.zizibujuan.drip.server.util.OAuthConstants;

/**
 * 用户 服务接口
 * @author jinzw
 * @since 0.0.1
 */
public interface UserService {

	/**
	 * 新增用户。
	 * <pre>
	 * 用户信息的格式为:
	 * 		login: 注册邮箱 之所以叫login，是因为也可能是手机号或用户名
	 * 		password: 登录密码
	 * 		repassword: 确认密码
	 * 		realName: 真实姓名
	 * </pre>
	 * @param userInfo 用户信息
	 * @return 新增用户的标识
	 */
	Long add(Map<String,Object> userInfo);

	/**
	 * 用户登录
	 * @param email 邮箱地址 (未加密)
	 * @param password 密码
	 * @return 如果登录失败则返回null，否则返回用户信息
	 */
	Map<String,Object> login(String email, String password);
	
	/**
	 * 用户登录，主要是记录使用第三方网站进行登录
	 * @param localUserId 本网站用户标识
	 * @param mapUserId 与第三方网站用户映射标识
	 * @param siteId 网站标识，参考 {@link OAuthConstants}
	 * @return 如果系统中存在该用户信息则返回，否则返回空的map对象。
	 * <pre>
	 * 	map结构为：
	 * 		id: 用户标识
	 *  这些信息，如果是本地用户从数据库中获取，如果是第三方用户，则从返回的记录中直接获取，不走后台
	 * 		email: 邮箱
	 * 		mobile：手机号
	 * 		displayName: 显示名
	 * 这些字段是按照网站提供的图片大小从小到打排列的
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
	Map<String, Object> login(Long localUserId, Long mapUserId, int siteId);

	/**
	 * 获取用户登录信息，返回到客户端的，所以不能包含用户隐私信息。
	 * @param userId 用户标识
	 * @return <pre>用户登录信息
	 * 		nickName : 昵称，如果没有昵称，则显示登录名
	 * 		userId : 用户标识
	 * </pre> 
	 */
	Map<String, Object> getLoginInfo(Long userId);

	/**
	 * 判断邮箱是否已被使用
	 * @param email 有效的邮箱地址
	 * @return 已存在则返回<code>true</code>；否则返回<code>false</code>
	 */
	boolean emailIsExist(String email);

	
	/**
	 * 导入第三网站的用户信息
	 * @param userInfo 用户详细信息
	 * <pre>
	 * map结构
	 * 		loginName:登录名
	 * 		nickName:昵称
	 * 		headUrl:头像链接
	 * 		authSiteId：第三方网站标识 {@link OAuthConstants}
	 * 					如果是使用第三方网站的用户登录，则是第三方网站用户标识；如果是用本网站用户登录，则是本网站用户标识
	 * 		authUserId: 第三方网站的用户标识
	 * </pre>
	 * @return 该网站的用户标识
	 * <pre>
	 *  返回map的结构
	 * 		LOCAL_USER_ID: 本网站用户标识
	 * 		MAP_USER_ID: 映射标识
	 * </pre>
	 */
	Map<String,Object> importUser(Map<String, Object> userInfo);

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
	 * @param localUserId 本网站用户标识
	 * @param mapUserId 本网站用户与第三方用户的映射标识
	 * @return 如果系统中存在该用户信息则返回，否则返回空的map对象。
	 * <pre>
	 * 	map结构为：
	 * 		id: 用户标识
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
	 * </pre>
	 */
	Map<String, Object> getPublicInfo(Long localUserId, Long mapUserId);

}
