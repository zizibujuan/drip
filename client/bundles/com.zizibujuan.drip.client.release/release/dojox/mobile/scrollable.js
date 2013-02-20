//>>built
define("dojox/mobile/scrollable","dojo/_base/kernel,dojo/_base/connect,dojo/_base/event,dojo/_base/lang,dojo/_base/window,dojo/dom-class,dojo/dom-construct,dojo/dom-style,dojo/touch,./sniff,./_css3,./_maskUtils".split(","),function(m,l,r,s,i,k,n,j,p,g,f,u){var h=s.getObject("dojox.mobile",!0);g.add("translate3d",function(){if(g("css3-animations")){var a=i.doc.createElement("div");a.style[f.name("transform")]="translate3d(0px,1px,0px)";i.doc.documentElement.appendChild(a);var b=i.doc.defaultView.getComputedStyle(a,
"")[f.name("transform",!0)],b=b&&0===b.indexOf("matrix");i.doc.documentElement.removeChild(a);return b}});var t=function(){};s.extend(t,{fixedHeaderHeight:0,fixedFooterHeight:0,isLocalFooter:!1,scrollBar:!0,scrollDir:"v",weight:0.6,fadeScrollBar:!0,disableFlashScrollBar:!1,threshold:4,constraint:!0,touchNode:null,propagatable:!0,dirLock:!1,height:"",scrollType:0,init:function(a){if(a)for(var b in a)a.hasOwnProperty(b)&&(this[b]=("domNode"==b||"containerNode"==b)&&"string"==typeof a[b]?i.doc.getElementById(a[b]):
a[b]);if("undefined"!=typeof this.domNode.style.msTouchAction)this.domNode.style.msTouchAction="none";this.touchNode=this.touchNode||this.containerNode;this._v=-1!=this.scrollDir.indexOf("v");this._h=-1!=this.scrollDir.indexOf("h");this._f="f"==this.scrollDir;this._ch=[];this._ch.push(l.connect(this.touchNode,p.press,this,"onTouchStart"));if(g("css3-animations")){this._useTopLeft=this.scrollType?2===this.scrollType:3>g("android");if(!this._useTopLeft)this._useTransformTransition=this.scrollType?3===
this.scrollType:6<=g("ios");if(this._useTopLeft)this._ch.push(l.connect(this.domNode,f.name("transitionEnd"),this,"onFlickAnimationEnd")),this._ch.push(l.connect(this.domNode,f.name("transitionStart"),this,"onFlickAnimationStart"));else{if(this._useTransformTransition)this._ch.push(l.connect(this.domNode,f.name("transitionEnd"),this,"onFlickAnimationEnd")),this._ch.push(l.connect(this.domNode,f.name("transitionStart"),this,"onFlickAnimationStart"));else{this._ch.push(l.connect(this.domNode,f.name("animationEnd"),
this,"onFlickAnimationEnd"));this._ch.push(l.connect(this.domNode,f.name("animationStart"),this,"onFlickAnimationStart"));for(a=0;3>a;a++)this.setKeyframes(null,null,a)}g("translate3d")&&j.set(this.containerNode,f.name("transform"),"translate3d(0,0,0)")}}this._speed={x:0,y:0};this._appFooterHeight=0;this.isTopLevel()&&!this.noResize&&this.resize();var c=this;setTimeout(function(){c.flashScrollBar()},600)},isTopLevel:function(){return!0},cleanup:function(){if(this._ch){for(var a=0;a<this._ch.length;a++)l.disconnect(this._ch[a]);
this._ch=null}},findDisp:function(a){if(!a.parentNode)return null;if(1===a.nodeType&&k.contains(a,"mblSwapView")&&"none"!==a.style.display)return a;for(var b=a.parentNode.childNodes,c=0;c<b.length;c++){var e=b[c];if(1===e.nodeType&&k.contains(e,"mblView")&&"none"!==e.style.display)return e}return a},getScreenSize:function(){return{h:i.global.innerHeight||i.doc.documentElement.clientHeight||i.doc.documentElement.offsetHeight,w:i.global.innerWidth||i.doc.documentElement.clientWidth||i.doc.documentElement.offsetWidth}},
resize:function(){this._appFooterHeight=this._fixedAppFooter?this._fixedAppFooter.offsetHeight:0;if(this.isLocalHeader)this.containerNode.style.marginTop=this.fixedHeaderHeight+"px";for(var a=0,b=this.domNode;b&&"BODY"!=b.tagName;b=b.offsetParent){b=this.findDisp(b);if(!b)break;a+=b.offsetTop}var c,b=this.getScreenSize().h,a=b-a-this._appFooterHeight;if("inherit"===this.height)this.domNode.offsetParent&&(c=this.domNode.offsetParent.offsetHeight+"px");else if("auto"===this.height){if(c=this.domNode.offsetParent){this.domNode.style.height=
"0px";c=c.getBoundingClientRect();var a=this.domNode.getBoundingClientRect(),e=c.bottom-this._appFooterHeight,a=a.bottom>=e?b-(a.top-c.top)-this._appFooterHeight:e-a.bottom}b=Math.max(this.domNode.scrollHeight,this.containerNode.scrollHeight);c=(b?Math.min(b,a):a)+"px"}else if(this.height)c=this.height;c||(c=a+"px");if("-"!==c.charAt(0)&&"default"!==c)this.domNode.style.height=c;this.onTouchEnd()},onFlickAnimationStart:function(a){r.stop(a)},onFlickAnimationEnd:function(a){var b=a&&a.animationName;
if(b&&-1===b.indexOf("scrollableViewScroll2"))if(-1!==b.indexOf("scrollableViewScroll0"))this._scrollBarNodeV&&k.remove(this._scrollBarNodeV,"mblScrollableScrollTo0");else if(-1!==b.indexOf("scrollableViewScroll1"))this._scrollBarNodeH&&k.remove(this._scrollBarNodeH,"mblScrollableScrollTo1");else{if(this._scrollBarNodeV)this._scrollBarNodeV.className="";if(this._scrollBarNodeH)this._scrollBarNodeH.className=""}else{if(this._useTransformTransition||this._useTopLeft)if(b=a.target,b===this._scrollBarV||
b===this._scrollBarH){a="mblScrollableScrollTo"+(b===this._scrollBarV?"0":"1");k.contains(b,a)?k.remove(b,a):b.className="";return}a&&a.srcElement&&r.stop(a);this.stopAnimation();if(this._bounce){var c=this,e=c._bounce;setTimeout(function(){c.slideTo(e,0.3,"ease-out")},0);c._bounce=void 0}else this.hideScrollBar(),this.removeCover()}},isFormElement:function(a){if(a&&1!==a.nodeType)a=a.parentNode;if(!a||1!==a.nodeType)return!1;a=a.tagName;return"SELECT"===a||"INPUT"===a||"TEXTAREA"===a||"BUTTON"===
a},onTouchStart:function(a){if(!(this.disableTouchScroll||this._conn&&500>(new Date).getTime()-this.startTime)){if(!this._conn)this._conn=[],this._conn.push(l.connect(i.doc,p.move,this,"onTouchMove")),this._conn.push(l.connect(i.doc,p.release,this,"onTouchEnd"));this._aborted=!1;if(k.contains(this.containerNode,"mblScrollableScrollTo2"))this.abort();else{if(this._scrollBarNodeV)this._scrollBarNodeV.className="";if(this._scrollBarNodeH)this._scrollBarNodeH.className=""}this.touchStartX=a.touches?a.touches[0].pageX:
a.clientX;this.touchStartY=a.touches?a.touches[0].pageY:a.clientY;this.startTime=(new Date).getTime();this.startPos=this.getPos();this._dim=this.getDim();this._time=[0];this._posX=[this.touchStartX];this._posY=[this.touchStartY];this._locked=!1;this.isFormElement(a.target)||(this.propagatable?a.preventDefault():r.stop(a))}},onTouchMove:function(a){if(!this._locked){var b=a.touches?a.touches[0].pageX:a.clientX,a=a.touches?a.touches[0].pageY:a.clientY,c=b-this.touchStartX,e=a-this.touchStartY,d={x:this.startPos.x+
c,y:this.startPos.y+e},o=this._dim,c=Math.abs(c),e=Math.abs(e);if(1==this._time.length){if(this.dirLock&&(this._v&&!this._h&&c>=this.threshold&&c>=e||(this._h||this._f)&&!this._v&&e>=this.threshold&&e>=c)){this._locked=!0;return}if(this._v&&this._h){if(e<this.threshold&&c<this.threshold)return}else if(this._v&&e<this.threshold||(this._h||this._f)&&c<this.threshold)return;this.addCover();this.showScrollBar()}c=this.weight;if(this._v&&this.constraint)if(0<d.y)d.y=Math.round(d.y*c);else if(d.y<-o.o.h)d.y=
o.c.h<o.d.h?Math.round(d.y*c):-o.o.h-Math.round((-o.o.h-d.y)*c);if((this._h||this._f)&&this.constraint)if(0<d.x)d.x=Math.round(d.x*c);else if(d.x<-o.o.w)d.x=o.c.w<o.d.w?Math.round(d.x*c):-o.o.w-Math.round((-o.o.w-d.x)*c);this.scrollTo(d);d=this._time.length;if(2<=d){var f,g;this._v&&!this._h?(f=this._posY[d-1]-this._posY[d-2],g=a-this._posY[d-1]):!this._v&&this._h&&(f=this._posX[d-1]-this._posX[d-2],g=b-this._posX[d-1]);if(0>f*g)this._time=[this._time[d-1]],this._posX=[this._posX[d-1]],this._posY=
[this._posY[d-1]],d=1}10==d&&(this._time.shift(),this._posX.shift(),this._posY.shift());this._time.push((new Date).getTime()-this.startTime);this._posX.push(b);this._posY.push(a)}},onTouchEnd:function(a){if(!this._locked){var b=this._speed={x:0,y:0},c=this._dim,e=this.getPos(),d={};if(a){if(!this._conn)return;for(b=0;b<this._conn.length;b++)l.disconnect(this._conn[b]);this._conn=null;var b=this._time.length,f=!1;this._aborted||(1>=b?f=!0:2==b&&4>Math.abs(this._posY[1]-this._posY[0])&&g("touch")&&
(f=!0));if(f){this.hideScrollBar();this.removeCover();if(g("touch")&&!this.isFormElement(a.target)&&!(4.1<=g("android")||10<=g("ie"))){var q=a.target;if(1!=q.nodeType)q=q.parentNode;var h=i.doc.createEvent("MouseEvents");h.initMouseEvent("click",!0,!0,i.global,1,a.screenX,a.screenY,a.clientX,a.clientY);setTimeout(function(){q.dispatchEvent(h)},0)}return}b=this._speed=this.getSpeed()}else{if(0==e.x&&0==e.y)return;c=this.getDim()}if(this._v)d.y=e.y+b.y;if(this._h||this._f)d.x=e.x+b.x;if(!1!==this.adjustDestination(d,
e,c))if("v"==this.scrollDir&&c.c.h<c.d.h)this.slideTo({y:0},0.3,"ease-out");else if("h"==this.scrollDir&&c.c.w<c.d.w)this.slideTo({x:0},0.3,"ease-out");else if(this._v&&this._h&&c.c.h<c.d.h&&c.c.w<c.d.w)this.slideTo({x:0,y:0},0.3,"ease-out");else{var j,f="ease-out",k={};if(this._v&&this.constraint)if(0<d.y)0<e.y?(j=0.3,d.y=0):(d.y=Math.min(d.y,20),f="linear",k.y=0);else if(-b.y>c.o.h- -e.y)e.y<-c.o.h?(j=0.3,d.y=c.c.h<=c.d.h?0:-c.o.h):(d.y=Math.max(d.y,-c.o.h-20),f="linear",k.y=-c.o.h);if((this._h||
this._f)&&this.constraint)if(0<d.x)0<e.x?(j=0.3,d.x=0):(d.x=Math.min(d.x,20),f="linear",k.x=0);else if(-b.x>c.o.w- -e.x)e.x<-c.o.w?(j=0.3,d.x=c.c.w<=c.d.w?0:-c.o.w):(d.x=Math.max(d.x,-c.o.w-20),f="linear",k.x=-c.o.w);this._bounce=void 0!==k.x||void 0!==k.y?k:void 0;if(void 0===j){var m,n;if(this._v&&this._h)n=Math.sqrt(b.x*b.x+b.y*b.y),m=Math.sqrt(Math.pow(d.y-e.y,2)+Math.pow(d.x-e.x,2));else if(this._v)n=b.y,m=d.y-e.y;else if(this._h)n=b.x,m=d.x-e.x;if(0===m&&!a)return;j=0!==n?Math.abs(m/n):0.01}this.slideTo(d,
j,f)}}},adjustDestination:function(){return!0},abort:function(){this.scrollTo(this.getPos());this.stopAnimation();this._aborted=!0},stopAnimation:function(){k.remove(this.containerNode,"mblScrollableScrollTo2");if(this._scrollBarV)this._scrollBarV.className="";if(this._scrollBarH)this._scrollBarH.className="";if(this._useTransformTransition||this._useTopLeft)this.containerNode.style[f.name("transition")]="",this._scrollBarV&&(this._scrollBarV.style[f.name("transition")]=""),this._scrollBarH&&(this._scrollBarH.style[f.name("transition")]=
"")},scrollIntoView:function(a,b,c){if(this._v){for(var e=this.containerNode,d=this.getDim().d.h,f=0,g=a;g!==e;g=g.offsetParent){if(!g||"BODY"===g.tagName)return;f+=g.offsetTop}a=b?Math.max(d-e.offsetHeight,-f):Math.min(0,d-f-a.offsetHeight);c&&"number"===typeof c?this.slideTo({y:a},c,"ease-out"):this.scrollTo({y:a})}},getSpeed:function(){var a=0,b=0,c=this._time.length;if(2<=c&&500>(new Date).getTime()-this.startTime-this._time[c-1])var a=this._posX[c-(3<c?2:1)]-this._posX[0<=c-6?c-6:0],e=this._time[c-
(3<c?2:1)]-this._time[0<=c-6?c-6:0],b=this.calcSpeed(this._posY[c-(3<c?2:1)]-this._posY[0<=c-6?c-6:0],e),a=this.calcSpeed(a,e);return{x:a,y:b}},calcSpeed:function(a,b){return 4*Math.round(100*(a/b))},scrollTo:function(a,b,c){c=(c||this.containerNode).style;if(g("css3-animations"))if(this._useTopLeft){c[f.name("transition")]="";if(this._v)c.top=a.y+"px";if(this._h||this._f)c.left=a.x+"px"}else this._useTransformTransition&&(c[f.name("transition")]=""),c[f.name("transform")]=this.makeTranslateStr(a);
else{if(this._v)c.top=a.y+"px";if(this._h||this._f)c.left=a.x+"px"}b||this.scrollScrollBarTo(this.calcScrollBarPos(a))},slideTo:function(a,b,c){this._runSlideAnimation(this.getPos(),a,b,c,this.containerNode,2);this.slideScrollBarTo(a,b,c)},makeTranslateStr:function(a){var b=this._v&&"number"==typeof a.y?a.y+"px":"0px",a=(this._h||this._f)&&"number"==typeof a.x?a.x+"px":"0px";return g("translate3d")?"translate3d("+a+","+b+",0px)":"translate("+a+","+b+")"},getPos:function(){if(g("css3-animations")){var a=
i.doc.defaultView.getComputedStyle(this.containerNode,"");if(this._useTopLeft)return{x:parseInt(a.left)||0,y:parseInt(a.top)||0};var b=a[f.name("transform")];return b&&0===b.indexOf("matrix")?(a=b.split(/[,\s\)]+/),b=0===b.indexOf("matrix3d")?12:4,{y:a[b+1]-0,x:a[b]-0}):{x:0,y:0}}return{y:parseInt(this.containerNode.style.top)||0,x:this.containerNode.offsetLeft}},getDim:function(){var a={};a.c={h:this.containerNode.offsetHeight,w:this.containerNode.offsetWidth};a.v={h:this.domNode.offsetHeight+this._appFooterHeight,
w:this.domNode.offsetWidth};a.d={h:a.v.h-this.fixedHeaderHeight-this.fixedFooterHeight,w:a.v.w};a.o={h:a.c.h-a.v.h+this.fixedHeaderHeight+this.fixedFooterHeight,w:a.c.w-a.v.w};return a},showScrollBar:function(){if(this.scrollBar){var a=this._dim;if(!("v"==this.scrollDir&&a.c.h<=a.d.h||"h"==this.scrollDir&&a.c.w<=a.d.w))if(!this._v||!this._h||!(a.c.h<=a.d.h&&a.c.w<=a.d.w)){a=function(a,c){var e=a["_scrollBarNode"+c];if(!e){var e=n.create("div",null,a.domNode),d={position:"absolute",overflow:"hidden"};
"V"==c?(d.right="2px",d.width="5px"):(d.bottom=(a.isLocalFooter?a.fixedFooterHeight:0)+2+"px",d.height="5px");j.set(e,d);e.className="mblScrollBarWrapper";a["_scrollBarWrapper"+c]=e;e=n.create("div",null,e);j.set(e,f.add({opacity:0.6,position:"absolute",backgroundColor:"#606060",fontSize:"1px",MozBorderRadius:"2px",zIndex:2147483647},{borderRadius:"2px",transformOrigin:"0 0"}));j.set(e,"V"==c?{width:"5px"}:{height:"5px"});a["_scrollBarNode"+c]=e}return e};if(this._v&&!this._scrollBarV)this._scrollBarV=
a(this,"V");if(this._h&&!this._scrollBarH)this._scrollBarH=a(this,"H");this.resetScrollBar()}}},hideScrollBar:function(){if(this.fadeScrollBar&&g("css3-animations")&&!h._fadeRule){var a=n.create("style",null,i.doc.getElementsByTagName("head")[0]);a.textContent=".mblScrollableFadeScrollBar{  "+f.name("animation-duration",!0)+": 1s;  "+f.name("animation-name",!0)+": scrollableViewFadeScrollBar;}@"+f.name("keyframes",!0)+" scrollableViewFadeScrollBar{  from { opacity: 0.6; }  to { opacity: 0; }}";h._fadeRule=
a.sheet.cssRules[1]}if(this.scrollBar){a=function(a,c){j.set(a,f.add({opacity:0},{animationDuration:""}));if(!c._useTopLeft||!g("android"))a.className="mblScrollableFadeScrollBar"};if(this._scrollBarV)a(this._scrollBarV,this),this._scrollBarV=null;if(this._scrollBarH)a(this._scrollBarH,this),this._scrollBarH=null}},calcScrollBarPos:function(a){var b={},c=this._dim,e=function(a,c,b,e,f){b=Math.round((e-c-8)/(e-f)*b);b<-c+5&&(b=-c+5);b>a-5&&(b=a-5);return b};if("number"==typeof a.y&&this._scrollBarV)b.y=
e(this._scrollBarWrapperV.offsetHeight,this._scrollBarV.offsetHeight,a.y,c.d.h,c.c.h);if("number"==typeof a.x&&this._scrollBarH)b.x=e(this._scrollBarWrapperH.offsetWidth,this._scrollBarH.offsetWidth,a.x,c.d.w,c.c.w);return b},scrollScrollBarTo:function(a){if(this.scrollBar){if(this._v&&this._scrollBarV&&"number"==typeof a.y)g("css3-animations")?this._useTopLeft?j.set(this._scrollBarV,f.add({top:a.y+"px"},{transition:""})):(this._useTransformTransition&&(this._scrollBarV.style[f.name("transition")]=
""),this._scrollBarV.style[f.name("transform")]=this.makeTranslateStr({y:a.y})):this._scrollBarV.style.top=a.y+"px";if(this._h&&this._scrollBarH&&"number"==typeof a.x)g("css3-animations")?this._useTopLeft?j.set(this._scrollBarH,f.add({left:a.x+"px"},{transition:""})):(this._useTransformTransition&&(this._scrollBarH.style[f.name("transition")]=""),this._scrollBarH.style[f.name("transform")]=this.makeTranslateStr({x:a.x})):this._scrollBarH.style.left=a.x+"px"}},slideScrollBarTo:function(a,b,c){if(this.scrollBar){var e=
this.calcScrollBarPos(this.getPos()),a=this.calcScrollBarPos(a);this._v&&this._scrollBarV&&this._runSlideAnimation({y:e.y},{y:a.y},b,c,this._scrollBarV,0);this._h&&this._scrollBarH&&this._runSlideAnimation({x:e.x},{x:a.x},b,c,this._scrollBarH,1)}},_runSlideAnimation:function(a,b,c,e,d,h){if(g("css3-animations"))if(this._useTopLeft)j.set(d,f.add({},{transitionProperty:"top, left",transitionDuration:c+"s",transitionTimingFunction:e})),setTimeout(function(){j.set(d,{top:(b.y||0)+"px",left:(b.x||0)+"px"})},
0),k.add(d,"mblScrollableScrollTo"+h);else if(this._useTransformTransition){if(void 0===b.x)b.x=a.x;if(void 0===b.y)b.y=a.y;if(b.x!==a.x||b.y!==a.y){j.set(d,f.add({},{transitionProperty:f.name("transform"),transitionDuration:c+"s",transitionTimingFunction:e}));var i=this.makeTranslateStr(b);setTimeout(function(){j.set(d,f.add({},{transform:i}))},0);k.add(d,"mblScrollableScrollTo"+h)}else this.hideScrollBar(),this.removeCover()}else this.setKeyframes(a,b,h),j.set(d,f.add({},{animationDuration:c+"s",
animationTimingFunction:e})),k.add(d,"mblScrollableScrollTo"+h),2==h?this.scrollTo(b,!0,d):this.scrollScrollBarTo(b);else m.fx&&m.fx.easing&&c?(a=m.fx.slideTo({node:d,duration:1E3*c,left:b.x,top:b.y,easing:"ease-out"==e?m.fx.easing.quadOut:m.fx.easing.linear}).play(),2==h&&l.connect(a,"onEnd",this,"onFlickAnimationEnd")):2==h?(this.scrollTo(b,!1,d),this.onFlickAnimationEnd()):this.scrollScrollBarTo(b)},resetScrollBar:function(){var a=function(a,b,d,f,g,h){if(b){var i={};i[h?"top":"left"]=g+4+"px";
g=0>=d-8?1:d-8;i[h?"height":"width"]=g+"px";j.set(a,i);a=Math.round(d*d/f);a=Math.min(Math.max(a-8,5),g);b.style[h?"height":"width"]=a+"px";j.set(b,{opacity:0.6})}},b=this.getDim();a(this._scrollBarWrapperV,this._scrollBarV,b.d.h,b.c.h,this.fixedHeaderHeight,!0);a(this._scrollBarWrapperH,this._scrollBarH,b.d.w,b.c.w,0);this.createMask()},createMask:function(){if(g("webkit")||g("svg"))this._scrollBarWrapperV&&u.createRoundMask(this._scrollBarWrapperV,0,0,0,0,5,this._scrollBarWrapperV.offsetHeight,
2,2,0.5),this._scrollBarWrapperH&&u.createRoundMask(this._scrollBarWrapperH,0,0,0,0,this._scrollBarWrapperH.offsetWidth,5,2,2,0.5)},flashScrollBar:function(){if(!this.disableFlashScrollBar&&this.domNode&&(this._dim=this.getDim(),!(0>=this._dim.d.h))){this.showScrollBar();var a=this;setTimeout(function(){a.hideScrollBar()},300)}},addCover:function(){if(!g("touch")&&!this.noCover)h._cover?h._cover.style.display="":(h._cover=n.create("div",null,i.doc.body),h._cover.className="mblScrollableCover",j.set(h._cover,
{backgroundColor:"#ffff00",opacity:0,position:"absolute",top:"0px",left:"0px",width:"100%",height:"100%",zIndex:2147483647}),this._ch.push(l.connect(h._cover,p.press,this,"onTouchEnd"))),this.setSelectable(h._cover,!1),this.setSelectable(this.domNode,!1)},removeCover:function(){if(!g("touch")&&h._cover)h._cover.style.display="none",this.setSelectable(h._cover,!0),this.setSelectable(this.domNode,!0)},setKeyframes:function(a,b,c){if(!h._rule)h._rule=[];if(!h._rule[c]){var e=n.create("style",null,i.doc.getElementsByTagName("head")[0]);
e.textContent=".mblScrollableScrollTo"+c+"{"+f.name("animation-name",!0)+": scrollableViewScroll"+c+";}@"+f.name("keyframes",!0)+" scrollableViewScroll"+c+"{}";h._rule[c]=e.sheet.cssRules[1]}if(c=h._rule[c])if(a&&(c.deleteRule(g("webkit")?"from":0),(c.insertRule||c.appendRule).call(c,"from { "+f.name("transform",!0)+": "+this.makeTranslateStr(a)+"; }")),b){if(void 0===b.x)b.x=a.x;if(void 0===b.y)b.y=a.y;c.deleteRule(g("webkit")?"to":1);(c.insertRule||c.appendRule).call(c,"to { "+f.name("transform",
!0)+": "+this.makeTranslateStr(b)+"; }")}},setSelectable:function(a,b){a.style.KhtmlUserSelect=b?"auto":"none";a.style.MozUserSelect=b?"":"none";a.onselectstart=b?null:function(){return!1};if(g("ie")){a.unselectable=b?"":"on";for(var c=a.getElementsByTagName("*"),e=0;e<c.length;e++)c[e].unselectable=b?"":"on"}}});s.setObject("dojox.mobile.scrollable",t);return t});