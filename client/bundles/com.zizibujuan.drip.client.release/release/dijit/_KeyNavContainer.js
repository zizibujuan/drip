//>>built
define("dijit/_KeyNavContainer",["dojo/_base/array","dojo/_base/declare","dojo/dom-attr","dojo/_base/kernel","dojo/keys","dojo/_base/lang","./registry","./_Container","./_FocusMixin","./_KeyNavMixin"],function(array,declare,domAttr,kernel,keys,lang,registry,_Container,_FocusMixin,_KeyNavMixin){return declare("dijit._KeyNavContainer",[_FocusMixin,_Container,_KeyNavMixin],{connectKeyNavHandlers:function(prevKeyCodes,nextKeyCodes){var keyCodes=this._keyNavCodes={},prev=lang.hitch(this,"focusPrev"),next=lang.hitch(this,"focusNext");array.forEach(prevKeyCodes,function(code){keyCodes[code]=prev}),array.forEach(nextKeyCodes,function(code){keyCodes[code]=next}),keyCodes[keys.HOME]=lang.hitch(this,"focusFirstChild"),keyCodes[keys.END]=lang.hitch(this,"focusLastChild")},startupKeyNavChildren:function(){kernel.deprecated("startupKeyNavChildren() call no longer needed","","2.0")},startup:function(){this.inherited(arguments),array.forEach(this.getChildren(),lang.hitch(this,"_startupChild"))},addChild:function(widget,insertIndex){this.inherited(arguments),this._startupChild(widget)},_startupChild:function(widget){widget.set("tabIndex","-1")},_getFirstFocusableChild:function(){return this._getNextFocusableChild(null,1)},_getLastFocusableChild:function(){return this._getNextFocusableChild(null,-1)},focusFirstChild:function(){this.focusChild(this._getFirstFocusableChild())},focusLastChild:function(){this.focusChild(this._getLastFocusableChild())},focusNext:function(){this.focusChild(this._getNextFocusableChild(this.focusedChild,1))},focusPrev:function(){this.focusChild(this._getNextFocusableChild(this.focusedChild,-1),!0)},_getNextFocusableChild:function(child,dir){child&&(child=this._getSiblingOfChild(child,dir));var children=this.getChildren();for(var i=0;i<children.length;i++){child||(child=children[dir>0?0:children.length-1]);if(child.isFocusable())return child;child=this._getSiblingOfChild(child,dir)}return null},childSelector:function(node){var node=registry.byNode(node);return node&&node.getParent()==this}})})