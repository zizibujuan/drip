//>>built
define("doc/files/FileForm","dojo/_base/declare dojo/_base/lang dojo/on dojo/json dojo/request/xhr dojo/dom-construct dojo/dom-style dijit/_WidgetBase dijit/_TemplatedMixin dijit/_WidgetsInTemplateMixin dojo/text!doc/templates/FileForm.html dijit/form/ValidationTextBox dijit/form/SimpleTextarea".split(" "),function(b,d,c,e,f,n,g,h,k,l,m){return b("doc.files.FileForm",[h,k,l],{templateString:m,pathName:null,pathInfo:null,method:"POST",action:"new",errorMsg:"\u521b\u5efa\u6587\u4ef6\u5931\u8d25",title:"\u65b0\u5efa\u9875\u9762",
postCreate:function(){this.inherited(arguments);this.action_title.innerHTML=this.title;var b=this.pathName.replace("files/"+this.action,"files");this.projectPath=this.pathName.replace("files/"+this.action,"projects");g.set(this.content,{width:"100%",height:"400px"});var a=this.editor=ace.edit(this.content);a.setTheme("ace/theme/textmate");a.getSession().setMode("ace/mode/markdown");this.own(c(this.submitFile,"click",d.hitch(this,function(a){a={name:this.fileName.get("value"),content:this.editor.getValue()};
var c={summary:this.commitSummary.get("value")};f(b,{method:this.method,data:e.stringify({fileInfo:a,commitInfo:c})}).then(d.hitch(this,function(a){window.location.href=this.projectPath}),function(a){})})))}})});require({cache:{"url:doc/templates/FileForm.html":'\x3cdiv\x3e\n\t\x3ch1 data-dojo-attach-point \x3d "action_title"\x3e\x3c/h1\x3e\n\t\x3cdiv\x3e\n\t\t\x3cdiv class\x3d"breadcrumb"\x3e\n\t\t\x3c!-- \u5728\u8fd9\u91cc\u6839\u636e\u8def\u5f84\u751f\u6210 a/b \u6837\u5f0f\u7684\u7ed3\u6784 --\x3e\n\t\t\t\x3cdiv data-dojo-type\x3d"dijit/form/ValidationTextBox"\n\t\t\t\tdata-dojo-attach-point \x3d "fileName"\n\t\t\t\tdata-dojo-props\x3d"placeholder:\'\u8f93\u5165\u6587\u4ef6\u540d\'"\x3e\x3c/div\x3e\n\t\t\t\x3cp\x3e\x3ca href\x3d"#"\x3e\u53d6\u6d88\x3c/a\x3e\x3c/p\x3e\x3c!-- \u8df3\u8f6c\u5230\u9879\u76ee\u5217\u8868\u9875\u9762 --\x3e\n\t\t\x3c/div\x3e\n\t\t\x3cdiv class\x3d"file"\x3e\n\t\t\t\x3cdiv class\x3d"meta"\x3e\n\t\t\t\t\x3cdiv class\x3d"info"\x3e\n\t\t\t\t\t\x3ci class\x3d"icon-file-text-alt"\x3e\x3c/i\x3e\n\t\t\t\t\x3c/div\x3e\n\t\t\t\t\x3cdiv\x3e\n\t\t\t\t\t\x3c!-- \u63d0\u4f9b\u9884\u89c8\u6309\u94ae --\x3e\n\t\t\t\t\x3c/div\x3e\n\t\t\t\x3c/div\x3e\n\t\t\t\x3cdiv\x3e\n\t\t\t\t\x3cdiv data-dojo-attach-point\x3d"content"\x3e\x3c/div\x3e\n\t\t\t\x3c/div\x3e\n\t\t\t\n\t\t\x3c/div\x3e\n\t\t\n\t\t\x3cdiv class\x3d"new-commit"\x3e\n\t\t\t\x3cdiv\x3e\n\t\t\t\t\x3cdiv\x3e\u63d0\u4ea4\u6982\u8ff0\uff08\u5fc5\u8f93\uff09\x3c/div\x3e\n\t\t\t\t\x3cdiv data-dojo-type \x3d "dijit/form/ValidationTextBox"\n\t\t\t\t\tdata-dojo-attach-point \x3d "commitSummary"\n\t\t\t\t\tdata-dojo-props \x3d "placeholder:\'\u65b0\u5efa\u6587\u4ef6\'"\x3e\x3c/div\x3e\n\t\t\t\t\x3cdiv\x3e\u8be6\u7ec6\u63cf\u8ff0\x3c/div\x3e\n\t\t\t\t\x3cdiv data-dojo-type \x3d "dijit/form/SimpleTextarea"\n\t\t\t\t\tdata-dojo-attach-point \x3d "extendDesc"\n\t\t\t\t\tdata-dojo-props \x3d "rows:2,cols:50"\x3e\x3c/div\x3e\n\t\t\t\x3c/div\x3e\n\t\t\t\n\t\t\t\x3cdiv\x3e\n\t\t\t\x3c!-- \u8df3\u8f6c\u5230\u9879\u76ee\u5217\u8868\u9875\u9762 --\x3e\n\t\t\t\t\x3ca href\x3d"#" class\x3d"minibutton"\x3e\u53d6\u6d88\x3c/a\x3e\n\t\t\t\t\x3cbutton data-dojo-attach-point\x3d"submitFile" type\x3d"submit" class\x3d"minibutton primary"\x3e\u4fdd\u5b58\x3c/button\x3e\t\n\t\t\t\x3c/div\x3e\n\t\t\x3c/div\x3e\n\t\t\n\t\t\n\t\t\n\t\x3c/div\x3e\n\x3c/div\x3e'}});
//@ sourceMappingURL=FileForm.js.map