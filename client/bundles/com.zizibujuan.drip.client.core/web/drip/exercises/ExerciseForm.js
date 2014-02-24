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
        "dojo/string",
        "mathEditor/Editor",
        "drip/classCode",
        "drip/tip",
        "drip/editorHelper",
        "dojox/form/Uploader",
        "drip/widget/form/uploader/FileList",
        "dojo/i18n!./nls/ExerciseForm"], function(
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
        		string,
        		Editor,
        		classCode,
        		tip,
        		editorHelper,
        		Uploader,
        		FileList,
        		ExerciseFormMessages){
	
	var optionLabel = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	
	var courses = [{id: "essayQuestion", label: ExerciseFormMessages.essay_question, type: classCode.exerciseType.ESSAY_QUESTION},
	               {id:"single", label: ExerciseFormMessages.single_option, type: classCode.exerciseType.SINGLE_OPTION},
	               {id:"multiple", label: ExerciseFormMessages.multiple_option, type: classCode.exerciseType.MULTI_OPTION}/*,
	               {id:"fill", label:"填空题"}*/];
	
	return declare("drip.exercises.ExerciseForm", [_WidgetBase], {
		
		
		// data: Object
		//		习题数据
		//			exerciseType:
		//			content:
		//			options:[]
		data:{},
		
		optionLength: 4,
		
		_optionName:"exercise-option",
		
		_editors: [],
		
		_fieldErrors: {},
		
		exerciseType: classCode.exerciseType.ESSAY_QUESTION,
		
		// 缓存
		exerciseTypePane: null,
		
		// 选择题主干，也包括问答题等的主干
		stemPane: null,
		
		optionsPane: null,
		
		imagesPane: null,
		
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
			var leftDiv = this.leftDiv = domConstruct.place('<div style="width: 600px; float: left;"></div>', this.domNode);
			var rightDiv = this.rightDiv = domConstruct.place('<div style="width: 350px; float: right;"></div>', this.domNode);
			
			var exerciseFormDiv = domConstruct.create("div", {
				"class": "exercise_form clearfix"
			}, leftDiv);
			
			/*
			 * exercise_form
			 * 	exercise_wrapper
			 * 		exerciseType
			 * 		stem
			 * 		options
			 * 		images
			 * 	actions
			 */
			var optionsDiv = null;
			var exerciseWrapperDiv = domConstruct.create("div", {}, exerciseFormDiv);
				var exerciseTypeDiv = this.exerciseTypePane = domConstruct.create("div", {"class": "form"}, exerciseWrapperDiv);
				var stemDiv = this.stemPane = domConstruct.create("div", {"class": "form"}, exerciseWrapperDiv);
				if(this._isMultipleChoice(this.exerciseType)){
					optionsDiv = this.optionsPane = domConstruct.create("div", {"class": "form"}, exerciseWrapperDiv);
				}
				var imagesDiv = this.imagesPane = domConstruct.create("div", {"class": "form"}, exerciseWrapperDiv);
			var actionsDiv = domConstruct.create("div", {}, exerciseFormDiv);
			
			
			this._refreshForm(this.exerciseType);
			
			
			// 创建保存按钮
			var actionContainer = domConstruct.create("div",{"class":"drip_form_actions"},this.leftDiv);
			var btnReset = this.btnReset = domConstruct.place("<button class='button'>" + ExerciseFormMessages.action_reset + "</button>", actionContainer);
			var btnSaveDraft = this.btnSaveDraft = domConstruct.place("<button class='button'>" + ExerciseFormMessages.action_save_exercise_draft + "</button>", actionContainer);
			var btnPublish = this.btnPublish = domConstruct.place("<button class=\"button primary\">" + ExerciseFormMessages.action_publish + "</button>", actionContainer);
			domConstruct.place('<div class="drip_form_tip">' + ExerciseFormMessages.tip_publish + '</div>', this.leftDiv);
			
			on(btnReset, "click", lang.hitch(this, this.doReset));
			on(btnSaveDraft, "click", lang.hitch(this, this.doSaveDraft));
			on(btnPublish, "click", lang.hitch(this, this.doPublish));
		},
		
		_isMultipleChoice: function(type){
			// summary:
			//		判断是否选择题
			
			return type && 
				(type == classCode.exerciseType.SINGLE_OPTION || 
				type == classCode.exerciseType.MULTI_OPTION);
		},
		
		_refreshForm: function(exerciseType){
			// summary:
			//		根据不同的题型显示不同的输入框
			
			// 部件只创建一次，但是部件的值可以随意刷新
			if(!this._exerciseTypePaneCreated){
				this._createExerciseTypeOptions(this.exerciseTypePane, exerciseType);
				this._exerciseTypePaneCreated = true;
			}
			
			if(!this._stemPaneCreated){
				this._createStemInput(this.stemPane);
				this._stemPaneCreated = true;
			}
			
			// 如果选项没有创建
			if(this._isMultipleChoice(exerciseType)){
				
				// 如果是选择题切换到问答题，则只隐藏选项，已被用户想恢复到选择题
				// 所以在获取数据时，不要获取已经隐藏的数据
				if(this.optionsPane && domStyle.get(this.optionsPane, "display") == "none"){
					domStyle.set(this.optionsPane, "display", "block")
				}

				
				var optionType = null;
				if(exerciseType === classCode.exerciseType.SINGLE_OPTION){
					optionType = "radio";
				}else if(exerciseType === classCode.exerciseType.MULTI_OPTION){
					optionType = "checkbox";
				}
				this.optionType = optionType;
				// 如果没有创建
				if(!this._optionsPaneCreated){
					// 创建
					if(!this.optionsPane){
						this.optionsPane = domConstruct.create("div", {"class": "form"}, this.stemPane, "after");
					}
					this._createOptionPane(this.optionsPane, optionType);
					
					this._optionsPaneCreated = true;
				}else{
					// 如果已经创建， 则确认类型有没有发生变化
					
					if(optionType){
						if(exerciseType != this._exerciseType){
							// 如果不相同，则转换为参数指定的类型
							query("input", this.optionsPane).forEach(function(el,index){
								el.type = optionType;
							});
						}
					}
					
				}
			}else{
				// 一律隐藏
				if(this.optionsPane){
					domStyle.set(this.optionsPane, "display", "none");
				}
			}

			if(!this._imagePaneCreated){
				this._createImageInput(this.imagesPane);
				this._imagePaneCreated = true;
			}
			
			this._exerciseType = exerciseType;
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
		_createExerciseTypeOptions: function(parentNode, exerciseType /*默认值*/){
			// summary:
			//		创建题型选择项。

			this._createLabel(parentNode, ExerciseFormMessages.label_exerciseType);
			
			var div = domConstruct.create("div", {"class": "clearfix"}, parentNode);
			var name = this._exerciseTypeOptionName = "exerciseType";
			var ul = domConstruct.create("ul", {
				"class": "radio-group"
			}, div);
			for(var i = 0; i < courses.length; i++){
				var course = courses[i];
				var checked = (course.type == exerciseType);
				var li = domConstruct.create("li", null, ul);
				var input = domConstruct.create("input", {
					type: "radio", 
					name: name, 
					id: course.type, 
					checked: checked
				}, li);
				var label = domConstruct.create("label", {
					"for": course.type, 
					innerHTML: course.label
				}, li);
				on(input,"click", lang.hitch(this,function(e){
					var target = e.target;
					if(target.id != this.data.exerType){
						// 只有选中的节点发生变化的时候才触发，即如果该节点之前没有选中
						this._refreshForm(target.id);
						this.clearErrors();
					}else{
						// 如果之前已经选中，则什么也不做。
					}
					
				}));
			}
		},
		
		_createStemInput: function(parentNode, value){
			// summary:
			//		创建习题内容输入框。
			//		只创建一次。
			
			this._createLabel(parentNode, ExerciseFormMessages.label_content, ExerciseFormMessages.required);
			this.exerContentEditor = this._createMathInput(parentNode, 10, value);
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
		_createImageInput: function(parentNode, value){
			// summary:
			//		创建图片上传输入框与图片编辑器。
			
			// 不需要label
			//this._createLabel(parentNode, ExerciseFormMessages.label_content, ExerciseFormMessages.required);
			
			var title = domConstruct.place('<div class="drip-title" style="margin-bottom: 5px;"></div>', parentNode);
			
			var u = new dojox.form.Uploader({
			    label: ExerciseFormMessages.label_image,
			    multiple: true,
			    type:"file",
			    uploadOnSelect: true,
			    url: "/uploads/exerciseImage"
			});
			u.placeAt(title);
			u.startup();
			
			var list = this.image = new drip.widget.form.uploader.FileList({uploader:u});
			list.placeAt(title);
			//list.startup();
		},
		
		// TODO: 重构，在ExerciseEditor中重复存在
		_createOptionPane: function(parentNode, type){
			// summary:
			//		创建习题选项面板
			// type: String
			//		复选框类型，radio或checkbox
			
			// 在最外围添加一个div容器
			
			this._createLabel(parentNode, ExerciseFormMessages.label_option);
			
			var container = domConstruct.place('<div></div>', parentNode);
			// 创建选项
			var table = this.tblOption = domConstruct.place('<table class="drip-exercise-option"></table>', container);
			var defaultOptionLength = this.optionLength;
			for(var i = 0; i < defaultOptionLength; i++){
				this._createOption(table, i, type);
			}
			this._refreshOption();
			
			// 创建新建行按钮
			var addContainer = domConstruct.place('<div></div>', container);
			// TODO：添加选项时，让这个按钮不要移动。
			var aAdd = domConstruct.place('<a href="#"><i class=\"icon-plus\"></i> ' + ExerciseFormMessages.label_add_option + '</a>', addContainer);
			on(aAdd, "click", lang.hitch(this, function(e){
				this._createOption(table, this.optionLength++, this.optionType);
				event.stop(e);
			}));
		},
		
		_getOptionId: function(){
			
			if(!this.optionId){
				this.optionId = 0;
			}
			return this.optionId++;
		},
		
		_createOption: function(parentNode, index, inputType){
			var tr = domConstruct.place('<tr></tr>', parentNode);
			var td1 = domConstruct.place('<td></td>', tr);
			var optId = this._getOptionId();
			var input = domConstruct.place('<input disabled type="'+inputType+'\" name="'+this._optionName+'"/>', td1);
			var td2 = domConstruct.place('<td></td>', tr);
			var label = domConstruct.place('<label>'+optionLabel.charAt(index)+'</label>', td2);
			var td3 = domConstruct.place('<td></td>', tr);
			var editor = this._createEditor(td3, 2, 490);
			var td4 = domConstruct.place('<td></td>', tr);
			var aDel = domConstruct.place('<a href="#" class=\"iconbutton\" title=\"' + ExerciseFormMessages.label_delete_option + '\"><i class=\"icon-trash\"></i></a>', td4);
			var aDown = domConstruct.place('<a href="#" class=\"iconbutton\" title=\"' + ExerciseFormMessages.label_move_down_option + '\"><i class=\"icon-arrow-down\"></i></a>', td4);
			var aUp = domConstruct.place('<a href="#" class=\"iconbutton\" title=\"' + ExerciseFormMessages.label_move_up_option + '\"><i class=\"icon-arrow-up\"></i></a>', td4);
			
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
				//domAttr.set(labelEl,"for",id);
				labelEl.innerHTML = label;
			});
		},
		// TODO: 删除
		// FIXME: 这段代码在ExerciseEditor重复存在，待重构。
//		_showOptionPane: function(optionType){
//			// summary: 显示/创建/隐藏选项面板
//			//		如果optionType不为null
//			if(this.optionPane){
//				// 如果已经创建
//				if(optionType == null){
//					// 如果optionType为null，则隐藏选项面板
//					if(this.optionPane.style.display == ""){
//						this.optionPane.style.display = "none";
//					}
//				}else{
//					if(this.optionPane.style.display == "none"){
//						this.optionPane.style.display = "";
//					}
//					// 获取当前选项面板的选项类型
//					if(optionType == this._optionType){
//						// 如果当前的选项类型与参数相同则不做处理
//					}else{
//						// 如果不相同，则转换为参数指定的类型
//						query("input", this.optionPane).forEach(function(el,index){
//							el.type = optionType;
//						});
//					}
//				}
//			}else{
//				if(optionType != null){
//					this._createOptionPane(optionType);
//				}
//			}
//			this._optionType = optionType;// 缓存选项类型
//		},
		
		_createLabel: function(parentNode, label, requireTip){
			var _requireTip = requireTip ? "<span>(" + requireTip + ")</span>" : "";
			domConstruct.place('<div><span class="drip-title">'+label+'</span>'+_requireTip+'</div>', parentNode);
		},
		
		// TODO: 删除
		_createMathInput: function(parentNode, rowCount, value){
			// summary:
			//		创建支持输入数学公式的输入框
			// rowCount:
			//		默认的行数，如果包含内容的高度超过这个行数，则以内容的高度为准。
			
			return this._createEditor(parentNode, rowCount, 550, value);
		},
		
		_createEditor: function(parentNode, rowCount, width, value){
			// rowCount支持auto，即适配内容的高度
			
			var editor = editorHelper.createEditor(parentNode, rowCount, width, value);
			this._editors.push(editor);
			return editor;
		},
		
		// TODO: 删除
//		_createForm: function(exerciseType){
//			// summary:
//			//		创建习题输入界面
//			// exerciseType: String
//			//		题型
//			
//			debugger;
//			this._exerciseType = exerciseType;
//			// 创建题型
//			this._createExerciseTypeOptions(exerciseType);
//			
//			// 随着题型而变化的form对象为答案可选项，分为单选和多选。
//			// 而内容、图片和习题解析是每个题型都有的。
//			
//			// 题型默认选中问答题
//			//this._createSingleSelectForm();
//			//this._createEssayQuestionForm();
//			
//			// 在右侧创建图片上传功能
//			
//			// 创建习题内容输入框
//			this._createContentInput();
//			
//			// 根据题型决定是否显示可选项
//			var optionType = null;
//			if(exerciseType === classCode.exerciseType.SINGLE_OPTION){
//				optionType = "radio";
//			}else if(exerciseType === classCode.exerciseType.MULTI_OPTION){
//				optionType = "checkbox";
//			}
//			this._showOptionPane(optionType);
//			
//			// TODO: 通过用户自定义的科目label来添加科目
//			
//			this._createImageInput();
//			
//			this._createMathEditorHelper();
//		},
		
		
		/*
		<ul class="radio-group">
			<li><input type="radio" name="course" id="higherMath"/><label for="higherMath">高等数学</label></li>
			<li><input type="radio" name="course" id="linearAlgebra"/><label for="linearAlgebra">线性代数</label></li>
			<li><input type="radio" name="course" id="probability"/><label for="probability">概率论与数理统计</label></li>
		</ul>
		 */
//		_createCourseOptions: function(){
//			// summary:
//			//		创建课程选项
//			//		只创建一次，为的是保留之前的输入内容
//			if(this.coursePane)return;
//			var row = domConstruct.create("div", {"class":"form clearfix"}, this.leftDiv);
//			
//			domConstruct.place('<div class="drip-title">科目</div>', row);
//			var name = this._courseOptionName = "course";
//			var cources = [{id:"01", label:"高等数学"},
//			               {id:"02", label:"线性代数"},
//			               {id:"03", label:"概率论与数理统计"}];
//			var ul = domConstruct.place("<ul class=\"radio-group\"></ul>", row);
//			for(var i = 0; i < cources.length; i++){
//				var cource = cources[i];
//				var li = domConstruct.create("li", null, ul);
//				var input = domConstruct.create("input", {type:"radio", name:name, id: "course_"+cource.id}, li);
//				var label = domConstruct.create("label", {"for":"course_"+cource.id, innerHTML: cource.label}, li);
//			}
//			this.coursePane = row;
//		},
		
		
		
		
		_createMathEditorHelper: function(){
			if(this._editorHelper)return;
			domConstruct.create("iframe", {
				"class": "helper", 
				"style": "border:none; height:700px; width:100%",
				"src": "/drip/exercises/mathEditorHelp.html"
			}, this.rightDiv);
			
			this._editorHelper = true;
		},
		
		_getFormData: function(){
			var data = this.data;
			data.exerciseType = this._exerciseType;
			data.imageName = this.image.fileId;
			data.content = this.exerContentEditor.get("value");

//			query("[name=" + this._courseOptionName + "]:checked", this.coursePane).forEach(function(inputEl, index){
//				data.exercise.course = inputEl.id.split("_")[1];
//				return;
//			});
			
			if(this.optionsPane && domStyle.get(this.optionsPane, "display") == "block"){
				data.options = [];
				registry.findWidgets(this.optionsPane).forEach(function(widget, index){
					console.log(widget, index, widget.get("value"));
					// 只有当有内容时，才加入进来
					var val = widget.get("value");
					if(string.trim(val) != ""){
						// 如果在内容两边保留了空格，则不要删除
						data.options.push({content: val});
					}
				});
			}
			
			return data;
		},
		
		doReset: function(e){
			// summary:
			//		清除用户录入的数据。
			//		并将习题类型恢复为问答题。
			
			// 使用习题类型作为id
			domAttr.set(this.exerciseType, "checked", true);
			this._refreshForm(this.exerciseType);
			
			// 清除所有数据
			this._reset();
		},
		
		doSaveDraft: function(e){
			// 保存之前要先校验
			var data = this._getFormData();
			data.status = classCode.exerciseStatus.DRAFT;
			
			this._doSave(data, e);
		},
		
		doPublish: function(e){
			var data = this._getFormData();
			data.status = classCode.exerciseStatus.PUBLISH;
			
			this._doSave(data, e);
		},
		
		_doSave: function(data, e){
			console.log("将要保存的习题数据为：",data);
			
			var button = e.target;
			// 每次校验之前，先清除上一次的错误信息
			this.clearErrors();
			this.validate(data);
			if(this.hasError()){
				// 在每个label后面显示提示信息
				this.showErrors();
				return;
			}
			// icon-refresh icon-spin icon-large
			// 失效保存按钮，防止重复提交
			domAttr.set(button,"disabled", true);
			
			xhr.post("/exercises/",{
				handleAs: "json", 
				data: JSON.stringify(data)
			}).then(lang.hitch(this,function(response){
				// 保存成功，在界面上清除用户输入数据，使处于新增状态。在页面给出保存成功的提示，在按钮旁边显示。
				tip.ok(ExerciseFormMessages.tip_save_success, button.parentNode, "first");
				this._reset();
				domAttr.set(button,"disabled", false);
			}),lang.hitch(this, function(error){
				// 保存失败，不清除用户输入数据，并给出详尽的错误提示
				domAttr.set(button,"disabled", false);
				this.data = {};
				
				// 显示服务器端校验信息
				if(error.response.data){
					var errorJson = JSON.parse(error.response.data);
					this._fieldErrors  = errorJson;
					if(this.hasError()){
						this.showErrors();
					}
				}
			}));
		},
		
		validate: function(data){
			var exercise = data;
			var exerciseType = exercise.exerciseType;
			var content = exercise.content;
			var options = exercise.options || [];
			debugger;
			if(this._isMultipleChoice(exerciseType)){
				if(string.trim(content) == ""){
					this._fieldErrors["content"] = [ExerciseFormMessages.tip_content_required];
				}
				if(options.length < 2){
					this._fieldErrors["exerOption"] = [ExerciseFormMessages.tip_options_required];
				}
			}else if(exerciseType == classCode.exerciseType.ESSAY_QUESTION){
				if(string.trim(content) == ""){
					this._fieldErrors["content"] = [ExerciseFormMessages.tip_content_required];
				}
			}else{
				console.error("没有校验该类型习题的数据");
			}
		},
		
		hasError: function(){
			var errors = this._fieldErrors;
			for (var name in errors ) {
				return true;
			}
			return false;
		},
		
		showErrors: function(){
			var errors = this._fieldErrors;
			var contentErrors = errors["content"];
			if(contentErrors){
				var target = this.exerContentEditor.domNode.previousSibling;
				domConstruct.create("span", {"class": "drip-error", innerHTML: contentErrors[0]}, target);
			}
			var exerOptionErrors = errors["exerOption"];
			if(exerOptionErrors){
				var target = this.tblOption.parentNode.previousSibling;
				domConstruct.create("span", {"class": "drip-error", innerHTML: exerOptionErrors[0]}, target);
			}
		},
		
		// TODO: 测试
		clearErrors: function(){
			var errors = this._fieldErrors;
			if(errors.content){
				domConstruct.destroy(this.exerContentEditor.domNode.previousSibling.lastChild);
			}
			if(errors.exerOption){
				domConstruct.destroy(this.tblOption.parentNode.previousSibling.lastChild);
			}
			this._fieldErrors = {};
		},
		
		_reset: function(){
			this.data = {};
			this.clearErrors();
			this.exerContentEditor.set("value", "");
			query("[name="+this._optionName+"]:checked", this.tblOption).forEach(function(inputEl, index){
				domAttr.set(inputEl,"checked", false);
			});
			
//			query("[name="+this._courseOptionName+"]:checked", this.coursePane).forEach(function(inputEl, index){
//				domAttr.set(inputEl,"checked", false);
//			});
			
			if(this.tblOption){
				registry.findWidgets(this.tblOption).forEach(function(widget, index){
					widget.set("value","");
				});
			}
			
			this.image.reset();
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
		

		
		_destroyForm: function(){
			var formPanel = this.domNode;
			registry.findWidgets(formPanel).forEach(function(w,index){
				w.destroyRecursive();
			});
			domConstruct.empty(formPanel);
		},
		
		startup: function(){
			this.inherited(arguments);
			var editors = this._editors;
			for(var i = 0; i < editors.length; i++){
				var editor = editors[i];
				editor.startup();
			}
		}
		
	});
	
});