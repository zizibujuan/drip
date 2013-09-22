//>>built
define("drip/exercises/ExerciseForm","dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/event dojo/request/xhr dijit/_WidgetBase dijit/registry dojo/dom dojo/dom-attr dojo/dom-style dojo/dom-class dojo/dom-construct dojo/on dojo/query dojo/json mathEditor/Editor drip/classCode dojox/form/Uploader drip/widget/form/uploader/FileList".split(" "),function(s,g,t,n,u,v,p,y,h,z,A,c,k,q,w,x,l,B,C){var r=[{id:"essayQuestion",label:"\u95ee\u7b54\u9898",type:l.ExerciseType.ESSAY_QUESTION},{id:"single",
label:"\u5355\u9879\u9009\u62e9\u9898",type:l.ExerciseType.SINGLE_OPTION},{id:"multiple",label:"\u591a\u9879\u9009\u62e9\u9898",type:l.ExerciseType.MULTI_OPTION}];return s("drip.exercises.ExerciseForm",[v],{data:{},optionLength:4,_optionName:"exercise-option",_editors:[],postCreate:function(){this.inherited(arguments);this.leftDiv=c.place('\x3cdiv style\x3d"width: 600px; float: left;"\x3e\x3c/div\x3e',this.domNode);this.rightDiv=c.place('\x3cdiv style\x3d"width: 350px; float: right;"\x3e\x3c/div\x3e',
this.domNode);this._createForm(l.ExerciseType.ESSAY_QUESTION);var b=c.create("div",{"class":"drip_form_actions"},this.leftDiv),b=this.btnSave=c.place('\x3cbutton class\x3d"minibutton primary"\x3e\x3ci class\x3d"icon-save icon-large"\x3e\x3c/i\x3e \u4fdd\u5b58\x3c/button\x3e',b);k(b,"click",g.hitch(this,this.doSave))},_createForm:function(b){this.data.exerType=b;this._createQuestionTypeOptions(b);this._createContentInput();var a=null;b===l.ExerciseType.SINGLE_OPTION?a="radio":b===l.ExerciseType.MULTI_OPTION&&
(a="checkbox");this._showOptionPane(a);this._createGuideInput();this._createCourseOptions();this._createImageInput();this._createMathEditorHelper()},_createQuestionTypeOptions:function(b){if(!this._questionTypeInput){var a=c.create("div",{"class":"form clearfix"},this.leftDiv);c.place('\x3cdiv class\x3d"drip-title"\x3e\u9898\u578b\x3c/div\x3e',a);for(var a=c.place('\x3cul class\x3d"radio-group"\x3e\x3c/ul\x3e',a),f=0;f<r.length;f++){var d=r[f],e=d.type==b,m=c.create("li",null,a),e=c.create("input",
{type:"radio",name:"questionType",id:d.type,checked:e},m);c.create("label",{"for":d.type,innerHTML:d.label},m);k(e,"click",g.hitch(this,function(a){a=a.target;a.id!=this.data.exerType&&this._createForm(a.id)}))}this._questionTypeInput=!0}},_createContentInput:function(){this.exerContentEditor||(this.contentPane=(this.exerContentEditor=this._createMathInput("\u4e60\u9898\u5185\u5bb9",10)).domNode.parentNode)},_createCourseOptions:function(){if(!this.coursePane){var b=c.create("div",{"class":"form clearfix"},
this.leftDiv);c.place('\x3cdiv class\x3d"drip-title"\x3e\u79d1\u76ee\x3c/div\x3e',b);for(var a=[{id:"higherMath",label:"\u9ad8\u7b49\u6570\u5b66"},{id:"linearAlgebra",label:"\u7ebf\u6027\u4ee3\u6570"},{id:"probability",label:"\u6982\u7387\u8bba\u4e0e\u6570\u7406\u7edf\u8ba1"}],f=c.place('\x3cul class\x3d"radio-group"\x3e\x3c/ul\x3e',b),d=0;d<a.length;d++){var e=a[d],m=c.create("li",null,f);c.create("input",{type:"radio",name:"course",id:e.id},m);c.create("label",{"for":e.id,innerHTML:e.label},m)}this.coursePane=
b}},_createGuideInput:function(){this.guideEditor||(this.guideEditor=this._createMathInput("\u4e60\u9898\u89e3\u6790",5))},_createMathInput:function(b,a){var f=c.create("div",{"class":"form"},this.leftDiv);c.place('\x3cdiv class\x3d"drip-title"\x3e'+b+"\x3c/div\x3e",f);return this._createEditor(f,a,550)},_createEditor:function(b,a,c){var d={};d.rows=a;c&&(d.width=c);a=new x(d);a.placeAt(b);a.startup();this._editors.push(a);return a},_createImageInput:function(){if(!this._imageInput){var b=c.create("div",
{"class":"form"},this.rightDiv),b=c.place('\x3cdiv class\x3d"drip-title" style\x3d"margin-bottom: 5px;"\x3e\x3c/div\x3e',b),a=new dojox.form.Uploader({label:"\u4e0a\u4f20\u56fe\u7247",multiple:!0,type:"file",uploadOnSelect:!0,url:"/uploads/exerciseImage"});a.placeAt(b);a.startup();(new drip.widget.form.uploader.FileList({uploader:a})).placeAt(b);this._imageInput=!0}},_createMathEditorHelper:function(){this._editorHelper||(c.create("iframe",{"class":"helper",style:"border:none; height:700px; width:100%",
src:"/drip/exercises/mathEditorHelp.html"},this.rightDiv),this._editorHelper=!0)},_showOptionPane:function(b){this.optionPane?null==b?""==this.optionPane.style.display&&(this.optionPane.style.display="none"):("none"==this.optionPane.style.display&&(this.optionPane.style.display=""),b!=this._optionType&&q("input",this.optionPane).forEach(function(a,c){a.type=b})):null!=b&&this._createOptionPane(b);this._optionType=b},_getFormData:function(){var b=this.data;b.content=this.exerContentEditor.get("value");
this.tblOption&&(b.options=[],p.findWidgets(this.tblOption).forEach(function(a,c){b.options.push(a.get("value"))}));var a={};if(this.tblOption){var c=[];q("[name\x3d"+this._optionName+"]:checked",this.tblOption).forEach(function(a,b){c.push({seq:a.value})});0<c.length&&(a.detail=c)}var d=this.guideEditor.get("value");null!=d&&0<d.length&&(a.guide=d);if(a.detail||a.guide)b.answer=a;return b},doSave:function(b){h.set(this.btnSave,"disabled",!0);b=this._getFormData();u("/exercises/",{method:"POST",data:w.stringify(b)}).then(g.hitch(this,
function(a){this._reset();h.set(this.btnSave,"disabled",!1)}),g.hitch(this,function(a){h.set(this.btnSave,"disabled",!1)}))},_reset:function(){this.data={};this.exerContentEditor.set("value","");this.guideEditor.set("value","");q("[name\x3d"+this._optionName+"]:checked",this.tblOption).forEach(function(b,a){h.set(b,"checked",!1)});p.findWidgets(this.tblOption).forEach(function(b,a){b.set("value","")})},empty:function(){},_createOptionPane:function(b){var a=this.optionPane=c.create("div",null,this.contentPane,
"after");c.place('\x3cdiv class\x3d"drip-title"\x3e\u9009\u9879\u548c\u7b54\u6848\x3c/div\x3e',a);for(var a=c.place("\x3cdiv\x3e\x3c/div\x3e",a),f=this.tblOption=c.place('\x3ctable class\x3d"drip-exercise-option"\x3e\x3c/table\x3e',a),d=this.optionLength,e=0;e<d;e++)this._createOption(f,e,b);this._refreshOption();a=c.place("\x3cdiv\x3e\x3c/div\x3e",a);a=c.place('\x3ca href\x3d"#"\x3e\x3ci class\x3d"icon-plus"\x3e\x3c/i\x3e \u6dfb\u52a0\u9009\u9879\x3c/a\x3e',a);k(a,"click",g.hitch(this,function(a){this._createOption(f,
this.optionLength++,b);n.stop(a)}))},_getOptionId:function(){this.optionId||(this.optionId=0);return this.optionId++},_createOption:function(b,a,f){var d=c.place("\x3ctr\x3e\x3c/tr\x3e",b),e=c.place("\x3ctd\x3e\x3c/td\x3e",d);this._getOptionId();c.place('\x3cinput type\x3d"'+f+'" name\x3d"'+this._optionName+'"/\x3e',e);f=c.place("\x3ctd\x3e\x3c/td\x3e",d);c.place("\x3clabel\x3e"+"ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(a)+"\x3c/label\x3e",f);a=c.place("\x3ctd\x3e\x3c/td\x3e",d);this._createEditor(a,2,
490);e=c.place("\x3ctd\x3e\x3c/td\x3e",d);a=c.place('\x3ca href\x3d"#" class\x3d"iconbutton" title\x3d"\u5220\u9664"\x3e\x3ci class\x3d"icon-trash"\x3e\x3c/i\x3e\x3c/a\x3e',e);f=c.place('\x3ca href\x3d"#" class\x3d"iconbutton" title\x3d"\u4e0b\u79fb"\x3e\x3ci class\x3d"icon-arrow-down"\x3e\x3c/i\x3e\x3c/a\x3e',e);e=c.place('\x3ca href\x3d"#" class\x3d"iconbutton" title\x3d"\u4e0a\u79fb"\x3e\x3ci class\x3d"icon-arrow-up"\x3e\x3c/i\x3e\x3c/a\x3e',e);k(a,"click",g.hitch(this,function(a){this.optionLength--;
p.findWidgets(d).forEach(function(a,b){a.destroyRecursive()});c.destroy(d);this._refreshOption();n.stop(a)}));k(f,"click",g.hitch(this,function(a){d.nextSibling?c.place(d,d.nextSibling,"after"):c.place(d,b,"first");this._refreshOption();n.stop(a)}));k(e,"click",g.hitch(this,function(a){d.previousSibling?c.place(d,d.previousSibling,"before"):c.place(d,b,"last");this._refreshOption();n.stop(a)}))},_refreshOption:function(){t.forEach(this.tblOption.childNodes,function(b,a){var c="ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(a),
d=b.cells[0].firstChild,e="option"+(a+1);h.set(d,"id",e);d.value=a;d=b.cells[1].firstChild;h.set(d,"for",e);d.innerHTML=c})},_destroyForm:function(){var b=this.domNode;p.findWidgets(b).forEach(function(a,b){a.destroyRecursive()});c.empty(b)},startup:function(){this.inherited(arguments);for(var b=this._editors,a=0;a<b.length;a++)b[a].startup()}})});
//@ sourceMappingURL=ExerciseForm.js.map