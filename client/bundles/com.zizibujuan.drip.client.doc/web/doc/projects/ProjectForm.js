define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/on",
         "dojo/json",
         "dojo/request/xhr",
         "dojo/dom-construct",
         "dijit/_WidgetBase",
         "dijit/_TemplatedMixin",
         "dijit/_WidgetsInTemplateMixin",
         "dojo/text!doc/templates/ProjectForm.html",
         "dijit/form/ValidationTextBox",
         "dijit/form/SimpleTextarea",
         "drip/widget/form/AceEditor"
         ], function(
        		 declare,
        		 lang,
        		 on,
        		 JSON,
        		 xhr,
        		 domConstruct,
        		 _WidgetBase,
        		 _TemplatedMixin,
        		 _WidgetsInTemplateMixin,
        		 ProjectFormTemplate) {

	return declare("doc.projects.ProjectForm", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		
		templateString: ProjectFormTemplate,
		
		postCreate: function(){
			this.inherited(arguments);
			
			// 绑定事件
			this.own(on(this.submitProject, "click", lang.hitch(this,function(e){
				var projectInfo = {
					name: this.projectName.get("value"),
					label: this.projectLabel.get("value"),
					description: this.peojectDesc.get("value")
				};
				xhr.post("/projects/",{data:JSON.stringify(projectInfo)}).then(function(data){
					window.location.href = "/"; // TODO：跳转到项目列表页面
				}, function(error){
					// TODO:如果保存失败，则给出提示
					console.error("创建项目失败", error);
				});
			})));
		}
		
	});
	
});