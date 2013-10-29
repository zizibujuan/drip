package com.zizibujuan.drip.server.model;

/**
 * 用户相关的统计信息
 * 
 * @author jzw
 * @since 0.0.1
 */
public class UserStatistics {

	private Long id;
	private Long fanCount;
	private Long followCount;
	@Deprecated
	private Long exerDraftCount;
	private Long exerPublishCount;
	private Long answerCount;
	private Long docCommitCount;
	
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
