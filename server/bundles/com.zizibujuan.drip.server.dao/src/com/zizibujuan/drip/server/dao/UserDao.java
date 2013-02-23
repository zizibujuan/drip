package com.zizibujuan.drip.server.dao;

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
	 * <pre>
	 * 	map结构为：
	 * 		id: 全局用户标识
	 * 		loginName: 用户登录名
	 * 		email: 用户常用邮箱
	 * 		mobile: 用户手机号码
	 * 		realName: 真实姓名
	 * 		digitalId: 数字帐号
	 * </pre>
	 */
	Map<String, Object> get(String email, String md5Password);

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

}
