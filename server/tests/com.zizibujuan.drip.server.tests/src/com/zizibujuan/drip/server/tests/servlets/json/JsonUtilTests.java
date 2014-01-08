package com.zizibujuan.drip.server.tests.servlets.json;

import java.util.Map;

import junit.framework.Assert;

import org.junit.BeforeClass;
import org.junit.Test;

import com.zizibujuan.drip.server.util.json.GsonAdapter;
import com.zizibujuan.drip.server.util.json.JacksonAdapter;
import com.zizibujuan.drip.server.util.json.JsonUtil;
import com.zizibujuan.drip.server.util.json.StrutsJsonAdapter;

/**
 * {@link JsonUtil}类的测试用例
 * 
 * @author jzw
 * @since 0.0.1
 */
public class JsonUtilTests {
	private static GsonAdapter gsonAdapter;
	private static JacksonAdapter jacksonAdapter;
	@BeforeClass
	public static void beforeClass(){
		gsonAdapter = new GsonAdapter();
		jacksonAdapter = new JacksonAdapter();
	}

	@Test
	public void testData(){
//		Map<String,Object> src = new HashMap<String, Object>();
//		Calendar date = Calendar.getInstance();
//		date.clear();
//		date.set(2013, 0, 1,1,1,1);
//		
//		src.put("now", date.getTime());
//		String jsonString = JsonUtil.toJson(src);
//		System.out.println(jsonString);
//		
//		src.put("now", new java.sql.Date(date.getTime().getTime()));
//		jsonString = JsonUtil.toJson(src);
//		System.out.println(jsonString);
//		Assert.assertEquals("{\"now\":\"2013-01-01\"}", jsonString);
//		
//		src.put("now", new java.sql.Timestamp(date.getTime().getTime()));
//		jsonString = JsonUtil.toJson(src);
//		System.out.println(jsonString);
//		Assert.assertEquals("{\"now\":\"2013-01-01T01:01:01\"}", jsonString);
	}
	
	@Test
	public void testLongTypeConverter(){
		String jsonString = "{\"exerId\":25,\"detail\":[{\"optionId\":98}],\"guide\":\"<root><line><text>q</text></line></root>\"}";
		Map<String,Object> json = JsonUtil.fromJsonObject(jsonString);
		System.out.println(json);
		Object o = json.get("exerId");
		System.out.println(o);
		// TODO:在网上查找Gson在什么情况下会将数字解析为Long类型
		// 不要在整数后面加一个 ".0"
	}
	
	@Test
	public void testCompareMapAndBean(){
		
	}
	
	@Test
	public void testSerializationPerformence(){
		System.out.println(Long.MAX_VALUE);
		String jsonString = "{\"date\":\"2013-01-01\", \"dateTime\":\"2013-01-01 10:10\", \"string\":\"你好hello\",\"int_\":11,\"long_\":1234567890123456789,\"double_\":10.1,\"boolean_\":true,\"null_\":null}";
		int num = 10000;
		// gson
		long begin = System.nanoTime();
		for(int i = 0; i < num; i++){
			gsonAdapter.fromJsonObject(jsonString);
		}
		long end = System.nanoTime();
		System.out.println("使用GSON__序列化json对象耗时："+(end-begin));
		
		// jackson
		begin = System.nanoTime();
		for(int i = 0; i < num; i++){
			jacksonAdapter.fromJsonObject(jsonString);
		}
		end = System.nanoTime();
		System.out.println("使用JACK__序列化json对象耗时："+(end-begin));
		
		//struts-json-plugin
		StrutsJsonAdapter adapter = new StrutsJsonAdapter();
		begin = System.nanoTime();
		for(int i = 0; i < num; i++){
			adapter.fromJsonObject(jsonString);
		}
		end = System.nanoTime();
		System.out.println("使用STRUTS序列化json对象耗时："+(end-begin));
		
		
		
		Map<String,Object> map = jacksonAdapter.fromJsonObject(jsonString);
		System.out.println(map);
	}
	
	
	
	@Test
	public void testDeserializationPerformence(){
		
	}
	
	
	@Test
	public void testSerialization_Int(){
		String jsonString = "{\"int\":2}";
		
		//jackson
		JacksonAdapter jacksonAdapter = new JacksonAdapter();
		Map<String,Object> json = jacksonAdapter.fromJsonObject(jsonString);
		Assert.assertEquals(2, json.get("int"));
		
		// struts-json-plugin
		StrutsJsonAdapter strutsJsonAdapter = new StrutsJsonAdapter();
		json = strutsJsonAdapter.fromJsonObject(jsonString);
		Assert.assertEquals(2l, json.get("int"));
		
		// gson
		GsonAdapter gsonAdapter = new GsonAdapter();
		json = gsonAdapter.fromJsonObject(jsonString);
		Assert.assertEquals(2, json.get("int"));
	}
	
	@Test
	public void testToJsonObject(){
		JacksonAdapter jacksonAdapter = new JacksonAdapter();
		String jsonString = "{\"fileInfo\":{\"name\":\"文件.md\", \"content\":\"aaaa\"}, \"commitInfo\":{}}";
//		NewFileForm newFileForm = jacksonAdapter.fromJsonObject(jsonString, NewFileForm.class);
//		Assert.assertEquals("文件.md", newFileForm.getFileInfo().getName());
	}
	
	
}
