//>>built
define("dojo/Evented",["./aspect","./on"],function(aspect,on){"use strict";function Evented(){}var after=aspect.after;return Evented.prototype={on:function(type,listener){return on.parse(this,type,listener,function(target,type){return after(target,"on"+type,listener,!0)})},emit:function(type,event){var args=[this];return args.push.apply(args,arguments),on.emit.apply(on,args)}},Evented})