package com.zizibujuan.drip.server.util.dao;

import java.util.Calendar;

/**
 * 日期帮助类，对org.apache.commons.lang3.time.DateUtils的补充
 * @author jzw
 * @since 0.0.1
 */
public abstract class DripDateUtils {

	public static final int TYPE_SQL_DATE = 1;
	public static final int TYPE_UTIL_DATE = 2;
	
	/**
	 * 获取当前时间，包括小时，分，秒。通常也就在dao层获取当前时间时用。
	 * @return 当前时间
	 */
	public static java.sql.Timestamp now() {
		Calendar now = Calendar.getInstance();
		return new java.sql.Timestamp(now.getTime().getTime());
	}
}
