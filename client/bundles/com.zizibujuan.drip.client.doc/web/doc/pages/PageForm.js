define([ "dojo/_base/declare",
         "dojo/dom-construct",
         "dijit/_WidgetBase",
         "dijit/_TemplatedMixin",
         "dijit/_WidgetsInTemplateMixin",
         "dojo/text!doc/templates/PageForm.html",
         "dijit/form/ValidationTextBox",
         "dijit/form/SimpleTextarea",
         "drip/widget/form/AceEditor"
         ], function(
        		 declare,
        		 domConstruct,
        		 _WidgetBase,
        		 _TemplatedMixin,
        		 _WidgetsInTemplateMixin,
        		 PageFormTemplate) {

	return declare("doc.pages.PageForm", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		
		templateString: PageFormTemplate,
		
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