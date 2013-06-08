define(["dojo/_base/declare",
        "dijit/_WidgetBase"], function(
        		declare,
        		_WidgetBase){
	
	return declare("drip.Feedback", _WidgetBase, {
		// summary:
		//		用户反馈录入界面，会显示在每个界面中。
		//		登录用户和匿名用户看到的输入项是不一样的。
		//		第一个版本，先做一个简单的反馈系统，后续版本再做一个ajax im
		//		TODO：会和在线帮助放在一起，这个帮助系统，目前主要是数学编辑器的输入帮助。
		
		postCreate: function(){
			
		}
	});
});