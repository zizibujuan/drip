//>>built
define("dojox/mvc/StatefulArray",["dojo/_base/lang","dojo/Stateful"],function(a,f){function k(a){a._watchElementCallbacks&&a._watchElementCallbacks();return a}var i=function(e){var e=a._toArray(e||[]),l=i;l._meta={bases:[f]};e.constructor=l;return a.mixin(e,{pop:function(){return this.splice(this.get("length")-1,1)[0]},push:function(){this.splice.apply(this,[this.get("length"),0].concat(a._toArray(arguments)));return this.get("length")},reverse:function(){return k([].reverse.apply(this,a._toArray(arguments)))},
shift:function(){return this.splice(0,1)[0]},sort:function(){return k([].sort.apply(this,a._toArray(arguments)))},splice:function(d,c){var b=this.get("length"),d=d+(0>d?b:0),m=Math.min(d,b),j=this.slice(d,d+c),h=a._toArray(arguments).slice(2);[].splice.apply(this,[d,c].concat(Array(h.length)));for(var g=0;g<h.length;g++)this.set(m+g,h[g]);this._watchElementCallbacks&&this._watchElementCallbacks(d,j,h);this._watchCallbacks&&this._watchCallbacks("length",b,b-j.length+h.length);return j},unshift:function(){this.splice.apply(this,
[0,0].concat(a._toArray(arguments)));return this.get("length")},concat:function(d){return new i([].concat.apply(this,arguments))},join:function(d){for(var c=[],b=this.get("length"),a=0;a<b;a++)c.push(this.get(a));return c.join(d)},slice:function(d,c){for(var b=this.get("length"),c=(void 0===c?b:c)+(0>c?b:0),a=[],b=d+(0>d?b:0)||0;b<Math.min(c,this.get("length"));b++)a.push(this.get(b));return new i(a)},watchElements:function(d){var c=this._watchElementCallbacks,b=this;if(!c)c=this._watchElementCallbacks=
function(a,d,g){for(var f=[].concat(c.list),e=0;e<f.length;e++)f[e].call(b,a,d,g)},c.list=[];c.list.push(d);var a={};a.unwatch=a.remove=function(){for(var a=c.list,b=0;b<a.length;b++)if(a[b]==d){a.splice(b,1);break}};return a}},f.prototype,{set:function(a,c){if("length"==a){var b=this.get("length");b<c?this.splice.apply(this,[b,0].concat(Array(c-b))):c>b&&this.splice.apply(this,[c,b-c])}else b=this.length,f.prototype.set.call(this,a,c),b!=this.length&&f.prototype.set.call(this,"length",this.length);
return this}})};return a.setObject("dojox.mvc.StatefulArray",i)});