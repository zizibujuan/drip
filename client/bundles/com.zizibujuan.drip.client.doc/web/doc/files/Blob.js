define(["dojo/_base/declare",
        "dijit/_WidgetBase"], function(
		declare,
		_WidgetBase){
	
	return declare("doc.files.Blob", [_WidgetBase], {
		pathName: null,
		
		postCreate: function(){
			this.inherited(arguments);
			
			
		}
	
	});
	
});