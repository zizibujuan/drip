//>>built
define("drip/exercises/ExerciseForm","dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/event dojo/request/xhr dijit/_WidgetBase dijit/registry dojo/dom dojo/dom-attr dojo/dom-style dojo/dom-class dojo/dom-construct dojo/on dojo/query dojo/json mathEditor/Editor drip/classCode dojox/form/Uploader drip/widget/form/uploader/FileList".split(" "),function(s,f,t,l,u,v,m,n,k,y,r,c,g,p,w,x,q,z,A){return s("drip.exercises.ExerciseForm",[v],{data:{},optionLength:4,_optionName:"exercise-option",
_imagePath:"/drip/resources/images/",postCreate:function(){this.inherited(arguments);this._createExerciseTypeBar();this._createSingleSelectForm();var a=c.create("div",{"class":"drip_form_actions"},this.domNode),a=this.btnNewExercise=c.create("input",{type:"button",value:"\u4fdd\u5b58"},a);g(a,"click",f.hitch(this,this.doSave))},doSave:function(a){k.set(this.btnNewExercise,"disabled",!0);var b=this.data;b.content=this.editorExerContent.get("value");b.options=[];m.findWidgets(this.tblOption).forEach(function(a,
c){b.options.push(a.get("value"))});a={};var c=[];p("[name\x3d"+this._optionName+"]:checked",this.tblOption).forEach(function(a,b){c.push({seq:a.value})});0<c.length&&(a.detail=c);var d=this.editorGuide.get("value");null!=d&&0<d.length&&(a.guide=d);if(a.detail||a.guide)b.answer=a;u("/exercises/",{method:"POST",data:w.stringify(b)}).then(f.hitch(this,function(a){this._reset();k.set(this.btnNewExercise,"disabled",!1)}),f.hitch(this,function(a){k.set(this.btnNewExercise,"disabled",!1)}))},_reset:function(){this.data=
{};this.editorExerContent.set("value","");this.editorGuide.set("value","");p("[name\x3d"+this._optionName+"]:checked",this.tblOption).forEach(function(a,b){k.set(a,"checked",!1)});m.findWidgets(this.tblOption).forEach(function(a,b){a.set("value","")})},empty:function(){},_createExerciseTypeBar:function(){var a=n.byId("single");this._toggleSelection(a);g(a,"click",f.hitch(this,this._showSingleSelectForm));g(n.byId("multiple"),"click",f.hitch(this,this._showMultipleSelectForm));g(n.byId("fill"),"click",
f.hitch(this,this._showFillForm));g(n.byId("essayQuestion"),"click",f.hitch(this,this._showEssayQuestionForm))},_toggleSelection:function(a){this._selectedExerTypeElement&&r.remove(this._selectedExerTypeElement,"selected");this._selectedExerTypeElement=a;r.add(this._selectedExerTypeElement,"selected")},_showSingleSelectForm:function(a){a.target!=this._selectedExerTypeElement&&(this._toggleSelection(a.target),this._createSingleSelectForm())},_showMultipleSelectForm:function(a){a.target!=this._selectedExerTypeElement&&
(this._toggleSelection(a.target),this._createMultipleSelectForm())},_showFillForm:function(a){a.target!=this._selectedExerTypeElement&&this._toggleSelection(a.target)},_showEssayQuestionForm:function(a){a.target!=this._selectedExerTypeElement&&(this._toggleSelection(a.target),this._createEssayQuestionForm())},_createSingleSelectForm:function(){this.data.exerType=q.ExerciseType.SINGLE_OPTION;this.optionPane?("none"==this.optionPane.style.display&&(this.optionPane.style.display=""),""==this.optionPane.style.display&&
p("input",this.optionPane).forEach(function(a,b){a.type="radio"})):this._createSelectForm("radio")},_createMultipleSelectForm:function(){this.data.exerType=q.ExerciseType.MULTI_OPTION;this.optionPane?("none"==this.optionPane.style.display&&(this.optionPane.style.display=""),""==this.optionPane.style.display&&p("input",this.optionPane).forEach(function(a,b){a.type="checkbox"})):this._createSelectForm("checkbox")},_createSelectForm:function(a){this._createContentInput();this._createImageInput();this._createOptionPane(a);
this._createGuideInput()},_createEssayQuestionForm:function(){this.data.exerType=q.ExerciseType.ESSAY_QUESTION;this.optionPane&&""==this.optionPane.style.display&&(this.optionPane.style.display="none")},_createContentInput:function(){var a=c.create("div",null,this.domNode);c.place('\x3cdiv class\x3d"drip-title"\x3e\u5185\u5bb9\x3c/div\x3e',a);this.editorExerContent=this._createEditor(a,150)},_createEditor:function(a,b,c){var d={};d.style="height:"+b+"px; width:"+c+"px";b=new x(d);b.placeAt(a);return b},
_createImageInput:function(){var a=c.create("div",null,this.domNode),a=c.place('\x3cdiv class\x3d"drip-title" style\x3d"margin-bottom: 5px;"\x3e\x3c/div\x3e',a),b=new dojox.form.Uploader({label:"\u9644\u56fe",multiple:!0,type:"file",uploadOnSelect:!0,url:"/uploads/exerciseImage"});b.placeAt(a);b.startup();(new drip.widget.form.uploader.FileList({uploader:b})).placeAt(a)},_createOptionPane:function(a){var b=this.optionPane=c.create("div",null,this.domNode);c.place('\x3cdiv class\x3d"drip-title"\x3e\u9009\u9879\u548c\u7b54\u6848\x3c/div\x3e',
b);for(var b=c.place("\x3cdiv\x3e\x3c/div\x3e",b),h=this.tblOption=c.place('\x3ctable class\x3d"drip-exercise-option"\x3e\x3c/table',b),d=this.optionLength,e=0;e<d;e++)this._createOption(h,e,a);this._refreshOption();b=c.place("\x3cdiv\x3e\x3c/div\x3e",b);b=c.place('\x3ca href\x3d"#"\x3e\x3cimg src\x3d"'+this._imagePath+'add_20.png"/\x3e\x3c/a\x3e',b);g(b,"click",f.hitch(this,function(b){this._createOption(h,this.optionLength++,a);l.stop(b)}))},_getOptionId:function(){this.optionId||(this.optionId=
0);return this.optionId++},_createOption:function(a,b,h){var d=c.place("\x3ctr\x3e\x3c/tr\x3e",a),e=c.place("\x3ctd\x3e\x3c/td\x3e",d);this._getOptionId();c.place('\x3cinput type\x3d"'+h+'" name\x3d"'+this._optionName+'"/\x3e',e);h=c.place("\x3ctd\x3e\x3c/td\x3e",d);c.place("\x3clabel\x3e"+"ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(b)+"\x3c/label\x3e",h);b=c.place("\x3ctd\x3e\x3c/td\x3e",d);this._createEditor(b,25,550);e=c.place("\x3ctd\x3e\x3c/td\x3e",d);b=c.place('\x3ca href\x3d"#"\x3e\x3cimg alt\x3d"\u5220\u9664" src\x3d"'+
this._imagePath+'delete.png"\x3e\x3c/a\x3e',e);h=c.place('\x3ca href\x3d"#"\x3e\x3cimg alt\x3d"\u4e0b\u79fb" src\x3d"'+this._imagePath+'arrow_down.gif"\x3e\x3c/a\x3e',e);e=c.place('\x3ca href\x3d"#"\x3e\x3cimg alt\x3d"\u4e0a\u79fb" src\x3d"'+this._imagePath+'arrow_up.gif"\x3e\x3c/a\x3e',e);g(b,"click",f.hitch(this,function(a){this.optionLength--;m.findWidgets(d).forEach(function(a,b){a.destroyRecursive()});c.destroy(d);this._refreshOption();l.stop(a)}));g(h,"click",f.hitch(this,function(b){d.nextSibling?
c.place(d,d.nextSibling,"after"):c.place(d,a,"first");this._refreshOption();l.stop(b)}));g(e,"click",f.hitch(this,function(b){d.previousSibling?c.place(d,d.previousSibling,"before"):c.place(d,a,"last");this._refreshOption();l.stop(b)}))},_refreshOption:function(){t.forEach(this.tblOption.childNodes,function(a,b){var c="ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(b),d=a.cells[0].firstChild,e="option"+(b+1);k.set(d,"id",e);d.value=b;d=a.cells[1].firstChild;k.set(d,"for",e);d.innerHTML=c})},_createGuideInput:function(){var a=
c.create("div",null,this.domNode);c.place('\x3cdiv class\x3d"drip-title"\x3e\u4e60\u9898\u89e3\u6790\x3c/div\x3e',a);this.editorGuide=this._createEditor(a,100)},_destroyForm:function(){var a=this.domNode;m.findWidgets(a).forEach(function(a,c){a.destroyRecursive()});c.empty(a)}})});
//@ sourceMappingURL=ExerciseForm.js.map