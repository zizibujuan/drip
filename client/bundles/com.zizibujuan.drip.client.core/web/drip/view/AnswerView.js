define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-construct",
        "dojo/dom-prop",
        "mathEditor/Editor",
        "drip/tip"], function(
        		declare,
        		lang,
        		array,
        		domConstruct,
        		domProp,
        		MathEditor,
        		tip){
	
	return declare("drip.view.AnswerView", null, {
		
		// 习题视图
		exerciseView: null,
		
		answerInfo: null,
		
		parentNode: null,
		
		readOnly: false,
		
		constructor: function(args){
			lang.mixin(this, args);
		},
		
		render: function(){
			if(this.exerciseView.isOptionExercise()){
				
				var data = this.answerInfo;
				if(data && data.detail && data.detail.length > 0){
					array.forEach(data.detail, lang.hitch(this, this.exerciseView.setOption));
				}
			}else if(this.exerciseView.isQuestionExercise()){
				var answerDiv = domConstruct.create("div",{"class":"answer-edit"}, this.parentNode);
				var answerLabel = domConstruct.create("div",{innerHTML:"答案"}, answerDiv);
				var answerEditor = this.answerEditor = new MathEditor({rows: 5, width: 650});
				answerEditor.placeAt(answerDiv);
				answerEditor.startup();
				
				if(this.answerInfo){
					answerEditor.set("value", this.answerInfo.options[0].content);
				}
			}
			
			var guideDiv = domConstruct.create("div",{"class":"guide"}, this.parentNode);
			var guideLabel = domConstruct.create("div",{innerHTML:"解析"},guideDiv);
			var guideEditor = this.guideEditor = new MathEditor({rows:5, width:650});
			guideEditor.placeAt(guideDiv);
			guideEditor.startup();
			if(this.answerInfo){
				guideEditor.set("value", this.answerInfo.guide);
			}
		},
		
		save: function(e){
			var button = e.target;
			var answerData = this._getAnaswrData();
			this._saveOrUpdate(answerData, button);
		},
		
		_getAnsswerData: function(){
			var data = {};
			data.detail = [];
			// 答案
			if(this.exerciseView.isOptionExercise()){
				data.detail = this.exerciseView.getSelectedAnswers();
			}else if(this.exerciseView.isQuestionExercise()){
				var answerContent = this.answerEditor.get("value");
				if(string.trim(answerContent) != ""){
					data.detail.push({content: answerContent});
				}
			}
			// 解析
			var guideContent = this.guideEditor.get("value");
			if(string.trim(guideContent) != ""){
				data.guide = guideContent;
			}
			return data;
		},
		
		_saveOrUpdate: function(answerData, button){
			var target = "/answers/";
			var oldAnswer = this.answerInfo;
			if(oldAnswer){
				method = "PUT";
				// 是当前答案表中的标识，不是历史答案表中的标识
				target += oldAnswer.id;
				answerData.id = oldAnswer.id;
				answerData.answerVersion = oldAnswer.answerVersion;
				// FIXME:answerInfo的exerciseId中存的应该是稳定的习题标识,即不是历史习题标识。
				answerData.exerciseId = oldAnswer.exerciseId;
			}else{
				method = "POST";
				// 历史习题标识？这里无法获取到
				answerData.exerciseId = this.exerciseView.getExerciseId();
			}
			
			xhr(target, {
				method: method,
				handleAs: "json",
				data: JSON.stringify(answerData);
			}).then(
				lang.hitch(this, this.afterSaveSuccess, button),
				lang.hitch(this, this.afterSaveError)	
			);
		},
		
		afterSaveSuccess: function(button, data){
			tip.ok("保存成功", button, "after");
		},
		
		afterSaveError: function(button, error){
			tip.ok("保存出错，请重试", button, "after");
		}
		
	});
	
});