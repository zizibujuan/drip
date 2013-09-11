define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/on",
         "dojo/json",
         "dojo/request/xhr",
         "dojo/dom-construct",
         "dojo/dom-style",
         "dijit/_WidgetBase",
         "dijit/_TemplatedMixin",
         "dijit/_WidgetsInTemplateMixin",
         "dojo/text!doc/templates/FileForm.html",
         "dijit/form/ValidationTextBox",
         "dijit/form/SimpleTextarea"
         ], function(
        		 declare,
        		 lang,
        		 on,
        		 JSON,
        		 xhr,
        		 domConstruct,
        		 domStyle,
        		 _WidgetBase,
        		 _TemplatedMixin,
        		 _WidgetsInTemplateMixin,
        		 FileFormTemplate) {

	return declare("doc.files.FileForm", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		
		templateString: FileFormTemplate,
		
		pathName: null,
		
		pathInfo: null,
		
		method: "POST",
		
		errorMsg: "创建文件失败",
		
		postCreate: function(){
			this.inherited(arguments);
			
			var newFilePathName = this.pathName.replace("files/new", "files");
			var projectPath = this.pathName.replace("files/new", "projects");
			
			domStyle.set(this.content, {width: "100%", height: "400px"});
			// 因为AceEditor在ace压缩后，_WidgetsInTemplateMixin一直报有模块没有预加载，
			// 所以这里直接使用ace
			var editor = this.editor = ace.edit(this.content);
			
			// 绑定事件
			this.own(on(this.submitFile, "click", lang.hitch(this,function(e){
				var fileInfo = {
					name: this.fileName.get("value"),
					content: this.editor.getValue()
				};
				var commitInfo = {
					summary: this.commitSummary.get("value")/*,
					extendDesc: this.extendDesc.get("value")*/
				};
				var jsonData = {fileInfo: fileInfo, commitInfo: commitInfo};
				xhr(newFilePathName, {method: this.method, data:JSON.stringify(jsonData)}).then(function(data){
					window.location.href = projectPath;
				}, function(error){
					// TODO:如果保存失败，则给出提示
					console.error("创建文件失败", error);
				});
			})));
		}
		
	});
	
});