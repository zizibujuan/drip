define(["dojo/_base/window",
        "dojo/fx",
        "dojo/dom-construct"], function(
        		win,
        		coreFx,
        		domConstruct){
	
	var tip = {};
	
	tip.quiet = function(msg){
		var tipDiv = domConstruct.create("div");
	};
	
	tip.block = function(msg){
		
	};
	
	return tip;
});