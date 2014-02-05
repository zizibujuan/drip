define(["dojo/_base/declare",
        "dojo/_base/array",
        "dojo/_base/lang",
        "dojo/query",
        "dojo/dom-prop",
        "dojo/dom-construct",
        "mathEditor/dataUtil",
        "drip/classCode"], function(
        		declare,
        		array,
        		lang,
        		query,
        		domProp,
        		domConstruct,
        		dataUtil,
        		classCode){
	
	var optionLabel = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	return declare("drip.view.ExerciseView", null, {
		
		parentWidgetId: null,
		
		exerciseInfo: null,
		
		parentNode: null,
		
		readOnly: true,
		
		constructor: function(args){
			lang.mixin(this, args);
		},
		
		getExerciseId: function(){
			return this.exerciseInfo.id;
		},
		
		render: function(){
			var exerciseInfo = this.exerciseInfo;
			var parentNode = this.parentNode;
			
			var html = dataUtil.xmlStringToHtml(exerciseInfo.content);
			var _contentDiv = this.contentDiv = domConstruct.create("div", {innerHTML: html, "class": "content"}, parentNode);
			if(exerciseInfo.imageName){
				//  FIXME:这个图，放在创建人的用户名下，作为修改人，用户下是没有这个图的,
				// 保存的时候，把用户标识也保存进去？
				// TODO：可编辑
				var _imageDiv = domConstruct.create("img", {src: "/userImages/" + exerciseInfo.createUserId + "/" + exerciseInfo.imageName}, parentNode);
			}
			var options = exerciseInfo.options;
			if(options && options.length > 0){
				var inputType = null;
				var exerType = exerciseInfo.exerciseType;
				if(exerType == classCode.ExerciseType.SINGLE_OPTION){
					inputType = "radio";
				}else if(exerType == classCode.ExerciseType.MULTI_OPTION){
					inputType = "checkbox";
				}else{
					throw "不支持的习题类型："+exerType;
				}
					
				var _optionsDiv  = this.optionsDiv= domConstruct.create("div",{"class":"option"}, parentNode);
				var table = this._table = domConstruct.create("table", null, _optionsDiv);
				// 循环填写options节点
				array.forEach(options, lang.hitch(this, function(option, index){
					this._createOption(table, inputType, option, index)
				}));
			}
			
			// 如果习题处于草稿状态，则添加草稿标签
			if(exerciseInfo.status == classCode.exerciseStatus.DRAFT){
				var span = domConstruct.create("span", {"class": "tag_draft"}, parentNode);
				span.innerHTML = "草稿";
				
				if(exerciseInfo.histVersion != exerciseInfo.version){
					var span = domConstruct.create("span", {"class": "tag_updated"}, parentNode);
					span.innerHTML = "已修订";
				}
			}
		},
		
		getOptionEls: function(){
			if(!this._optionEls){
				this._optionEls = query("input[type=radio]", this._table);
			}
			return this._optionEls;
		},
		
		getSelectedAnswers: function(){
			var answers = [];
			this.getOptionEls().forEach(function(opt, index){
				if(domProp.get(opt, "checked") === true){
					var optionData = {optionId: domProp.get(opt, "optionId")};
					answers.push(optionData);
				}
			});
			return answers;
		},
		
		setOption: function(answerOption, index){
			var optionId = answerOption.optionId;
			this.getOptionEls().some(lang.hitch(this,function(node,index){
				if(domProp.get(node,"optionId") == optionId){
					domProp.set(node,"checked", true);
					return true;
				}
				return false;
			}));
		},
		
		_createOption: function(parentNode,inputType, data, index){
			// 因为选项的name必须要与其他习题的区分开，所以这里使用父部件id
			var widgetId = this.parentWidgetId;
			var inputId = widgetId + "_" + data.id;
			var inputGroupName = "opt_" + widgetId;
			
			var tr = domConstruct.place('<tr></tr>', parentNode);
			var td1 = domConstruct.place('<td></td>', tr);
			var input = domConstruct.create("input",{type: inputType, name: inputGroupName, id: inputId}, td1);
			
			if(this.readOnly){
				domProp.set(input,{"disabled": true});
			}
			domProp.set(input, {optionId: data.id});
			
			var td2 = domConstruct.place('<td></td>', tr);
			var label = domConstruct.place('<label style="padding-right:5px">' + optionLabel.charAt(index) + '</label>',td2);
			domProp.set(label,"for",inputId);
			
			// 不在选项内容上添加for属性，因为用户阅读内容时，用鼠标选中内容可能只是为了帮助理解，而不是选择答案
			var td3 = domConstruct.place('<td></td>', tr);
			var html = dataUtil.xmlStringToHtml(data.content);
			td3.innerHTML = html;
		},
		
		isOptionExercise: function(){
			// summary:
			//		判断题型是不是选择题，包括多选和单选
			
			var exerType = this.exerciseInfo.exerciseType;
			return exerType == classCode.ExerciseType.SINGLE_OPTION || exerType == classCode.ExerciseType.MULTI_OPTION;
		},
	
		isQuestionExercise: function(){
			// summary:
			//		判断题型是不是问答题
			
			var exerType = this.exerciseInfo.exerciseType;
			return exerType == classCode.ExerciseType.ESSAY_QUESTION;
		},
		
		activeOptions: function(){
			this.getOptionEls().forEach(function(optEl, index){
				domProp.set(optEl,"disabled",false);
				if(domProp.get(optEl,"checked") == true){
					domProp.set(optEl, "checked", false);
				}
			});
		}
		
	});

});