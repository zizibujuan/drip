//>>built
define("dojox/mobile/ScrollableView",["dojo/_base/array","dojo/_base/declare","dojo/dom-class","dojo/dom-construct","dijit/registry","./View","./_ScrollableMixin"],function(array,declare,domClass,domConstruct,registry,View,ScrollableMixin){return declare("dojox.mobile.ScrollableView",[View,ScrollableMixin],{scrollableParams:null,keepScrollPos:!1,constructor:function(){this.scrollableParams={noResize:!0}},buildRendering:function(){this.inherited(arguments),domClass.add(this.domNode,"mblScrollableView"),this.domNode.style.overflow="hidden",this.domNode.style.top="0px",this.containerNode=domConstruct.create("div",{className:"mblScrollableViewContainer"},this.domNode),this.containerNode.style.position="absolute",this.containerNode.style.top="0px",this.scrollDir==="v"&&(this.containerNode.style.width="100%")},startup:function(){if(this._started)return;this.reparent(),this.inherited(arguments)},resize:function(){this.inherited(arguments),array.forEach(this.getChildren(),function(child){child.resize&&child.resize()})},isTopLevel:function(e){var parent=this.getParent&&this.getParent();return!parent||!parent.resize},addFixedBar:function(widget){var c=widget.domNode,fixed=this.checkFixedBar(c,!0);if(!fixed)return;this.domNode.appendChild(c),fixed==="top"?(this.fixedHeaderHeight=c.offsetHeight,this.isLocalHeader=!0):fixed==="bottom"&&(this.fixedFooterHeight=c.offsetHeight,this.isLocalFooter=!0,c.style.bottom="0px"),this.resize()},reparent:function(){var i,idx,len,c;for(i=0,idx=0,len=this.domNode.childNodes.length;i<len;i++){c=this.domNode.childNodes[idx];if(c===this.containerNode||this.checkFixedBar(c,!0)){idx++;continue}this.containerNode.appendChild(this.domNode.removeChild(c))}},onAfterTransitionIn:function(moveTo,dir,transition,context,method){this.flashScrollBar()},getChildren:function(){var children=this.inherited(arguments),fixedWidget;return this.fixedHeader&&this.fixedHeader.parentNode===this.domNode&&(fixedWidget=registry.byNode(this.fixedHeader),fixedWidget&&children.push(fixedWidget)),this.fixedFooter&&this.fixedFooter.parentNode===this.domNode&&(fixedWidget=registry.byNode(this.fixedFooter),fixedWidget&&children.push(fixedWidget)),children}})})