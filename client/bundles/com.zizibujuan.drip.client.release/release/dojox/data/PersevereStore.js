//>>built
define("dojox/data/PersevereStore",["dojo","dojox","require","dojox/data/JsonQueryRestStore","dojox/rpc/Client","dojo/_base/url"],function(dojo,dojox,require){return dojox.json.ref.serializeFunctions=!0,dojo.declare("dojox.data.PersevereStore",dojox.data.JsonQueryRestStore,{useFullIdInQueries:!0,jsonQueryPagination:!1}),dojox.data.PersevereStore.getStores=function(path,sync){path=path&&(path.match(/\/$/)?path:path+"/")||"/",path.match(/^\w*:\/\//)&&(require("dojox/io/xhrScriptPlugin"),dojox.io.xhrScriptPlugin(path,"callback",dojox.io.xhrPlugins.fullHttpAdapter));var plainXhr=dojo.xhr;dojo.xhr=function(method,args){return(args.headers=args.headers||{})["Server-Methods"]="false",plainXhr.apply(dojo,arguments)};var rootService=dojox.rpc.Rest(path,!0);dojox.rpc._sync=sync;var dfd=rootService("Class/"),results,stores={},callId=0;return dfd.addCallback(function(schemas){function setupHierarchy(schema){schema["extends"]&&schema["extends"].prototype&&(!schema.prototype||!schema.prototype.isPrototypeOf(schema["extends"].prototype))&&(setupHierarchy(schema["extends"]),dojox.rpc.Rest._index[schema.prototype.__id]=schema.prototype=dojo.mixin(dojo.delegate(schema["extends"].prototype),schema.prototype))}function setupMethods(methodsDefinitions,methodsTarget){if(methodsDefinitions&&methodsTarget)for(var j in methodsDefinitions){var methodDef=methodsDefinitions[j];methodDef.runAt!="client"&&!methodsTarget[j]&&(methodsTarget[j]=function(methodName){return function(){var deferred=dojo.rawXhrPost({url:this.__id,postData:dojox.json.ref.toJson({method:methodName,id:callId++,params:dojo._toArray(arguments)}),handleAs:"json"});return deferred.addCallback(function(response){return response.error?new Error(response.error):response.result}),deferred}}(j))}}dojox.json.ref.resolveJson(schemas,{index:dojox.rpc.Rest._index,idPrefix:"/Class/",assignAbsoluteIds:!0});for(var i in schemas)if(typeof schemas[i]=="object"){var schema=schemas[i];setupHierarchy(schema),setupMethods(schema.methods,schema.prototype=schema.prototype||{}),setupMethods(schema.staticMethods,schema),stores[schemas[i].id]=new dojox.data.PersevereStore({target:new dojo._Url(path,schemas[i].id)+"/",schema:schema})}return results=stores}),dojo.xhr=plainXhr,sync?results:dfd},dojox.data.PersevereStore.addProxy=function(){require("dojox/io/xhrPlugins"),dojox.io.xhrPlugins.addProxy("/proxy/")},dojox.data.PersevereStore})