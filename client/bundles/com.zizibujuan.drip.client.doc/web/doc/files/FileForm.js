define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/on",
         "dojo/json",
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
        		 lang,
        		 on,
        		 JSON,
        		 xhr,
        		 domConstruct,
        		 _WidgetBase,
        		 _TemplatedMixin,
        		 _WidgetsInTemplateMixin,
        		 FileFormTemplate) {

	return declare("doc.files.FileForm", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		
		templateString: FileFormTemplate,
		
		pathName: null,
		
		pathInfo: null,
		
		postCreate: function(){
			this.inherited(arguments);
			
			this.pathInfo = this.pathName.replace("/files/", "").replace("/new", "");
			var projectPath = this.pathName.replace("files", "projects").replace("/new", "");
			
			// 绑定事件
			this.own(on(this.submitFile, "click", lang.hitch(this,function(e){
				var fileInfo = {
					name: this.fileName.get("value"),
					content: this.content.get("value")
				};
				var commitInfo = {
					summary: this.commitSummary.get("value")/*,
					extendDesc: this.extendDesc.get("value")*/
				};
				var jsonData = {fileInfo: fileInfo, commitInfo: commitInfo};
				xhr.post("/files/" + this.pathInfo, {data:JSON.stringify(jsonData)}).then(function(data){
					debugger;
					window.location.href = projectPath;
				}, function(error){
					// TODO:如果保存失败，则给出提示
					console.error("创建文件失败", error);
				});
			})));
		}
		
	});
	
});