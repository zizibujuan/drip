define(["dojo/_base/window",
        "dojo/fx",
        "dojo/dom-construct"], function(
        		win,
        		coreFx,
        		domConstruct){
	
	var tip = {};
	
	tip.ok = function(msg, dom, position){
		var tipDiv = domConstruct.create("span", {style:{color:"green"}}, dom, position);
		tipDiv.innerHTML = "<i class='icon-ok'></i> " + msg;
		coreFx.wipeOut({
			node: tipDiv,
			duration: 1000,
			onEnd: function(){
				domConstruct.destroy(tipDiv);
			}
		}).play();
	};
	
	tip.error = function(msg, dom, position){
		if(email.nextSibling){
			domConstruct.destroy(email.nextSibling);
		}
		var tipDiv = domConstruct.create("span", {style:{color:"red"}}, dom, position);
		tipDiv.innerHTML = "<i class='icon-remove-sign'></i> " + msg;
	};
	
	return tip;
});