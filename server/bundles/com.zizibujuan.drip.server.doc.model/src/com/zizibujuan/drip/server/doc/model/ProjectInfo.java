package com.zizibujuan.drip.server.doc.model;

import java.util.Date;

/**
 * 项目信息
 * 
 * @author jzw
 * @since 0.0.1
 */
public class ProjectInfo {
	
	private Long id;
	
	private String name;
	
	private String label;
	
	private String description;
	
	private Long createUserId;
	
	private String createUserName; // 项目创建者的登录名
	
	private Date createTime;

	/**
	 * 获取项目标识
	 * @return 项目标识
	 */
	public Long getId() {
		return id;
	}

	/**
	 * 设置项目标识
	 * @param id 项目标识
	 */
	public void setId(Long id) {
		this.id = id;
	}

	/**
	 * 获取项目名称
	 * @return 项目名称
	 */
	public String getName() {
		return name;
	}

	/**
	 * 获取项目显示名（项目中文名，选填）
	 * @return 显示名称
	 */
	public String getLabel() {
		return label;
	}

	/**
	 * 设置项目显示名
	 * @param label 显示名称
	 */
	public void setLabel(String label) {
		this.label = label;
	}

	/**
	 * 设置项目名称，只允许输入英文，字母或下划线
	 * @param name 项目名称
	 */
	public void setName(String name) {
		this.name = name;
	}

	/**
	 * 获取项目详细描述
	 * @return 详细描述
	 */
	public String getDescription() {
		return description;
	}

	/**
	 * 设置项目详细描述
	 * @param description 详细描述
	 */
	public void setDescription(String description) {
		this.description = description;
	}

	/**
	 * 获取项目创建人标识。<br/>
	 * 存放的是connectUserId，便于统计第三方用户创建项目的个数，
	 * 比较不同网站来的用户创建项目的个数。
	 * @return 项目创建人标识
	 */
	public Long getCreateUserId() {
		return createUserId;
	}

	/**
	 * 设置项目创建人标识
	 * @param createUserId 项目创建人标识
	 */
	public void setCreateUserId(Long createUserId) {
		this.createUserId = createUserId;
	}

	/**
	 * 获取创建人用户名，这个用户名全局唯一
	 * @return 创建人用户名
	 */
	public String getCreateUserName() {
		return createUserName;
	}

	/**
	 * 设置创建人用户名
	 * @param createUserName 创建人用户名
	 */
	public void setCreateUserName(String createUserName) {
		this.createUserName = createUserName;
	}

	/**
	 * 获取项目创建时间
	 * @return 创建时间
	 */
	public Date getCreateTime() {
		return createTime;
	}

	/**
	 * 设置项目创建时间
	 * @param createTime 项目创建时间
	 */
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
}
