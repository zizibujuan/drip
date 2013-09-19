//>>built
define("dijit/_MenuBase","dojo/_base/array dojo/_base/declare dojo/dom dojo/dom-attr dojo/dom-class dojo/_base/lang dojo/mouse dojo/on dojo/window ./a11yclick ./registry ./_Widget ./_CssStateMixin ./_KeyNavContainer ./_TemplatedMixin".split(" "),function(s,k,t,l,g,f,h,c,u,m,d,n,p,q,r){return k("dijit._MenuBase",[n,r,q,p],{selected:null,_setSelectedAttr:function(a){this.selected!=a&&(this.selected&&(this.selected._setSelected(!1),this._onChildDeselect(this.selected)),a&&a._setSelected(!0),this._set("selected",
a))},activated:!1,_setActivatedAttr:function(a){g.toggle(this.domNode,"dijitMenuActive",a);g.toggle(this.domNode,"dijitMenuPassive",!a);this._set("activated",a)},parentMenu:null,popupDelay:500,passivePopupDelay:Infinity,autoFocus:!1,childSelector:function(a){var b=d.byNode(a);return a.parentNode==this.containerNode&&b&&b.focus},postCreate:function(){var a=this,b="string"==typeof this.childSelector?this.childSelector:f.hitch(this,"childSelector");this.own(c(this.containerNode,c.selector(b,h.enter),
function(){a.onItemHover(d.byNode(this))}),c(this.containerNode,c.selector(b,h.leave),function(){a.onItemUnhover(d.byNode(this))}),c(this.containerNode,c.selector(b,m),function(b){a.onItemClick(d.byNode(this),b);b.stopPropagation()}),c(this.containerNode,c.selector(b,"focusin"),function(){a._onItemFocus(d.byNode(this))}));this.inherited(arguments)},onKeyboardSearch:function(a,b,c,e){this.inherited(arguments);if(a&&(-1==e||a.popup&&1==e))this.onItemClick(a,b)},_keyboardSearchCompare:function(a,b){return a.shortcutKey?
b==a.shortcutKey.toLowerCase()?-1:0:this.inherited(arguments)?1:0},onExecute:function(){},onCancel:function(){},_moveToPopup:function(a){if(this.focusedChild&&this.focusedChild.popup&&!this.focusedChild.disabled)this.onItemClick(this.focusedChild,a);else(a=this._getTopMenu())&&a._isMenuBar&&a.focusNext()},_onPopupHover:function(){this.set("selected",this.currentPopupItem);this._stopPendingCloseTimer()},onItemHover:function(a){this.activated?(this.set("selected",a),a.popup&&(!a.disabled&&!this.hover_timer)&&
(this.hover_timer=this.defer(function(){this._openItemPopup(a)},this.popupDelay))):Infinity>this.passivePopupDelay&&(this.passive_hover_timer&&this.passive_hover_timer.remove(),this.passive_hover_timer=this.defer(function(){this.onItemClick(a,{type:"click"})},this.passivePopupDelay));this._hoveredChild=a;a._set("hovering",!0)},_onChildDeselect:function(a){this._stopPopupTimer();this.currentPopupItem==a&&(this._stopPendingCloseTimer(),this._pendingClose_timer=this.defer(function(){this.currentPopupItem=
this._pendingClose_timer=null;a._closePopup()},this.popupDelay))},onItemUnhover:function(a){this._hoveredChild==a&&(this._hoveredChild=null);this.passive_hover_timer&&(this.passive_hover_timer.remove(),this.passive_hover_timer=null);a._set("hovering",!1)},_stopPopupTimer:function(){this.hover_timer&&(this.hover_timer=this.hover_timer.remove())},_stopPendingCloseTimer:function(){this._pendingClose_timer&&(this._pendingClose_timer=this._pendingClose_timer.remove())},_getTopMenu:function(){for(var a=
this;a.parentMenu;a=a.parentMenu);return a},onItemClick:function(a,b){this.passive_hover_timer&&this.passive_hover_timer.remove();this.focusChild(a);if(a.disabled)return!1;if(a.popup){this.set("selected",a);this.set("activated",!0);var c=/^key/.test(b._origType||b.type)||0==b.clientX&&0==b.clientY;this._openItemPopup(a,c)}else this.onExecute(),a._onClick?a._onClick(b):a.onClick(b)},_openItemPopup:function(a,b){if(a!=this.currentPopupItem){this.currentPopupItem&&(this._stopPendingCloseTimer(),this.currentPopupItem._closePopup());
this._stopPopupTimer();var d=a.popup;d.parentMenu=this;this.own(this._mouseoverHandle=c.once(d.domNode,"mouseover",f.hitch(this,"_onPopupHover")));var e=this;a._openPopup({parent:this,orient:this._orient||["after","before"],onCancel:function(){b&&e.focusChild(a);e._cleanUp()},onExecute:f.hitch(this,"_cleanUp",!0),onClose:function(){e._mouseoverHandle&&(e._mouseoverHandle.remove(),delete e._mouseoverHandle)}},b);this.currentPopupItem=a}},onOpen:function(){this.isShowingNow=!0;this.set("activated",
!0)},onClose:function(){this.set("activated",!1);this.set("selected",null);this.isShowingNow=!1;this.parentMenu=null},_closeChild:function(){this._stopPopupTimer();this.currentPopupItem&&(this.focused&&(l.set(this.selected.focusNode,"tabIndex",this.tabIndex),this.selected.focusNode.focus()),this.currentPopupItem._closePopup(),this.currentPopupItem=null)},_onItemFocus:function(a){if(this._hoveredChild&&this._hoveredChild!=a)this.onItemUnhover(this._hoveredChild);this.set("selected",a)},_onBlur:function(){this._cleanUp(!0);
this.inherited(arguments)},_cleanUp:function(a){this._closeChild();"undefined"==typeof this.isShowingNow&&this.set("activated",!1);a&&this.set("selected",null)}})});
//@ sourceMappingURL=_MenuBase.js.map