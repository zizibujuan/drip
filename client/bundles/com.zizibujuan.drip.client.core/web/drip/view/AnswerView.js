define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-construct",
        "dojo/dom-prop",
        "mathEditor/Editor"], function(
        		declare,
        		lang,
        		array,
        		domConstruct,
        		domProp,
        		MathEditor){
	
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
					array.forEach(data.detail, lang.hitch(this, this._setOptionAnswer));
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
		
		_setOptionAnswer: function(answer, index){
			var optionId = answer.optionId;
			this.exerciseView.getOptionEls().some(lang.hitch(this,function(node,index){
				if(domProp.get(node,"optionId") == optionId){
					domProp.set(node,"checked", true);
					return true;
				}
				return false;
			}));
		}
		
	});
	
});