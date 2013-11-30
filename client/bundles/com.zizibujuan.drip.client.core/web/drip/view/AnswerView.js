define(["dojo/_base/declare",
        "dojo/_base/lang"], function(
        		declare,
        		lang){
	
	return declare("drip.view.AnswerView", null, {
		
		constructor: function(args){
			lang.mixin(this, args);
		}
	});
	
});