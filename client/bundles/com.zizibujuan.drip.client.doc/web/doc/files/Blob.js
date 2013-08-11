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
				debugger;
				marked.setOptions({
					gfm: true,
					highlight: function (code, lang) {
					    debugger;
						return hljs.highlight(lang, code).value;
					},
					langPrefix: 'lang-'
				});
				this.blob.innerHTML = marked(fileInfo.content);
				
				this.icon.className = "icon-file-text";
				this.mode.innerHTML = "文档";
				this.size.innerHTML = fileInfo.size;
				
			}));
		}
	
	});
	
});