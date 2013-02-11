//>>built
define("dojox/xml/DomParser",["dojo/_base/kernel","dojo/_base/array"],function(k){k.getObject("xml",!0,dojox);dojox.xml.DomParser=new function(){var p,l,q;function C(){return new function(){var a={};this.nodeType=p;this.nodeName="#document";this.namespaces={};this._nsPaths={};this.childNodes=[];this.documentElement=null;this._add=function(b){"undefined"!=typeof b.id&&(a[b.id]=b)};this._remove=function(b){a[b]&&delete a[b]};this.byId=this.getElementById=function(b){return a[b]};this.byName=this.getElementsByTagName=
r;this.byNameNS=this.getElementsByTagNameNS=s;this.childrenByName=t;this.childrenByNameNS=u}}function r(a){function b(a,e,c){k.forEach(a.childNodes,function(a){a.nodeType==l&&("*"==e?c.push(a):a.nodeName==e&&c.push(a),b(a,e,c))})}var c=[];b(this,a,c);return c}function s(a,b){function c(a,b,d,i){k.forEach(a.childNodes,function(a){a.nodeType==l&&("*"==b&&a.ownerDocument._nsPaths[d]==a.namespace?i.push(a):a.localName==b&&a.ownerDocument._nsPaths[d]==a.namespace&&i.push(a),c(a,b,d,i))})}b||(b=m);var d=
[];c(this,a,b,d);return d}function t(a){var b=[];k.forEach(this.childNodes,function(c){c.nodeType==l&&("*"==a?b.push(c):c.nodeName==a&&b.push(c))});return b}function u(a,b){var c=[];k.forEach(this.childNodes,function(d){d.nodeType==l&&("*"==a&&d.ownerDocument._nsPaths[b]==d.namespace?c.push(d):d.localName==a&&d.ownerDocument._nsPaths[b]==d.namespace&&c.push(d))});return c}function v(a){return{nodeType:q,nodeName:"#text",nodeValue:a.replace(w," ").replace(x,">").replace(y,"<").replace(z,"'").replace(A,
'"').replace(B,"&")}}function D(a){for(var b=0;b<this.attributes.length;b++)if(this.attributes[b].nodeName==a)return this.attributes[b].nodeValue;return null}function E(a,b){for(var c=0;c<this.attributes.length;c++)if(this.ownerDocument._nsPaths[b]==this.attributes[c].namespace&&this.attributes[c].localName==a)return this.attributes[c].nodeValue;return null}function F(a,b){for(var c=null,d=0;d<this.attributes.length;d++)if(this.attributes[d].nodeName==a){c=this.attributes[d].nodeValue;this.attributes[d].nodeValue=
b;break}"id"==a&&(null!=c&&this.ownerDocument._remove(c),this.ownerDocument._add(this))}function G(a,b,c){for(var d=0;d<this.attributes.length;d++)if(this.ownerDocument._nsPaths[c]==this.attributes[d].namespace&&this.attributes[d].localName==a){this.attributes[d].nodeValue=b;break}}function H(){var a=this.parentNode;if(a)for(var b=0;b<a.childNodes.length;b++)if(a.childNodes[b]==this&&0<b)return a.childNodes[b-1];return null}function I(){var a=this.parentNode;if(a)for(var b=0;b<a.childNodes.length;b++)if(a.childNodes[b]==
this&&b+1<a.childNodes.length)return a.childNodes[b+1];return null}l=1;q=3;p=9;var J=/<([^>\/\s+]*)([^>]*)>([^<]*)/g,K=/([^=]*)=(("([^"]*)")|('([^']*)'))/g,o=/<!ENTITY\s+([^"]*)\s+"([^"]*)">/g,L=/<!\[CDATA\[([\u0001-\uFFFF]*?)\]\]>/g,M=/<\!--([\u0001-\uFFFF]*?)--\>/g,n=/^\s+|\s+$/g,w=/\s+/g,x=/\&gt;/g,y=/\&lt;/g,A=/\&quot;/g,z=/\&apos;/g,B=/\&amp;/g,m="_def_";this.parse=function(a){var b=C();if(null==a||0==a.length)return b;if(0<a.indexOf("<!ENTITY")){var c,d=[];if(o.test(a)){for(o.lastIndex=0;null!=
(c=o.exec(a));)d.push({entity:"&"+c[1].replace(n,"")+";",expression:c[2]});for(var e=0;e<d.length;e++)a=a.replace(RegExp(d[e].entity,"g"),d[e].expression)}}for(d=[];null!=(c=L.exec(a));)d.push(c[1]);for(e=0;e<d.length;e++)a=a.replace(d[e],e);for(c=[];null!=(e=M.exec(a));)c.push(e[1]);for(e=0;e<c.length;e++)a=a.replace(c[e],e);for(var g,e=b;null!=(g=J.exec(a));)if("/"==g[2].charAt(0)&&1<g[2].replace(n,"").length){if(e.parentNode)e=e.parentNode;var h=(g[3]||"").replace(n,"");0<h.length&&e.childNodes.push(v(h))}else if(0<
g[1].length)if("?"==g[1].charAt(0))h=g[1].substr(1),g=g[2].substr(0,g[2].length-2),e.childNodes.push({nodeType:7,nodeName:h,nodeValue:g});else if("!"==g[1].charAt(0))if(0==g[1].indexOf("![CDATA[")){var i=parseInt(g[1].replace("![CDATA[","").replace("]]",""));e.childNodes.push({nodeType:4,nodeName:"#cdata-section",nodeValue:d[i]})}else"!--"==g[1].substr(0,3)&&(i=parseInt(g[1].replace("!--","").replace("--","")),e.childNodes.push({nodeType:8,nodeName:"#comment",nodeValue:c[i]}));else{var h=g[1].replace(n,
""),f={nodeType:l,nodeName:h,localName:h,namespace:m,ownerDocument:b,attributes:[],parentNode:null,childNodes:[]};if(-1<h.indexOf(":")){var j=h.split(":");f.namespace=j[0];f.localName=j[1]}f.byName=f.getElementsByTagName=r;f.byNameNS=f.getElementsByTagNameNS=s;f.childrenByName=t;f.childrenByNameNS=u;f.getAttribute=D;f.getAttributeNS=E;f.setAttribute=F;f.setAttributeNS=G;f.previous=f.previousSibling=H;for(f.next=f.nextSibling=I;null!=(i=K.exec(g[2]));)if(0<i.length)if(h=i[1].replace(n,""),i=(i[4]||
i[6]||"").replace(w," ").replace(x,">").replace(y,"<").replace(z,"'").replace(A,'"').replace(B,"&"),0==h.indexOf("xmlns"))0<h.indexOf(":")?(j=h.split(":"),b.namespaces[j[1]]=i,b._nsPaths[i]=j[1]):(b.namespaces[m]=i,b._nsPaths[i]=m);else{var k=h,j=m;0<h.indexOf(":")&&(j=h.split(":"),k=j[1],j=j[0]);f.attributes.push({nodeType:2,nodeName:h,localName:k,namespace:j,nodeValue:i});if("id"==k)f.id=i}b._add(f);if(e)e.childNodes.push(f),f.parentNode=e,"/"!=g[2].charAt(g[2].length-1)&&(e=f);h=g[3];0<h.length&&
e.childNodes.push(v(h))}for(e=0;e<b.childNodes.length;e++)if(a=b.childNodes[e],a.nodeType==l){b.documentElement=a;break}return b}};return dojox.xml.DomParser});