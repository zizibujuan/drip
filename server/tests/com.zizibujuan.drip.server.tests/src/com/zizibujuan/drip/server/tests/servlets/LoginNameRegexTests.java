package com.zizibujuan.drip.server.tests.servlets;

import java.io.UnsupportedEncodingException;

import org.apache.commons.validator.routines.RegexValidator;
import org.junit.Test;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.assertEquals;

public class LoginNameRegexTests {

	private String regex = "^(?![-_])[a-zA-Z0-9_-]+$";
	
	@Test
	public void test_valid(){
		RegexValidator validator = new RegexValidator(regex);
		assertFalse(validator.isValid("a汉字b"));
		assertFalse(validator.isValid("(a"));
		assertFalse(validator.isValid("-a"));
		assertFalse(validator.isValid("_a"));
		assertFalse(validator.isValid("-abc"));
		
		assertTrue(validator.isValid("a-"));
		assertTrue(validator.isValid("a1"));
		assertTrue(validator.isValid("1a"));
	}
	
	@Test
	public void test_chinses_length() throws UnsupportedEncodingException{
		assertEquals(3, "a一".getBytes("gb2312").length);
		assertEquals(5, "a一二".getBytes("gb2312").length);
	}
	
}
