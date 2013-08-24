package com.zizibujuan.drip.server.dao;

import java.util.Locale;
import java.util.Map;
import java.util.Properties;

/**
 * 系统属性 数据访问接口
 * @author jinzw
 * @since 0.0.1
 */
public interface ApplicationPropertyDao {

	/**
	 * 获取值为long类型的属性值
	 * @param propertyName 属性名
	 * @return 属性值
	 */
	Long getLong(String propertyName);

	/**
	 * 新增long类型的属性值
	 * @param propertyName 属性名
	 * @param value 属性值
	 */
	void putLong(String propertyName, Long value);
	
	/**
	 * 添加分组
	 * @param groupName 属性名
	 * @param displayName 显示名
	 * @param locale 本地化
	 */
	void addGroup(String groupName, String displayName, Locale locale);

	/**
	 * 获取指定的key对应的字符串值
	 * @param propertyName 键
	 * @return 值
	 */
	String getForString(String propertyName);

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
	 * 完整的map结构:
	 * 		country: 国家名称
	 * 		province：省份名称
	 * 		city：城市名称
	 * 		county:县名称
	 * </pre>
	 * 如果只查到n级，则n+1级的信息不加载
	 */
	Map<String, Object> getCity(String cityCode);
	
	/**
	 * 获取一组属性
	 * @param groupKey
	 * @return 属性
	 */
	Properties getProperties(String groupKey);
}
