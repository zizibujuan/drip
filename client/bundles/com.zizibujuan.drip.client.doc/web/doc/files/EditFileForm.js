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
		
		errorMsg: "编辑文件失败",
		
		postCreate: function(){
			this.inherited(arguments);
			
			// 加载数据
			xhr.get(this.pathName).then(lang.hitch(this, this._loadData), function(error){
				console.error(error, "加载文件信息失败")
			});
		},
		
		_loadData: function(data){
			this.editor.setValue(data.content);
		}
	});
	
});