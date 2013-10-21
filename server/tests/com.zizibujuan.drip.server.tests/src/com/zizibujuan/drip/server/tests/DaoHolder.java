package com.zizibujuan.drip.server.tests;

import com.zizibujuan.drip.server.dao.UserDao;
import com.zizibujuan.drip.server.dao.UserStatisticsDao;

/**
 * 放置dao实例
 * 
 * @author jzw
 * @since 0.0.1
 */
public class DaoHolder {

	private static DaoHolder singleton;

	public static DaoHolder getDefault() {
		return singleton;
	}

	public void activate() {
		singleton = this;
	}

	public void deactivate() {
		singleton = null;
	}
	
	private UserStatisticsDao userStatisticsDao;
	public UserStatisticsDao getUserStatisticsDao() {
		return userStatisticsDao;
	}
	public void setUserStatisticsDao(UserStatisticsDao userStatisticsDao) {
		System.out.println("注入userStatisticsDao");
		this.userStatisticsDao = userStatisticsDao;
	}

	public void unsetUserStatisticsDao(UserStatisticsDao userStatisticsDao) {
		System.out.println("注销userStatisticsDao");
		if (this.userStatisticsDao == userStatisticsDao) {
			this.userStatisticsDao = null;
		}
	}
	
	
	private UserDao userDao;
	public UserDao getUserDao() {
		return userDao;
	}
	public void setUserDao(UserDao userDao) {
		System.out.println("注入userDao");
		this.userDao = userDao;
	}

	public void unsetUserDao(UserDao userDao) {
		System.out.println("注销userDao");
		if (this.userDao == userDao) {
			this.userDao = null;
		}
	}
}
