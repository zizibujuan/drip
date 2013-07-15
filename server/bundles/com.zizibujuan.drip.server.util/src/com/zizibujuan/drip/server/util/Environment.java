package com.zizibujuan.drip.server.util;

/**
 * 兼容各操作系统的工具方法
 * @author jzw
 * @since 0.0.1
 */
public abstract class Environment {

	/**
	 * 获取换行符号，兼容各种操作系统
	 * @return 换行符号
	 */
	public static String newLine(){
		return System.getProperty("line.separator");
	}
}