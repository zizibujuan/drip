define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/_base/event",
        "dojo/request/xhr",
        "dijit/_WidgetBase",
        "dijit/registry",
        "dojo/dom",
        "dojo/dom-attr",
        "dojo/dom-style",
        "dojo/dom-class",
        "dojo/dom-construct",
        "dojo/on",
        "dojo/query",
        "dojo/json",
        "mathEditor/Editor",
        "drip/classCode",
        "dojox/form/Uploader",
        "drip/widget/form/uploader/FileList"
        ], function(
        		declare,
        		lang,
        		array,
        		event,
        		xhr,
        		_WidgetBase,
        		registry,
        		dom,
        		domAttr,
        		domStyle,
        		domClass,
        		domConstruct,
        		on,
        		query,
        		JSON,
        		Editor,
        		classCode,
        		Uploader,
        		FileList){
	
	var optionLabel = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	
	return declare("drip.exercises.ExerciseForm",[_WidgetBase],{
		// summary:
		//		数据
		//		exerType:
		//		content:
		//		guide:
		//		options:[]
		//		answers:[]
		data:{},
		
		optionLength: 4,
		
		_optionName:"exercise-option",
		
		postCreate: function(){
			this.inherited(arguments);
			
			// 左右分栏
			
//			<div style="width: 660px; float: left;" id="leftForm">
//			</div>
//			<div style="float: right; width:240px">
//				<!-- 提供系统标签，也允许用户自定义标签，放在各自的tab中 -->
//				<h3>选择科目</h3>
//				<div>高等数学</div>
//				<div>
//					树状结构展示更详细的分类。
//				</div>
//			</div>
			
//			<div style="float: right; width:240px">
//				<!-- 提供系统标签，也允许用户自定义标签，放在各自的tab中 -->
//				<h3>选择科目</h3>
//				<div>高等数学</div>
//				<div>
//					树状结构展示更详细的分类。
//				</div>
//			</div>
			var leftDiv = this.leftDiv = domConstruct.place('<div style="width: 660px; float: left;"></div>', this.domNode);
			var rightDiv = this.rightDiv = domConstruct.place('<div style="width: 240px; float: right;"></div>', this.domNode);
			
			// 创建题型
			this._createQuestionTypeOptions();
			
			// 随着题型而变化的form对象为答案可选项，分为单选和多选。
			// 而内容、图片和习题解析是每个题型都有的。
			
			// 题型默认选中问答题
			this._createSingleSelectForm();
			//this._createEssayQuestionForm();
			
			// 在右侧创建图片上传功能
			
			// 创建习题内容输入框
			this._createContentInput();
			
			// 根据题型决定是否显示可选项
			
			// 创建习题解析输入框
			this._createGuideInput();
			
			// 创建科目course
			// 科目默认不选择（optional，甚至可以录完习题内容之后再设置，
			// 因为这个页面的第一功能是录入习题，而科目是用来设置习题的类别关系）。
			this._createCourseOptions();
			// 创建保存按钮
			var actionContainer = domConstruct.create("div",{"class":"drip_form_actions"},this.leftDiv);
			var btnSave = this.btnSave = domConstruct.place("<button class=\"minibutton\"><i class=\"icon-save icon-large\"></i> 保存</button>", actionContainer);
			on(btnSave,"click",lang.hitch(this, this.doSave));
		},
		
		/*
		<ul class="radio-group">
			<li><input type="radio" name="course" id="higherMath"/><label for="higherMath">高等数学</label></li>
			<li><input type="radio" name="course" id="linearAlgebra"/><label for="linearAlgebra">线性代数</label></li>
			<li><input type="radio" name="course" id="probability"/><label for="probability">概率论与数理统计</label></li>
		</ul>
		 */
		_createCourseOptions: function(){
			var row = domConstruct.create("div", {"class":"form clearfix"}, this.leftDiv);
			
			domConstruct.place('<div class="drip-title">科目</div>', row);
			var name = "course";
			var cources = [{id:"higherMath", label:"高等数学"},
			               {id:"linearAlgebra", label:"线性代数"},
			               {id:"probability", label:"概率论与数理统计"}];
			var ul = domConstruct.place("<ul class=\"radio-group\"></ul>", row);
			for(var i = 0; i < cources.length; i++){
				var cource = cources[i];
				var li = domConstruct.create("li", null, ul);
				var input = domConstruct.create("input", {type:"radio", name:name, id: cource.id}, li);
				var label = domConstruct.create("label", {"for":cource.id, innerHTML: cource.label}, li);
			}
		},
		
		_createContentInput: function(){
			// summary:
			//		创建习题内容输入框
			
			this._createMathInput("习题内容", 10);
		},
		
		_createGuideInput: function(){
			// summary:
			//		创建习题解析输入框
			
			this._createMathInput("习题解析", 5);
		},
		
		_createMathInput: function(label, rowCount){
			// summary:
			//		创建包含label的支持输入数学公式的输入框
			
			var guidePane = domConstruct.create("div", {"class":"form"}, this.leftDiv);
			domConstruct.place('<div class="drip-title">'+label+'</div>', guidePane);
			this.editorGuide = this._createEditor(guidePane, rowCount);
		},
		
		_createEditor: function(parentNode, rowCount, width){
			// summary:
			//		创建数学编辑器
			// parentNode: dom node
			// rowCount: int
			// width: int
			var params = {};
			// TODO:在mathEditor中增加rows参数，但是不增加columns参数，而是依然使用width参数，
			// 因为输入数学公式之后，列数是无法确定的。
			params.width = width;
			params.rows = rowCount;
			var editor = new Editor(params);
			editor.placeAt(parentNode);
			return editor;
		},
		
		/*
		 <ul class="radio-group">
			<li><input type="radio" name="questionType" id="essayQuestion"/><label for="essayQuestion">问答题</label></li>
			<li><input type="radio" name="questionType" id="single"/><label for="single">单项选择题</label></li>
			<li><input type="radio" name="questionType" id="multiple"/><label for="multiple">多项选择题</label></li>
			<!-- 填空题
			<li><input type="radio" name="questionType" id="fill"><label for="fill">填空题</label></li>
			 -->
		</ul>
		 */
		_createQuestionTypeOptions: function(){
			var row = domConstruct.create("div", {"class":"form clearfix"}, this.leftDiv);
			
			domConstruct.place('<div class="drip-title">题型</div>', row);
			var name = "questionType";
			var cources = [{id: "essayQuestion", label: "问答题", selected: true},
			               {id:"single", label:"单项选择题", selected: false},
			               {id:"multiple", label:"多项选择题", selected: false}/*,
			               {id:"fill", label:"填空题"}*/];
			var ul = domConstruct.place("<ul class=\"radio-group\"></ul>", row);
			for(var i = 0; i < cources.length; i++){
				var cource = cources[i];
				var li = domConstruct.create("li", null, ul);
				var input = domConstruct.create("input", {type:"radio", name:name, id: cource.id, checked: cource.selected}, li);
				var label = domConstruct.create("label", {"for":cource.id, innerHTML: cource.label}, li);
			}
		},
		/*
		 * // 绑定事件
			var singleEl = dom.byId("single");
			this._toggleSelection(singleEl);
			on(singleEl,"click",lang.hitch(this, this._showSingleSelectForm));
			on(dom.byId("multiple"),"click",lang.hitch(this, this._showMultipleSelectForm));
			on(dom.byId("fill"),"click",lang.hitch(this, this._showFillForm));
			on(dom.byId("essayQuestion"),"click",lang.hitch(this, this._showEssayQuestionForm));
			
			

		
		 
		 */
		_createImageInput: function(){
			// summary:
			//		创建图片上传输入框与图片编辑器。
			
			var imagePane = domConstruct.create("div", {"class":"form"}, this.rightDiv);
			var title = domConstruct.place('<div class="drip-title" style="margin-bottom: 5px;"></div>', imagePane);
			
			var u = new dojox.form.Uploader({
			    label: "上传图片",
			    multiple: true,
			    type:"file",
			    uploadOnSelect: true,
			    url: "/uploads/exerciseImage"
			});
			u.placeAt(title);
			u.startup();
			
			var list = new drip.widget.form.uploader.FileList({uploader:u});
			list.placeAt(title);
			//list.startup();
		},
		
		doSave: function(e){
			// 保存之前要先校验
			
			// 失效保存按钮，防止重复提交
			domAttr.set(this.btnSave,"disabled", true);
			
			var data = this.data;
			data.content = this.editorExerContent.get("value");
			data.options = [];
			registry.findWidgets(this.tblOption).forEach(function(widget, index){
				console.log(widget, index, widget.get("value"));
				data.options.push(widget.get("value"));
			});
			
			var answer = {};
			var answerDetail = [];
			query("[name="+this._optionName+"]:checked", this.tblOption).forEach(function(inputEl, index){
				console.log(inputEl, index);
				answerDetail.push({seq: inputEl.value});
			});
			
			if(answerDetail.length > 0){
				answer.detail = answerDetail;
			}
			var guide = this.editorGuide.get("value");
			if(guide!= null && guide.length > 0){
				answer.guide = guide;
			}
			if(answer.detail || answer.guide){
				data.answer = answer;
			}
			console.log("将要保存的习题数据为：",data);
			
			xhr("/exercises/",{method:"POST", data:JSON.stringify(data)}).then(lang.hitch(this,function(response){
				// 保存成功，在界面上清除用户输入数据，使处于新增状态。在页面给出保存成功的提示，在按钮旁边显示。
				this._reset();
				domAttr.set(this.btnSave,"disabled", false);
			}),lang.hitch(this, function(error){
				// 保存失败，不清除用户输入数据，并给出详尽的错误提示
				domAttr.set(this.btnSave,"disabled", false);
			}));
		},
		
		_reset: function(){
			this.data = {};
			this.editorExerContent.set("value","");
			this.editorGuide.set("value","");
			query("[name="+this._optionName+"]:checked", this.tblOption).forEach(function(inputEl, index){
				domAttr.set(inputEl,"checked", false);
			});
			registry.findWidgets(this.tblOption).forEach(function(widget, index){
				widget.set("value","");
			});
		},
		
		empty: function(){
			
		},
		
		/*
						<!-- optionId
						
						暂时决定不在这里录入习题解析。网站上的一切习题，只有大家回答的答案，没有绝对的标准答案。
						把录入习题和解答习题分为两个活动。
						可提供一个按钮，叫确定并解答习题。在解答习题的页面会给“习题解析”录入框。
						
						现在设计的是把录入习题和回答习题放在一个页面了。
						 -->
					</div>
					
			
		 */
		
		_toggleSelection: function(target){
			if(this._selectedExerTypeElement){
				domClass.remove(this._selectedExerTypeElement,"selected");
			}
			this._selectedExerTypeElement = target;
			domClass.add(this._selectedExerTypeElement,"selected");
		},
		
		_showSingleSelectForm: function(e){
			if(e.target == this._selectedExerTypeElement){
				return;
			}
			this._toggleSelection(e.target);
			this._createSingleSelectForm();
		},
		
		_showMultipleSelectForm: function(e){
			if(e.target == this._selectedExerTypeElement){
				return;
			}
			this._toggleSelection(e.target);
			this._createMultipleSelectForm();
		},
		
		_showFillForm: function(e){
			if(e.target == this._selectedExerTypeElement){
				return;
			}
			this._toggleSelection(e.target);
		},
		
		_showEssayQuestionForm: function(e){
			if(e.target == this._selectedExerTypeElement){
				return;
			}
			this._toggleSelection(e.target);
			this._createEssayQuestionForm();
		},
		
		_createSingleSelectForm: function(){
			// summary:
			//		创建单选题form
			this.data.exerType = classCode.ExerciseType.SINGLE_OPTION;
			if(this.optionPane){
				if(this.optionPane.style.display == "none"){
					this.optionPane.style.display = "";
				}
				if(this.optionPane.style.display == ""){
					query("input", this.optionPane).forEach(function(el,index){
						el.type="radio";
					});
				}
			}else{
				this._createSelectForm("radio");
			}
		},
		
		_createMultipleSelectForm: function(){
			this.data.exerType = classCode.ExerciseType.MULTI_OPTION;
			if(this.optionPane){
				if(this.optionPane.style.display == "none"){
					this.optionPane.style.display = "";
				}
				if(this.optionPane.style.display == ""){
					query("input", this.optionPane).forEach(function(el,index){
						el.type="checkbox";
					});
				}
			}else{
				this._createSelectForm("checkbox");
			}
			
		},
		
		_createSelectForm: function(type){
			this._createContentInput();
			this._createImageInput();
			this._createOptionPane(type);
			this._createGuideInput();
		},
		
		_createEssayQuestionForm: function(){
			this.data.exerType = classCode.ExerciseType.ESSAY_QUESTION;
			if(this.optionPane && this.optionPane.style.display == ""){
				this.optionPane.style.display = "none";
			}
		},
		
		_createOptionPane: function(type){
			// summary:
			//		创建习题选项面板
			
			// 在最外围添加一个div容器
			var optionPane = this.optionPane = domConstruct.create("div", null, this.leftDiv);
			domConstruct.place('<div class="drip-title">选项和答案</div>', optionPane);
			var container = domConstruct.place('<div></div>', optionPane);
			
			// 创建选项
			var table = this.tblOption = domConstruct.place('<table class="drip-exercise-option"></table', container);
			var defaultOptionLength = this.optionLength;
			for(var i = 0; i < defaultOptionLength; i++){
				this._createOption(table,i, type);
			}
			this._refreshOption();
			
			// 创建新建行按钮
			var addContainer = domConstruct.place('<div></div>', container);
			// TODO：添加选项时，让这个按钮不要移动。
			var aAdd = domConstruct.place('<a href="#"><i class=\"icon-plus\"></i> 添加选项</a>', addContainer);
			on(aAdd, "click", lang.hitch(this, function(e){
				this._createOption(table, this.optionLength++, type);
				event.stop(e);
			}));
		},
		
		_getOptionId: function(){
			
			if(!this.optionId){
				this.optionId = 0;
			}
			return this.optionId++;
		},
		
		_createOption: function(parentNode,index, inputType){
			var tr = domConstruct.place('<tr></tr>', parentNode);
			var td1 = domConstruct.place('<td></td>', tr);
			var optId = this._getOptionId();
			var input = domConstruct.place('<input type="'+inputType+'\" name="'+this._optionName+'"/>', td1);
			var td2 = domConstruct.place('<td></td>', tr);
			var label = domConstruct.place('<label>'+optionLabel.charAt(index)+'</label>', td2);
			var td3 = domConstruct.place('<td></td>', tr);
			// TODO:添加一个属性，设置行数，而不是直接设置行高。
			var editor = this._createEditor(td3,2,550);
			var td4 = domConstruct.place('<td></td>', tr);
			var aDel = domConstruct.place('<a href="#" class=\"iconbutton\" title=\"删除\"><i class=\"icon-trash\"></i></a>', td4);
			var aDown = domConstruct.place('<a href="#" class=\"iconbutton\" title=\"下移\"><i class=\"icon-arrow-down\"></i></a>', td4);
			var aUp = domConstruct.place('<a href="#" class=\"iconbutton\" title=\"上移\"><i class=\"icon-arrow-up\"></i></a>', td4);
			
			on(aDel, "click", lang.hitch(this, function(e){
				this.optionLength--;
				// 先删除tr中的所有dijit部件
				
				registry.findWidgets(tr).forEach(function(w,index){
					w.destroyRecursive();
				});
				domConstruct.destroy(tr);
				this._refreshOption();
				event.stop(e);
			}));
			
			on(aDown, "click", lang.hitch(this, function(e){
				if(tr.nextSibling){
					domConstruct.place(tr,tr.nextSibling, "after");
				}else{
					domConstruct.place(tr,parentNode,"first");
				}
				
				this._refreshOption();
				event.stop(e);
			}));
			
			on(aUp, "click", lang.hitch(this, function(e){
				if(tr.previousSibling){
					domConstruct.place(tr,tr.previousSibling, "before");
				}else{
					domConstruct.place(tr,parentNode,"last");
				}
				
				this._refreshOption();
				event.stop(e);
			}));
		},
		
		_refreshOption: function(){
			var trs = this.tblOption.childNodes;
			array.forEach(trs, function(tr, index){
				var label = optionLabel.charAt(index);
				var inputEl = tr.cells[0].firstChild;
				var id = "option"+(index+1);
				domAttr.set(inputEl,"id",id);
				inputEl.value = index;
				
				var labelEl = tr.cells[1].firstChild;
				domAttr.set(labelEl,"for",id);
				labelEl.innerHTML = label;
			});
		},
		
		_destroyForm: function(){
			var formPanel = this.domNode;
			registry.findWidgets(formPanel).forEach(function(w,index){
				w.destroyRecursive();
			});
			domConstruct.empty(formPanel);
		}
		
	});
	
});