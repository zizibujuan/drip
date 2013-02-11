//>>built
define("dojo/touch","./_base/kernel,./aspect,./dom,./_base/lang,./on,./has,./mouse,./domReady,./_base/window".split(","),function(p,j,r,k,d,l,f,q,b){function e(a,c,b){return m&&b?function(a,c){return d(a,b,c)}:i?function(b,e){var f=d(b,c,e),g=d(b,a,function(a){(!h||(new Date).getTime()>h+1E3)&&e.call(this,a)});return{remove:function(){f.remove();g.remove()}}}:function(b,c){return d(b,a,c)}}var i=l("touch"),g=!1;l("ios")&&(j=navigator.userAgent.match(/OS ([\d_]+)/)?RegExp.$1:"1",g=5>parseFloat(j.replace(/_/,
".").replace(/_/g,"")));var m=navigator.msPointerEnabled,h,n,o,c;i&&!m&&(q(function(){c=b.body();b.doc.addEventListener("touchstart",function(a){h=(new Date).getTime();var b=c;c=a.target;d.emit(b,"dojotouchout",{target:b,relatedTarget:c,bubbles:!0});d.emit(c,"dojotouchover",{target:c,relatedTarget:b,bubbles:!0})},!0);d(b.doc,"touchmove",function(a){h=(new Date).getTime();o=a;if(a=b.doc.elementFromPoint(a.pageX-(g?0:b.global.pageXOffset),a.pageY-(g?0:b.global.pageYOffset)))c!==a&&(d.emit(c,"dojotouchout",
{target:c,relatedTarget:a,bubbles:!0}),d.emit(a,"dojotouchover",{target:a,relatedTarget:c,bubbles:!0}),c=a),d.emit(a,"dojotouchmove",{target:a,bubbles:!0})});d(b.doc,"touchend",function(a){var c=b.doc.elementFromPoint(a.pageX-(g?0:b.global.pageXOffset),a.pageY-(g?0:b.global.pageYOffset));d.emit(c,"dojotouchend",k.delegate(a,{target:c,bubbles:!0}))})}),n=function(a,b){return d(a,"dojotouchmove",function(a){b(k.delegate(o,{target:a.target,stopPropagation:function(){a.stopPropagation()}}))})});f={press:e("mousedown",
"touchstart","MSPointerDown"),move:e("mousemove",n,"MSPointerMove"),release:e("mouseup","dojotouchend","MSPointerUp"),cancel:e(f.leave,"touchcancel",i?"MSPointerCancel":null),over:e("mouseover","dojotouchover","MSPointerOver"),out:e("mouseout","dojotouchout","MSPointerOut"),enter:f._eventHandler(e("mouseover","dojotouchover","MSPointerOver")),leave:f._eventHandler(e("mouseout","dojotouchout","MSPointerOut"))};return p.touch=f});