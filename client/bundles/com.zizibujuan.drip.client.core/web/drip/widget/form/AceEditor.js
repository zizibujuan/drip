define([ "dojo/_base/declare",
         "dijit/_WidgetBase",
         "ace/ace"], function(
        		 declare,
        		 _WidgetBase,
        		 ace){
	
	return declare("drip.widget.form.AceEditor", [_WidgetBase], {
		
		postCreate: function(){
			ace.edit(this.domNode);
		}
	
	});
	
});