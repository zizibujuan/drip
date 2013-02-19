package com.zizibujuan.drip.server.dao;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Map;

import com.zizibujuan.drip.server.util.OAuthConstants;

/**
 * 通过第三方网站提供的connect功能，接入的用户。
 * <p>因为第三方网站的用户基本信息，如头像等信息，可能会发生变化，所以需要每天在网站闲暇时间同步一下第三方网站的用户信息</p>
 * 数据访问接口
 * @author jzw
 * @since 0.0.1
 */
public interface ConnectUserDao {

	/**
	 * 获取接入的第三方网站用户的基本信息。只包含页面显示信息，不包含用户隐私信息。
	 * 
	 * @param connectUserId 本网站为第三方网站生成的用户标识
	 * @return 用户基本信息，不包含敏感数据，因为第三方传过来的数据基本都过滤了敏感数据的，所以可以全部查出。
	 * <pre>
	 * map结构：
	 *		connectUserId：映射标识
	 *		nickName：用户昵称
	 *		loginName: 登录名
	 *		digitalId: 为本网站用户分配的数字帐号
	 *		homeCityCode：用户家乡所在城市编码
	 *		sex：用户性别
	 *		siteId：来自哪个网站的标识
	 * </pre>
	 */
	Map<String, Object> getPublicInfo(Long connectUserId);
	
	/**
	 * 将第三方网站的用户基本信息保存起来
	 * @param con 数据库链接
	 * @param connectUserInfo 第三方网站的用户信息
	 * <pre>
	 * map结构
	 * 		loginName: 登录名
	 * 		nickName: 昵称
	 * 		sex: 性别代码
	 * 		headUrl: 头像链接
	 * 		homeCityCode: 家乡所在城市编码
	 * 		homeCity: 家乡所在城市名称
	 * 		siteId: 网站标识 {@link OAuthConstants}
	 * 				如果是使用第三方网站的用户登录，则是第三方网站用户标识；如果是用本网站用户登录，则是本网站用户标识
	 * 		openId: 第三方网站的用户标识
	 * 		avatar：用户头像列表
	 * 			urlName: 头像名称
	 * 			url：头像链接
	 * 			width：头像宽度
	 * 			height：头像高度
	 * </pre>
	 * @return 在本网站产生的新的用户标识,全局统一的用户标识
	 * @throws SQLException 
	 */
	Long add(Connection con, Map<String,Object> connectUserInfo) throws SQLException;

}
