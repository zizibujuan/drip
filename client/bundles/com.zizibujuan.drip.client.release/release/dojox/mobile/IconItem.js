//>>built
define("dojox/mobile/IconItem","dojo/_base/declare,dojo/_base/event,dojo/_base/lang,dojo/sniff,dojo/_base/window,dojo/dom-class,dojo/dom-construct,dojo/dom-geometry,dojo/dom-style,./_ItemBase,./Badge,./TransitionEvent,./iconUtils,./lazyLoadUtils,./viewRegistry,./_css3,dojo/has!dojo-bidi?dojox/mobile/bidi/IconItem".split(","),function(k,l,g,h,m,e,d,i,j,f,n,o,p,q,r,s,t){f=k(h("dojo-bidi")?"dojox.mobile.NonBidiIconItem":"dojox.mobile.IconItem",f,{lazy:!1,requires:"",timeout:10,content:"",badge:"",badgeClass:"mblDomButtonRedBadge",
deletable:!0,deleteIcon:"",tag:"li",paramsToInherit:"transition,icon,deleteIcon,badgeClass,deleteIconTitle,deleteIconRole",baseClass:"mblIconItem",_selStartMethod:"touch",_selEndMethod:"none",destroy:function(){this.badgeObj&&delete this.badgeObj;this.inherited(arguments)},buildRendering:function(){this.domNode=this.srcNodeRef||d.create(this.tag);if(this.srcNodeRef){this._tmpNode=d.create("div");for(var a=0,b=this.srcNodeRef.childNodes.length;a<b;a++)this._tmpNode.appendChild(this.srcNodeRef.firstChild)}this.iconDivNode=
d.create("div",{className:"mblIconArea"},this.domNode);this.iconParentNode=d.create("div",{className:"mblIconAreaInner"},this.iconDivNode);this.labelNode=d.create("span",{className:"mblIconAreaTitle"},this.iconDivNode);this.inherited(arguments)},startup:function(){if(!this._started){var a=this.getParent();require([a.iconItemPaneClass],g.hitch(this,function(b){b=this.paneWidget=new b(a.iconItemPaneProps);this.containerNode=b.containerNode;if(this._tmpNode){for(var c=0,d=this._tmpNode.childNodes.length;c<
d;c++)b.containerNode.appendChild(this._tmpNode.firstChild);this._tmpNode=null}a.paneContainerWidget.addChild(b,this.getIndexInParent());b.set("label",this.label);this._clickCloseHandle=this.connect(b.closeIconNode,"onclick","_closeIconClicked");this._keydownCloseHandle=this.connect(b.closeIconNode,"onkeydown","_closeIconClicked")}));this.inherited(arguments);if(!this._isOnLine)this._isOnLine=!0,this.set("icon",void 0!==this._pendingIcon?this._pendingIcon:this.icon),delete this._pendingIcon;!this.icon&&
a.defaultIcon&&this.set("icon",a.defaultIcon);this._dragstartHandle=this.connect(this.domNode,"ondragstart",l.stop);this._keydownHandle=this.connect(this.domNode,"onkeydown","_onClick")}},highlight:function(a){e.add(this.iconDivNode,"mblVibrate");a=void 0!==a?a:this.timeout;if(0<a){var b=this;setTimeout(function(){b.unhighlight()},1E3*a)}},unhighlight:function(){e.remove(this.iconDivNode,"mblVibrate")},isOpen:function(){return this.paneWidget.isOpen()},_onClick:function(a){this.getParent().isEditing||
a&&"keydown"===a.type&&13!==a.keyCode||!1===this.onClick(a)||this.defaultClickAction(a)},onClick:function(){},_onNewWindowOpened:function(){this.set("selected",!1)},_prepareForTransition:function(a,b){if(b)return setTimeout(g.hitch(this,function(){this.set("selected",!1)}),1500),!0;"below"===this.getParent().transition&&this.isOpen()?this.close():this.open(a);return!1},_closeIconClicked:function(a){a?"keydown"===a.type&&13!==a.keyCode||!1===this.closeIconClicked(a)||setTimeout(g.hitch(this,function(){this._closeIconClicked()}),
0):this.close()},closeIconClicked:function(){},open:function(a){var b=this.getParent();if("below"===this.transition)b.single&&b.closeAll(),this._open_1();else{b._opening=this;if(b.single)this.paneWidget.closeHeaderNode.style.display="none",this.isOpen()||b.closeAll(),b.appView._heading.set("label",this.label);this.moveTo=b.id+"_mblApplView";(new o(this.domNode,this.getTransOpts(),a)).dispatch()}},_open_1:function(){this.paneWidget.show();this.unhighlight();if(this.lazy)q.instantiateLazyWidgets(this.containerNode,
this.requires),this.lazy=!1;this.scrollIntoView(this.paneWidget.domNode);this.onOpen()},scrollIntoView:function(a){var b=r.getEnclosingScrollable(a);if(b){var c=b.getDim();c.c.h>=c.d.h&&b.scrollIntoView(a,!0)}else m.global.scrollBy(0,i.position(a,!1).y)},close:function(a){if(this.isOpen()){this.set("selected",!1);if(h("css3-animations")&&!a)if(a=this.paneWidget.domNode,"below"==this.getParent().transition){e.add(a,"mblCloseContent mblShrink");var b=i.position(a,!0),c=i.position(this.domNode,!0);j.set(a,
s.add({},{transformOrigin:c.x+c.w/2-b.x+"px "+(c.y+c.h/2-b.y)+"px"}))}else e.add(a,"mblCloseContent mblShrink0");else this.paneWidget.hide();this.onClose()}},onOpen:function(){},onClose:function(){},_setLabelAttr:function(a){this.label=a;this.labelNode.innerHTML=this._cv?this._cv(a):a;this.paneWidget&&this.paneWidget.set("label",a)},_getBadgeAttr:function(){return this.badgeObj?this.badgeObj.getValue():null},_setBadgeAttr:function(a){if(!this.badgeObj)this.badgeObj=new n({fontSize:14,className:this.badgeClass}),
j.set(this.badgeObj.domNode,{position:"absolute",top:"-2px",right:"2px"});this.badgeObj.setValue(a);a?this.iconDivNode.appendChild(this.badgeObj.domNode):this.iconDivNode.removeChild(this.badgeObj.domNode)},_setDeleteIconAttr:function(a){if(this.getParent()&&(this._set("deleteIcon",a),a=this.deletable?a:"",this.deleteIconNode=p.setIcon(a,this.deleteIconPos,this.deleteIconNode,this.deleteIconTitle||this.alt,this.iconDivNode)))e.add(this.deleteIconNode,"mblIconItemDeleteIcon"),this.deleteIconRole&&
this.deleteIconNode.setAttribute("role",this.deleteIconRole)},_setContentAttr:function(a){var b;if(this.paneWidget)b=this.paneWidget.containerNode;else{if(!this._tmpNode)this._tmpNode=d.create("div");b=this._tmpNode}"object"===typeof a?(d.empty(b),b.appendChild(a)):b.innerHTML=a},_setSelectedAttr:function(a){this.inherited(arguments);j.set(this.iconNode,"opacity",a?this.getParent().pressedIconOpacity:1)}});return h("dojo-bidi")?k("dojox.mobile.IconItem",[f,t]):f});