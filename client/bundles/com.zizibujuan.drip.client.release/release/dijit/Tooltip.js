//>>built
define("dijit/Tooltip","dojo/_base/array dojo/_base/declare dojo/_base/fx dojo/dom dojo/dom-class dojo/dom-geometry dojo/dom-style dojo/_base/lang dojo/mouse dojo/on dojo/sniff ./_base/manager ./place ./_Widget ./_TemplatedMixin ./BackgroundIframe dojo/text!./templates/Tooltip.html ./main".split(" "),function(b,r,s,t,w,n,x,d,u,k,p,y,z,v,A,B,C,m){var q=r("dijit._MasterTooltip",[v,A],{duration:y.defaultDuration,templateString:C,postCreate:function(){this.ownerDocumentBody.appendChild(this.domNode);
this.bgIframe=new B(this.domNode);this.fadeIn=s.fadeIn({node:this.domNode,duration:this.duration,onEnd:d.hitch(this,"_onShow")});this.fadeOut=s.fadeOut({node:this.domNode,duration:this.duration,onEnd:d.hitch(this,"_onHide")})},show:function(a,e,h,f,l){if(!this.aroundNode||!(this.aroundNode===e&&this.containerNode.innerHTML==a))if("playing"==this.fadeOut.status())this._onDeck=arguments;else{this.containerNode.innerHTML=a;l&&this.set("textDir",l);this.containerNode.align=f?"right":"left";var g=z.around(this.domNode,
e,h&&h.length?h:c.defaultPosition,!f,d.hitch(this,"orient")),b=g.aroundNodePos;"M"==g.corner.charAt(0)&&"M"==g.aroundCorner.charAt(0)?(this.connectorNode.style.top=b.y+(b.h-this.connectorNode.offsetHeight>>1)-g.y+"px",this.connectorNode.style.left=""):"M"==g.corner.charAt(1)&&"M"==g.aroundCorner.charAt(1)?this.connectorNode.style.left=b.x+(b.w-this.connectorNode.offsetWidth>>1)-g.x+"px":(this.connectorNode.style.left="",this.connectorNode.style.top="");x.set(this.domNode,"opacity",0);this.fadeIn.play();
this.isShowingNow=!0;this.aroundNode=e}},orient:function(a,e,b,f,c){this.connectorNode.style.top="";var g=f.h;f=f.w;a.className="dijitTooltip "+{"MR-ML":"dijitTooltipRight","ML-MR":"dijitTooltipLeft","TM-BM":"dijitTooltipAbove","BM-TM":"dijitTooltipBelow","BL-TL":"dijitTooltipBelow dijitTooltipABLeft","TL-BL":"dijitTooltipAbove dijitTooltipABLeft","BR-TR":"dijitTooltipBelow dijitTooltipABRight","TR-BR":"dijitTooltipAbove dijitTooltipABRight","BR-BL":"dijitTooltipRight","BL-BR":"dijitTooltipLeft"}[e+
"-"+b];this.domNode.style.width="auto";var d=n.position(this.domNode);9==p("ie")&&(d.w+=2);var k=Math.min(Math.max(f,1),d.w);n.setMarginBox(this.domNode,{w:k});"B"==b.charAt(0)&&"B"==e.charAt(0)?(a=n.position(a),e=this.connectorNode.offsetHeight,a.h>g?(this.connectorNode.style.top=g-(c.h+e>>1)+"px",this.connectorNode.style.bottom=""):(this.connectorNode.style.bottom=Math.min(Math.max(c.h/2-e/2,0),a.h-e)+"px",this.connectorNode.style.top="")):(this.connectorNode.style.top="",this.connectorNode.style.bottom=
"");return Math.max(0,d.w-f)},_onShow:function(){p("ie")&&(this.domNode.style.filter="")},hide:function(a){this._onDeck&&this._onDeck[1]==a?this._onDeck=null:this.aroundNode===a&&(this.fadeIn.stop(),this.isShowingNow=!1,this.aroundNode=null,this.fadeOut.play())},_onHide:function(){this.domNode.style.cssText="";this.containerNode.innerHTML="";this._onDeck&&(this.show.apply(this,this._onDeck),this._onDeck=null)}});p("dojo-bidi")&&q.extend({_setAutoTextDir:function(a){this.applyTextDir(a);b.forEach(a.children,
function(a){this._setAutoTextDir(a)},this)},_setTextDirAttr:function(a){this._set("textDir",a);"auto"==a?this._setAutoTextDir(this.containerNode):this.containerNode.dir=this.textDir}});m.showTooltip=function(a,e,h,f,d){h&&(h=b.map(h,function(a){return{after:"after-centered",before:"before-centered"}[a]||a}));c._masterTT||(m._masterTT=c._masterTT=new q);return c._masterTT.show(a,e,h,f,d)};m.hideTooltip=function(a){return c._masterTT&&c._masterTT.hide(a)};var c=r("dijit.Tooltip",v,{label:"",showDelay:400,
connectId:[],position:[],selector:"",_setConnectIdAttr:function(a){b.forEach(this._connections||[],function(a){b.forEach(a,function(a){a.remove()})},this);this._connectIds=b.filter(d.isArrayLike(a)?a:a?[a]:[],function(a){return t.byId(a,this.ownerDocument)},this);this._connections=b.map(this._connectIds,function(a){a=t.byId(a,this.ownerDocument);var b=this.selector,c=b?function(a){return k.selector(b,a)}:function(a){return a},l=this;return[k(a,c(u.enter),function(){l._onHover(this)}),k(a,c("focusin"),
function(){l._onHover(this)}),k(a,c(u.leave),d.hitch(l,"_onUnHover")),k(a,c("focusout"),d.hitch(l,"_onUnHover"))]},this);this._set("connectId",a)},addTarget:function(a){a=a.id||a;-1==b.indexOf(this._connectIds,a)&&this.set("connectId",this._connectIds.concat(a))},removeTarget:function(a){a=b.indexOf(this._connectIds,a.id||a);0<=a&&(this._connectIds.splice(a,1),this.set("connectId",this._connectIds))},buildRendering:function(){this.inherited(arguments);w.add(this.domNode,"dijitTooltipData")},startup:function(){this.inherited(arguments);
var a=this.connectId;b.forEach(d.isArrayLike(a)?a:[a],this.addTarget,this)},getContent:function(a){return this.label||this.domNode.innerHTML},_onHover:function(a){this._showTimer||(this._showTimer=this.defer(function(){this.open(a)},this.showDelay))},_onUnHover:function(){this._showTimer&&(this._showTimer.remove(),delete this._showTimer);this.close()},open:function(a){this._showTimer&&(this._showTimer.remove(),delete this._showTimer);var b=this.getContent(a);b&&(c.show(b,a,this.position,!this.isLeftToRight(),
this.textDir),this._connectNode=a,this.onShow(a,this.position))},close:function(){this._connectNode&&(c.hide(this._connectNode),delete this._connectNode,this.onHide());this._showTimer&&(this._showTimer.remove(),delete this._showTimer)},onShow:function(){},onHide:function(){},destroy:function(){this.close();b.forEach(this._connections||[],function(a){b.forEach(a,function(a){a.remove()})},this);this.inherited(arguments)}});c._MasterTooltip=q;c.show=m.showTooltip;c.hide=m.hideTooltip;c.defaultPosition=
["after-centered","before-centered"];return c});require({cache:{"url:dijit/templates/Tooltip.html":'\x3cdiv class\x3d"dijitTooltip dijitTooltipLeft" id\x3d"dojoTooltip"\n\t\x3e\x3cdiv class\x3d"dijitTooltipConnector" data-dojo-attach-point\x3d"connectorNode"\x3e\x3c/div\n\t\x3e\x3cdiv class\x3d"dijitTooltipContainer dijitTooltipContents" data-dojo-attach-point\x3d"containerNode" role\x3d\'alert\'\x3e\x3c/div\n\x3e\x3c/div\x3e\n'}});
//@ sourceMappingURL=Tooltip.js.map