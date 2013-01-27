package com.zizibujuan.drip.server.util;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;

/**
 * 编码规则
 * @author jzw
 * @since 0.0.1
 */
public class CodeRule {

	private String[] rules;
	private int length;
	private String[] hiberarchyKeys;
	
	/**
	 * 构造函数
	 * @param rule 使用逗号隔开的0标识，如00,00,00
	 */
	public CodeRule(String rule) {
		rules = rule.split(",");
		for (String each : rules) {
			length += each.length();
		}
	}

	/**
	 * 解析传入的编码
	 * @param code 编码
	 * @return 返回有效的编码层级
	 */
	public List<String> parse(String code) {
		if(length != code.length())
			throw new IllegalArgumentException("该编码的长度与编码规则的长度不一致");
		List<String> result = new ArrayList<String>();
		
		int startIndex = 0;
		
		for (int i = 0; i < rules.length; i++) {
			int endIndex = startIndex + rules[i].length();
			String each = code.substring(startIndex,endIndex);
			startIndex = endIndex;
			if(!each.equals(rules[i])){
				int left = length-endIndex;
				result.add(code.substring(0, endIndex)+StringUtils.repeat('0', left));
			}else{
				break;
			}
		}
		
		return result;
	}
	
	public void setHiberarchyKeys(String key) {
		hiberarchyKeys = new String[rules.length];
		int startIndex = 0;
		for (int i = 0; i < rules.length; i++) {
			hiberarchyKeys[i] = key.substring(startIndex,
					startIndex += rules[i].length());
		}
	}

}
