package com.zizibujuan.drip.server.tests;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;
import org.junit.runners.Suite.SuiteClasses;

import com.zizibujuan.drip.server.tests.service.ActivityServiceTests;
import com.zizibujuan.drip.server.tests.service.UserBindServiceTests;
import com.zizibujuan.drip.server.tests.service.UserRelationTests;
import com.zizibujuan.drip.server.tests.service.UserServiceTests;

/**
 * 测试所有服务层代码
 * @author jzw
 * @since 0.0.1
 */
@RunWith(Suite.class)
@SuiteClasses({
	UserServiceTests.class,
	UserBindServiceTests.class,
	ActivityServiceTests.class,
	UserRelationTests.class
})
public class AllServiceTests {

}
