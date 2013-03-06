//>>built
define("mathEditor/lang",["dojo/_base/array"],function(e){var b={};b.isNumber=function(a){return!isNaN(parseFloat(a))&&isFinite(a)};b.isOperator=function(a){return"+"==a||"="==a||"-"==a||"&#xD7;"==a||"&#xF7;"==a?!0:!1};b.isNewLine=function(a){return"\n"===a};b.isTab=function(a){return"\t"===a};b.isFenced=function(a){return/\(|\[|\{|\|/.test(a)};b.insertNodeAfter=function(a,b){var c=b.parentNode;c.lastChild==b?c.appendChild(a):c.insertBefore(a,b.nextSibling)};b._fontStyles={fontFamily:1,fontSize:1,
fontWeight:1,fontStyle:1,lineHeight:1};b.isMathTokenNode=function(a){return this.isMathTokenName(a.nodeName)};b.isMathTokenName=function(a){var b=!1;e.forEach("mi,mn,mo,mtext,mspace,ms".split(","),function(c){a==c&&(b=!0)});return b};b.measureTextSize=function(a,b){if(!this.measureNode){var c=document.createElement("div"),d=c.style;d.width=d.height="auto";d.left=d.top="-1000px";d.visibility="hidden";d.position="absolute";d.overflow="visible";d.whiteSpace="nowrap";document.body.appendChild(c);this.measureNode=
c}c=this.measureNode;c.innerHTML=b;var d=c.style,e=window.getComputedStyle(a,null),f;for(f in this._fontStyles)d[f]=e[f];return{height:c.offsetHeight,width:c.offsetWidth}};return b});