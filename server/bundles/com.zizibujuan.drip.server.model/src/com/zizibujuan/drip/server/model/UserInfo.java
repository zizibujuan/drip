package com.zizibujuan.drip.server.model;

/**
 * 用户信息
 * @author jzw
 * @since 0.0.1
 */
public class UserInfo {

	private String name;
	private String email;

	/**
	 * 获取用户名，这个用户名是唯一且固定的，由英文字母、下划线和数字组成。
	 * @return 用户名
	 */
	public String getName() {
		return name;
	}

	/**
	 * 设置用户名
	 * @param name 用户名
	 */
	public void setName(String name) {
		this.name = name;
	}

	/**
	 * 获取用户常用邮箱地址
	 * @return 邮箱地址
	 */
	public String getEmail() {
		return email;
	}

	/**
	 * 设置用户常用邮箱地址
	 * @param email 邮箱地址
	 */
	public void setEmail(String email) {
		this.email = email;
	}
	
}
