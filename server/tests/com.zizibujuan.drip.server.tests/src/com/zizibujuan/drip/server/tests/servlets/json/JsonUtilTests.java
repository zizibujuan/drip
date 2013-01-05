package com.zizibujuan.drip.server.tests.servlets.json;

import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

import junit.framework.Assert;

import org.junit.Test;

import com.zizibujuan.drip.server.util.JsonUtil;

/**
 * {@link JsonUtil}类的测试用例
 * 
 * @author jzw
 * @since 0.0.1
 */
public class JsonUtilTests {

	@Test
	public void testData(){
		Map<String,Object> src = new HashMap<String, Object>();
		Calendar date = Calendar.getInstance();
		date.clear();
		date.set(2013, 0, 1,1,1,1);
		
		src.put("now", date.getTime());
		String jsonString = JsonUtil.toJson(src);
		System.out.println(jsonString);
		
		src.put("now", new java.sql.Date(date.getTime().getTime()));
		jsonString = JsonUtil.toJson(src);
		System.out.println(jsonString);
		Assert.assertEquals("{\"now\":\"2013-01-01\"}", jsonString);
		
		src.put("now", new java.sql.Timestamp(date.getTime().getTime()));
		jsonString = JsonUtil.toJson(src);
		System.out.println(jsonString);
		Assert.assertEquals("{\"now\":\"2013-01-01T01:01:01\"}", jsonString);
	}
}
