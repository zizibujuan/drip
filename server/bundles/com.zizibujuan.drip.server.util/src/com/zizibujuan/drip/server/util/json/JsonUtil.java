package com.zizibujuan.drip.server.util.json;

import java.io.IOException;
import java.io.Reader;
import java.lang.reflect.Type;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zizibujuan.drip.server.exception.json.JSONAccessException;

/**
 * json工具类，这里对json实现做一个封装，如果需要换json实现，修改这个类。
 * 提供在不同类库之间切换的功能
 * @author jzw
 * @since 0.0.1
 */
public abstract class JsonUtil {

	private static Json json;
	static{
		//json = new GsonAdapter();
		json = new StrutsJsonAdapter();
	}
	
	public static Map<String,Object> fromJsonObject(String jsonString){
		return json.fromJsonObject(jsonString);
	}
	
	public static Map<String,Object> fromJsonObject(Reader reader){
		return json.fromJsonObject(reader);
	}
	
	public static List<Map<String, Object>> fromJsonArray(String jsonString){
		return json.fromJsonArray(jsonString);
	}
	
	public static List<Map<String, Object>> fromJsonArray(Reader reader){
		return json.fromJsonArray(reader);
	}
	
	public static String toJson(Object src){
		return json.toJson(src);
	}
	/*
	public static String toJson(Object src, Type typeOfSrc){
		return json.toJson(src, typeOfSrc);
	}
	public static <T> T fromJson(String jsonString, Type typeOfT){
		return json.fromJson(jsonString, typeOfT);
	}
	
	public static <T> T fromJson(String jsonString, Class<T> classOfT){
		return json.fromJson(jsonString, classOfT);
	}
	*/
}
