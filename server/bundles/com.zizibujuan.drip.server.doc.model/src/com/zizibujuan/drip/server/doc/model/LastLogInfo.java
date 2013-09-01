package com.zizibujuan.drip.server.doc.model;

import org.eclipse.core.filesystem.IFileInfo;

/**
 * 记录文件信息和最后一次git提交的内容
 * 
 * TODO:重构类名
 * 
 * @author jzw
 * @since 0.0.1
 */
public class LastLogInfo {
	private IFileInfo fileInfo;
	private CommitInfo commitInfo;
	public IFileInfo getFileInfo() {
		return fileInfo;
	}
	public void setFileInfo(IFileInfo fileInfo) {
		this.fileInfo = fileInfo;
	}
	public CommitInfo getCommitInfo() {
		return commitInfo;
	}
	public void setCommitInfo(CommitInfo commitInfo) {
		this.commitInfo = commitInfo;
	}
}
