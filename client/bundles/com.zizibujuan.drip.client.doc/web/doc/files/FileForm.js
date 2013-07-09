define([ "dojo/_base/declare",
         "dojo/dom-construct",
         "dijit/_WidgetBase",
         "dijit/_TemplatedMixin",
         "dijit/_WidgetsInTemplateMixin",
         "dojo/text!doc/templates/FileForm.html",
         "dijit/form/ValidationTextBox",
         "dijit/form/SimpleTextarea",
         "drip/widget/form/AceEditor"
         ], function(
        		 declare,
        		 domConstruct,
        		 _WidgetBase,
        		 _TemplatedMixin,
        		 _WidgetsInTemplateMixin,
        		 FileFormTemplate) {

	return declare("doc.files.FileForm", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		
		templateString: FileFormTemplate,
		
		postCreate: function(){
			this.inherited(arguments);
			
			this._createForm();
		},
		
		_createForm: function(){
			// 创建form
			
			// 绑定事件
		}
		
	});
	
});