package com.zizibujuan.drip.server.service;

/**
 * 系统属性 服务接口
 * @author jinzw
 * @since 0.0.1
 */
public interface ApplicationPropertyService {

	/**
	 * 为匿名用户获取一个唯一标识
	 * @return 匿名用户标识
	 */
	Long getNextAnonymouseId();
	
	/**
	 * 获取指定的key对应的字符串值
	 * @param propertyName 键
	 * @return 值
	 */
	String getForString(String propertyName);

}
