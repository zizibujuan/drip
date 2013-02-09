//>>built
define("dojox/data/css",["dojo/_base/lang","dojo/_base/array"],function(lang,array){var css=lang.getObject("dojox.data.css",!0);return css.rules={},css.rules.forEach=function(fn,ctx,context){if(context){var _processSS=function(styleSheet){array.forEach(styleSheet[styleSheet.cssRules?"cssRules":"rules"],function(rule){if(!rule.type||rule.type!==3){var href="";styleSheet&&styleSheet.href&&(href=styleSheet.href),fn.call(ctx?ctx:this,rule,styleSheet,href)}})};array.forEach(context,_processSS)}},css.findStyleSheets=function(sheets){var sheetObjects=[],_processSS=function(styleSheet){var s=css.findStyleSheet(styleSheet);s&&array.forEach(s,function(sheet){array.indexOf(sheetObjects,sheet)===-1&&sheetObjects.push(sheet)})};return array.forEach(sheets,_processSS),sheetObjects},css.findStyleSheet=function(sheet){var sheetObjects=[];sheet.charAt(0)==="."&&(sheet=sheet.substring(1));var _processSS=function(styleSheet){return styleSheet.href&&styleSheet.href.match(sheet)?(sheetObjects.push(styleSheet),!0):styleSheet.imports?array.some(styleSheet.imports,function(importedSS){return _processSS(importedSS)}):array.some(styleSheet[styleSheet.cssRules?"cssRules":"rules"],function(rule){return rule.type&&rule.type===3&&_processSS(rule.styleSheet)?!0:!1})};return array.some(document.styleSheets,_processSS),sheetObjects},css.determineContext=function(initialStylesheets){var ret=[];initialStylesheets&&initialStylesheets.length>0?initialStylesheets=css.findStyleSheets(initialStylesheets):initialStylesheets=document.styleSheets;var _processSS=function(styleSheet){ret.push(styleSheet),styleSheet.imports&&array.forEach(styleSheet.imports,function(importedSS){_processSS(importedSS)}),array.forEach(styleSheet[styleSheet.cssRules?"cssRules":"rules"],function(rule){rule.type&&rule.type===3&&_processSS(rule.styleSheet)})};return array.forEach(initialStylesheets,_processSS),ret},css})