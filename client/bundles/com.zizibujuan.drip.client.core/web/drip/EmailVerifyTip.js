define(["dojo/_base/declare",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dojo/text!drip/templates/EmailVerifyTip.html"],function(
        		declare,
        		_WidgetBase,
        		_TemplatedMixin,
        		emailVerifyTipTemplate){
	
	return declare("drip.EmailVerifyTip", [_WidgetBase, _TemplatedMixin], {
		
		templateString: emailVerifyTipTemplate,
		
		postCreate: function(){
			this.inherited(arguments);
			
		}
	});
	
});