package com.zizibujuan.drip.server.doc.model;

/**
 * 文件信息
 * 
 * @author jzw
 * @since 0.0.1
 */
public class FileInfo {
	
	private Long id;
	
	private String name;
	
	private String content;

	/**
	 * 获取文件标识
	 * @return 文件标识
	 */
	public Long getId() {
		return id;
	}

	/**
	 * 设置文件标识
	 * @param id 文件标识
	 */
	public void setId(Long id) {
		this.id = id;
	}

	/**
	 * 获取文件名
	 * @return 文件名
	 */
	public String getName() {
		return name;
	}

	/**
	 * 设置文件名
	 * @param name 文件名
	 */
	public void setName(String name) {
		this.name = name;
	}

	/**
	 * 获取文件内容
	 * @return 文件内容
	 */
	public String getContent() {
		return content;
	}

	/**
	 * 设置文件内容
	 * @param content 文件内容
	 */
	public void setContent(String content) {
		this.content = content;
	}

}
