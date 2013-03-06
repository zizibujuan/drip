//>>built
define("dijit/layout/LayoutContainer","dojo/_base/array,dojo/_base/declare,dojo/dom-class,dojo/dom-style,dojo/_base/kernel,dojo/_base/lang,../_WidgetBase,./_LayoutWidget,./utils".split(","),function(d,c,f,g,m,i,j,k,l){c=c("dijit.layout.LayoutContainer",k,{design:"headline",baseClass:"dijitLayoutContainer",startup:function(){this._started||(d.forEach(this.getChildren(),this._setupChild,this),this.inherited(arguments))},_setupChild:function(a){this.inherited(arguments);var b=a.region;if(b){f.add(a.domNode,
this.baseClass+"Pane");var h=this.isLeftToRight();"leading"==b&&(b=h?"left":"right");"trailing"==b&&(b=h?"right":"left");a.region=b}},_getOrderedChildren:function(){var a=d.map(this.getChildren(),function(b,a){return{pane:b,weight:["center"==b.region?Infinity:0,b.layoutPriority,("sidebar"==this.design?1:-1)*(/top|bottom/.test(b.region)?1:-1),a]}},this);a.sort(function(b,a){for(var c=b.weight,d=a.weight,e=0;e<c.length;e++)if(c[e]!=d[e])return c[e]-d[e];return 0});return d.map(a,function(a){return a.pane})},
layout:function(){l.layoutChildren(this.domNode,this._contentBox,this._getOrderedChildren())},addChild:function(a,b){this.inherited(arguments);this._started&&this.layout()},removeChild:function(a){this.inherited(arguments);this._started&&this.layout();f.remove(a.domNode,this.baseClass+"Pane");g.set(a.domNode,{top:"auto",bottom:"auto",left:"auto",right:"auto",position:"static"});g.set(a.domNode,/top|bottom/.test(a.region)?"width":"height","auto")}});c.ChildWidgetProperties={region:"",layoutAlign:"",
layoutPriority:0};i.extend(j,c.ChildWidgetProperties);return c});