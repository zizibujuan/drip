//>>built
require({cache:{"url:dijit/templates/MenuBar.html":'<div class="dijitMenuBar dijitMenuPassive" data-dojo-attach-point="containerNode" role="menubar" tabIndex="${tabIndex}"\n	 data-dojo-attach-event="onkeydown: _onKeyDown"></div>\n'}}),define("dijit/MenuBar",["dojo/_base/declare","dojo/keys","./_MenuBase","dojo/text!./templates/MenuBar.html"],function(declare,keys,_MenuBase,template){return declare("dijit.MenuBar",_MenuBase,{templateString:template,baseClass:"dijitMenuBar",_isMenuBar:!0,postCreate:function(){this.inherited(arguments);var l=this.isLeftToRight();this.connectKeyNavHandlers(l?[keys.LEFT_ARROW]:[keys.RIGHT_ARROW],l?[keys.RIGHT_ARROW]:[keys.LEFT_ARROW]),this._orient=["below"]},_moveToPopup:function(evt){this.focusedChild&&this.focusedChild.popup&&!this.focusedChild.disabled&&this.onItemClick(this.focusedChild,evt)},focusChild:function(item){var prev_item=this.focusedChild,showpopup=prev_item&&prev_item.popup&&prev_item.popup.isShowingNow;this.inherited(arguments),showpopup&&item.popup&&!item.disabled&&this._openPopup(item,!0)},_onKeyDown:function(evt){if(evt.ctrlKey||evt.altKey)return;switch(evt.keyCode){case keys.DOWN_ARROW:this._moveToPopup(evt),evt.stopPropagation(),evt.preventDefault()}},onItemClick:function(item,evt){item.popup&&item.popup.isShowingNow&&(!/^key/.test(evt.type)||evt.keyCode!==keys.DOWN_ARROW)?item.popup.onCancel():this.inherited(arguments)}})})