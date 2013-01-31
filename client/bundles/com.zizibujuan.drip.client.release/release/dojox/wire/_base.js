//>>built
define("dojox/wire/_base",["dijit","dojo","dojox"],function(g,d,b){d.provide("dojox.wire._base");b.wire._defaultWireClass="dojox.wire.Wire";b.wire._wireClasses={attribute:"dojox.wire.DataWire",path:"dojox.wire.XmlWire",children:"dojox.wire.CompositeWire",columns:"dojox.wire.TableAdapter",nodes:"dojox.wire.TreeAdapter",segments:"dojox.wire.TextAdapter"};b.wire.register=function(a,c){a&&c&&!b.wire._wireClasses[c]&&(b.wire._wireClasses[c]=a)};b.wire._getClass=function(a){d.require(a);return d.getObject(a)};
b.wire.create=function(a){a||(a={});var c=a.wireClass;if(c)d.isString(c)&&(c=b.wire._getClass(c));else for(var e in a)if(a[e]&&(c=b.wire._wireClasses[e])){d.isString(c)&&(c=b.wire._getClass(c),b.wire._wireClasses[e]=c);break}if(!c){if(d.isString(b.wire._defaultWireClass))b.wire._defaultWireClass=b.wire._getClass(b.wire._defaultWireClass);c=b.wire._defaultWireClass}return new c(a)};b.wire.isWire=function(a){return a&&a._wireClass};b.wire.transfer=function(a,c,d,f){a&&c&&(b.wire.isWire(a)||(a=b.wire.create(a)),
b.wire.isWire(c)||(c=b.wire.create(c)),a=a.getValue(d),c.setValue(a,f||d))};b.wire.connect=function(a,c,e){if(a&&c&&e){var f={topic:a.topic};if(a.topic)f.handle=d.subscribe(a.topic,function(){b.wire.transfer(c,e,arguments)});else if(a.event)f.handle=d.connect(a.scope,a.event,function(){b.wire.transfer(c,e,arguments)});return f}};b.wire.disconnect=function(a){a&&a.handle&&(a.topic?d.unsubscribe(a.handle):d.disconnect(a.handle))}});