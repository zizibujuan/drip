define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dijit/_WidgetBase",
        "mathEditor/Editor",
        "drip/editorHelper",
        "drip/classCode"], function(
        		declare,
        		lang,
        		_WidgetBase,
        		Editor,
        		editorHelper,
        		classCode){
	
	return declare("drip.view.ExerciseEdit", _WidgetBase, {
		
		exerciseInfo: null,
		
		postCreate: function(){
			// summary：
			//		渲染习题编辑界面
			//		不允许修改题型
			
			this.inherited(arguments);
			

		},
		
		_createContentInput: function(content){
			// summary:
			//		创建习题内容输入框。
			//		只创建一次。
			
			// TODO: width的值应该设置为100%，但是设置为100%后光标类型显示不正确
			var editor = this.contentEditor = new Editor({rows:5, width:650});
			editor.placeAt(this.domNode);
			editor.startup();
			editor.set("value", content);
		},
		
		startup: function(){
			this.inherited(arguments);
			
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
		
		destroy: function(preserveDom){
			this.inherited(arguments);
			
			
		}
		
		/*
		 var exerciseEditor = this.exerciseEditor = new Editor({rows:5, width:650});
			exerciseEditor.placeAt(editorContainer);
			exerciseEditor.startup();
		 */
	});
});