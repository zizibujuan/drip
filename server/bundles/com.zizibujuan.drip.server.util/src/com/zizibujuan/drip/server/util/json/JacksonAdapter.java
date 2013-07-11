package com.zizibujuan.drip.server.util.json;

import java.io.IOException;
import java.io.InputStream;
import java.io.Reader;
import java.io.StringWriter;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.JsonParseException;
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
	public <T> T fromJsonObject(String jsonString, Class<T> clazz) {
		T t = null;
		try {
			t = objectMapper.readValue(jsonString, clazz);
		} catch (JsonParseException e) {
			e.printStackTrace();
			throw new JSONAccessException(e);
		} catch (JsonMappingException e) {
			e.printStackTrace();
			throw new JSONAccessException(e);
		} catch (IOException e) {
			e.printStackTrace();
			throw new JSONAccessException(e);
		}
		return t;
	}
	
	@Override
	public <T> T fromJsonObject(InputStream io, Class<T> clazz) {
		T t = null;
		try {
			t = objectMapper.readValue(io, clazz);
		} catch (JsonParseException e) {
			e.printStackTrace();
			throw new JSONAccessException(e);
		} catch (JsonMappingException e) {
			e.printStackTrace();
			throw new JSONAccessException(e);
		} catch (IOException e) {
			e.printStackTrace();
			throw new JSONAccessException(e);
		}
		return t;
	}


	@Override
	public <T> String toJson(T bean) {
		StringWriter sw = new StringWriter();
		try {
			objectMapper.writeValue(sw, bean);
			return sw.toString();
		} catch (JsonGenerationException e) {
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
	
	

}
