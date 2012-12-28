package com.zizibujuan.drip.server.dao;

import java.util.Map;

/**
 * 通过第三方网站提供的connect功能，接入的用户。
 * <p>因为第三方网站的用户基本信息，如头像等信息，可能会发生变化，所以需要每天在网站闲暇时间同步一下第三方网站的用户信息</p>
 * 数据访问接口
 * @author jzw
 * @since 0.0.1
 */
public interface ConnectUserDao {

	/**
	 * 获取接入的第三方网站用户的基本信息。
	 * 
	 * @param mapUserId 映射标识
	 * @return 用户基本信息，不包含敏感数据，因为第三方穿过来的数据基本都过滤了敏感数据的，所以可以全部查出。
	 */
	Map<String, Object> get(Long mapUserId);

}
