//>>built
define("dojo/promise/tracer",["../_base/lang","./Promise","../Evented"],function(lang,Promise,Evented){"use strict";function emitAsync(args){setTimeout(function(){emit.apply(evented,args)},0)}var evented=new Evented,emit=evented.emit;return evented.emit=null,Promise.prototype.trace=function(){var args=lang._toArray(arguments);return this.then(function(value){emitAsync(["resolved",value].concat(args))},function(error){emitAsync(["rejected",error].concat(args))},function(update){emitAsync(["progress",update].concat(args))}),this},Promise.prototype.traceRejected=function(){var args=lang._toArray(arguments);return this.otherwise(function(error){emitAsync(["rejected",error].concat(args))}),this},evented})