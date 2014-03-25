define({
	exerciseType: {
		SINGLE_OPTION: "01",
		MULTI_OPTION: "02",
		FILL: "03",
		JUDGE: "04",
		CALCULATION: "05",
		ESSAY_QUESTION: "06"
	},
	
	actionType: {
		SAVE_EXERCISE_DRAFT: "0001",
		EDIT_EXERCISE_DRAFT: "0002",
		PUBLISH_EXERCISE: "0011",
		ANSWER_EXERCISE: "0021",
		EDIT_EXERCISE_ANSWER: "0022"
	},
	
	// TODO: 放到国际化文件中
	actionTypeMap: {
		"0001": "新建习题草稿",
		"0002": "编辑习题草稿",
		"0003": "删除习题草稿",
		"0011":	"发布习题",
		"0021": "解答习题",
		"0022": "编辑答案"
	},
	
	exerciseTypeMap: {
		"01": "单项选择题",
		"02": "多项选择题",
		"03": "完形填空题",
		"04": "判断题",
		"05": "计算题",
		"06": "问答题"
		
	},
	
	sex: {
		"1": "男",
		"2": "女"
	},
	
	site: {
		"1": "孜孜不倦",
		"101": "人人网"
	},
	
	avatar: {
		smallImageUrl: "/drip/resources/images/profile_50_50.gif"
	},
	
	exerciseStatus: {
		DRAFT: "01",
		PUBLISH: "02"
	}
});