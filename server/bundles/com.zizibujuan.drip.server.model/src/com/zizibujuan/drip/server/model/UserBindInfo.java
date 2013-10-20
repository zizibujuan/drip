package com.zizibujuan.drip.server.model;

/**
 * 本网站用户与第三方网站用户的绑定信息
 * 
 * @author jzw
 * @since 0.0.1
 */
public class UserBindInfo {

	private Long id;
	private Integer siteId;
	private String openId;
	private Long userId;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Integer getSiteId() {
		return siteId;
	}
	public void setSiteId(Integer siteId) {
		this.siteId = siteId;
	}
	public String getOpenId() {
		return openId;
	}
	public void setOpenId(String openId) {
		this.openId = openId;
	}
	public Long getUserId() {
		return userId;
	}
	public void setUserId(Long userId) {
		this.userId = userId;
	}
	
}
