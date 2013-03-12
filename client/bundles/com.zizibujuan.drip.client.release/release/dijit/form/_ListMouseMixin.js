//>>built
define("dijit/form/_ListMouseMixin",["dojo/_base/declare","dojo/on","dojo/touch","./_ListBase"],function(e,f,b,g){return e("dijit.form._ListMouseMixin",g,{postCreate:function(){this.inherited(arguments);this.domNode.dojoClick=!0;this.own(f(this.domNode,"mousedown",function(c){c.preventDefault()}));this._listConnect("click","_onClick");this._listConnect(b.press,"_onMouseDown");this._listConnect(b.release,"_onMouseUp");this._listConnect(b.over,"_onMouseOver");this._listConnect(b.out,"_onMouseOut")},
_onClick:function(c,a){this._setSelectedAttr(a);this._deferredClick&&this._deferredClick.remove();this._deferredClick=this.defer(function(){this._deferredClick=null;this.onClick(a)})},_onMouseDown:function(c,a){if(this._hoveredNode)this.onUnhover(this._hoveredNode),this._hoveredNode=null;this._isDragging=!0;this._setSelectedAttr(a)},_onMouseUp:function(c,a){this._isDragging=!1;var b=this.selected,d=this._hoveredNode;b&&a==b?this.defer(function(){this._onClick(c,b)}):d&&this.defer(function(){this._onClick(c,
d)})},_onMouseOut:function(){if(this._hoveredNode)this.onUnhover(this._hoveredNode),this._hoveredNode=null;if(this._isDragging)this._cancelDrag=(new Date).getTime()+1E3},_onMouseOver:function(b,a){if(this._cancelDrag){if((new Date).getTime()>this._cancelDrag)this._isDragging=!1;this._cancelDrag=null}this._hoveredNode=a;this.onHover(a);this._isDragging&&this._setSelectedAttr(a)}})});