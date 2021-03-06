package com.zizibujuan.drip.server.tests;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;
import org.junit.runners.Suite.SuiteClasses;

import com.zizibujuan.drip.server.tests.servlets.RegexTests;

/**
 * 放置所有Junit测试类的测试套件
 * @author jzw
 * @since 0.0.1
 */
@RunWith(Suite.class)
@SuiteClasses({
	RegexTests.class
})
public class AllJunitTests {

}
