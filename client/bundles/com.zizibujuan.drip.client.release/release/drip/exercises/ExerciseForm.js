//>>built
define("drip/exercises/ExerciseForm",["dojo/_base/declare","dojo/_base/lang","dojo/_base/array","dojo/_base/event","dojo/request/xhr","dijit/_WidgetBase","dijit/registry","dojo/dom","dojo/dom-attr","dojo/dom-style","dojo/dom-class","dojo/dom-construct","dojo/on","dojo/query","dojo/json","mathEditor/Editor","drip/classCode","dojox/form/Uploader","drip/widget/form/uploader/FileList"],function(declare,lang,array,event,xhr,_WidgetBase,registry,dom,domAttr,domStyle,domClass,domConstruct,on,query,JSON,Editor,classCode,Uploader,FileList){var optionLabel="ABCDEFGHIJKLMNOPQRSTUVWXYZ";return declare("drip.exercises.ExerciseForm",[_WidgetBase],{data:{},optionLength:4,_optionName:"exercise-option",postCreate:function(){this.inherited(arguments);debugger;this._createExerciseTypeBar(),this._createSingleSelectForm();var actionContainer=domConstruct.create("div",{"class":"drip_form_actions"},this.domNode),btnNewExercise=this.btnNewExercise=domConstruct.create("input",{type:"button",value:"保存"},actionContainer);on(btnNewExercise,"click",lang.hitch(this,this.doSave))},doSave:function(e){domAttr.set(this.btnNewExercise,"disabled",!0);var data=this.data;data.content=this.editorExerContent.get("value"),data.options=[],registry.findWidgets(this.tblOption).forEach(function(widget,index){0,data.options.push(widget.get("value"))});var answer={},answerDetail=[];query("[name="+this._optionName+"]:checked",this.tblOption).forEach(function(inputEl,index){0,answerDetail.push({seq:inputEl.value})}),answerDetail.length>0&&(answer.detail=answerDetail);var guide=this.editorGuide.get("value");guide!=null&&guide.length>0&&(answer.guide=guide);if(answer.detail||answer.guide)data.answer=answer;0,xhr("/exercises/",{method:"POST",data:JSON.stringify(data)}).then(lang.hitch(this,function(response){this._reset(),domAttr.set(this.btnNewExercise,"disabled",!1)}),lang.hitch(this,function(error){domAttr.set(this.btnNewExercise,"disabled",!1)}))},_reset:function(){this.data={},this.editorExerContent.set("value",""),this.editorGuide.set("value",""),query("[name="+this._optionName+"]:checked",this.tblOption).forEach(function(inputEl,index){domAttr.set(inputEl,"checked",!1)}),registry.findWidgets(this.tblOption).forEach(function(widget,index){widget.set("value","")})},empty:function(){},_createExerciseTypeBar:function(){var singleEl=dom.byId("single");this._toggleSelection(singleEl),on(singleEl,"click",lang.hitch(this,this._showSingleSelectForm)),on(dom.byId("multiple"),"click",lang.hitch(this,this._showMultipleSelectForm)),on(dom.byId("fill"),"click",lang.hitch(this,this._showFillForm)),on(dom.byId("essayQuestion"),"click",lang.hitch(this,this._showEssayQuestionForm))},_toggleSelection:function(target){this._selectedExerTypeElement&&domClass.remove(this._selectedExerTypeElement,"selected"),this._selectedExerTypeElement=target,domClass.add(this._selectedExerTypeElement,"selected")},_showSingleSelectForm:function(e){if(e.target==this._selectedExerTypeElement)return;this._toggleSelection(e.target),this._createSingleSelectForm()},_showMultipleSelectForm:function(e){if(e.target==this._selectedExerTypeElement)return;this._toggleSelection(e.target),this._createMultipleSelectForm()},_showFillForm:function(e){if(e.target==this._selectedExerTypeElement)return;this._toggleSelection(e.target)},_showEssayQuestionForm:function(e){if(e.target==this._selectedExerTypeElement)return;this._toggleSelection(e.target),this._createEssayQuestionForm()},_createSingleSelectForm:function(){this.data.exerType=classCode.ExerciseType.SINGLE_OPTION,this.optionPane?(this.optionPane.style.display=="none"&&(this.optionPane.style.display=""),this.optionPane.style.display==""&&query("input",this.optionPane).forEach(function(el,index){el.type="radio"})):this._createSelectForm("radio")},_createMultipleSelectForm:function(){this.data.exerType=classCode.ExerciseType.MULTI_OPTION,this.optionPane?(this.optionPane.style.display=="none"&&(this.optionPane.style.display=""),this.optionPane.style.display==""&&query("input",this.optionPane).forEach(function(el,index){el.type="checkbox"})):this._createSelectForm("checkbox")},_createSelectForm:function(type){this._createContentInput(),this._createImageInput(),this._createOptionPane(type),this._createGuideInput()},_createEssayQuestionForm:function(){this.data.exerType=classCode.ExerciseType.ESSAY_QUESTION,this.optionPane&&this.optionPane.style.display==""&&(this.optionPane.style.display="none")},_createContentInput:function(){var contentPane=domConstruct.create("div",null,this.domNode);domConstruct.place('<div class="drip-title">内容</div>',contentPane),this.editorExerContent=this._createEditor(contentPane,150)},_createEditor:function(parentNode,height,width){var parms={};parms.style="height:"+height+"px; width:"+width+"px";var editor=new Editor(parms);return editor.placeAt(parentNode),editor},_createImageInput:function(){var imagePane=domConstruct.create("div",null,this.domNode),title=domConstruct.place('<div class="drip-title" style="margin-bottom: 5px;"></div>',imagePane),u=new dojox.form.Uploader({label:"附图",multiple:!0,type:"file",uploadOnSelect:!0,url:"/uploads/exerciseImage"});u.placeAt(title),u.startup();var list=new widget.form.uploader.FileList({uploader:u});list.placeAt(title)},_createOptionPane:function(type){var optionPane=this.optionPane=domConstruct.create("div",null,this.domNode);domConstruct.place('<div class="drip-title">选项和答案</div>',optionPane);var container=domConstruct.place("<div></div>",optionPane),table=this.tblOption=domConstruct.place('<table class="drip-exercise-option"></table',container),defaultOptionLength=this.optionLength;for(var i=0;i<defaultOptionLength;i++)this._createOption(table,i,type);this._refreshOption();var addContainer=domConstruct.place("<div></div>",container),aAdd=domConstruct.place('<a href="#"><img src="/resources/images/add_20.png"/></a>',addContainer);on(aAdd,"click",lang.hitch(this,function(e){this._createOption(table,this.optionLength++,type),event.stop(e)}))},_getOptionId:function(){return this.optionId||(this.optionId=0),this.optionId++},_createOption:function(parentNode,index,inputType){var tr=domConstruct.place("<tr></tr>",parentNode),td1=domConstruct.place("<td></td>",tr),optId=this._getOptionId(),input=domConstruct.place('<input type="'+inputType+'" name="'+this._optionName+'"/>',td1),td2=domConstruct.place("<td></td>",tr),label=domConstruct.place("<label>"+optionLabel.charAt(index)+"</label>",td2),td3=domConstruct.place("<td></td>",tr),editor=this._createEditor(td3,25,550),td4=domConstruct.place("<td></td>",tr),aDel=domConstruct.place('<a href="#"><img alt="删除" src="/resources/images/delete.png"></a>',td4),aDown=domConstruct.place('<a href="#"><img alt="下移" src="/resources/images/arrow_down.gif"></a>',td4),aUp=domConstruct.place('<a href="#"><img alt="上移" src="/resources/images/arrow_up.gif"></a>',td4);on(aDel,"click",lang.hitch(this,function(e){this.optionLength--,registry.findWidgets(tr).forEach(function(w,index){w.destroyRecursive()}),domConstruct.destroy(tr),this._refreshOption(),event.stop(e)})),on(aDown,"click",lang.hitch(this,function(e){tr.nextSibling?domConstruct.place(tr,tr.nextSibling,"after"):domConstruct.place(tr,parentNode,"first"),this._refreshOption(),event.stop(e)})),on(aUp,"click",lang.hitch(this,function(e){tr.previousSibling?domConstruct.place(tr,tr.previousSibling,"before"):domConstruct.place(tr,parentNode,"last"),this._refreshOption(),event.stop(e)}))},_refreshOption:function(){var trs=this.tblOption.childNodes;array.forEach(trs,function(tr,index){var label=optionLabel.charAt(index),inputEl=tr.cells[0].firstChild,id="option"+(index+1);domAttr.set(inputEl,"id",id),inputEl.value=index;var labelEl=tr.cells[1].firstChild;domAttr.set(labelEl,"for",id),labelEl.innerHTML=label})},_createGuideInput:function(){var guidePane=domConstruct.create("div",null,this.domNode);domConstruct.place('<div class="drip-title">习题解析</div>',guidePane),this.editorGuide=this._createEditor(guidePane,100)},_destroyForm:function(){var formPanel=this.domNode;registry.findWidgets(formPanel).forEach(function(w,index){w.destroyRecursive()}),domConstruct.empty(formPanel)}})})