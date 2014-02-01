package com.zizibujuan.drip.server.service;

import com.zizibujuan.drip.server.model.UserBindInfo;
import com.zizibujuan.drip.server.util.constant.OAuthConstants;

/**
 * 获取与OAuth授权网站关联的用户，不同站点可能使用不同的类型来表示用户标识，因此多个方法
 * 
 * @author jzw
 * @since 0.0.1
 */
public interface UserBindService {

	/**
	 * 从帐号关联表中获取关联信息
	 * 
	 * @param siteId 授权站点标识 {@link OAuthConstants}
	 * @param openId 第三方网站的用户标识，因为第三方网站用户标识类型不确定，
	 * 所以这里一律使用字符串类型。
	 * @return 本网站用户与第三方网站用户映射信息
	 */
	UserBindInfo get(int siteId, String openId);
	
	/**
	 * 从帐号关联表中获取关联信息
	 * 
	 * @param siteId 授权站点标识 {@link OAuthConstants}
	 * @param openId 第三方网站的用户标识，因为第三方网站用户标识类型不确定，
	 * 所以这里一律使用字符串类型。
	 * @return 本网站用户与第三方网站用户映射信息
	 */
	UserBindInfo get(int siteId, long openId);

}
