package com.zizibujuan.drip.server.util.json;

import java.io.InputStream;
import java.io.Reader;
import java.util.List;
import java.util.Map;

import org.apache.struts2.json.JSONException;
import org.apache.struts2.json.JSONUtil;

import com.zizibujuan.drip.server.exception.json.JSONAccessException;

public class StrutsJsonAdapter implements Json {

	private Object deserialize(String jsonString){
		try {
			return JSONUtil.deserialize(jsonString);
		} catch (JSONException e) {
			throw new JSONAccessException(e);
		}
	}
	
	private Object deserialize(Reader reader){
		try {
			return JSONUtil.deserialize(reader);
		} catch (JSONException e) {
			throw new JSONAccessException(e);
		}
	}
	
	@Override
	public Map<String, Object> fromJsonObject(String jsonString) {
		return (Map<String,Object>)deserialize(jsonString);
	}

	@Override
	public Map<String, Object> fromJsonObject(Reader reader) {
		return (Map<String,Object>)deserialize(reader);
	}

	@Override
	public List<Map<String, Object>> fromJsonArray(String jsonString) {
		return (List<Map<String, Object>>)deserialize(jsonString);
	}

	@Override
	public List<Map<String, Object>> fromJsonArray(Reader reader) {
		return (List<Map<String, Object>>)deserialize(reader);
	}

	@Override
	public <T> T fromJsonObject(String jsonString, Class<T> clazz) {
		return (T) deserialize(jsonString);
	}

	@Override
	public <T> String toJson(T bean) {
		try {
			return JSONUtil.serialize(bean);
		} catch (JSONException e) {
			e.printStackTrace();
			throw new JSONAccessException(e);
		}
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
