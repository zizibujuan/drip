//>>built
define("dojo/store/Cache",["../_base/lang","../when"],function(h,f){var i=function(e,d,g){g=g||{};return h.delegate(e,{query:function(a,b){var c=e.query(a,b);c.forEach(function(a){(!g.isLoaded||g.isLoaded(a))&&d.put(a)});return c},queryEngine:e.queryEngine||d.queryEngine,get:function(a,b){return f(d.get(a),function(c){return c||f(e.get(a,b),function(b){b&&d.put(b,{id:a});return b})})},add:function(a,b){return f(e.add(a,b),function(c){d.add(a&&"object"==typeof c?c:a,b);return c})},put:function(a,b){d.remove(b&&
b.id||this.getIdentity(a));return f(e.put(a,b),function(c){d.put(a&&"object"==typeof c?c:a,b);return c})},remove:function(a,b){return f(e.remove(a,b),function(){return d.remove(a,b)})},evict:function(a){return d.remove(a)}})};h.setObject("dojo.store.Cache",i);return i});