package com.zizibujuan.drip.server.tests.servlets;

import java.io.UnsupportedEncodingException;

import org.apache.commons.validator.routines.RegexValidator;
import org.junit.Test;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.assertEquals;

public class RegexTests {

	private static String REGEX_LOGIN_NAME = "^(?![-_])[a-zA-Z0-9_-]+$";
	private static String REGEX_PROJECT_NAME = "^[A-Za-z0-9_\\.-]+$";
	
	
	@Test
	public void test_login_name_valid(){
		RegexValidator validator = new RegexValidator(REGEX_LOGIN_NAME);
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
	public void test_chinese_length() throws UnsupportedEncodingException{
		assertEquals(3, "a一".getBytes("gb2312").length);
		assertEquals(5, "a一二".getBytes("gb2312").length);
	}
	
	@Test
	public void test_project_name(){
		RegexValidator validator = new RegexValidator(REGEX_PROJECT_NAME);
		assertFalse(validator.isValid("a b"));
		assertFalse(validator.isValid("a——b"));
		assertFalse(validator.isValid("a一b"));
		
		assertTrue(validator.isValid("a-b"));
		assertTrue(validator.isValid("a_b"));
		assertTrue(validator.isValid("a.b"));
	}
	
}
