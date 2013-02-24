//>>built
define("dojox/mobile/_EditableListMixin","dojo/_base/array,dojo/_base/connect,dojo/_base/declare,dojo/_base/event,dojo/_base/window,dojo/dom-class,dojo/dom-geometry,dojo/dom-style,dojo/touch,dijit/registry,./ListItem".split(","),function(e,i,l,m,n,f,g,j,h,k,o){return l("dojox.mobile._EditableListMixin",null,{rightIconForEdit:"mblDomButtonGrayKnob",deleteIconForEdit:"mblDomButtonRedCircleMinus",isEditing:!1,destroy:function(){this._blankItem&&this._blankItem.destroy();this.inherited(arguments)},_setupMoveItem:function(a){j.set(a,
{width:g.getContentBox(a).w+"px",top:a.offsetTop+"px"});f.add(a,"mblListItemFloat")},_resetMoveItem:function(a){setTimeout(function(){f.remove(a,"mblListItemFloat");j.set(a,{width:"",top:""})},0)},_onClick:function(a){if(!(a&&"keydown"===a.type&&13!==a.keyCode||!1===this.onClick(a)))for(var b=k.getEnclosingWidget(a.target),a=a.target;a!==b.domNode;a=a.parentNode)if(a===b.deleteIconNode){i.publish("/dojox/mobile/deleteListItem",[b]);this.onDeleteItem(b);break}},onClick:function(){},_onTouchStart:function(a){if(!(1>=
this.getChildren().length)){if(!this._blankItem)this._blankItem=new o;var b=this._movingItem=k.getEnclosingWidget(a.target);this._startIndex=this.getIndexOfChild(b);for(var c=!1,d=a.target;d!==b.domNode;d=d.parentNode)if(d===b.rightIconNode){c=!0;break}if(c){c=(c=b.getNextSibling())?c.domNode:null;this.containerNode.insertBefore(this._blankItem.domNode,c);this._setupMoveItem(b.domNode);this.containerNode.appendChild(b.domNode);if(!this._conn)this._conn=[this.connect(this.domNode,h.move,"_onTouchMove"),
this.connect(n.doc,h.release,"_onTouchEnd")];this._pos=[];e.forEach(this.getChildren(),function(a){this._pos.push(g.position(a.domNode,!0).y)},this);this.touchStartY=a.touches?a.touches[0].pageY:a.pageY;this._startTop=g.getMarginBox(b.domNode).t;m.stop(a)}}},_onTouchMove:function(a){for(var a=a.touches?a.touches[0].pageY:a.pageY,b=this._pos.length-1,c=1;c<this._pos.length;c++)if(a<this._pos[c]){b=c-1;break}b=this.getChildren()[b];c=this._blankItem;if(b!==c){var d=b.domNode.parentNode;b.getIndexInParent()<
c.getIndexInParent()?d.insertBefore(c.domNode,b.domNode):d.insertBefore(b.domNode,c.domNode)}this._movingItem.domNode.style.top=this._startTop+(a-this.touchStartY)+"px"},_onTouchEnd:function(){var a=this._startIndex,b=this.getIndexOfChild(this._blankItem),c=this._blankItem.getNextSibling(),c=c?c.domNode:null;null===c&&b--;this.containerNode.insertBefore(this._movingItem.domNode,c);this.containerNode.removeChild(this._blankItem.domNode);this._resetMoveItem(this._movingItem.domNode);e.forEach(this._conn,
i.disconnect);this._conn=null;this.onMoveItem(this._movingItem,a,b)},startEdit:function(){this.isEditing=!0;f.add(this.domNode,"mblEditableRoundRectList");e.forEach(this.getChildren(),function(a){if(!a.deleteIconNode)a.set("rightIcon",this.rightIconForEdit),a.set("deleteIcon",this.deleteIconForEdit),a.deleteIconNode.tabIndex=a.tabIndex;a.rightIconNode.style.display="";a.deleteIconNode.style.display="";if("undefined"!=typeof a.rightIconNode.style.msTouchAction)a.rightIconNode.style.msTouchAction="none"},
this);if(!this._handles)this._handles=[this.connect(this.domNode,h.press,"_onTouchStart"),this.connect(this.domNode,"onclick","_onClick"),this.connect(this.domNode,"onkeydown","_onClick")];this.onStartEdit()},endEdit:function(){f.remove(this.domNode,"mblEditableRoundRectList");e.forEach(this.getChildren(),function(a){a.rightIconNode.style.display="none";a.deleteIconNode.style.display="none";if("undefined"!=typeof a.rightIconNode.style.msTouchAction)a.rightIconNode.style.msTouchAction="auto"});if(this._handles)e.forEach(this._handles,
this.disconnect,this),this._handles=null;this.isEditing=!1;this.onEndEdit()},onDeleteItem:function(){},onMoveItem:function(){},onStartEdit:function(){},onEndEdit:function(){}})});