package com.zizibujuan.drip.server.model;

/**
 * 用户头像信息
 * 
 * @author jzw
 * @since 0.0.1
 */
public class Avatar {

	private Long id;
	private String urlName;
	private Integer width;
	private Integer height;
	private String url;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUrlName() {
		return urlName;
	}

	public void setUrlName(String urlName) {
		this.urlName = urlName;
	}

	public Integer getWidth() {
		return width;
	}

	public void setWidth(Integer width) {
		this.width = width;
	}

	public Integer getHeight() {
		return height;
	}

	public void setHeight(Integer height) {
		this.height = height;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}
	
}
