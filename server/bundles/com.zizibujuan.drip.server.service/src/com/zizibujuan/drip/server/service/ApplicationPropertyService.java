package com.zizibujuan.drip.server.service;

import java.util.Map;

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
	
	// TODO：增加一个分组参数

	/**
	 * 根据城市名称获取城市编码
	 * @param cityName 城市名称
	 * @return 城市编码，如果找不到则返回null
	 */
	String getCityCodeByValue(String cityName);

	/**
	 * 获取城市名称
	 * @param cityCode 城市代码
	 * @return 城市名称，如果没有找到，则返回空的map对象
	 * <pre>
	 * map结构:
	 * 		country: 国家名称
	 * 		province：省份名称
	 * 		city：城市名称
	 * </pre>
	 */
	Map<String,Object> getCity(String cityCode);

}
