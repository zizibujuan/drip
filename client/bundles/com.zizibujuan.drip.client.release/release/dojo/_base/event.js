//>>built
define("dojo/_base/event",["./kernel","../on","../has","../dom-geometry"],function(dojo,on,has,dom){if(on._fixEvent){var fixEvent=on._fixEvent;on._fixEvent=function(evt,se){return evt=fixEvent(evt,se),evt&&dom.normalizeEvent(evt),evt}}var ret={fix:function(evt,sender){return on._fixEvent?on._fixEvent(evt,sender):evt},stop:function(evt){has("dom-addeventlistener")||evt&&evt.preventDefault?(evt.preventDefault(),evt.stopPropagation()):(evt=evt||window.event,evt.cancelBubble=!0,on._preventDefault.call(evt))}};return dojo.fixEvent=ret.fix,dojo.stopEvent=ret.stop,ret})