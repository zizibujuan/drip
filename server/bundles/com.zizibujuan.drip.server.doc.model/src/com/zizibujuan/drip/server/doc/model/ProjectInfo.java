package com.zizibujuan.drip.server.doc.model;

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
	
	
}
