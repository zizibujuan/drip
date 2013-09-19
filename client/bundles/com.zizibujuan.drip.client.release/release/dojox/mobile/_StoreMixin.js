//>>built
define("dojox/mobile/_StoreMixin",["dojo/_base/Deferred","dojo/_base/declare"],function(e,f){return f("dojox.mobile._StoreMixin",null,{store:null,query:null,queryOptions:null,labelProperty:"label",childrenProperty:"children",setStore:function(a,b,c){if(a===this.store)return null;a&&(a.getValue=function(a,b){return a[b]});this.store=a;this._setQuery(b,c);return this.refresh()},setQuery:function(a,b){this._setQuery(a,b);return this.refresh()},_setQuery:function(a,b){this.query=a;this.queryOptions=b||
this.queryOptions},refresh:function(){if(!this.store)return null;var a=this,b=this.store.query(this.query,this.queryOptions);e.when(b,function(c){c.items&&(c=c.items);b.observe&&(a._observe_h&&a._observe_h.remove(),a._observe_h=b.observe(function(b,c,d){if(-1!=c)if(d!=c)a.onDelete(b,c);else{if(a.onAdd)a.onUpdate(b,d)}else if(-1!=d)if(a.onAdd)a.onAdd(b,d);else a.onUpdate(b,d)},!0));a.onComplete(c)},function(b){a.onError(b)});return b},destroy:function(){this._observe_h&&(this._observe_h=this._observe_h.remove());
this.inherited(arguments)}})});
//@ sourceMappingURL=_StoreMixin.js.map