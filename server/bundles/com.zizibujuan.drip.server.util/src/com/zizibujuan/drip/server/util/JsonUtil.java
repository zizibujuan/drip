package com.zizibujuan.drip.server.util;

import java.io.Reader;
import java.lang.reflect.Type;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Map;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;
import com.google.gson.reflect.TypeToken;

/**
 * json工具类，这里对json实现做一个封装，如果需要换json实现，修改这个类。
 * @author jzw
 * @since 0.0.1
 */
public abstract class JsonUtil {

	private static final class MapTypeToken extends
			TypeToken<Map<String, Object>> {
	}
	
	private static final class ListMapTypeToken extends
		TypeToken<List<Map<String, Object>>> {
	}
	
	private static final class SqlDateJsonSerializer implements JsonSerializer<java.sql.Date>
	{
		@Override
		public JsonElement serialize(java.sql.Date src, Type typeOfSrc,
				JsonSerializationContext context) {
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
			return new JsonPrimitive(dateFormat.format(src));
		}
	}
	
	private static final class SqlTimestampSerializer implements JsonSerializer<java.sql.Timestamp>{

		@Override
		public JsonElement serialize(java.sql.Timestamp src, Type typeOfSrc,
				JsonSerializationContext context) {
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
			return new JsonPrimitive(dateFormat.format(src));
		}
	}

	// Gson 实现
	private static Gson json = new GsonBuilder()
			.serializeNulls()
			.registerTypeAdapter(java.sql.Date.class, new SqlDateJsonSerializer())
			.registerTypeAdapter(java.sql.Timestamp.class, new SqlTimestampSerializer())
			.create();
	
	private static MapTypeToken mapTypeToken = new MapTypeToken();
	private static ListMapTypeToken listMapTypeToken = new ListMapTypeToken();
	
	
	public static String toJson(Object src){
		return json.toJson(src);
	}
	
	public static String toJson(Object src, Type typeOfSrc){
		return json.toJson(src, typeOfSrc);
	}
	
	public static Map<String,Object> fromJsonObject(String jsonString){
		return json.fromJson(jsonString, mapTypeToken.getType());
	}
	
	public static Map<String,Object> fromJsonObject(Reader reader){
		return json.fromJson(reader, mapTypeToken.getType());
	}
	
	public static List<Map<String, Object>> fromJsonArray(String jsonString){
		return json.fromJson(jsonString, listMapTypeToken.getType());
	}
	
	public static List<Map<String, Object>> fromJsonArray(Reader reader){
		return json.fromJson(reader, listMapTypeToken.getType());
	}
	
	public static <T> T fromJson(String jsonString, Type typeOfT){
		return json.fromJson(jsonString, typeOfT);
	}
	
	public static <T> T fromJson(String jsonString, Class<T> classOfT){
		return json.fromJson(jsonString, classOfT);
	}

}
