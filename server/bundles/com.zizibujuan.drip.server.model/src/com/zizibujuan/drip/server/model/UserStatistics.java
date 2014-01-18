package com.zizibujuan.drip.server.model;

/**
 * 用户相关的统计信息
 * 
 * @author jzw
 * @since 0.0.1
 */
public class UserStatistics {

	private Long id;
	private Long fanCount = 0l;
	private Long followCount = 0l;
	private Long exerDraftCount = 0l;
	private Long exerPublishCount = 0l;
	private Long answerCount = 0l;
	private Long docCommitCount = 0l;
	
	private Long userId;
	

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getFanCount() {
		return fanCount;
	}

	public void setFanCount(Long fanCount) {
		this.fanCount = fanCount;
	}

	public Long getFollowCount() {
		return followCount;
	}

	public void setFollowCount(Long followCount) {
		this.followCount = followCount;
	}

	public Long getExerDraftCount() {
		return exerDraftCount;
	}

	public void setExerDraftCount(Long exerDraftCount) {
		this.exerDraftCount = exerDraftCount;
	}

	public Long getExerPublishCount() {
		return exerPublishCount;
	}

	public void setExerPublishCount(Long exerPublishCount) {
		this.exerPublishCount = exerPublishCount;
	}

	public Long getAnswerCount() {
		return answerCount;
	}

	public void setAnswerCount(Long answerCount) {
		this.answerCount = answerCount;
	}
	
	public Long getDocCommitCount() {
		return docCommitCount;
	}

	public void setDocCommitCount(Long docCommitCount) {
		this.docCommitCount = docCommitCount;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

}
