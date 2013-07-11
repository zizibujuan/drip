package com.zizibujuan.drip.server.util.json;

import java.io.InputStream;
import java.io.Reader;
import java.util.List;
import java.util.Map;

/**
 * 通用的json接口，让json适配器使用，统一接口
 * @author jzw
 * @since 0.0.1
 */
public interface Json {
	Map<String,Object> fromJsonObject(String jsonString);
	
	Map<String,Object> fromJsonObject(Reader reader);
	
	List<Map<String, Object>> fromJsonArray(String jsonString);
	
	List<Map<String, Object>> fromJsonArray(Reader reader);
	
	
	<T> T fromJsonObject(String jsonString, Class<T> clazz);
	
	<T> String toJson(T bean);

	<T> T fromJsonObject(InputStream io, Class<T> clazz);
	
}
