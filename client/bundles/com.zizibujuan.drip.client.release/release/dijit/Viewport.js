//>>built
define("dijit/Viewport","dojo/Evented,dojo/on,dojo/domReady,dojo/sniff,dojo/_base/window,dojo/window".split(","),function(h,d,i,f,j,e){var c=new h,b;i(function(){var a=e.getBox();c._rlh=d(j.global,"resize",function(){var b=e.getBox();a.h==b.h&&a.w==b.w||(a=b,c.emit("resize"))});if(8==f("ie")){var g=screen.deviceXDPI;setInterval(function(){if(screen.deviceXDPI!=g)g=screen.deviceXDPI,c.emit("resize")},500)}d(document,"focusin",function(a){b=a.target});d(document,"focusout",function(){b=null})});c.getEffectiveBox=
function(a){var a=e.getBox(a),c=b&&b.tagName.toLowerCase();if(f("ios")&&("textarea"==c||"input"==c&&/^(color|email|number|password|search|tel|text|url)$/.test(b.type)))a.h*=a.h>a.w?0.66:0.4;return a};return c});