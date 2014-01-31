define(["dojo/_base/declare",
        "mathEditor/Editor",
        "drip/editorHelper",
        "drip/classCode"], function(
        		declare,
        		Editor,
        		editorHelper,
        		classCode){
	
	return declare("drip.view.ExerciseEditor", null, {
		
		parentNode: null,
		
		exerciseInfo: null,
		
		constructor: function(args){
			lang.mixin(this, args);
		},
		
		render: function(){
			// summary：
			//		渲染习题编辑界面
			//		不允许修改题型
			
			var exerciseInfo = this.exerciseInfo;
			// 绘制习题内容输入框
			this._createContentInput(exerciseInfo.content);
			
			// 如果是选择题，绘制可选项输入框
			// 根据题型决定是否显示可选项
			var exerciseType = exerciseInfo.exerciseType;
			var optionType = null;
			if(exerciseType === classCode.ExerciseType.SINGLE_OPTION){
				optionType = "radio";
			}else if(exerciseType === classCode.ExerciseType.MULTI_OPTION){
				optionType = "checkbox";
			}
			if(optionType != null){
				this._showOptionPane(optionType);
			}
			
			
			
		},
		
		_createContentInput: function(content){
			// summary:
			//		创建习题内容输入框。
			//		只创建一次。
			
			var editor = this.exerContentEditor = editorHelper.createEditor("内容", 10, "必填");
			editor.set("value", content);
		}
	});
});