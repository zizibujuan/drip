//>>built
define("dojox/mobile/ViewController","dojo/_base/kernel,dojo/_base/array,dojo/_base/connect,dojo/_base/declare,dojo/_base/lang,dojo/_base/window,dojo/_base/Deferred,dojo/dom,dojo/dom-class,dojo/dom-construct,dojo/on,dojo/ready,dijit/registry,./ProgressIndicator,./TransitionEvent,./viewRegistry".split(","),function(s,t,m,n,i,h,o,p,u,v,q,r,f,w,k,j){var e=n("dojox.mobile.ViewController",null,{dataHandlerClass:"dojox/mobile/dh/DataHandler",dataSourceClass:"dojox/mobile/dh/UrlDataSource",fileTypeMapClass:"dojox/mobile/dh/SuffixFileTypeMap",
constructor:function(){this.viewMap={};r(i.hitch(this,function(){q(h.body(),"startTransition",i.hitch(this,"onStartTransition"))}))},findTransitionViews:function(b){if(!b)return[];b.match(/^#?([^&?]+)(.*)/);var b=RegExp.$2,a=f.byId(RegExp.$1);if(!a)return[];for(var d=a.getParent();d;d=d.getParent())if(d.isVisible&&!d.isVisible()){var c=a.getShowingView();c&&c.id!==a.id&&a.show();a=d}return[a.getShowingView(),a,b]},openExternalView:function(b,a){var d=new o,c=this.viewMap[b.url];if(c)return b.moveTo=
c,b.noTransition?f.byId(c).hide():(new k(h.body(),b)).dispatch(),d.resolve(!0),d;for(var l=null,c=a.childNodes.length-1;0<=c;c--){var g=a.childNodes[c];if(1===g.nodeType&&"bottom"===(g.getAttribute("fixed")||g.getAttribute("data-mobile-fixed")||f.byNode(g)&&f.byNode(g).fixed)){l=g;break}}require([b.dataHandlerClass||this.dataHandlerClass,b.dataSourceClass||this.dataSourceClass,b.fileTypeMapClass||this.fileTypeMapClass],i.hitch(this,function(c,g,e){c=new c(new g(b.data||b.url),a,l);e=b.contentType||
e.getContentType(b.url)||"html";c.processData(e,i.hitch(this,function(a){a?(this.viewMap[b.url]=b.moveTo=a,b.noTransition?f.byId(a).hide():(new k(h.body(),b)).dispatch(),d.resolve(!0)):d.reject("Failed to load "+b.url)}))}));return d},onStartTransition:function(b){b.preventDefault();if(b.detail){var a=b.detail;if(a.moveTo||a.href||a.url||a.scene)if(a.url&&!a.moveTo){var d=a.urlTarget,c=f.byId(d),d=c&&c.containerNode||p.byId(d);d||(d=(c=j.getEnclosingView(b.target))&&c.domNode.parentNode||h.body());
this.openExternalView(a,d)}else if(a.href)if(a.hrefTarget)h.global.open(a.href,a.hrefTarget);else{for(c=j.getEnclosingView(b.target);c;c=j.getParentView(c))d=c;d&&d.performTransition(null,a.transitionDir,a.transition,b.target,function(){location.href=a.href})}else if(a.scene)m.publish("/dojox/mobile/app/pushScene",[a.scene]);else{var e=this.findTransitionViews(a.moveTo),d=e[0],c=e[1],e=e[2];if(!location.hash&&!a.hashchange)j.initialView=d;if(a.moveTo&&c)a.moveTo=("#"===a.moveTo.charAt(0)?"#"+c.id:
c.id)+e;if(d&&!(a.moveTo&&d===f.byId(a.moveTo.replace(/^#?([^&?]+).*/,"$1")))){if((b=f.getEnclosingWidget(b.target))&&b.callback)a.context=b,a.method=b.callback;d.performTransition(a)}}}}});e._instance=new e;e.getInstance=function(){return e._instance};return e});