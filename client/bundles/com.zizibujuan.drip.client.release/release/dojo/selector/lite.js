//>>built
define("dojo/selector/lite",["../has","../_base/kernel"],function(i,m){var g=document.createElement("div"),j=g.matchesSelector||g.webkitMatchesSelector||g.mozMatchesSelector||g.msMatchesSelector||g.oMatchesSelector,n=g.querySelectorAll,p=/([^\s,](?:"(?:\\.|[^"])+"|'(?:\\.|[^'])+'|[^,])*)/g;i.add("dom-matches-selector",!!j);i.add("dom-qsa",!!n);var l=function(f,a){if(q&&-1<f.indexOf(","))return q(f,a);var c=a?a.ownerDocument||a:m.doc||document,b=(n?/^([\w]*)#([\w\-]+$)|^(\.)([\w\-\*]+$)|^(\w+$)/:/^([\w]*)#([\w\-]+)(?:\s+(.*))?$|(?:^|(>|.+\s+))([\w\-\*]+)(\S*$)/).exec(f),
a=a||c;if(b){if(b[2]){var d=m.byId?m.byId(b[2]):c.getElementById(b[2]);if(!d||b[1]&&b[1]!=d.tagName.toLowerCase())return[];if(a!=c)for(c=d;c!=a;)if(c=c.parentNode,!c)return[];return b[3]?l(b[3],d):[d]}if(b[3]&&a.getElementsByClassName)return a.getElementsByClassName(b[4]);if(b[5])if(d=a.getElementsByTagName(b[5]),b[4]||b[6])f=(b[4]||"")+b[6];else return d}if(n)return 1===a.nodeType&&"object"!==a.nodeName.toLowerCase()?r(a,f,a.querySelectorAll):a.querySelectorAll(f);d||(d=a.getElementsByTagName("*"));
for(var b=[],c=0,k=d.length;c<k;c++){var h=d[c];1==h.nodeType&&s(h,f,a)&&b.push(h)}return b},r=function(f,a,c){var b=f,d=f.getAttribute("id"),k=d||"__dojo__",h=f.parentNode,g=/^\s*[+~]/.test(a);if(g&&!h)return[];d?k=k.replace(/'/g,"\\$&"):f.setAttribute("id",k);if(g&&h)f=f.parentNode;a=a.match(p);for(h=0;h<a.length;h++)a[h]="[id='"+k+"'] "+a[h];a=a.join(",");try{return c.call(f,a)}finally{d||b.removeAttribute("id")}};if(!i("dom-matches-selector"))var s=function(){function f(o,e,a){var b=e.charAt(0);
if('"'==b||"'"==b)e=e.slice(1,-1);var e=e.replace(/\\/g,""),c=h[a||""];return function(a){return(a=a.getAttribute(o))&&c(a,e)}}function a(a){return function(e,b){for(;(e=e.parentNode)!=b;)if(a(e,b))return!0}}function c(a){return function(e,b){e=e.parentNode;return a?e!=b&&a(e,b):e==b}}function b(a,e){return a?function(b,c){return e(b)&&a(b,c)}:e}var d="div"==g.tagName?"toLowerCase":"toUpperCase",k={"":function(a){a=a[d]();return function(b){return b.tagName==a}},".":function(a){var b=" "+a+" ";return function(c){return-1<
c.className.indexOf(a)&&-1<(" "+c.className+" ").indexOf(b)}},"#":function(a){return function(b){return b.id==a}}},h={"^=":function(a,b){return 0==a.indexOf(b)},"*=":function(a,b){return-1<a.indexOf(b)},"$=":function(a,b){return a.substring(a.length-b.length,a.length)==b},"~=":function(a,b){return-1<(" "+a+" ").indexOf(" "+b+" ")},"|=":function(a,b){return 0==(a+"-").indexOf(b+"-")},"=":function(a,b){return a==b},"":function(){return!0}},i={};return function(d,e,h){var g=i[e];if(!g){if(e.replace(/(?:\s*([> ])\s*)|(#|\.)?((?:\\.|[\w-])+)|\[\s*([\w-]+)\s*(.?=)?\s*("(?:\\.|[^"])+"|'(?:\\.|[^'])+'|(?:\\.|[^\]])*)\s*\]/g,
function(d,e,h,i,j,l,o){i?g=b(g,k[h||""](i.replace(/\\/g,""))):e?g=(" "==e?a:c)(g):j&&(g=b(g,f(j,o,l)));return""}))throw Error("Syntax error in query");if(!g)return!0;i[e]=g}return g(d,h)}}();if(!i("dom-qsa"))var q=function(f,a){for(var c=f.match(p),b=[],d=0;d<c.length;d++){f=new String(c[d].replace(/\s*$/,""));f.indexOf=escape;for(var g=l(f,a),h=0,i=g.length;h<i;h++){var j=g[h];b[j.sourceIndex]=j}}c=[];for(d in b)c.push(b[d]);return c};l.match=j?function(f,a,c){return c&&9!=c.nodeType?r(c,a,function(a){return j.call(f,
a)}):j.call(f,a)}:s;return l});