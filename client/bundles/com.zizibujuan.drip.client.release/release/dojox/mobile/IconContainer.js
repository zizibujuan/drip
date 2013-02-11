//>>built
define("dojox/mobile/IconContainer","dojo/_base/array,dojo/_base/declare,dojo/_base/lang,dojo/_base/window,dojo/dom-construct,dijit/_Contained,dijit/_Container,dijit/_WidgetBase,./IconItem,./Heading,./View".split(","),function(h,e,f,i,c,j,k,l,o,m,g){return e("dojox.mobile.IconContainer",[l,k,j],{defaultIcon:"",transition:"below",pressedIconOpacity:0.4,iconBase:"",iconPos:"",back:"Home",label:"My Application",single:!1,editable:!1,tag:"ul",baseClass:"mblIconContainer",editableMixinClass:"dojox/mobile/_EditableIconMixin",
iconItemPaneContainerClass:"dojox/mobile/Container",iconItemPaneContainerProps:null,iconItemPaneClass:"dojox/mobile/_IconItemPane",iconItemPaneProps:null,buildRendering:function(){this.domNode=this.containerNode=this.srcNodeRef||c.create(this.tag);this._terminator=c.create("ul"===this.tag?"li":"div",{className:"mblIconItemTerminator"},this.domNode);this.inherited(arguments)},postCreate:function(){this.editable&&!this.startEdit&&require([this.editableMixinClass],f.hitch(this,function(a){e.safeMixin(this,
new a);this.set("editable",this.editable)}))},startup:function(){this._started||(require([this.iconItemPaneContainerClass],f.hitch(this,function(a){this.paneContainerWidget=new a(this.iconItemPaneContainerProps);if("below"===this.transition)c.place(this.paneContainerWidget.domNode,this.domNode,"after");else{var a=this.appView=new g({id:this.id+"_mblApplView"}),n=this;a.onAfterTransitionIn=function(){n._opening._open_1()};a.domNode.style.visibility="hidden";var b=a._heading=new m({back:this._cv?this._cv(this.back):
this.back,label:this._cv?this._cv(this.label):this.label,moveTo:this.domNode.parentNode.id,transition:"zoomIn"==this.transition?"zoomOut":this.transition});a.addChild(b);a.addChild(this.paneContainerWidget);for(var d,b=this.getParent();b;b=b.getParent())if(b instanceof g){d=b.domNode.parentNode;break}d||(d=i.body());d.appendChild(a.domNode);a.startup()}})),this.inherited(arguments))},closeAll:function(){h.forEach(this.getChildren(),function(a){a.close(!0)},this)},addChild:function(a,c){this.inherited(arguments);
this._started&&a.paneWidget&&!a.paneWidget.getParent()&&this.paneContainerWidget.addChild(a.paneWidget,c);this.domNode.appendChild(this._terminator)},removeChild:function(a){this.paneContainerWidget.removeChild("number"==typeof a?a:a.getIndexInParent());this.inherited(arguments)},_setLabelAttr:function(a){if(this.appView)this.label=a,this.appView._heading.set("label",this._cv?this._cv(a):a)}})});