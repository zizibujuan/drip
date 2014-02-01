package com.zizibujuan.drip.server.service;

import java.util.List;
import java.util.Map;

import com.zizibujuan.drip.server.model.Avatar;
import com.zizibujuan.drip.server.model.UserBindInfo;
import com.zizibujuan.drip.server.model.UserInfo;
import com.zizibujuan.drip.server.model.UserStatistics;
import com.zizibujuan.drip.server.util.constant.OAuthConstants;

/**
 * 用户 服务接口
 * 
 * @author jinzw
 * @since 0.0.1
 */
public interface UserService {

	/**
	 * 注册用户，注册成功后，给用户发送邮件
	 * 
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
	 * 发送激活用户的邮件
	 * 
	 * @param toEmail 用户的邮箱地址
	 * @param loginName 登录名
	 * @param confirmKey 激活确认码
	 */
	void sendActiveEmail(String toEmail, String loginName, String confirmKey);
	

	/**
	 * 用户登录。记录登录信息，但是不记录用户各项统计信息
	 * 
	 * @param login 邮箱地址或者登录名
	 * @param password 密码 (未加密)
	 * @return 如果登录失败则返回null，否则返回用户标识
	 * <pre>
	 * 主要返回的用户信息有
	 * 		id
	 * 		email
	 * 		loginName
	 * 		active
	 * 		siteId
	 * 		
	 * 		smallImageUrl: 小头像
	 * 		largeImageUrl: 
	 * 		largerImageUrl:
	 * 		xLargeImageUrl:
	 * <pre>
	 */
	UserInfo login(String login, String password);
	
	/**
	 * 根据用户标识，获取用户信息。注意包含用户的一些不允许公开的信息，如邮箱等。
	 * 即会有一些隐私数据，如果需要公开显示用户信息，则请使用{@link #getPublicInfo(Long)}
	 * 
	 * @param userId
	 * @return 用户信息，包含隐私数据
	 */
	UserInfo getById(Long userId);
	
	/**
	 * 根据token获取用户信息
	 * 
	 * @param token
	 * @return 用户信息
	 */
	 UserInfo getByToken(String token);
	
	/**
	 * 根据登录名获取用户的基本信息。
	 * 这个方法不是通用的，因为获取不到第三方网站用户的登录名
	 * 
	 * @param loginName 登录名
	 * @return 用户的基本信息，如果没有查到，返回null
	 */
	UserInfo getByLoginName(String loginName);

	
	/**
	 * 根据confirmKey值获取用户的基本信息，其中不包含用户头像信息，主要是通过邮件激活帐号时，
	 * 获取用户信息。
	 * @param confirmKey
	 * @return 用户基本信息
	 */
	UserInfo getByConfirmKey(String confirmKey);
	
	/**
	 * 激活用户,激活成功之后，要添加自我关注
	 * 
	 * @param userId 用户标识
	 */
	void active(Long userId);
	
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
	 * 用户登录，主要是记录使用第三方网站进行登录。注意每天晚上定时从第三方同步用户信息。
	 * 这个方法获取用户的静态信息，即变化不是很频繁的信息，主要是用来在session中保存。
	 * 因此不会返回用户统计信息。
	 * 
	 * @param userId 为本网站用户生成的全局用户标识
	 * @return 返回用户静态信息，如果系统中存在该用户信息则返回null。
	 */
	UserInfo login(Long userId);
	
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
	 * @param userId 本网站为本网站用户产生的全局用户标识
	 * @return 可以公开的用户信息。如果系统中存在该用户信息则返回，否则返回空的map对象。
	 * <pre>
	 * 	map结构为：
	 * 		userId: 本网站用户标识
	 * 		nickName: 用户昵称
	 * 		loginName: 登录名
	 * 		digitalId: 数字帐号，暂时没有启用。
	 * 		sex: 性别代码
	 * 		siteId:网站标识
	 * 		homeCityCode:家乡所在地代码
	 * 		homeCity：家乡所在地
	 * 			country：国家
	 * 			province：省
	 * 			city：市
	 * 			county：县
	 * 		statistics
	 * 			fanCount：粉丝数
	 * 			followCount: 关注人数
	 * 			//exerDraftCount： 习题草稿数
	 * 			exerPublishCount：发布的习题数
	 * 			answerCount： 习题总数 = 习题草稿数+发布的习题数
	 * 
	 * 		smallImageUrl: 小头像
	 * 		largeImageUrl: 
	 * 		largerImageUrl:
	 * 		xLargeImageUrl:
	 * </pre>
	 */
	Map<String, Object> getPublicInfo(Long userId);
	
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
	 * 		nickName : 昵称，如果没有昵称，则显示登录名
	 * 		userId : 用户标识
	 * </pre> 
	 */
	Map<String, Object> getLoginInfo(Long userId);

	/**
	 * 同步用户信息。
	 */
	Map<String,Object> syncUserInfo(Map<String, Object> userInfo);


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
	 * @param userId 本网站用户标识
	 * @return 用户的统计信息
	 * <pre>
	 * map结构：
	 * 	 	fanCount：粉丝数
	 * 		followCount: 关注人数
	 * 		exerDraftCount： 习题草稿数
	 * 		exerPublishCount：发布的习题数
	 * 		answerCount： 习题总数 = 习题草稿数+发布的习题数
	 * </pre>
	 */
	UserStatistics getUserStatistics(Long userId);

}
