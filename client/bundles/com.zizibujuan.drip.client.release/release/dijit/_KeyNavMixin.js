//>>built
define("dijit/_KeyNavMixin","dojo/_base/array,dojo/_base/declare,dojo/dom-attr,dojo/keys,dojo/_base/lang,dojo/on,dijit/registry,dijit/_FocusMixin".split(","),function(j,g,f,c,b,e,h,i){return g("dijit._KeyNavMixin",i,{tabIndex:"0",childSelector:null,postCreate:function(){this.inherited(arguments);f.set(this.domNode,"tabIndex",this.tabIndex);if(!this._keyNavCodes){var a=this._keyNavCodes={};a[c.HOME]=b.hitch(this,"focusFirstChild");a[c.END]=b.hitch(this,"focusLastChild");a[this.isLeftToRight()?c.LEFT_ARROW:
c.RIGHT_ARROW]=b.hitch(this,"_onLeftArrow");a[this.isLeftToRight()?c.RIGHT_ARROW:c.LEFT_ARROW]=b.hitch(this,"_onRightArrow");a[c.UP_ARROW]=b.hitch(this,"_onUpArrow");a[c.DOWN_ARROW]=b.hitch(this,"_onDownArrow")}var d=this,a="string"==typeof this.childSelector?this.childSelector:b.hitch(this,"childSelector");this.own(e(this.domNode,"keypress",b.hitch(this,"_onContainerKeypress")),e(this.domNode,"keydown",b.hitch(this,"_onContainerKeydown")),e(this.domNode,"focus",b.hitch(this,"_onContainerFocus")),
e(this.containerNode,e.selector(a,"focusin"),function(a){d._onChildFocus(h.getEnclosingWidget(this),a)}))},_onLeftArrow:function(){},_onRightArrow:function(){},_onUpArrow:function(){},_onDownArrow:function(){},focus:function(){this.focusFirstChild()},focusFirstChild:function(){},focusLastChild:function(){},focusChild:function(a,d){a&&(this.focusedChild&&a!==this.focusedChild&&this._onChildBlur(this.focusedChild),a.set("tabIndex",this.tabIndex),a.focus(d?"end":"start"))},_onContainerFocus:function(a){a.target!==
this.domNode||this.focusedChild||this.focusFirstChild()},_onFocus:function(){f.set(this.domNode,"tabIndex","-1");this.inherited(arguments)},_onBlur:function(a){f.set(this.domNode,"tabIndex",this.tabIndex);this.focusedChild&&(this.focusedChild.set("tabIndex","-1"),this._set("focusedChild",null));this.inherited(arguments)},_onChildFocus:function(a){if(a&&a!=this.focusedChild)this.focusedChild&&!this.focusedChild._destroyed&&this.focusedChild.set("tabIndex","-1"),a.set("tabIndex",this.tabIndex),this.lastFocused=
a,this._set("focusedChild",a)},_searchString:"",multiCharSearchDuration:1E3,onKeyboardSearch:function(a){a&&this.focusChild(a)},_keyboardSearchCompare:function(a,d){var b=a.domNode,b=(a.label||(b.focusNode?b.focusNode.label:"")||b.innerText||b.textContent||"").replace(/^\s+/,"").substr(0,d.length).toLowerCase();return d.length&&b==d?-1:0},_onContainerKeydown:function(a){var b=this._keyNavCodes[a.keyCode];if(b)b(a,this.focusedChild),a.stopPropagation(),a.preventDefault(),this._searchString=""},_onContainerKeypress:function(a){if(!(32>=
a.charCode||a.ctrlKey||a.altKey)){var d=null,c,e=0,f=b.hitch(this,function(){this._searchTimer&&this._searchTimer.remove();this._searchString+=g;var a=/^(.)\1*$/.test(this._searchString)?1:this._searchString.length;c=this._searchString.substr(0,a);this._searchTimer=this.defer(function(){this._searchTimer=null;this._searchString=""},this.multiCharSearchDuration);var b=this.focusedChild||null;if(1==a||!b)if(b=this._getNextFocusableChild(b,1),!b)return;a=b;do{var f=this._keyboardSearchCompare(b,c);f&&
0==e++&&(d=b);if(-1==f){e=-1;break}b=this._getNextFocusableChild(b,1)}while(b!=a)}),g=String.fromCharCode(a.charCode).toLowerCase();f();this.onKeyboardSearch(d,a,c,e)}},_onChildBlur:function(){},_getNextFocusableChild:function(){return null}})});