package com.zizibujuan.drip.server.service;

import java.util.Map;

import com.zizibujuan.drip.server.model.UserInfo;
import com.zizibujuan.drip.server.util.OAuthConstants;

/**
 * 用户 服务接口
 * @author jinzw
 * @since 0.0.1
 */
public interface UserService {

	/**
	 * 注册用户，注册成功后，给用户发送邮件
	 * @param userInfo 用户信息
	 * <pre>
	 * 用户信息的格式为:
	 * 		email: 注册邮箱
	 * 		password: 登录密码
	 * 		loginName: 登录用户名
	 *		siteId: 网站标识 {@link OAuthConstants}
	 * </pre>
	 * @return 新增用户的标识
	 */
	Long register(UserInfo userInfo);
	
	/**
	 * 判断邮箱是否已被使用
	 * @param email 有效的邮箱地址
	 * @return 已被使用则返回<code>true</code>；否则返回<code>false</code>
	 */
	boolean emailIsUsed(String email);
	
	/**
	 * 判断用户名是否已被使用
	 * @param loginName 登录名
	 * @return 已被使用则返回<code>true</code>；否则返回<code>false</code>
	 */
	boolean loginNameIsUsed(String loginName);

	/**
	 * 用户登录
	 * @param email 邮箱地址 (未加密)
	 * @param password 密码
	 * @return 如果登录失败则返回null，否则返回用户信息
	 * <pre>
	 * 	map结构为：
	 * 		localUserId: 本网站为本网站用户生成的全局用户标识
	 * 		connectUserId: 本网站为第三方网站用户生成的全局用户标识
	 * 		siteId：与哪个网站的用户关联
	 * 		email: 邮箱
	 * 		mobile：手机号
	 * 		nickName: 用户昵称
	 * 		loginName: 登录名
	 * 		digitalId: 为本网站用户分配的数字帐号
	 * 这些字段是按照网站提供的图片尺寸大小从小到大排列的
	 * 		smallImageUrl: 小头像
	 * 		largeImageUrl: 
	 * 		largerImageUrl:
	 * 		xLargeImageUrl:
	 * 
	 * </pre>
	 */
	Map<String,Object> login(String email, String password);
	
	/**
	 * 用户登录，主要是记录使用第三方网站进行登录。注意每天晚上定时从第三方同步用户信息。
	 * 这个方法获取用户的静态信息，即变化不是很频繁的信息，主要是用来在session中保存。
	 * 因此不会返回用户统计信息。
	 * @param localUserId 为本网站用户生成的全局用户标识
	 * @param connectUserId 本网站为第三方网站用户生成的全局用户标识
	 * @return 如果系统中存在该用户信息则返回，否则返回空的map对象。
	 * <pre>
	 * 	map结构为：
	 * 		localUserId: 本网站为本网站用户生成的全局用户标识
	 * 		connectUserId: 本网站为第三方网站用户生成的全局用户标识
	 * 		siteId：与哪个网站的用户关联
	 * 		email: 邮箱
	 * 		mobile：手机号
	 * 		nickName: 用户昵称
	 * 		loginName: 登录名
	 * 		digitalId: 为本网站用户分配的数字帐号
	 * 这些字段是按照网站提供的图片尺寸大小从小到大排列的
	 * 		smallImageUrl: 小头像
	 * 		largeImageUrl: 
	 * 		largerImageUrl:
	 * 		xLargeImageUrl:
	 * 
	 * </pre>
	 * 
	 */
	Map<String, Object> login(Long localUserId, Long connectUserId);

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
	 * 导入第三网站的用户信息
	 * @param userInfo 用户详细信息
	 * <pre>
	 * map结构
	 * 		loginName:登录名
	 * 		nickName:昵称
	 * 		realName:真实姓名
	 * 		sex:性别代码
	 * 		birthday:生日 java.util.Date
	 * 		homeCityCode:家乡所在城市编码
	 * 		homeCity:家乡所在城市名称
	 * 		siteId：第三方网站标识 {@link OAuthConstants}
	 * 					如果是使用第三方网站的用户登录，则是第三方网站用户标识；如果是用本网站用户登录，则是本网站用户标识
	 * 		openId: 第三方网站的用户标识
	 * 		avatar：用户头像列表
	 * 			urlName:头像名称
	 * 			url：头像链接
	 * 			width：头像宽度
	 * 			height：头像高度
	 * </pre>
	 * @return 该网站的用户标识
	 * <pre>
	 *  返回map的结构
	 * 		localUserId: 本网站用户标识
	 * 		connectUserId: 本网站为第三方网站用户统一生成的用户标识
	 *      digitalId: 本网站产生的数字帐号
	 * </pre>
	 */
	Map<String,Object> importUser(Map<String, Object> userInfo);
	
	/**
	 * 同步用户信息。
	 */
	Map<String,Object> syncUserInfo(Map<String, Object> userInfo);

	/**
	 * 获取可以公开的用户信息，这些信息会在其他用户的页面上显示，剔除掉了用户的隐私信息。
	 * 因为用户信息存储在多个表中，这里将一些基本的可公开的用户信息组合在一起。<br/>
	 * 返回的信息包含三类信息:
	 * <ul>
	 * 	<li>基本信息</li>
	 * 	<li>统计信息</li>
	 *  <li>头像信息</li>
	 * </ul>
	 * 
	 * <p>在界面上可以直接通过mapUserId获取用户信息，无需id</p>
	 * @param localGlobalUserId 本网站为本网站用户产生的全局用户标识
	 * @return 可以公开的用户信息。如果系统中存在该用户信息则返回，否则返回空的map对象。
	 * <pre>
	 * 	map结构为：
	 * 		localUserId: 本地用户标识，即localUserId
	 * 		connectUserId：本网站为第三方用户生成的代理主键
	 * 		nickName: 用户昵称
	 * 		loginName: 登录名
	 * 		digitalId: 为本网站用户分配的数字帐号,任何来自第三方网站的用户，本网站都会分配一个数字帐号。
	 * 		sex: 性别代码
	 * 		siteId:网站标识
	 * 		homeCityCode:家乡所在地代码
	 * 		homeCity：家乡所在地
	 * 			country：国家
	 * 			province：省
	 * 			city：市
	 * 			county：县
	 * 
	 * 		fanCount：粉丝数
	 * 		followCount: 关注人数
	 * 		exerDraftCount： 习题草稿数
	 * 		exerPublishCount：发布的习题数
	 * 		answerCount： 习题总数 = 习题草稿数+发布的习题数
	 * 
	 * 		smallImageUrl: 小头像
	 * 		largeImageUrl: 
	 * 		largerImageUrl:
	 * 		xLargeImageUrl:
	 * </pre>
	 */
	Map<String, Object> getPublicInfo(Long localGlobalUserId);

	/**
	 * 获取简化的用户信息
	 * @param digitalId 数字帐号
	 * @return 简化的用户信息
	 * <pre>
	 *  map结构：
	 *		digitalId: 数字帐号
	 *      localUserId: 全局用户标识
	 *      connectUserId:
	 *      nickName: 昵称
	 *      loginName: 登录名
	 *      smallImageUrl: 小头像
	 *      largeImageUrl: 
	 * 		largerImageUrl:
	 * 		xLargeImageUrl:
	 * 
	 * </pre>
	 */
	Map<String, Object> getSimpleInfo(Long digitalId);

	/**
	 * 获取本地用户的统计信息
	 * @param localUserId 为本地用户生成的全局用户标识
	 * @return 本地用户的统计信息
	 * <pre>
	 * map结构：
	 * 	 	fanCount：粉丝数
	 * 		followCount: 关注人数
	 * 		exerDraftCount： 习题草稿数
	 * 		exerPublishCount：发布的习题数
	 * 		answerCount： 习题总数 = 习题草稿数+发布的习题数
	 * </pre>
	 */
	Map<String, Object> getLocalUserStatistics(Long localUserId);

}
