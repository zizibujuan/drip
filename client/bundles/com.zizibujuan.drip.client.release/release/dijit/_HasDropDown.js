//>>built
define("dijit/_HasDropDown","dojo/_base/declare,dojo/_base/Deferred,dojo/dom,dojo/dom-attr,dojo/dom-class,dojo/dom-geometry,dojo/dom-style,dojo/has,dojo/keys,dojo/_base/lang,dojo/on,./registry,./focus,./popup,./_FocusMixin,./Viewport".split(","),function(r,s,t,n,j,k,o,p,l,f,g,u,q,m,v,w){return r("dijit._HasDropDown",v,{_buttonNode:null,_arrowWrapperNode:null,_popupStateNode:null,_aroundNode:null,dropDown:null,autoWidth:!0,forceWidth:!1,maxHeight:0,dropDownPosition:["below","above"],_stopClickEvents:!0,
_onDropDownMouseDown:function(a){if(!this.disabled&&!this.readOnly)a.preventDefault(),this._docHandler=this.own(g(this.ownerDocument,"mouseup",f.hitch(this,"_onDropDownMouseUp")))[0],this.toggleDropDown()},_onDropDownMouseUp:function(a){a&&this._docHandler&&this.disconnect(this._docHandler);var b=this.dropDown,e=!1;if(a&&this._opened){var c=k.position(this._buttonNode,!0);if(!(a.pageX>=c.x&&a.pageX<=c.x+c.w)||!(a.pageY>=c.y&&a.pageY<=c.y+c.h)){for(c=a.target;c&&!e;)j.contains(c,"dijitPopup")?e=!0:
c=c.parentNode;if(e){c=a.target;if(b.onItemClick){for(var d;c&&!(d=u.byNode(c));)c=c.parentNode;if(d&&d.onClick&&d.getParent)d.getParent().onItemClick(d,a)}return}}}if(this._opened){if(b.focus&&!1!==b.autoFocus)this._focusDropDownTimer=this.defer(function(){b.focus();delete this._focusDropDownTimer})}else this.defer("focus");if(p("touch"))this._justGotMouseUp=!0,this.defer(function(){this._justGotMouseUp=!1})},_onDropDownClick:function(a){p("touch")&&!this._justGotMouseUp&&(this._onDropDownMouseDown(a),
this._onDropDownMouseUp(a));this._stopClickEvents&&(a.stopPropagation(),a.preventDefault())},buildRendering:function(){this.inherited(arguments);this._buttonNode=this._buttonNode||this.focusNode||this.domNode;this._popupStateNode=this._popupStateNode||this.focusNode||this._buttonNode;var a={after:this.isLeftToRight()?"Right":"Left",before:this.isLeftToRight()?"Left":"Right",above:"Up",below:"Down",left:"Left",right:"Right"}[this.dropDownPosition[0]]||this.dropDownPosition[0]||"Down";j.add(this._arrowWrapperNode||
this._buttonNode,"dijit"+a+"ArrowButton")},postCreate:function(){this.inherited(arguments);var a=this.focusNode||this.domNode;this.own(g(this._buttonNode,"mousedown",f.hitch(this,"_onDropDownMouseDown")),g(this._buttonNode,"click",f.hitch(this,"_onDropDownClick")),g(a,"keydown",f.hitch(this,"_onKey")),g(a,"keyup",f.hitch(this,"_onKeyUp")))},destroy:function(){this.dropDown&&(this.dropDown._destroyed||this.dropDown.destroyRecursive(),delete this.dropDown);this.inherited(arguments)},_onKey:function(a){if(!this.disabled&&
!this.readOnly){var b=this.dropDown,e=a.target;if(b&&this._opened&&b.handleKey&&!1===b.handleKey(a))a.stopPropagation(),a.preventDefault();else if(b&&this._opened&&a.keyCode==l.ESCAPE)this.closeDropDown(),a.stopPropagation(),a.preventDefault();else if(!this._opened&&(a.keyCode==l.DOWN_ARROW||(a.keyCode==l.ENTER||a.keyCode==l.SPACE)&&("input"!==(e.tagName||"").toLowerCase()||e.type&&"text"!==e.type.toLowerCase())))this._toggleOnKeyUp=!0,a.stopPropagation(),a.preventDefault()}},_onKeyUp:function(){if(this._toggleOnKeyUp){delete this._toggleOnKeyUp;
this.toggleDropDown();var a=this.dropDown;a&&a.focus&&this.defer(f.hitch(a,"focus"),1)}},_onBlur:function(){this.closeDropDown(q.curNode&&this.dropDown&&t.isDescendant(q.curNode,this.dropDown.domNode));this.inherited(arguments)},isLoaded:function(){return!0},loadDropDown:function(a){a()},loadAndOpenDropDown:function(){var a=new s,b=f.hitch(this,function(){this.openDropDown();a.resolve(this.dropDown)});this.isLoaded()?b():this.loadDropDown(b);return a},toggleDropDown:function(){!this.disabled&&!this.readOnly&&
(this._opened?this.closeDropDown():this.loadAndOpenDropDown())},openDropDown:function(){var a=this.dropDown,b=a.domNode,e=this._aroundNode||this.domNode,c=this;if(!this._preparedNode){this._preparedNode=!0;if(b.style.width)this._explicitDDWidth=!0;if(b.style.height)this._explicitDDHeight=!0}if(this.maxHeight||this.forceWidth||this.autoWidth){var d={display:"",visibility:"hidden"};if(!this._explicitDDWidth)d.width="";if(!this._explicitDDHeight)d.height="";o.set(b,d);d=this.maxHeight;if(-1==d)var d=
w.getEffectiveBox(this.ownerDocument),h=k.position(e,!1),d=Math.floor(Math.max(h.y,d.h-(h.y+h.h)));m.moveOffScreen(a);a.startup&&!a._started&&a.startup();var h=k.getMarginSize(b),g=d&&h.h>d;o.set(b,{overflow:g?"auto":"visible"});var i={};if(g)i.h=d,i.w=h.w+18;if(this.forceWidth||this.autoWidth&&e.offsetWidth>("w"in i?i.w:h.w))i.w=e.offsetWidth;f.isFunction(a.resize)?a.resize(i):k.setMarginBox(b,i)}e=m.open({parent:this,popup:a,around:e,orient:this.dropDownPosition,onExecute:function(){c.closeDropDown(!0)},
onCancel:function(){c.closeDropDown(!0)},onClose:function(){n.set(c._popupStateNode,"popupActive",!1);j.remove(c._popupStateNode,"dijitHasDropDownOpen");c._set("_opened",!1)}});n.set(this._popupStateNode,"popupActive","true");j.add(this._popupStateNode,"dijitHasDropDownOpen");this._set("_opened",!0);this._popupStateNode.setAttribute("aria-expanded","true");this._popupStateNode.setAttribute("aria-owns",a.id);"presentation"!==b.getAttribute("role")&&!b.getAttribute("aria-labelledby")&&b.setAttribute("aria-labelledby",
this.id);return e},closeDropDown:function(a){this._focusDropDownTimer&&(this._focusDropDownTimer.remove(),delete this._focusDropDownTimer);if(this._opened)this._popupStateNode.setAttribute("aria-expanded","false"),a&&this.focus(),m.close(this.dropDown),this._opened=!1}})});