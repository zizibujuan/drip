//>>built
define("dojox/mobile/sniff",["dojo/_base/window","dojo/_base/sniff","dojo/_base/array"],function(win,has,arr){var ua=navigator.userAgent;has.add("bb",(ua.indexOf("BlackBerry")>=0||ua.indexOf("BB10"))&&parseFloat(ua.split("Version/")[1])||undefined,undefined,!0),has.add("android",parseFloat(ua.split("Android ")[1])||undefined,undefined,!0);if(ua.match(/(iPhone|iPod|iPad)/)){var p=RegExp.$1.replace(/P/,"p"),v=ua.match(/OS ([\d_]+)/)?RegExp.$1:"1",os=parseFloat(v.replace(/_/,".").replace(/_/g,""));has.add(p,os,undefined,!0),has.add("iphone",os,undefined,!0)}has("webkit")&&has.add("touch",typeof win.doc.documentElement.ontouchstart!="undefined"&&navigator.appVersion.indexOf("Mobile")!=-1||!!has("android"),undefined,!0);var prefixes=["webkit"];return has.add("css3-animations",function(global,document,element){var style=element.style;return style.animation!==undefined&&style.transition!==undefined||arr.some(prefixes,function(p){return style[p+"Animation"]!==undefined&&style[p+"Transition"]!==undefined})}),has.add("svg","SVGAngle"in win.global),has})