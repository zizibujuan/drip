//>>built
define("mathEditor/dataUtil",["dojox/xml/parser","dojo/_base/array"],function(d,e){var a={};a.xmlDocToHtml=function(a){var c="";e.forEach(a.documentElement.childNodes,function(a){var b="<div class='drip_line'>";e.forEach(a.childNodes,function(a){"text"==a.nodeName?b+="<span>"+a.textContent+"</span>":"math"==a.nodeName&&(a=d.innerXML(a),b+=a.replace(/&amp;/g,"&"))});b+="</div>";c+=b});return c};a.xmlStringToHtml=function(a){return this.xmlDocToHtml(d.parse(a))};return a});