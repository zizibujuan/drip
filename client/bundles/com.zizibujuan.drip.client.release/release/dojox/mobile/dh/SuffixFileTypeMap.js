//>>built
define("dojox/mobile/dh/SuffixFileTypeMap",["dojo/_base/lang"],function(lang){var o={};return lang.setObject("dojox.mobile.dh.SuffixFileTypeMap",o),o.map={html:"html",json:"json"},o.add=function(key,contentType){this.map[key]=contentType},o.getContentType=function(fileName){var fileType=(fileName||"").replace(/.*\./,"");return this.map[fileType]},o})