package com.zizibujuan.drip.server.tests.util;

import java.util.List;

import junit.framework.Assert;

import org.junit.Test;

import com.zizibujuan.drip.server.util.CodeRule;

/**
 * 编码规则测试用例
 * @author jzw
 * @since 0.0.1
 */
public class CodeRuleTests {

	@Test
	public void testValidLevel(){
		CodeRule codeRule = new CodeRule("00,00,00");
		List<String> levels = codeRule.parse("010100");
		Assert.assertTrue(levels.size()==2);
		Assert.assertEquals("010000", levels.get(0));
		Assert.assertEquals("010100", levels.get(1));
	}
	
	@Test
	public void testValidLevel_invalidCode(){
		CodeRule codeRule = new CodeRule("00");
		List<String> levels = codeRule.parse("00");
		Assert.assertTrue(levels.size()==0);
	}
}
