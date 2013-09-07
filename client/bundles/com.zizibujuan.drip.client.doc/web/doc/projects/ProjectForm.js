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
         "dijit/form/SimpleTextarea"
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
		
		errors: [],
		
		postCreate: function(){
			this.inherited(arguments);
			
			// 绑定事件
			this.own(on(this.submitProject, "click", lang.hitch(this,function(e){
				var projectInfo = {
					name: this.projectName.get("value"),
					label: this.projectLabel.get("value"),
					description: this.peojectDesc.get("value")
				};
				xhr.post("/projects/",{data:JSON.stringify(projectInfo), handleAs:"json"}).then(function(data){
					window.location.href = data.createUserName + "/" + data.name;
				}, function(error){
					var data = error.response.data;
					if(data){
						// 在界面上显示错误信息
						
					}else{
						console.error("创建项目失败", error);
					}
				});
			})));
		},
		
		validate: function(){
			
		},
		
		showError: function(){
			
		}
	});
	
});