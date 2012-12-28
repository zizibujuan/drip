package com.zizibujuan.drip.server.dao;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Map;

import com.zizibujuan.drip.server.util.OAuthConstants;

/**
 * 用户数据访问接口
 * @author jinzw
 * @since 0.0.1
 */
public interface UserDao {

	/**
	 * 新增用户。
	 * <pre>
	 * 用户信息的格式为:
	 * 		login: 注册邮箱
	 * 		password: 登录密码(已加过密)
	 * 		repassword: 确认密码
	 * 		realName: 真实姓名
	 * </pre>
	 * @param userInfo 用户信息
	 * @return 新增用户的标识
	 */
	Long add(Map<String,Object> userInfo);

	/**
	 * 获取用户基本信息，主要往用户session中保存。
	 * @param email 电子邮箱
	 * @param md5Password 加密后的密码
	 * @return 如果系统中存在该用户信息则返回，否则返回空的map对象
	 */
	Map<String, Object> get(String email, String md5Password);

	/**
	 * 获取用户基本信息，主要往用户session中保存。其中包括了用户的邮箱，手机号等保密信息
	 * @param userId 用户标识
	 * @return 如果系统中存在该用户信息则返回，否则返回空的map对象。
	 * <pre>
	 * 	map结构为：
	 * 		id: 用户标识
	 * 		email: 邮箱
	 * 		mobile：手机号
	 * 		displayName: 显示名
	 * 		fanCount：粉丝数
	 * 		followCount: 关注人数
	 * 		exerDraftCount： 习题草稿数
	 * 		exerPublishCount：发布的习题数
	 * 		answerCount： 习题总数 = 习题草稿数+发布的习题数
	 * </pre>
	 */
	Map<String, Object> getSimple(Long userId);
	
	/**
	 * 获取用户基本信息，是用户可以对外公开的信息，剔除掉了用户的隐私信息
	 * @param userId 用户标识
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
	Map<String, Object> getPublicInfo(Long userId);
	
	/**
	 * 获取用户的完整信息
	 * @param userId 用户标识
	 * @return 用户的完整信息
	 */
	Map<String, Object> getFull(Long userId);

	/**
	 * 更新登录状态。已过期，将在0.0.2版本中删除，请使用 {@link UserAttributesDao#updateLoginState}
	 * @param userId 用户标识
	 */
	@Deprecated
	void updateLoginState(Long userId);

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
	 * 判断邮箱是否已被使用
	 * @param email 有效的邮箱地址
	 * @return 已存在则返回<code>true</code>；否则返回<code>false</code>
	 */
	boolean emailIsExist(String email);
	
	/**
	 * 添加一道习题后，在用户的添加习题数上加1
	 * @param con 数据库链接
	 * @param userId 用户标识
	 * @throws SQLException 
	 */
	void increaseExerciseCount(Connection con, Long userId) throws SQLException;
	
	/**
	 * 用户回答了一套习题后，在用户回答的习题数上加1
	 * @param con 数据库链接
	 * @param userId 用户标识
	 * @throws SQLException 
	 */
	void increaseAnswerCount(Connection con, Long userId) throws SQLException;

	/**
	 * 导入第三网站的用户信息
	 * @param userInfo 用户详细信息
	 * <pre>
	 * map结构
	 * 		loginName:登录名
	 * 		nickName:昵称
	 * 		headUrl:头像链接
	 * 		authSiteId：第三方网站标识 {@link OAuthConstants} 
	 * 				    如果是使用第三方网站的用户登录，则是第三方网站用户标识；如果是用本网站用户登录，则是本网站用户标识
	 * 		authUserId: 第三方网站的用户标识
	 * </pre>
	 * 
	 * @return 该网站生成的用户标识
	 * <pre>
	 *  返回map的结构
	 * 		LOCAL_USER_ID: 本网站用户标识
	 * 		MAP_USER_ID: 映射标识
	 * </pre>
	 */
	Map<String, Object> importUser(Map<String, Object> userInfo);

	/**
	 * 获取本地用户相关的统计数据，这些只是在客户端显示的统计项。
	 * @param localUserId 本地用户标识
	 * @return 返回基于用户的统计数据。
	 */
	Map<String, Object> getUserStatistics(Long localUserId);

}
