package com.zizibujuan.drip.server.servlet.authentication;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Oauth2 用户相关的帮助类
 * @author jzw
 *
 */
public class Oauth2Helper {
	
	public static void addUserImage(List<Map<String, Object>> avatarList,
			String urlName, String url, int width, int height) {
		Map<String, Object> tinyUrlMap = new HashMap<String, Object>();
		tinyUrlMap.put("urlName", urlName);
		tinyUrlMap.put("url", url);
		tinyUrlMap.put("width", width);
		tinyUrlMap.put("height", height);
		avatarList.add(tinyUrlMap);
	}
}
