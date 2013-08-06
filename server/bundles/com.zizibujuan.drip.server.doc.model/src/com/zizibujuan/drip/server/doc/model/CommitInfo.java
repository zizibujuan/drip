package com.zizibujuan.drip.server.doc.model;

/**
 * 提交信息
 * @author jzw
 * @since 0.0.1
 */
public class CommitInfo {
	
	private Long authorId;
	
	private String summary;
	
	private String extendDesc;
	
	private Long commitTime;

	/**
	 * 获取作者标识
	 * @return 作者标识
	 */
	public Long getAuthorId() {
		return authorId;
	}

	/**
	 * 设置作者标识
	 * @param authorId 作者标识
	 */
	public void setAuthorId(Long authorId) {
		this.authorId = authorId;
	}

	public String getSummary() {
		return summary;
	}

	public void setSummary(String summary) {
		this.summary = summary;
	}

	public String getExtendDesc() {
		return extendDesc;
	}

	public void setExtendDesc(String extendDesc) {
		this.extendDesc = extendDesc;
	}

	public Long getCommitTime() {
		return commitTime;
	}

	public void setCommitTime(Long commitTime) {
		this.commitTime = commitTime;
	}

}
