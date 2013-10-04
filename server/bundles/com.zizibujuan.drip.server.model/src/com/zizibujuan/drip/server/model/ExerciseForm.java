package com.zizibujuan.drip.server.model;

/**
 * 新建习题时提交的form，包含习题信息和习题答案
 * 
 * @author jzw
 * @since 0.0.1
 */
public class ExerciseForm {

	private Exercise exercise;
	private Answer answer;

	public Exercise getExercise() {
		return exercise;
	}

	public void setExercise(Exercise exercise) {
		this.exercise = exercise;
	}

	public Answer getAnswer() {
		return answer;
	}

	public void setAnswer(Answer answer) {
		this.answer = answer;
	}
}
