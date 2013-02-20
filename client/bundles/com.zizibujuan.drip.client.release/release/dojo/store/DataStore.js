//>>built
define("dojo/store/DataStore","../_base/lang,../_base/declare,../Deferred,../_base/array,./util/QueryResults,./util/SimpleQueryEngine".split(","),function(m,k,g,n,o,p){return k("dojo.store.DataStore",null,{target:"",constructor:function(a){m.mixin(this,a);if(!1 in a){var c;try{c=this.store.getIdentityAttributes()}catch(b){}this.idProperty=!c||!idAttributes[0]||this.idProperty}a=this.store.getFeatures();if(!a["dojo.data.api.Read"])this.get=null;if(!a["dojo.data.api.Identity"])this.getIdentity=null;
if(!a["dojo.data.api.Write"])this.put=this.add=null},idProperty:"id",store:null,queryEngine:p,_objectConverter:function(a){function c(a){for(var i={},l=b.getAttributes(a),j=0;j<l.length;j++){var f=l[j],h=b.getValues(a,f);if(1<h.length){for(f=0;f<h.length;f++){var e=h[f];"object"==typeof e&&b.isItem(e)&&(h[f]=c(e))}e=h}else e=b.getValue(a,f),"object"==typeof e&&b.isItem(e)&&(e=c(e));i[l[j]]=e}!(d in i)&&b.getIdentity&&(i[d]=b.getIdentity(a));return i}var b=this.store,d=this.idProperty;return function(b){return a(c(b))}},
get:function(a){var c,b,d=new g;this.store.fetchItemByIdentity({identity:a,onItem:this._objectConverter(function(a){d.resolve(c=a)}),onError:function(a){d.reject(b=a)}});if(c)return c;if(b)throw b;return d.promise},put:function(a,c){var b=c&&"undefined"!=typeof c.id||this.getIdentity(a),d=this.store,g=this.idProperty;"undefined"==typeof b?(d.newItem(a),d.save()):d.fetchItemByIdentity({identity:b,onItem:function(b){if(b)for(var c in a)c!=g&&d.getValue(b,c)!=a[c]&&d.setValue(b,c,a[c]);else d.newItem(a);
d.save()}})},remove:function(a){var c=this.store;this.store.fetchItemByIdentity({identity:a,onItem:function(a){c.deleteItem(a);c.save()}})},query:function(a,c){var b,d=new g(function(){b.abort&&b.abort()});d.total=new g;var k=this._objectConverter(function(a){return a});b=this.store.fetch(m.mixin({query:a,onBegin:function(a){d.total.resolve(a)},onComplete:function(a){d.resolve(n.map(a,k))},onError:function(a){d.reject(a)}},c));return o(d)},getIdentity:function(a){return a[this.idProperty]}})});