package com.zizibujuan.drip.server.model;


/**
 * 用户信息
 * @author jzw
 * @since 0.0.1
 */
public class UserInfo {

	private Long id;
	private Long digitalId;
	private String loginName;
	private String nickName;
	private String email;
	private String password;
	private String confirmKey;
	
	/**
	 * 获取全局用户标识，对应drip_global_user_info的dbid
	 * @return 全局用户标识
	 */
	public Long getId() {
		return id;
	}
	
	/**
	 * 设置全局用户标识
	 * @param id 全局用户标识
	 */
	public void setId(Long id) {
		this.id = id;
	}

	/**
	 * 获取为本网站用户生成的数字帐号。
	 * <br/>注意：本网站不为第三方网站用户生成数字帐号。
	 * @return 数字帐号
	 */
	public Long getDigitalId() {
		return digitalId;
	}

	/**
	 * 为本网站用户设置数字帐号
	 * @param digitalId 数字帐号
	 */
	public void setDigitalId(Long digitalId) {
		this.digitalId = digitalId;
	}


	/**
	 * 获取用户名，这个用户名是唯一且固定的，由英文字母、下划线和数字组成。
	 * 就是用户登录名
	 * @return 用户登录名
	 */
	public String getLoginName() {
		return loginName.trim();
	}

	/**
	 * 设置用户名
	 * @param loginName 用户登录名
	 */
	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}
	
	/**
	 * 获取用户昵称，如果存在，则作为显示用户名使用
	 * @return 用户昵称
	 */
	public String getNickName() {
		return nickName;
	}

	/**
	 * 设置用户昵称
	 * @param nickName 用户昵称
	 */
	public void setNickName(String nickName) {
		this.nickName = nickName;
	}

	/**
	 * 获取用户常用邮箱地址
	 * @return 邮箱地址
	 */
	public String getEmail() {
		return email.trim();
	}

	/**
	 * 设置用户常用邮箱地址
	 * @param email 邮箱地址
	 */
	public void setEmail(String email) {
		this.email = email;
	}

	/**
	 * 获取登录密码，禁止往客户端发送密码。
	 * 密码的开始和结尾可以包含空字符。
	 * @return 登录密码
	 */
	public String getPassword() {
		return password;
	}

	/**
	 * 设置登录密码
	 * @param password 登录密码
	 */
	public void setPassword(String password) {
		this.password = password;
	}

	/**
	 * 获取邮箱激活时使用的key值
	 * @return 邮箱激活用户的key值
	 */
	public String getConfirmKey() {
		return confirmKey;
	}

	/**
	 * 设置邮箱激活用户的key值
	 * @param confirmKey 邮箱激活用户的key值
	 */
	public void setConfirmKey(String confirmKey) {
		this.confirmKey = confirmKey;
	}
	
}
