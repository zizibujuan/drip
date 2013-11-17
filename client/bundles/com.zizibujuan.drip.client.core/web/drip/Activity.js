// 显示活动列表
define(["dojo/_base/declare",
        "dojo/_base/array",
        "dojo/_base/lang",
        "dojo/_base/event",
        "dojo/request/xhr",
        "dojo/dom-construct",
        "dojo/dom-prop",
        "dojo/dom-style",
        "dojo/query",
        "dojo/on",
        "dojo/fx",
        "dojo/json",
        "dojo/string",
        "dojo/date/locale",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/form/Button",
        "drip/classCode",
        "drip/prettyDate",
        "drip/_StoreMixin",
        "mathEditor/Editor",
        "mathEditor/dataUtil",
        "dojo/text!./templates/ActivityNode.html",
        "dojo/text!./templates/ActivityList.html",
        "drip/MiniCard",
        "drip/tip"], function(
        		declare,
        		array,
        		lang,
        		event,
        		xhr,
        		domConstruct,
        		domProp,
        		domStyle,
        		query,
        		on,
        		coreFx,
        		JSON,
        		string,
        		locale,
        		_WidgetBase,
        		_TemplatedMixin,
        		Button,
        		classCode,
        		prettyDate,
        		_StoreMixin,
        		Editor,
        		dataUtil,
        		nodeTemplate,
        		listTemplate,
        		MiniCard,
        		tip){
	
	// TODO：用户答题前，确保没有显示答案
	// TODO：“不做了”，恢复到答题前的状态
	
	// TODO:重复存在，重构
	var optionLabel = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	
	var ActivityNode = declare("drip.ActivityNode", [_WidgetBase, _TemplatedMixin],{
		
		templateString: nodeTemplate,
		
		data:{},
		
		postCreate : function(){
			console.log("activity node data:",this.data);
			this.inherited(arguments);
			this._showActionLabel();
			
			this.miniCard = new MiniCard();
			
			this._createExercise();
			this._createAnswer();
			
			// TODO: 每回答一次+1
			this.drip_answer_count.innerHTML = this.data.exerAnswerCount;
			
			// 解答按钮
			on(this.btnAnswer,"click", lang.hitch(this, this._loadAnswerHandler));
			var watchUserId = this.data.userInfo.userId;
			// 为头像和用户名绑定mouseover事件
			on(this.userLinkNode,"mouseover", lang.hitch(this, function(e){
				this.miniCard.show(e.target, watchUserId);
			}));
			on(this.userInfo,"mouseover", lang.hitch(this, function(e){
				this.miniCard.show(e.target, watchUserId);
			}));
			
			// TODO：如果鼠标往弹出面板的方向移动，则不要关闭弹出面板，如何实现呢？
			// 这里的代码，在离开触发容器之后，立即就关闭了，光标根本无法操作弹出框中的内容
			on(this.userLinkNode,"mouseout", lang.hitch(this, function(e){
				this.miniCard.hide();
			}));
			on(this.userInfo,"mouseout", lang.hitch(this, function(e){
				this.miniCard.hide();
			}));

		},
		
		_showActionLabel: function(){
			var data = this.data;
			console.log("单条活动记录：",data);
			var userName = data.userInfo.nickName || data.userInfo.loginName;
			this.userInfo.innerHTML = userName;
			this.action.innerHTML = classCode.ActionTypeMap[data.actionType];
			this.time.innerHTML = prettyDate.prettyForNumber(data.createTime);
			var _createTime = new Date(data.createTime);
			this.time.title = locale.format(_createTime, {
				selector: "date", 
				formatLength: "full"
			});
			this.time.datetime = data.createTime;
			// 用户头像
			// TODO:每天晚上到人人上同步一下用户信息
			//this.userLinkNode.href = "/users/"+data.userId;
			this.userImageNode.src = data.userInfo.smallImageUrl || classCode.avatar.smallImageUrl;
		},
		
		_createExercise: function(){
			var exerciseInfo = this.data.exercise;
			var userInfo = this.data.userInfo;
			// TODO:需要将mathEditor中model的格式转换为html格式
			var html = dataUtil.xmlStringToHtml(exerciseInfo.content);
			var _contentDiv = domConstruct.create("div", {innerHTML: html, "class": "content"}, this.exerciseNode);
			if(exerciseInfo.imageName){
				var _imageDiv = domConstruct.create("img", {src: "/userImages/" + userInfo.userId + "/" + exerciseInfo.imageName}, this.exerciseNode);
			}
			var options = exerciseInfo.options;
			if(options && options.length > 0){
				var inputType = "radio";
				if(exerciseInfo.exerType == classCode.ExerciseType.SINGLE_OPTION){
					inputType = "radio";
				}else if(exerciseInfo.exerType == classCode.ExerciseType.MULTI_OPTION){
					inputType = "checkbox";
				}
					
				var _optionsDiv = domConstruct.create("div",{"class":"option"},this.exerciseNode);
				var table = this.table = domConstruct.create("table", null, _optionsDiv);
				// 循环填写options节点
				array.forEach(options,lang.hitch(this, this._createOption, table, inputType));
			}
			
			// TODO:显示附图
		},
		
		_createOption: function(parentNode,inputType, data, index){
			console.log(parentNode, data, index);
			// 因为选项的name必须要与其他习题的区分开，所以应该使用部件id
			var inputId = this.id+"_"+data.id;
			var inputGroupName = "opt_"+this.id;
			
			var tr = domConstruct.place('<tr></tr>', parentNode);
			var td1 = domConstruct.place('<td></td>', tr);
			var input = domConstruct.create("input",{type: inputType, name: inputGroupName, id: inputId}, td1);
			domProp.set(input,{"disabled": true, optionId: data.id});
			
			var td2 = domConstruct.place('<td></td>', tr);
			var label = domConstruct.place('<label style="padding-right:5px">' + optionLabel.charAt(index) + '</label>',td2);
			domProp.set(label,"for",inputId);
			
			// 不再选项内容上添加for属性，因为用户阅读内容时，用鼠标选中内容可能只是为了帮助理解，而不是选择答案
			var td3 = domConstruct.place('<td></td>', tr);
			var html = dataUtil.xmlStringToHtml(data.content);
			td3.innerHTML = html;
		},
		
		_createAnswer: function(){
			var answerInfo = this.data.answer;
			if(answerInfo){
				var exerciseInfo = this.data.exercise;
				var exerType = exerciseInfo.exerciseType;
				
				// 针对不同的题型，有不同的渲染方式
				if(this._isOptionExercise(exerType)){
					this._optionLabels = [];
					array.forEach(answerInfo.detail, lang.hitch(this,this._setOptionAnswer));
					// 即使是选择题，也要在答案面板中回答
					
					var answerDiv = this.answerDiv = domConstruct.create("div",{"class":"answer"}, this.answerNode);
					if(this._optionLabels.length > 0){
						answerDiv.innerHTML = "答案是："+"<span>"+ this._optionLabels.join(",") +"</span>";
					}else{
						answerDiv.innerHTML = "答案是："+"<span>您还没有作答。</span>";
					}
				}else if(exerType == classCode.ExerciseType.ESSAY_QUESTION){
					// 会出现只录入习题解析，但是没有录入答案的情况
					// 并且问答题只支持录入一个答案
					if(answerInfo.detail.length == 1){
						var answerDiv = this.answerDiv = domConstruct.create("div",{"class":"answer"}, this.answerNode);
						answerDiv.innerHTML = "答案:" + dataUtil.xmlStringToHtml(answerInfo.detail[0].content);
					}
				}
				// 如果用户为该题添加了习题解析，则显示出来，如果没有则不显示
				var guide = answerInfo.guide;
				if(guide && guide != ""){
					// 添加习题解析，只读的
					var guideHtml = dataUtil.xmlStringToHtml(guide);
					var guideContainerDiv = this.guideContainerDiv = domConstruct.create("div",{"class":"guide"}, this.answerNode);
					var guideLabel = domConstruct.create("div",{innerHTML:"解析"}, guideContainerDiv);
					var guideContentDiv = domConstruct.create("div",{innerHTML:guideHtml}, guideContainerDiv);
				}
			}
		},
		
		_loadAnswerHandler: function(){
			// TODO: 先查询用户是否已经回答过，如果已经回答过了，则将答案加载过来
			// TODO：然后编辑答案，如果没有回答过，则直接新增
			// 传递习题标识，然后在servlet中传递userId，注意，因为这里传过去的是习题标识，
			// 不是答案标识，所以不能直接拼在url后面，而应该使用/?exerId=xxx的query的方式传递。
			
			// 需要 习题解析框， 习题答案框
			
			// TODO：如果回答显示答案的习题时，应先把别人隐藏的答案删除掉
			//		如果存在答案，则清空答案或删除答案面板
			//		如果存在习题解析，则删除习题解析面板
			
			// 隐藏只读的答案区块
			if(this.answerNode){
				domStyle.set(this.answerNode,"display", "none");
			}
			// 回答问题相关的dijit部件 
			var answerWidgets = this._answerWidgets = [];
			
			var editAnswerPane = this.editAnswerPane = domConstruct.create("div",null, this.exerciseNode, "after");
			
			var exerType = this.data.exercise.exerciseType;
			if(this._isOptionExercise(exerType)){
				// 把所有option设置为有效
				// 清除答案
				// 如果是选择题,因为可以直接在选项上作答，所以将所有选项置为有效
				this._getOptionEls().forEach(function(optEl,index){
					domProp.set(optEl,"disabled",false);
					if(domProp.get(optEl,"checked") == true){
						domProp.set(optEl, "checked", false);
					}
				});
				// 为选项添加change事件
				this._getOptionEls().on("click", lang.hitch(this, this._onAnswerChangedHandler));
			}else if(exerType == classCode.ExerciseType.ESSAY_QUESTION){
				var answerDiv = domConstruct.create("div",{"class":"answer"}, editAnswerPane);
				var answerLabel = domConstruct.create("div",{innerHTML:"答案"}, answerDiv);
				var answerEditor = this.answerEditor = new Editor({rows: 5, width: 650});
				answerEditor.placeAt(answerDiv);
				answerEditor.startup();
				
				answerEditor.on("change", lang.hitch(this, this._onAnswerChangedHandler));
				
				answerWidgets.push(answerEditor);
			}
			
			
			
			

			// 如果是选择题，则根据是否改变选项或者修改解析，来激活保存按钮
			
			var guideDiv = domConstruct.create("div",{"class":"guide"}, editAnswerPane);
			var guideLabel = domConstruct.create("div",{innerHTML:"解析"},guideDiv);
			var guideEditor = this.guideEditor = new Editor({rows:5, width:650});
			guideEditor.placeAt(guideDiv);
			guideEditor.startup();
			guideEditor.on("change", lang.hitch(this, this._onGuideChangedHandler));
			
			
			// FIXME：当div中有float元素时，怎么让div的高度根据其中元素的高度自适应
			var btnContainer = domConstruct.create("div",{style:"width:98%;margin-top:5px;text-align:right"},editAnswerPane);
			// TODO:i18n
			var aCancel = this._aCancel = domConstruct.create("a",{"class":"drip_op_cancel",innerHTML:"取消",href:"#"},btnContainer);
			var btnSave = this._btnSave = domConstruct.place("<button class=\"minibutton\"><i class=\"icon-save\"></i> 保存</button>",btnContainer);
			domProp.set(btnSave, "disabled", true);
			//var btnCancel = new Button({"label":"取消",style:"float:right"});
			//btnCancel.placeAt(btnContainer);
			on(btnSave, "click", lang.hitch(this, this._saveOrUpdateAnswer));
			on(aCancel,"click", lang.hitch(this, this._cancelAnswer));
			
			
			answerWidgets.push(guideEditor);
			//answerWidgets.push(btnCancel);
			
			// 把加载数据放在最后
			// 查出最新版本的答案，用户回答问题时，只对最新版本的习题作答。
			var exerciseId = this.data.exercise.id;
			xhr.get("/answers/",{query:{exerId:exerciseId},handleAs:"json"}).then(lang.hitch(this, this._loadLatestAnswer));
			
			// 隐藏只读的解答区域
			this._showAnswerArea(false);
		
		},
		
		_onAnswerChangedHandler: function(data){
			
			// 如果是问答题，则根据答案的内容是否变化，来决定是否激活保存按钮
			// 只有是问答题时，才有answerEditor
			// 比较答案和习题解析的值，只要有一个发生变化，就激活保存按钮
			// 如果是新增习题
			var exerType = this.data.exercise.exerciseType;
			var oldAnswer = this._oldAnswer;
			if(oldAnswer){
				// 必须发生改变。
				// 答案或习题发生变化时,
				// 问答题和选择题的判断逻辑不一样
				// 如果答案发生了变化，则激活保存按钮
				// 如果答案为空，则失效保存按钮
				// 如果答案没有发生变化，则判断解析是否发生变化，如果发生了变化，则激活保存按钮；否则失效
				
				if(this._isOptionExercise(exerType)){
					// 判断用户勾选的选项是否发生了变化
					var oldOptions = oldAnswer.detail;
					var newOptions = this._getSelectExerciseAnswer();
					if(newOptions.length == 0){
						// 答案为空，则不论guide的值为多少，都不允许保存
						this._disableBtnSave(true);
						return;
					}
					// 判断选项有没有发生变化
					if(!this._selectedAnswerOptionsEquals(oldOptions, newOptions)){
						// 答案的内容发生了变化
						this._disableBtnSave(false);
						return;
					}
					
					// 如果答案的内容没有发生变化，则判断解析的内容有没有发生变化
					var guideEditor = this.guideEditor;
					var guideContent = guideEditor.get("value");
					// 习题解析允许为空
					if(guideContent != oldAnswer.guide){
						this._disableBtnSave(false);
						return;
					}
				}
				
				if(exerType == classCode.ExerciseType.ESSAY_QUESTION){
					var answerEditor = this.answerEditor;
					if(answerEditor.isEmpty()){
						// 答案为空，则不论guide的值为多少，都不允许保存
						this._disableBtnSave(true);
						return;
					}
					var answerContent = answerEditor.get("value");
					if(oldAnswer.detail[0].content != answerContent){
						// 答案的内容发生了变化
						this._disableBtnSave(false);
						return;
					}
					
					// 如果答案的内容没有发生变化，则判断解析的内容有没有发生变化
					var guideEditor = this.guideEditor;
					var guideContent = guideEditor.get("value");
					// 习题解析允许为空
					if(guideContent != oldAnswer.guide){
						this._disableBtnSave(false);
						return;
					}
				}
				
				this._disableBtnSave(true);
				return;
			}
			
			if(this._isOptionExercise(exerType)){
				var newOptions = this._getSelectExerciseAnswer();
				if(newOptions.length == 0){
					this._disableBtnSave(true);
				}else{
					this._disableBtnSave(false);
				}
				return;
			}
			
			if(exerType == classCode.ExerciseType.ESSAY_QUESTION){
				// 如果是第一次解答习题，只要答案的内容不为空，就可以保存
				var answerEditor = this.answerEditor;
				if(answerEditor.isEmpty()){
					this._disableBtnSave(true);
				}else{
					this._disableBtnSave(false);
				}
			}
		},
		
		_selectedAnswerOptionsEquals: function(oldOptions, newOptions){
			if(oldOptions.length != newOptions.length){
				return false;
			}
			for(var i = 0; i < oldOptions.length; i++){
				var oldOption = oldOptions[i];
				var newOption = newOptions[i];
				if(oldOption.optionId != newOption.optionId){
					return false;
				}
			}
			return true;
		},
		
		_onGuideChangedHandler: function(data){
			var exerType = this.data.exercise.exerciseType;
			var oldAnswer = this._oldAnswer;
			if(oldAnswer){
				var guideEditor = this.guideEditor;
				if(oldAnswer.guide != guideEditor.get("value")){
					this._disableBtnSave(false);
					return;
				}
				
				if(this._isOptionExercise(exerType)){
					
					return;
				}
				
				if(exerType == classCode.ExerciseType.ESSAY_QUESTION){
					// 如果是第一次解答习题，只要答案的内容不为空，就可以保存
					var answerEditor = this.answerEditor;
					if(oldAnswer.detail[0].content == answerEditor.get("value")){
						this._disableBtnSave(true);
					}else{
						this._disableBtnSave(false);
					}
				}
				
			}
		},
		
		_disableBtnSave: function(disable/*boolean*/){
			var btnSave = this._btnSave;
			if(domProp.get(btnSave, "disabled") != disable){
				domProp.set(btnSave, "disabled", disable);
			}
		},
		
		_getSelectExerciseAnswer: function(){
			// summary:
			//		获取选择题的答案
			// 习题答案
			/*
			 guide
			 
			 exerId
			 detail
			 	content
			 	optionId
			 */
			
			var result = [];
			this._getOptionEls().forEach(lang.hitch(this,function(optionEl, index){
				if(domProp.get(optionEl, "checked") === true){
					var optionData = {optionId: domProp.get(optionEl,"optionId")};
					result.push(optionData);
				}
			}));
			return result;
		},
		
		_saveOrUpdateAnswer: function(e){
			var answerData = {};
			answerData.detail = [];
			var exerType = this.data.exercise.exerciseType;
			if(this._isOptionExercise(exerType)){
				answerData.detail = this._getSelectExerciseAnswer();
			}else if(exerType == classCode.ExerciseType.ESSAY_QUESTION){
				var a = this.answerEditor.get("value");
				// 不清除答案两边的空格，只要不是全为空格
				if(string.trim(a) != ""){
					answerData.detail.push({content: a});
				}
			}
			
			// 习题解析
			var guide = this.guideEditor.get("value");
			if(guide != ""){
				console.log("习题解析:",guide);
				answerData.guide = guide;
			}
			// 在post中执行新增或更新操作，确保每个人对每道习题的最终答案只有一个。
			// 但是在答案历史记录中要记录
			// TODO：保存的时候进行判断，如果answerId已经存在，则执行put;如果不存在，则执行post
			
			var method = null;
			var target = "/answers/";
			if(this._oldAnswer){
				method = "PUT";
				target += this._oldAnswer.id; // 是当前答案表中的标识，不是历史答案表中的标识
				answerData.id = this._oldAnswer.id;
				answerData.answerVersion = this._oldAnswer.answerVersion;
				// FIXME:answerInfo的exerciseId中存的应该是稳定的习题标识,即不是历史习题标识。
				answerData.exerciseId = this._oldAnswer.exerciseId;
			}else{
				method = "POST";
				// 这里存放的是历史习题标识
				answerData.exerciseId = this.data.exercise.histId;
			}
			
			xhr(target,{
				method: method, 
				handleAs:"json",
				data:JSON.stringify(answerData)
			}).then(lang.hitch(this,function(response){
				tip.ok("保存成功", this._aCancel, "before");
				
				var hideEditAnswerPane = coreFx.wipeOut({
					node: this.editAnswerPane,
					duration: 2000,
					onEnd: lang.hitch(this,function(){
						this._destroyAnswerPane();
						this._resetSelectOldAnswerPanel();
					})
				});
				var showReadOnlyAnswerPane = coreFx.wipeIn({
					node: this.answerNode,
					onEnd: lang.hitch(this, function(){
						this._showAnswerArea(true);
					})
				});
				coreFx.chain([hideEditAnswerPane, showReadOnlyAnswerPane]).play();
				
				//
				// TODO：保存成功的时候，要从后台获取回答的次数，然后刷新答案个数
				//
			}),lang.hitch(this,function(error){
				// 出错时
			}));
		},
		
		_cancelAnswer: function(e){
			event.stop(e);
			// 删除答题面板
			this._destroyAnswerPane();
			// 恢复之前的状态，所以需要提取出数据，并将这些数据缓存起来。
			// 恢复显示隐藏的面板
			if(this.answerDiv){
				domStyle.set(this.answerDiv,"display","");
			}
			if(this.guideContainerDiv){
				domStyle.set(this.guideContainerDiv,"display","");
			}
			
			this._resetSelectOldAnswerPanel();
			
			this._showAnswerArea(true);
		},
		
		_resetSelectOldAnswerPanel: function(){
			// summary:
			//		恢复选择题的答案选项
			
			var answerInfo = this.data.answer;
			if(answerInfo){
				var exerType = this.data.exercise.exerciseType;
				if(this._isOptionExercise(exerType)){
					array.forEach(answerInfo.detail, lang.hitch(this,this._setOptionAnswer));
					this._getOptionEls().forEach(function(el){
						domProp.set(el, "disabled", true);
					});
				}
			}else{
				var exerType = this.data.exercise.exerciseType;
				if(this._isOptionExercise(exerType)){
					this._getOptionEls().forEach(function(el){
						domProp.set(el, "checked", false);
						domProp.set(el, "disabled", true);
					});
				}
			}
		},
		
		_loadLatestAnswer: function(e){
			var data = this.data.answer;
			// 这里应该将"null"解析为null
			if(data == null || data == "null"){
				// 说明没有获得答案
				return;
			}
			
			this._oldAnswer = data;
			console.log("answer:",data);
			// 如果已经作答过了，则之前做过的答案显示出来，
			// 并标出这是用户何时作答的答案，并提醒用户可以继续完善答案。
			// 如果没有作答，则这里什么也不做。
			if(data.guide){
				this.guideEditor.set("value",data.guide);
				console.log("guide:",data.guide);
				// TODO:在label上显示出这是在什么时候解答的，绿色显示。
			}
			var exerType = this.data.exercise.exerciseType;
			if(this._isOptionExercise(exerType)){
				if(data.detail && data.detail.length > 0){
					array.forEach(data.detail, lang.hitch(this,this._setOptionAnswer));
				}
			}else if(exerType == classCode.ExerciseType.ESSAY_QUESTION){
				if(data.detail && data.detail.length == 1){
					// 如果是问答题，则必有一个answerEditor
					this.answerEditor.set("value", data.detail[0].content);
				}
			}
			
			var info = domConstruct.create("div", {style: {color:"gray", "font-style": "italic"}}, this.editAnswerPane);
			var span1 = domConstruct.create("span", {innerHTML: "您上次于"}, info);
			var time = domConstruct.create("time", {innerHTML: prettyDate.prettyForNumber(data.createTime)}, info);
			time.datetime = data.createTime;
			var span2 = domConstruct.create("span", {innerHTML: "编辑该答案"}, info);
		},
		
		_showAnswerArea: function(show){
			var display = "";
			if(show==false){
				display = "none";
			}
			domStyle.set(this.answerAreaNode,"display",display);
			domStyle.set(this.answerNode, "display", display);
		},
		
		_destroyAnswerPane: function(){
			// summary
			//		删除答题面板
			
			if(this._answerWidgets){
				array.forEach(this._answerWidgets, function(widget,index){
					widget.destroyRecursive();
				});
				this._answerWidgets = [];
			}
			domConstruct.destroy(this.editAnswerPane);
			
			this.answerEditor = null;
			this.guideEditor = null;
		},
		
		_isOptionExercise: function(exerType){
			return exerType == classCode.ExerciseType.SINGLE_OPTION || exerType == classCode.ExerciseType.MULTI_OPTION;
		},
		
		_setOptionAnswer: function(answer, index){
			var optionId = answer.optionId;
			// TODO:从性能角度上将，可先缓存这些radio
			this._getOptionEls().some(lang.hitch(this,function(node,index){
				if(domProp.get(node,"optionId") == optionId){
					domProp.set(node,"checked", true);
					// 要是放在这里的话，加载当前用户的答案时，会覆盖掉原有的值，虽然并不会改变页面上显示的值。
					if(this._optionLabels){
						this._optionLabels.push(node.parentNode.nextSibling.firstChild.innerHTML);
					}
					
					return true;
				}
				return false;
			}));
		},
		
		_getOptionEls: function(){
			if(!this._optionEls){
				this._optionEls = query("input[type=radio]", this.table);
			}
			return this._optionEls;
		}
		
	});
	
	var Activity = declare("Activity",[_WidgetBase, _TemplatedMixin, _StoreMixin],{
		templateString: listTemplate,
		 
		 // 如果没有习题，则显示没有习题，
		 // 可扩展提示用户录入习题。
		 postCreate : function(){
			 this.inherited(arguments);
			 domStyle.set(this.domNode,{"padding-top":"10px","padding-left": "10px","padding-right":"10px"});
			 this.refresh();
		 },
		 
		 _load : function(items){
			 if(items.length == 0){
				 this.domNode.innerHTML = this.noDataMessage;
			 }else{
				 console.log("个人首页的活动列表：",items);
				 this.domNode.innerHTML = "";
				 array.forEach(items, lang.hitch(this,function(item, index){
					 
					 var node = new ActivityNode({
						 data : item
					 });
					 this.domNode.appendChild(node.domNode);
				 }));
				 // 隔上一分钟更新一下。
				 prettyDate.setInterval(this.domNode, 1000*60);
				 // 使用mathjax进行呈现
				 MathJax.Hub.Queue(["Typeset",MathJax.Hub, this.domNode]);
			 }
		 },
		 
		 refresh: function(){
			 this.domNode.innerHTML = this.loadingMessage;
			 if(this.store){
				 this.store.query(this.query/*TODO:加入分页信息*/).then(lang.hitch(this, this._load));
			 }
		 }
		 
	});
	
	return Activity;
	
});