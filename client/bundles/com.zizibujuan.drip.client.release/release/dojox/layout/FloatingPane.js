//>>built
require({cache:{"url:dojox/layout/resources/FloatingPane.html":'<div class="dojoxFloatingPane" id="${id}">\n	<div tabindex="0" role="button" class="dojoxFloatingPaneTitle" dojoAttachPoint="focusNode">\n		<span dojoAttachPoint="closeNode" dojoAttachEvent="onclick: close" class="dojoxFloatingCloseIcon"></span>\n		<span dojoAttachPoint="maxNode" dojoAttachEvent="onclick: maximize" class="dojoxFloatingMaximizeIcon">&thinsp;</span>\n		<span dojoAttachPoint="restoreNode" dojoAttachEvent="onclick: _restore" class="dojoxFloatingRestoreIcon">&thinsp;</span>	\n		<span dojoAttachPoint="dockNode" dojoAttachEvent="onclick: minimize" class="dojoxFloatingMinimizeIcon">&thinsp;</span>\n		<span dojoAttachPoint="titleNode" class="dijitInline dijitTitleNode"></span>\n	</div>\n	<div dojoAttachPoint="canvas" class="dojoxFloatingPaneCanvas">\n		<div dojoAttachPoint="containerNode" role="region" tabindex="-1" class="${contentClass}">\n		</div>\n		<span dojoAttachPoint="resizeHandle" class="dojoxFloatingResizeHandle"></span>\n	</div>\n</div>\n'}}),define("dojox/layout/FloatingPane",["dojo/_base/kernel","dojo/_base/lang","dojo/_base/window","dojo/_base/declare","dojo/_base/fx","dojo/_base/connect","dojo/_base/array","dojo/_base/sniff","dojo/window","dojo/dom","dojo/dom-class","dojo/dom-geometry","dojo/dom-construct","dijit/_TemplatedMixin","dijit/_Widget","dijit/BackgroundIframe","dojo/dnd/Moveable","./ContentPane","./ResizeHandle","dojo/text!./resources/FloatingPane.html","./Dock"],function(kernel,lang,winUtil,declare,baseFx,connectUtil,arrayUtil,has,windowLib,dom,domClass,domGeom,domConstruct,TemplatedMixin,Widget,BackgroundIframe,Moveable,ContentPane,ResizeHandle,template,Dock){kernel.experimental("dojox.layout.FloatingPane");var FloatingPane=declare("dojox.layout.FloatingPane",[ContentPane,TemplatedMixin],{closable:!0,dockable:!0,resizable:!1,maxable:!1,resizeAxis:"xy",title:"",dockTo:"",duration:400,contentClass:"dojoxFloatingPaneContent",_showAnim:null,_hideAnim:null,_dockNode:null,_restoreState:{},_allFPs:[],_startZ:100,templateString:template,attributeMap:lang.delegate(Widget.prototype.attributeMap,{title:{type:"innerHTML",node:"titleNode"}}),postCreate:function(){this.inherited(arguments),new Moveable(this.domNode,{handle:this.focusNode}),this.dockable||(this.dockNode.style.display="none"),this.closable||(this.closeNode.style.display="none"),this.maxable||(this.maxNode.style.display="none",this.restoreNode.style.display="none"),this.resizable?this.domNode.style.width=domGeom.getMarginBox(this.domNode).w+"px":this.resizeHandle.style.display="none",this._allFPs.push(this),this.domNode.style.position="absolute",this.bgIframe=new BackgroundIframe(this.domNode),this._naturalState=domGeom.position(this.domNode)},startup:function(){if(this._started)return;this.inherited(arguments),this.resizable&&(has("ie")?this.canvas.style.overflow="auto":this.containerNode.style.overflow="auto",this._resizeHandle=new ResizeHandle({targetId:this.id,resizeAxis:this.resizeAxis},this.resizeHandle));if(this.dockable){var tmpName=this.dockTo;this.dockTo?this.dockTo=dijit.byId(this.dockTo):this.dockTo=dijit.byId("dojoxGlobalFloatingDock");if(!this.dockTo){var tmpId,tmpNode;tmpName?(tmpId=tmpName,tmpNode=dom.byId(tmpName)):(tmpNode=domConstruct.create("div",null,winUtil.body()),domClass.add(tmpNode,"dojoxFloatingDockDefault"),tmpId="dojoxGlobalFloatingDock"),this.dockTo=new Dock({id:tmpId,autoPosition:"south"},tmpNode),this.dockTo.startup()}(this.domNode.style.display=="none"||this.domNode.style.visibility=="hidden")&&this.minimize()}this.connect(this.focusNode,"onmousedown","bringToTop"),this.connect(this.domNode,"onmousedown","bringToTop"),this.resize(domGeom.position(this.domNode)),this._started=!0},setTitle:function(title){kernel.deprecated("pane.setTitle","Use pane.set('title', someTitle)","2.0"),this.set("title",title)},close:function(){if(!this.closable)return;connectUtil.unsubscribe(this._listener),this.hide(lang.hitch(this,function(){this.destroyRecursive()}))},hide:function(callback){baseFx.fadeOut({node:this.domNode,duration:this.duration,onEnd:lang.hitch(this,function(){this.domNode.style.display="none",this.domNode.style.visibility="hidden",this.dockTo&&this.dockable&&this.dockTo._positionDock(null),callback&&callback()})}).play()},show:function(callback){var anim=baseFx.fadeIn({node:this.domNode,duration:this.duration,beforeBegin:lang.hitch(this,function(){this.domNode.style.display="",this.domNode.style.visibility="visible",this.dockTo&&this.dockable&&this.dockTo._positionDock(null),typeof callback=="function"&&callback(),this._isDocked=!1,this._dockNode&&(this._dockNode.destroy(),this._dockNode=null)})}).play();this.resize(domGeom.position(this.domNode)),this._onShow()},minimize:function(){this._isDocked||this.hide(lang.hitch(this,"_dock"))},maximize:function(){if(this._maximized)return;this._naturalState=domGeom.position(this.domNode),this._isDocked&&(this.show(),setTimeout(lang.hitch(this,"maximize"),this.duration)),domClass.add(this.focusNode,"floatingPaneMaximized"),this.resize(windowLib.getBox()),this._maximized=!0},_restore:function(){this._maximized&&(this.resize(this._naturalState),domClass.remove(this.focusNode,"floatingPaneMaximized"),this._maximized=!1)},_dock:function(){!this._isDocked&&this.dockable&&(this._dockNode=this.dockTo.addNode(this),this._isDocked=!0)},resize:function(dim){dim=dim||this._naturalState,this._currentState=dim;var dns=this.domNode.style;"t"in dim?dns.top=dim.t+"px":"y"in dim&&(dns.top=dim.y+"px"),"l"in dim?dns.left=dim.l+"px":"x"in dim&&(dns.left=dim.x+"px"),dns.width=dim.w+"px",dns.height=dim.h+"px";var mbCanvas={l:0,t:0,w:dim.w,h:dim.h-this.focusNode.offsetHeight};domGeom.setMarginBox(this.canvas,mbCanvas),this._checkIfSingleChild(),this._singleChild&&this._singleChild.resize&&this._singleChild.resize(mbCanvas)},bringToTop:function(){var windows=arrayUtil.filter(this._allFPs,function(i){return i!==this},this);windows.sort(function(a,b){return a.domNode.style.zIndex-b.domNode.style.zIndex}),windows.push(this),arrayUtil.forEach(windows,function(w,x){w.domNode.style.zIndex=this._startZ+x*2,domClass.remove(w.domNode,"dojoxFloatingPaneFg")},this),domClass.add(this.domNode,"dojoxFloatingPaneFg")},destroy:function(){this._allFPs.splice(arrayUtil.indexOf(this._allFPs,this),1),this._resizeHandle&&this._resizeHandle.destroy(),this.inherited(arguments)}});return FloatingPane})