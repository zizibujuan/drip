//>>built
define("doc/projects/ProjectForm","dojo/_base/declare dojo/_base/lang dojo/on dojo/json dojo/request/xhr dojo/dom-construct dijit/_WidgetBase dijit/_TemplatedMixin dijit/_WidgetsInTemplateMixin dojo/text!doc/templates/ProjectForm.html dijit/form/ValidationTextBox dijit/form/SimpleTextarea drip/widget/form/AceEditor".split(" "),function(c,d,e,f,g,n,h,k,l,m){return c("doc.projects.ProjectForm",[h,k,l],{templateString:m,errors:[],postCreate:function(){this.inherited(arguments);this.own(e(this.submitProject,
"click",d.hitch(this,function(b){b={name:this.projectName.get("value"),label:this.projectLabel.get("value"),description:this.peojectDesc.get("value")};g.post("/projects/",{data:f.stringify(b),handleAs:"json"}).then(function(a){window.location.href=a.createUserName+"/"+a.name},function(a){})})))},validate:function(){},showError:function(){}})});require({cache:{"url:doc/templates/ProjectForm.html":'\x3cdiv\x3e\n\t\x3cdiv\x3e\u9879\u76ee\u540d\u79f0\x3c/div\x3e\n\t\x3c!-- \u9879\u76ee\u540d\u79f0\u53ea\u5141\u8bb8\u8f93\u5165\u5b57\u6bcd\uff0c\u6570\u5b57\u6216\u4e0b\u5212\u7ebf_ --\x3e\n\t\x3cdiv data-dojo-type\x3d"dijit/form/ValidationTextBox"\n\t\tdata-dojo-attach-point \x3d "projectName"\n\t\tdata-dojo-props\x3d""\x3e\x3c/div\x3e\n\t\n\t\x3cdiv\x3e\u9879\u76ee\u4e2d\u6587\u540d(\u9009\u586b)\x3c/div\x3e\n\t\x3cdiv data-dojo-type\x3d"dijit/form/TextBox"\n\t\tdata-dojo-attach-point \x3d "projectLabel"\n\t\tdata-dojo-props\x3d""\x3e\x3c/div\x3e\n\t\t\n\t\x3cdiv\x3e\u9879\u76ee\u63cf\u8ff0(\u9009\u586b)\x3c/div\x3e\n\t\x3cdiv data-dojo-type\x3d"dijit/form/SimpleTextarea"\n\t\tdata-dojo-attach-point \x3d "peojectDesc"\n\t\tdata-dojo-props\x3d"rows:2,cols:50"\x3e\x3c/div\x3e\n\t\t\n\t\x3cdiv\x3e\n\t\t\x3cbutton data-dojo-attach-point\x3d"submitProject" \n\t\t\tclass\x3d"minibutton primary"\x3e\u521b\u5efa\x3c/button\x3e\t\n\t\x3c/div\x3e\n\n\x3c/div\x3e'}});
//@ sourceMappingURL=ProjectForm.js.map