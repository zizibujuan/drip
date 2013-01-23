package com.zizibujuan.drip.server.util.json;

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
	public String toJson(Object src) {
		try {
			return JSONUtil.serialize(src);
		} catch (JSONException e) {
			e.printStackTrace();
			throw new JSONAccessException(e);
		}
	}

}
