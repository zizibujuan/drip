package com.zizibujuan.drip.server.util;

/**
 * 用户关系类型
 * @author jzw
 * @since 0.0.1
 */
public abstract class RelationType {

	/**
	 * 关注者和被关注者是同一个人
	 */
	public static final String SELF = "0";
	
	/**
	 * 已关注
	 */
	public static final String FOLLOWED = "1";
	
	/**
	 * 未关注
	 */
	public static final String UNFOLLOWED = "2";
	
	// TODO:添加互粉
	public static final String EACH_OTHER = "3";
}
