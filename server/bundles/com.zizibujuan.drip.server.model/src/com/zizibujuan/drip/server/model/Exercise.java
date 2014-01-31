package com.zizibujuan.drip.server.model;

import java.util.List;

import com.zizibujuan.drip.server.util.constant.ExerciseStatus;
import com.zizibujuan.drip.server.util.model.LogModel;

/**
 * 习题信息
 * 
 * @author jzw
 * @since 0.0.1
 */
public class Exercise extends LogModel{

	private Long id;
	private Integer version;
	private String exerciseType;
	private String content;
	private String status;
	
	@Deprecated
	private String course;
	
	private String imageName; // 一个习题只能有一个附图
	private List<ExerciseOption> options; // 支持随机模式,按照seq排序
	
	/**
	 * 获取习题标识
	 * @return 习题标识
	 */
	public Long getId() {
		return id;
	}

	/**
	 * 设置习题标识
	 * @param id 习题标识
	 */
	public void setId(Long id) {
		this.id = id;
	}

	/**
	 * 获取习题最新版本号，版本号从1开始，用户每修改一次，就加1。
	 * 
	 * @return 习题最新的版本号
	 */
	public Integer getVersion() {
		return version;
	}

	/**
	 * 设置习题最新版本号，版本号从1开始，用户每修改一次，就加1
	 * 
	 * @param version 习题最新版本号
	 */
	public void setVersion(Integer version) {
		this.version = version;
	}

	/**
	 * 获取题型编码
	 * 
	 * @return 题型编码
	 */
	public String getExerciseType() {
		return exerciseType;
	}

	/**
	 * 设置题型编码
	 * 
	 * @param exerciseType 题型编码
	 */
	public void setExerciseType(String exerciseType) {
		this.exerciseType = exerciseType;
	}

	/**
	 * 获取习题内容
	 * 
	 * @return 习题内容
	 */
	public String getContent() {
		return content;
	}

	/**
	 * 设置习题内容
	 * 
	 * @param content 习题内容
	 */
	public void setContent(String content) {
		this.content = content;
	}

	/**
	 * 获取习题所属科目代码
	 * 
	 * @return 客户代码
	 * @deprecated
	 */
	public String getCourse() {
		return course;
	}

	/**
	 * 设置习题所属科目代码
	 * 
	 * @param course 客户代码
	 * @deprecated
	 */
	public void setCourse(String course) {
		this.course = course;
	}

	/**
	 * 获取附图v，附图存在文件系统中，这个id对应文件系统的文件名，
	 * 文件名是动态生成的唯一标识+文件之前的扩展名。
	 * 
	 * @return 附图名称
	 */
	public String getImageName() {
		return imageName;
	}

	/**
	 * 设置附图名称
	 * 
	 * @param imageName 附图名称
	 */
	public void setImageName(String imageName) {
		this.imageName = imageName;
	}

	/**
	 * 获取习题状态
	 * @return 习题状态，请参考{@link ExerciseStatus}
	 */
	public String getStatus() {
		return status;
	}

	/**
	 * 设置习题状态
	 * @param status 习题状态，请参考{@link ExerciseStatus}
	 */
	public void setStatus(String status) {
		this.status = status;
	}

	/**
	 * 获取习题选项，只有选择题才有这个值
	 * 
	 * @return 习题选项列表，如果没有，则返回null
	 */
	public List<ExerciseOption> getOptions() {
		return options;
	}

	/**
	 * 设置习题选项，只有选择题才需要设置这个值。
	 * 
	 * @param options 习题选项列表
	 */
	public void setOptions(List<ExerciseOption> options) {
		this.options = options;
	}
	
	
}
