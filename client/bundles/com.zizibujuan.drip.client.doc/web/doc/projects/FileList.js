define(["dojo/_base/declare",
        "dijit/_WidgetBase",
        "drip/_StoreMixin"], function(
		declare,
		_WidgetBase,
		_StoreMixin){
	
	return declare("projects.FileList", [_WidgetBase, _StoreMixin], {
		
		postCreate: function(){
			this.inherited(arguments);
			
		},
		
		refresh: function(){
			this.domNode.innerHTML = this.loadingMessage;
			 if(this.store){
				 this.store.query(this.query).then(lang.hitch(this, this._load));
			 }
		},
		
		_load: function(items){
			 if(items.length == 0){
				 this.domNode.innerHTML = this.noDataMessage;
			 }else{
				 console.log("项目根目录下的文件：",items);
				 this.domNode.innerHTML = "";
				 
				 // 创建一个三列的table
				 array.forEach(items, lang.hitch(this,function(item, index){
					 // TODO：
				 }));
			 }
		}
	
	});
});