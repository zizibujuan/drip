define([ "dojo/_base/declare",
         "dojo/on",
         "dojo/request/xhr",
         "dojo/dom-construct",
         "dijit/_WidgetBase",
         "dijit/_TemplatedMixin",
         "dijit/_WidgetsInTemplateMixin",
         "dojo/text!doc/templates/FileForm.html",
         "dijit/form/ValidationTextBox",
         "dijit/form/SimpleTextarea",
         "drip/widget/form/AceEditor"
         ], function(
        		 declare,
        		 on,
        		 xhr,
        		 domConstruct,
        		 _WidgetBase,
        		 _TemplatedMixin,
        		 _WidgetsInTemplateMixin,
        		 FileFormTemplate) {

	return declare("doc.files.FileForm", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		
		templateString: FileFormTemplate,
		
		postCreate: function(){
			this.inherited(arguments);
			
			// 绑定事件
			this.own(on(this.submitFile, "click", function(e){
				var fileInfo = {
					name: this.fileName.get("value"),
					content: this.content.get("value")
				};
				var commitInfo = {
					summary: this.commitSummary.get("value"),
					extendDesc: this.extendDesc.get("value")
				};
				var jsonData = {fileInfo: fileInfo, commitInfo: commitInfo};
				xhr.post("/files/",{data:jsonData}).then(function(data){
					window.location.href = "/"; // TODO：跳转到项目列表页面
				}, function(error){
					// TODO:如果保存失败，则给出提示
					console.error(error);
				});
			}));
		}
		
	});
	
});