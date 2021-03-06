define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/request/xhr",
        "dijit/_WidgetBase",
        "mathEditor/Editor",
        "drip/editorHelper",
        "drip/classCode"], function(
        		declare,
        		lang,
        		xhr,
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
			var editor = this.contentEditor = new Editor({rows:5, width:600});
			editor.placeAt(this.domNode);
			editor.startup();
			if(content){
				editor.set("value", content);
			}
		},
		
		startup: function(){
			this.inherited(arguments);
			
			var exerciseInfo = this.exerciseInfo || {};
			// 绘制习题内容输入框
			this._createContentInput(exerciseInfo.content);
			
			// 如果是选择题，绘制可选项输入框, 并且选项已经绘制出来，则激活checkbox即可
			// 根据题型决定是否显示可选项
//			var exerciseType = exerciseInfo.exerciseType;
//			var optionType = null;
//			if(exerciseType === classCode.ExerciseType.SINGLE_OPTION){
//				optionType = "radio";
//			}else if(exerciseType === classCode.ExerciseType.MULTI_OPTION){
//				optionType = "checkbox";
//			}
//			if(optionType != null){
//				this._createOptions(optionType);
//			}
		},
		
		_createOptions: function(optionType){
			
		},
		
		destroy: function(preserveDom){
			this.inherited(arguments);
			
			
		},
		
		save: function(){
			var data = this.exerciseInfo;
			return xhr.post("/exercises/", {
				handleAs: "json", 
				data: JSON.stringify(data)
			});
		},
		
		update: function(){
			var data = this.exerciseInfo;
			data.content = this.contentEditor.get("value");
			// TODO: 做数据有效性校验
			
			// 只编辑习题内容与选项，不编辑习题类型。
			return xhr.put("/exercises/" + data.id, {
				handleAs: "json", 
				data: JSON.stringify(data)
			});
		}
		
		/*
		 var exerciseEditor = this.exerciseEditor = new Editor({rows:5, width:650});
			exerciseEditor.placeAt(editorContainer);
			exerciseEditor.startup();
		 */
	});
});