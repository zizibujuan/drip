//>>built
define("dojo/domReady",["./has"],function(has){function domReady(callback){readyQ.push(callback),ready&&processQ()}function processQ(){if(recursiveGuard)return;recursiveGuard=!0;while(readyQ.length)try{readyQ.shift()(doc)}catch(err){0}recursiveGuard=!1,domReady._onQEmpty()}var global=this,doc=document,readyStates={loaded:1,complete:1},fixReadyState=typeof doc.readyState!="string",ready=!!readyStates[doc.readyState],readyQ=[],recursiveGuard;domReady.load=function(id,req,load){domReady(load)},domReady._Q=readyQ,domReady._onQEmpty=function(){},fixReadyState&&(doc.readyState="loading");if(!ready){var tests=[],detectReady=function(evt){evt=evt||global.event;if(ready||evt.type=="readystatechange"&&!readyStates[doc.readyState])return;fixReadyState&&(doc.readyState="complete"),ready=1,processQ()},on=function(node,event){node.addEventListener(event,detectReady,!1),readyQ.push(function(){node.removeEventListener(event,detectReady,!1)})};if(!has("dom-addeventlistener")){on=function(node,event){event="on"+event,node.attachEvent(event,detectReady),readyQ.push(function(){node.detachEvent(event,detectReady)})};var div=doc.createElement("div");try{div.doScroll&&global.frameElement===null&&tests.push(function(){try{return div.doScroll("left"),1}catch(e){}})}catch(e){}}on(doc,"DOMContentLoaded"),on(global,"load"),"onreadystatechange"in doc?on(doc,"readystatechange"):fixReadyState||tests.push(function(){return readyStates[doc.readyState]});if(tests.length){var poller=function(){if(ready)return;var i=tests.length;while(i--)if(tests[i]()){detectReady("poller");return}setTimeout(poller,30)};poller()}}return domReady})