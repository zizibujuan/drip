package com.zizibujuan.drip.server.doc.model;

/**
 * 新建文件时提交的信息
 * 
 * @author jzw
 * @since 0.0.1
 */
public class NewFileForm {
	private FileInfo fileInfo;
	private CommitInfo commitInfo;

	public FileInfo getFileInfo() {
		return fileInfo;
	}

	public void setFileInfo(FileInfo fileInfo) {
		this.fileInfo = fileInfo;
	}

	public CommitInfo getCommitInfo() {
		return commitInfo;
	}

	public void setCommitInfo(CommitInfo commitInfo) {
		this.commitInfo = commitInfo;
	}
}
