package com.zizibujuan.drip.server.util.json;

import java.io.InputStream;
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
 * Gson适配器
 * 
 * @author jzw
 * @since 0.0.1
 */
public class GsonAdapter implements Json {

	private static final class MapTypeToken extends
			TypeToken<Map<String, Object>> {
	}

	private static final class ListMapTypeToken extends
			TypeToken<List<Map<String, Object>>> {
	}

	private static final class SqlDateJsonSerializer implements
			JsonSerializer<java.sql.Date> {
		@Override
		public JsonElement serialize(java.sql.Date src, Type typeOfSrc,
				JsonSerializationContext context) {
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
			return new JsonPrimitive(dateFormat.format(src));
		}
	}

	private static final class SqlTimestampSerializer implements
			JsonSerializer<java.sql.Timestamp> {

		@Override
		public JsonElement serialize(java.sql.Timestamp src, Type typeOfSrc,
				JsonSerializationContext context) {
			SimpleDateFormat dateFormat = new SimpleDateFormat(
					"yyyy-MM-dd'T'HH:mm:ss");
			return new JsonPrimitive(dateFormat.format(src));
		}
	}

	// Gson 实现
	private Gson json = null;

	private static MapTypeToken mapTypeToken = new MapTypeToken();
	private static ListMapTypeToken listMapTypeToken = new ListMapTypeToken();

	public GsonAdapter() {
		json = new GsonBuilder()
				.serializeNulls()
				.registerTypeAdapter(java.sql.Date.class, new SqlDateJsonSerializer())
				.registerTypeAdapter(java.sql.Timestamp.class,new SqlTimestampSerializer())
				.registerTypeAdapterFactory(GsonObjectTypeAdapter.FACTORY)
				.create();
	}
	
	@Override
	public Map<String, Object> fromJsonObject(String jsonString) {
		return json.fromJson(jsonString, mapTypeToken.getType());
	}

	@Override
	public Map<String, Object> fromJsonObject(Reader reader) {
		return json.fromJson(reader, mapTypeToken.getType());
	}

	@Override
	public List<Map<String, Object>> fromJsonArray(String jsonString) {
		return json.fromJson(jsonString, listMapTypeToken.getType());
	}

	@Override
	public List<Map<String, Object>> fromJsonArray(Reader reader) {
		return json.fromJson(reader, listMapTypeToken.getType());
	}

	@Override
	public <T> T fromJsonObject(String jsonString, Class<T> clazz) {
		return json.fromJson(jsonString, clazz);
	}

	@Override
	public <T> String toJson(T bean) {
		return json.toJson(bean);
	}

	@Override
	public <T> T fromJsonObject(InputStream io, Class<T> clazz) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public <T> List<T> fromJsonArray(String jsonString,
			Class<List> collectionClass, Class<T> elementClass) {
		// TODO Auto-generated method stub
		return null;
	}

}
