//>>built
define("dojox/mobile/SwapView","dojo/_base/array,dojo/_base/connect,dojo/_base/declare,dojo/dom,dojo/dom-class,dijit/registry,./View,./_ScrollableMixin,./sniff,./_css3,dojo/has!dojo-bidi?dojox/mobile/bidi/SwapView".split(","),function(l,m,n,o,e,j,f,p,k,q,r){f=n(k("dojo-bidi")?"dojox.mobile.NonBidiSwapView":"dojox.mobile.SwapView",[f,p],{scrollDir:"f",weight:1.2,buildRendering:function(){this.inherited(arguments);e.add(this.domNode,"mblSwapView");this.setSelectable(this.domNode,!1);this.containerNode=
this.domNode;this.subscribe("/dojox/mobile/nextPage","handleNextPage");this.subscribe("/dojox/mobile/prevPage","handlePrevPage");this.noResize=!0},startup:function(){this._started||this.inherited(arguments)},resize:function(){this.inherited(arguments);l.forEach(this.getChildren(),function(a){a.resize&&a.resize()})},onTouchStart:function(a){var c=this.domNode.offsetTop,b=this.nextView(this.domNode);if(b)b.stopAnimation(),e.add(b.domNode,"mblIn"),b.containerNode.style.paddingTop=c+"px";if(b=this.previousView(this.domNode))b.stopAnimation(),
e.add(b.domNode,"mblIn"),b.containerNode.style.paddingTop=c+"px";this.inherited(arguments)},handleNextPage:function(a){this.domNode.parentNode!==(a.refId&&o.byId(a.refId)||a.domNode).parentNode||this.getShowingView()!==this||this.goTo(1)},handlePrevPage:function(a){this.domNode.parentNode!==(a.refId&&o.byId(a.refId)||a.domNode).parentNode||this.getShowingView()!==this||this.goTo(-1)},goTo:function(a,c){var b=c?j.byId(c):1==a?this.nextView(this.domNode):this.previousView(this.domNode);if(b&&b!==this)this.stopAnimation(),
b.stopAnimation(),this.domNode._isShowing=!1,b.domNode._isShowing=!0,this.performTransition(b.id,a,"slide",null,function(){m.publish("/dojox/mobile/viewChanged",[b])})},isSwapView:function(a){return a&&1===a.nodeType&&e.contains(a,"mblSwapView")},nextView:function(a){for(a=a.nextSibling;a;a=a.nextSibling)if(this.isSwapView(a))return j.byNode(a);return null},previousView:function(a){for(a=a.previousSibling;a;a=a.previousSibling)if(this.isSwapView(a))return j.byNode(a);return null},scrollTo:function(a){if(!this._beingFlipped){var c,
b;0>a.x?(c=this.nextView(this.domNode),b=a.x+this.domNode.offsetWidth):(c=this.previousView(this.domNode),b=a.x-this.domNode.offsetWidth);if(c){if("none"===c.domNode.style.display)c.domNode.style.display="",c.resize();c._beingFlipped=!0;c.scrollTo({x:b});c._beingFlipped=!1}}this.inherited(arguments)},findDisp:function(a){if(!e.contains(a,"mblSwapView"))return this.inherited(arguments);if(!a.parentNode)return null;for(var c=a.parentNode.childNodes,b=0;b<c.length;b++){var i=c[b];if(1===i.nodeType&&
e.contains(i,"mblSwapView")&&!e.contains(i,"mblIn")&&"none"!==i.style.display)return i}return a},slideTo:function(a,c,b,e){if(!this._beingFlipped){var h=this.domNode.offsetWidth,f=e||this.getPos(),d,g;if(0>f.x)if(d=this.nextView(this.domNode),f.x<-h/4){if(d)a.x=-h,g=0}else d&&(g=h);else if(d=this.previousView(this.domNode),f.x>h/4){if(d)a.x=h,g=0}else d&&(g=-h);if(d)d._beingFlipped=!0,d.slideTo({x:g},c,b),d._beingFlipped=!1,d.domNode._isShowing=d&&0===g;this.domNode._isShowing=!(d&&0===g)}this.inherited(arguments)},
onAnimationEnd:function(a){(!a||!a.target||!e.contains(a.target,"mblScrollableScrollTo2"))&&this.inherited(arguments)},onFlickAnimationEnd:function(a){if(!a||!a.target||e.contains(a.target,"mblScrollableScrollTo2"))if(this.inherited(arguments),this.domNode._isShowing)l.forEach(this.domNode.parentNode.childNodes,function(a){if(this.isSwapView(a)&&(e.remove(a,"mblIn"),!a._isShowing))a.style.display="none",a.style[q.name("transform")]="",a.style.left="0px"},this),m.publish("/dojox/mobile/viewChanged",
[this]),this.containerNode.style.paddingTop="";else if(!k("css3-animations"))this.containerNode.style.left="0px"}});return k("dojo-bidi")?n("dojox.mobile.SwapView",[f,r]):f});