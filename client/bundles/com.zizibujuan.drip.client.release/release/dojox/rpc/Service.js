//>>built
define("dojox/rpc/Service",["dojo","dojox","dojo/AdapterRegistry","dojo/_base/url"],function(e,f){e.declare("dojox.rpc.Service",null,{constructor:function(a,b){function c(a){a._baseUrl=new e._Url(e.isBrowser?location.href:e.config.baseUrl,d||".")+"";f._smd=a;for(var b in f._smd.services){for(var a=b.split("."),c=f,h=0;h<a.length-1;h++)c=c[a[h]]||(c[a[h]]={});c[a[a.length-1]]=f._generateService(b,f._smd.services[b])}}var d,f=this;if(a)if(e.isString(a)||a instanceof e._Url){d=a instanceof e._Url?a+
"":a;var h=e._getText(d);if(h)c(e.fromJson(h));else throw Error("Unable to load SMD from "+a);}else c(a);this._options=b?b:{};this._requestId=0},_generateService:function(a,b){if(this[b])throw Error("WARNING: "+a+" already exists for service. Unable to generate function");b.name=a;var c=e.hitch(this,"_executeMethod",b),d=f.rpc.transportRegistry.match(b.transport||this._smd.transport);d.getExecutor&&(c=d.getExecutor(c,b,this));d=b.returns||(b._schema={});d._service=c;c.servicePath="/"+a+"/";c._schema=
d;c.id=f.rpc.Service._nextId++;return c},_getRequest:function(a,b){var c=this._smd,d=f.rpc.envelopeRegistry.match(a.envelope||c.envelope||"NONE"),i=(a.parameters||[]).concat(c.parameters||[]);if(d.namedParams){if(1==b.length&&e.isObject(b[0]))b=b[0];else{for(var h={},g=0;g<a.parameters.length;g++)if("undefined"!=typeof b[g]||!a.parameters[g].optional)h[a.parameters[g].name]=b[g];b=h}if(a.strictParameters||c.strictParameters)for(g in b){for(var h=!1,j=0;j<i.length;j++)i[j].name==g&&(h=!0);h||delete b[g]}for(g=
0;g<i.length;g++)if(h=i[g],!h.optional&&h.name&&!b[h.name])if(h["default"])b[h.name]=h["default"];else if(!(h.name in b))throw Error("Required parameter "+h.name+" was omitted");}else i&&i[0]&&i[0].name&&1==b.length&&e.isObject(b[0])&&(b=!1===d.namedParams?f.rpc.toOrdered(i,b):b[0]);e.isObject(this._options)&&(b=e.mixin(b,this._options));i=a._schema||a.returns;g=d.serialize.apply(this,[c,a,b]);g._envDef=d;return e.mixin(g,{sync:f.rpc._sync,contentType:a.contentType||c.contentType||g.contentType,headers:a.headers||
c.headers||g.headers||{},target:g.target||f.rpc.getTarget(c,a),transport:a.transport||c.transport||g.transport,envelope:a.envelope||c.envelope||g.envelope,timeout:a.timeout||c.timeout,callbackParamName:a.callbackParamName||c.callbackParamName,rpcObjectParamName:a.rpcObjectParamName||c.rpcObjectParamName,schema:i,handleAs:g.handleAs||"auto",preventCache:a.preventCache||c.preventCache,frameDoc:this._options.frameDoc||void 0})},_executeMethod:function(a){var b=[],c;for(c=1;c<arguments.length;c++)b.push(arguments[c]);
var d=this._getRequest(a,b),b=f.rpc.transportRegistry.match(d.transport).fire(d);b.addBoth(function(a){return d._envDef.deserialize.call(this,a)});return b}});f.rpc.getTarget=function(a,b){var c=a._baseUrl;a.target&&(c=new e._Url(c,a.target)+"");b.target&&(c=new e._Url(c,b.target)+"");return c};f.rpc.toOrdered=function(a,b){if(e.isArray(b))return b;for(var c=[],d=0;d<a.length;d++)c.push(b[a[d].name]);return c};f.rpc.transportRegistry=new e.AdapterRegistry(!0);f.rpc.envelopeRegistry=new e.AdapterRegistry(!0);
f.rpc.envelopeRegistry.register("URL",function(a){return"URL"==a},{serialize:function(a,b,c){return{data:e.objectToQuery(c),transport:"POST"}},deserialize:function(a){return a},namedParams:!0});f.rpc.envelopeRegistry.register("JSON",function(a){return"JSON"==a},{serialize:function(a,b,c){return{data:e.toJson(c),handleAs:"json",contentType:"application/json"}},deserialize:function(a){return a}});f.rpc.envelopeRegistry.register("PATH",function(a){return"PATH"==a},{serialize:function(a,b,c){var d,a=
f.rpc.getTarget(a,b);if(e.isArray(c))for(d=0;d<c.length;d++)a+="/"+c[d];else for(d in c)a+="/"+d+"/"+c[d];return{data:"",target:a}},deserialize:function(a){return a}});f.rpc.transportRegistry.register("POST",function(a){return"POST"==a},{fire:function(a){a.url=a.target;a.postData=a.data;return e.rawXhrPost(a)}});f.rpc.transportRegistry.register("GET",function(a){return"GET"==a},{fire:function(a){a.url=a.target+(a.data?"?"+(a.rpcObjectParamName?a.rpcObjectParamName+"=":"")+a.data:"");return e.xhrGet(a)}});
f.rpc.transportRegistry.register("JSONP",function(a){return"JSONP"==a},{fire:function(a){a.url=a.target+(-1==a.target.indexOf("?")?"?":"&")+(a.rpcObjectParamName?a.rpcObjectParamName+"=":"")+a.data;a.callbackParamName=a.callbackParamName||"callback";return e.io.script.get(a)}});f.rpc.Service._nextId=1;e._contentHandlers.auto=function(a){var b=e._contentHandlers,c=a.getResponseHeader("Content-Type");return!c?b.text(a):c.match(/\/.*json/)?b.json(a):c.match(/\/javascript/)?b.javascript(a):c.match(/\/xml/)?
b.xml(a):b.text(a)};return f.rpc.Service});