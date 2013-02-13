package com.zizibujuan.drip.server.tests;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;
import org.junit.runners.Suite.SuiteClasses;

import com.zizibujuan.drip.server.tests.service.OAuthUserMapServiceTests;
import com.zizibujuan.drip.server.tests.service.UserServiceTests;

/**
 * 测试所有服务层代码
 * @author jzw
 * @since 0.0.1
 */
@RunWith(Suite.class)
@SuiteClasses({
	UserServiceTests.class,
	OAuthUserMapServiceTests.class
})
public class AllServiceTests {

}
