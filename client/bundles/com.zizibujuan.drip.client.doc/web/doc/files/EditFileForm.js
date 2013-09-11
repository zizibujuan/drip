define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/request/xhr",
        "doc/files/FileForm"], function(
        		declare,
        		lang,
        		xhr,
        		FileForm){
	
	return declare("doc.files.EditFileForm", [FileForm], {
		
		method: "PUT",
	
		action: "edit",
		
		title: "编辑页面",
		
		errorMsg: "编辑文件失败",
		
		postCreate: function(){
			this.inherited(arguments);
			if(this.pathName.lastIndexOf("/") == (this.pathName.length - 1)){
				this.pathName = this.pathName.substring(0, this.pathName.length - 1);
			}
			var projectPath = this.pathName.replace("files/" + this.action, "projects");
			var pathArray = projectPath.split("/");
			pathArray.pop();
			this.projectPath = pathArray.join("/");
				
			// TODO: 0.0.2版本支持修改文件名
			this.fileName.set("disabled", true);
			// 加载数据
			var blobUrl = this.pathName.replace("files/edit", "blob");
			xhr.get(blobUrl, {handleAs: "json", preventCache: true}).then(lang.hitch(this, this._loadData), function(error){
				console.error(error, "加载文件信息失败")
			});
		},
		
		_loadData: function(data){
			this.oldName = data.name;
			this.fileName.set("value", data.name);
			this.editor.setValue(data.content, -1);
			this.editor.focus();
		}
	});
	
});