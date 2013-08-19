define(["dojo/_base/declare",
        "dojo/request/xhr",
        "dijit/_WidgetBase"], function(
        		declare,
        		xhr,
        		_WidgetBase){
	
	return declare("drip.mixLogin.Register", [_WidgetBase], {
		
		
		signUp: function(){
			return xhr.post("/users", {handleAs: "json"});
		}
	});
	
});