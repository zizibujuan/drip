package com.zizibujuan.drip.server.util.model;

import java.util.Date;

/**
 * 记录数据变化时间和更新人信息
 * 
 * @author jzw
 * @since 0.0.1
 */
public class LogModel {

	private Long createUserId;
	private Date createTime;
	private Long lastUpdateUserId;
	private Date lastUpdateTime;

	/**
	 * 获取创建人标识
	 * 
	 * @return 创建人标识
	 */
	public Long getCreateUserId() {
		return createUserId;
	}

	/**
	 * 设置创建人标识
	 * 
	 * @param createUserId 创建人标识
	 */
	public void setCreateUserId(Long createUserId) {
		this.createUserId = createUserId;
	}

	/**
	 * 获取创建时间
	 * 
	 * @return 创建时间
	 */
	public Date getCreateTime() {
		return createTime;
	}

	/**
	 * 设置创建时间
	 * 
	 * @param createTime 创建时间
	 */
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	/**
	 * 获取最后一次修改记录的用户标识
	 * 
	 * @return 最后一次修改记录的用户标识
	 */
	public Long getLastUpdateUserId() {
		return lastUpdateUserId;
	}

	/**
	 * 设置最后一次修改记录的用户标识
	 * 
	 * @param lastUpdateUserId 最后一次修改记录的用户标识
	 */
	public void setLastUpdateUserId(Long lastUpdateUserId) {
		this.lastUpdateUserId = lastUpdateUserId;
	}

	/**
	 * 获取最后一次修改记录的用户标识
	 * 
	 * @return 最后一次修改记录的用户标识
	 */
	public Date getLastUpdateTime() {
		return lastUpdateTime;
	}

	/**
	 * 设置最后一次修改记录的用户标识
	 * 
	 * @param lastUpdateTime 最后一次修改记录的用户标识
	 */
	public void setLastUpdateTime(Date lastUpdateTime) {
		this.lastUpdateTime = lastUpdateTime;
	}

}
