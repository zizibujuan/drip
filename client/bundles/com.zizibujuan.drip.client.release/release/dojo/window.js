//>>built
define("dojo/window","./_base/lang,./sniff,./_base/window,./dom,./dom-geometry,./dom-style,./dom-construct".split(","),function(y,i,p,D,n,z,k){i.add("rtl-adjust-position-for-verticalScrollBar",function(b,f){var d=p.body(f),e=k.create("div",{style:{overflow:"scroll",overflowX:"visible",direction:"rtl",visibility:"hidden",position:"absolute",left:"0",top:"0",width:"64px",height:"64px"}},d,"last"),h=k.create("div",{style:{overflow:"hidden",direction:"ltr"}},e,"last"),g=0!=n.position(h).x;e.removeChild(h);
d.removeChild(e);return g});i.add("position-fixed-support",function(b,f){var d=p.body(f),e=k.create("span",{style:{visibility:"hidden",position:"fixed",left:"1px",top:"1px"}},d,"last"),h=k.create("span",{style:{position:"fixed",left:"0",top:"0"}},e,"last"),g=n.position(h).x!=n.position(e).x;e.removeChild(h);d.removeChild(e);return g});var l={getBox:function(b){var b=b||p.doc,f="BackCompat"==b.compatMode?p.body(b):b.documentElement,d=n.docScroll(b);if(i("touch"))var e=l.get(b),b=e.innerWidth||f.clientWidth,
f=e.innerHeight||f.clientHeight;else b=f.clientWidth,f=f.clientHeight;return{l:d.x,t:d.y,w:b,h:f}},get:function(b){if(i("ie")&&l!==document.parentWindow){b.parentWindow.execScript("document._parentWindow = window;","Javascript");var f=b._parentWindow;b._parentWindow=null;return f}return b.parentWindow||b.defaultView},scrollIntoView:function(b,f){try{var b=D.byId(b),d=b.ownerDocument||p.doc,e=p.body(d),h=d.documentElement||e.parentNode,g=i("ie"),q=i("webkit");if(!(b==e||b==h))if(!i("mozilla")&&!g&&
!q&&!i("opera")&&"scrollIntoView"in b)b.scrollIntoView(!1);else{var k="BackCompat"==d.compatMode,l=Math.min(e.clientWidth||h.clientWidth,h.clientWidth||e.clientWidth),w=Math.min(e.clientHeight||h.clientHeight,h.clientHeight||e.clientHeight),d=q||k?e:h,m=f||n.position(b),c=b.parentNode,q=function(a){return 6>=g||7==g&&k?!1:i("position-fixed-support")&&"fixed"==z.get(a,"position").toLowerCase()};if(!q(b))for(;c;){c==e&&(c=d);var a=n.position(c),A=q(c),x="rtl"==z.getComputedStyle(c).direction.toLowerCase();
if(c==d){a.w=l;a.h=w;d==h&&g&&x&&(a.x+=d.offsetWidth-a.w);if(0>a.x||!g||9<=g)a.x=0;if(0>a.y||!g||9<=g)a.y=0}else{var r=n.getPadBorderExtents(c);a.w-=r.w;a.h-=r.h;a.x+=r.l;a.y+=r.t;var o=c.clientWidth,s=a.w-o;if(0<o&&0<s)x&&i("rtl-adjust-position-for-verticalScrollBar")&&(a.x+=s),a.w=o;o=c.clientHeight;s=a.h-o;if(0<o&&0<s)a.h=o}if(A){if(0>a.y)a.h+=a.y,a.y=0;if(0>a.x)a.w+=a.x,a.x=0;if(a.y+a.h>w)a.h=w-a.y;if(a.x+a.w>l)a.w=l-a.x}var t=m.x-a.x,u=m.y-a.y,B=t+m.w-a.w,C=u+m.h-a.h,j,v;if(0<B*t&&(c.scrollLeft||
c==d||c.scrollWidth>c.offsetHeight)){j=Math[0>t?"max":"min"](t,B);if(x&&(8==g&&!k||9<=g))j=-j;v=c.scrollLeft;c.scrollLeft+=j;j=c.scrollLeft-v;m.x-=j}if(0<C*u&&(c.scrollTop||c==d||c.scrollHeight>c.offsetHeight))j=Math.ceil(Math[0>u?"max":"min"](u,C)),v=c.scrollTop,c.scrollTop+=j,j=c.scrollTop-v,m.y-=j;c=c!=d&&!A&&c.parentNode}}}catch(y){b.scrollIntoView(!1)}}};y.setObject("dojo.window",l);return l});