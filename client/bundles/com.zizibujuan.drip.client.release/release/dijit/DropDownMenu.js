//>>built
require({cache:{"url:dijit/templates/Menu.html":'<table class="dijit dijitMenu dijitMenuPassive dijitReset dijitMenuTable" role="menu" tabIndex="${tabIndex}"\n\t   data-dojo-attach-event="onkeydown:_onKeyDown" cellspacing="0">\n\t<tbody class="dijitReset" data-dojo-attach-point="containerNode"></tbody>\n</table>\n'}});
define("dijit/DropDownMenu",["dojo/_base/declare","dojo/keys","dojo/text!./templates/Menu.html","./_OnDijitClickMixin","./_MenuBase"],function(c,b,d,e,f){return c("dijit.DropDownMenu",[f,e],{templateString:d,baseClass:"dijitMenu",postCreate:function(){this.inherited(arguments);var a=this.isLeftToRight();this._openSubMenuKey=a?b.RIGHT_ARROW:b.LEFT_ARROW;this._closeSubMenuKey=a?b.LEFT_ARROW:b.RIGHT_ARROW;this.connectKeyNavHandlers([b.UP_ARROW],[b.DOWN_ARROW])},_onKeyDown:function(a){if(!a.ctrlKey&&
!a.altKey)switch(a.keyCode){case this._openSubMenuKey:this._moveToPopup(a);a.stopPropagation();a.preventDefault();break;case this._closeSubMenuKey:if(this.parentMenu)if(this.parentMenu._isMenuBar)this.parentMenu.focusPrev();else this.onCancel(!1);else a.stopPropagation(),a.preventDefault()}}})});