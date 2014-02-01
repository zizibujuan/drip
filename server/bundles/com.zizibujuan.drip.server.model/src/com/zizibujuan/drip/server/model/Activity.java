package com.zizibujuan.drip.server.model;

import java.util.Date;

import com.zizibujuan.drip.server.util.constant.ActionType;

/**
 * 用户活动
 * 
 * @author jzw
 * @since 0.0.1
 */
public class Activity {
	
	private Long id;
	private Long userId;
	private String actionType;
	private boolean isInHome = true; // 是否在个人首页显示，默认都显示
	private Long contentId;
	private Date createTime;
	 
	public Activity(Long userId, Long contentId, String actionType) {
		this.userId = userId;
		this.contentId = contentId;
		this.actionType = actionType;
	}
	
	public Activity() {}

	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Long getUserId() {
		return userId;
	}
	public void setUserId(Long userId) {
		this.userId = userId;
	}
	
	/**
	 * 获取操作类型，参考 {@link ActionType}
	 * 
	 * @return 操作类型
	 */
	public String getActionType() {
		return actionType;
	}
	public void setActionType(String actionType) {
		this.actionType = actionType;
	}
	public boolean isInHome() {
		return isInHome;
	}
	public void setInHome(boolean isInHome) {
		this.isInHome = isInHome;
	}
	public Long getContentId() {
		return contentId;
	}
	public void setContentId(Long contentId) {
		this.contentId = contentId;
	}
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	
	
}
