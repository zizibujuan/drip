define(["dojo/_base/declare",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dojo/text!doc/templates/FileDetail.html",
        "dojo/request/xhr",
        "dojo/_base/lang"], function(
		declare,
		_WidgetBase,
		_TemplatedMixin,
		FileDetailTemplate,
		xhr,
		lang){
	
	return declare("doc.files.Blob", [_WidgetBase, _TemplatedMixin], {
		
		pathName: null,
		
		templateString: FileDetailTemplate,
		
		postCreate: function(){
			this.inherited(arguments);
			xhr.get(this.pathName,{handleAs: "json"}).then(lang.hitch(this, function(fileInfo){
				this.icon.className = "icon-file-text";
				this.mode.innerHTML = "文档";
				this.size.innerHTML = fileInfo.size;
				this.btnEdit.href = this.pathName.replace("blob", "files/edit");
				
				marked.setOptions({
					gfm: true,
					highlight: function (code, lang) {
					    try{
					    	if(lang == "html"){lang = "xml";}
					 
					    	return hljs.highlight(lang, code).value;
					    }catch(e){
					    	console.error("高亮显示解析失败");
					    	return code;
					    }
						
					},
					langPrefix: 'lang-'
				});
				try{
					this.blob.innerHTML = marked(fileInfo.content);
				}catch(e){
					// 如果解析失败，则显示原文
					// 逻辑还是不够完善，尽量不允许解析错误，先要校验文件的有效性
					this.blob.innerHTML = fileInfo.content;
					console.error("marked解析失败");
				}
				
				
				
				
			}));
		}
	
	});
	
});