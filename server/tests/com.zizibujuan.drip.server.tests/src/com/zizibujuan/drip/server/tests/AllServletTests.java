package com.zizibujuan.drip.server.tests;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;
import org.junit.runners.Suite.SuiteClasses;

import com.zizibujuan.drip.server.tests.servlets.EmailConfirmServletTests;
import com.zizibujuan.drip.server.tests.servlets.FollowServletTests;
import com.zizibujuan.drip.server.tests.servlets.LoginServletTests;
import com.zizibujuan.drip.server.tests.servlets.UserServletTests;

/**
 * Servlet测试套件
 * @author jzw
 * @since 0.0.1
 */
@RunWith(Suite.class)
@SuiteClasses({
	LoginServletTests.class/*,
	FollowServletTests.class,
	UserServletTests.class,
	EmailConfirmServletTests.class*/
})
public class AllServletTests {

}
