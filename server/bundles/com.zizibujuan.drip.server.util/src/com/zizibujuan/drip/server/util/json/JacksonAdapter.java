package com.zizibujuan.drip.server.util.json;

import java.io.IOException;
import java.io.Reader;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zizibujuan.drip.server.exception.json.JSONAccessException;

/**
 * jackson适配器
 * @author jzw
 * @since 0.0.1
 */
public class JacksonAdapter implements Json {
	private ObjectMapper objectMapper;
	public JacksonAdapter(){
		objectMapper = new ObjectMapper();
	}
	
	
	@Override
	public Map<String, Object> fromJsonObject(String jsonString) {
		try {
			return objectMapper.readValue(jsonString, Map.class);
		} catch (com.fasterxml.jackson.core.JsonParseException e) {
			e.printStackTrace();
			throw new JSONAccessException(e);
		} catch (JsonMappingException e) {
			e.printStackTrace();
			throw new JSONAccessException(e);
		} catch (IOException e) {
			e.printStackTrace();
			throw new JSONAccessException(e);
		}
	}

	@Override
	public Map<String, Object> fromJsonObject(Reader reader) {
		try {
			return objectMapper.readValue(reader, Map.class);
		} catch (com.fasterxml.jackson.core.JsonParseException e) {
			e.printStackTrace();
			throw new JSONAccessException(e);
		} catch (JsonMappingException e) {
			e.printStackTrace();
			throw new JSONAccessException(e);
		} catch (IOException e) {
			e.printStackTrace();
			throw new JSONAccessException(e);
		}
	}

	@Override
	public List<Map<String, Object>> fromJsonArray(String jsonString) {
		try {
			return objectMapper.readValue(jsonString, List.class);
		} catch (com.fasterxml.jackson.core.JsonParseException e) {
			e.printStackTrace();
			throw new JSONAccessException(e);
		} catch (JsonMappingException e) {
			e.printStackTrace();
			throw new JSONAccessException(e);
		} catch (IOException e) {
			e.printStackTrace();
			throw new JSONAccessException(e);
		}
	}

	@Override
	public List<Map<String, Object>> fromJsonArray(Reader reader) {
		try {
			return objectMapper.readValue(reader, List.class);
		} catch (com.fasterxml.jackson.core.JsonParseException e) {
			e.printStackTrace();
			throw new JSONAccessException(e);
		} catch (JsonMappingException e) {
			e.printStackTrace();
			throw new JSONAccessException(e);
		} catch (IOException e) {
			e.printStackTrace();
			throw new JSONAccessException(e);
		}
	}


	@Override
	public String toJson(Object src) {
		// TODO Auto-generated method stub
		return null;
	}

}
