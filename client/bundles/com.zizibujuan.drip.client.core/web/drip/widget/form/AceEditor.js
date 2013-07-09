define([ "dojo/_base/declare",
         "dojo/dom-style",
         "dijit/_WidgetBase",
         "ace/ace"], function(
        		 declare,
        		 domStyle,
        		 _WidgetBase,
        		 ace){
	
	return declare("drip.widget.form.AceEditor", [_WidgetBase], {
		// 默认是100%
		width: "100%",
		
		height: 400,
		
		mode: "ace/mode/markdown",
		
		theme: "ace/theme/textmate",
		
		postCreate: function(){
			this.inherited(arguments);
			// TODO：如果宽度不是百分比，则要加上单位px
			domStyle.set(this.domNode, {width: this.width, height: this.height+"px"})
			var editor = ace.edit(this.domNode);
			editor.setTheme(this.theme);
			editor.getSession().setMode(this.mode);
		}
	
	});
	
});