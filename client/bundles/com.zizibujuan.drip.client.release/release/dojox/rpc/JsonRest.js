//>>built
define("dojox/rpc/JsonRest",["dojo","dojox","dojox/json/ref","dojox/rpc/Rest"],function(dojo,dojox){function resolveJson(service,deferred,value,defaultId){var timeStamp=deferred.ioArgs&&deferred.ioArgs.xhr&&deferred.ioArgs.xhr.getResponseHeader("Last-Modified");timeStamp&&Rest._timeStamps&&(Rest._timeStamps[defaultId]=timeStamp);var hrefProperty=service._schema&&service._schema.hrefProperty;return hrefProperty&&(dojox.json.ref.refAttribute=hrefProperty),value=value&&dojox.json.ref.resolveJson(value,{defaultId:defaultId,index:Rest._index,timeStamps:timeStamp&&Rest._timeStamps,time:timeStamp,idPrefix:service.servicePath.replace(/[^\/]*$/,""),idAttribute:jr.getIdAttribute(service),schemas:jr.schemas,loader:jr._loader,idAsRef:service.idAsRef,assignAbsoluteIds:!0}),dojox.json.ref.refAttribute="$ref",value}var dirtyObjects=[],Rest=dojox.rpc.Rest,jr;return jr=dojox.rpc.JsonRest={serviceClass:dojox.rpc.Rest,conflictDateHeader:"If-Unmodified-Since",commit:function(kwArgs){kwArgs=kwArgs||{};var actions=[],alreadyRecorded={},savingObjects=[];for(var i=0;i<dirtyObjects.length;i++){var dirty=dirtyObjects[i],object=dirty.object,old=dirty.old,append=!1;if((!kwArgs.service||!object&&!old||!(object||old).__id.indexOf(kwArgs.service.servicePath))&&dirty.save){delete object.__isDirty;if(object)if(old){var pathParts;if(pathParts=object.__id.match(/(.*)#.*/))object=Rest._index[pathParts[1]];if(!(object.__id in alreadyRecorded)){alreadyRecorded[object.__id]=object;if(kwArgs.incrementalUpdates&&!pathParts)var incremental=(typeof kwArgs.incrementalUpdates=="function"?kwArgs.incrementalUpdates:function(){incremental={};for(var j in object)if(object.hasOwnProperty(j))object[j]!==old[j]&&(incremental[j]=object[j]);else if(old.hasOwnProperty(j))return null;return incremental})(object,old);incremental?actions.push({method:"post",target:object,content:incremental}):actions.push({method:"put",target:object,content:object})}}else{var service=jr.getServiceAndId(object.__id).service,idAttribute=jr.getIdAttribute(service);idAttribute in object&&!kwArgs.alwaysPostNewItems?actions.push({method:"put",target:object,content:object}):actions.push({method:"post",target:{__id:service.servicePath},content:object})}else old&&actions.push({method:"delete",target:old});savingObjects.push(dirty),dirtyObjects.splice(i--,1)}}return dojo.connect(kwArgs,"onError",function(){if(kwArgs.revertOnError!==!1){var postCommitDirtyObjects=dirtyObjects;dirtyObjects=savingObjects;var numDirty=0;jr.revert(),dirtyObjects=postCommitDirtyObjects}else dojo.forEach(savingObjects,function(obj){jr.changing(obj.object,!obj.object)})}),jr.sendToServer(actions,kwArgs),actions},sendToServer:function(actions,kwArgs){var xhrSendId,plainXhr=dojo.xhr,left=actions.length,i,contentLocation,timeStamp,conflictDateHeader=this.conflictDateHeader;dojo.xhr=function(method,args){return args.headers=args.headers||{},args.headers.Transaction=actions.length-1==i?"commit":"open",conflictDateHeader&&timeStamp&&(args.headers[conflictDateHeader]=timeStamp),contentLocation&&(args.headers["Content-ID"]="<"+contentLocation+">"),plainXhr.apply(dojo,arguments)};for(i=0;i<actions.length;i++){var action=actions[i];dojox.rpc.JsonRest._contentId=action.content&&action.content.__id;var isPost=action.method=="post";timeStamp=action.method=="put"&&Rest._timeStamps[action.content.__id],timeStamp&&(Rest._timeStamps[action.content.__id]=new Date+""),contentLocation=isPost&&dojox.rpc.JsonRest._contentId;var serviceAndId=jr.getServiceAndId(action.target.__id),service=serviceAndId.service,dfd=action.deferred=service[action.method](serviceAndId.id.replace(/#/,""),dojox.json.ref.toJson(action.content,!1,service.servicePath,!0));(function(object,dfd,service){dfd.addCallback(function(value){try{var newId=dfd.ioArgs.xhr&&dfd.ioArgs.xhr.getResponseHeader("Location");if(newId){var startIndex=newId.match(/(^\w+:\/\/)/)&&newId.indexOf(service.servicePath);newId=startIndex>0?newId.substring(startIndex):(service.servicePath+newId).replace(/^(.*\/)?(\w+:\/\/)|[^\/\.]+\/\.\.\/|^.*\/(\/)/,"$2$3"),object.__id=newId,Rest._index[newId]=object}value=resolveJson(service,dfd,value,object&&object.__id)}catch(e){}return--left||kwArgs.onComplete&&kwArgs.onComplete.call(kwArgs.scope,actions),value})})(action.content,dfd,service),dfd.addErrback(function(value){left=-1,kwArgs.onError.call(kwArgs.scope,value)})}dojo.xhr=plainXhr},getDirtyObjects:function(){return dirtyObjects},revert:function(service){for(var i=dirtyObjects.length;i>0;){i--;var dirty=dirtyObjects[i],object=dirty.object,old=dirty.old,store=dojox.data._getStoreForItem(object||old);if(!service||!object&&!old||!(object||old).__id.indexOf(service.servicePath)){if(object&&old){for(var j in old)old.hasOwnProperty(j)&&object[j]!==old[j]&&(store&&store.onSet(object,j,object[j],old[j]),object[j]=old[j]);for(j in object)old.hasOwnProperty(j)||(store&&store.onSet(object,j,object[j]),delete object[j])}else old?store&&store.onNew(old):store&&store.onDelete(object);delete (object||old).__isDirty,dirtyObjects.splice(i,1)}}},changing:function(object,_deleting){if(!object.__id)return;object.__isDirty=!0;for(var i=0;i<dirtyObjects.length;i++){var dirty=dirtyObjects[i];if(object==dirty.object){_deleting&&(dirty.object=!1,this._saveNotNeeded||(dirty.save=!0));return}}var old=object instanceof Array?[]:{};for(i in object)object.hasOwnProperty(i)&&(old[i]=object[i]);dirtyObjects.push({object:!_deleting&&object,old:old,save:!this._saveNotNeeded})},deleteObject:function(object){this.changing(object,!0)},getConstructor:function(service,schema){if(typeof service=="string"){var servicePath=service;service=new dojox.rpc.Rest(service,!0),this.registerService(service,servicePath,schema)}return service._constructor?service._constructor:(service._constructor=function(data){function addDefaults(schema){if(schema){addDefaults(schema["extends"]),properties=schema.properties;for(var i in properties){var propDef=properties[i];propDef&&typeof propDef=="object"&&"default"in propDef&&(self[i]=propDef["default"])}}schema&&schema.prototype&&schema.prototype.initialize&&(initializeCalled=!0,schema.prototype.initialize.apply(self,args))}var self=this,args=arguments,properties,initializeCalled;addDefaults(service._schema),!initializeCalled&&data&&typeof data=="object"&&dojo.mixin(self,data);var idAttribute=jr.getIdAttribute(service);Rest._index[this.__id=this.__clientId=service.servicePath+(this[idAttribute]||Math.random().toString(16).substring(2,14)+"@"+(dojox.rpc.Client&&dojox.rpc.Client.clientId||"client"))]=this,dojox.json.schema&&properties&&dojox.json.schema.mustBeValid(dojox.json.schema.validate(this,service._schema)),dirtyObjects.push({object:this,save:!0})},dojo.mixin(service._constructor,service._schema,{load:service}))},fetch:function(absoluteId){var serviceAndId=jr.getServiceAndId(absoluteId);return this.byId(serviceAndId.service,serviceAndId.id)},getIdAttribute:function(service){var schema=service._schema,idAttr;if(schema&&!(idAttr=schema._idAttr))for(var i in schema.properties)if(schema.properties[i].identity||schema.properties[i].link=="self")schema._idAttr=idAttr=i;return idAttr||"id"},getServiceAndId:function(absoluteId){var serviceName="";for(var service in jr.services)absoluteId.substring(0,service.length)==service&&service.length>=serviceName.length&&(serviceName=service);if(serviceName)return{service:jr.services[serviceName],id:absoluteId.substring(serviceName.length)};var parts=absoluteId.match(/^(.*\/)([^\/]*)$/);return{service:new jr.serviceClass(parts[1],!0),id:parts[2]}},services:{},schemas:{},registerService:function(service,servicePath,schema){servicePath=service.servicePath=servicePath||service.servicePath,service._schema=jr.schemas[servicePath]=schema||service._schema||{},jr.services[servicePath]=service},byId:function(service,id){var deferred,result=Rest._index[(service.servicePath||"")+id];return result&&!result._loadObject?(deferred=new dojo.Deferred,deferred.callback(result),deferred):this.query(service,id)},query:function(service,id,args){var deferred=service(id,args);return deferred.addCallback(function(result){return result.nodeType&&result.cloneNode?result:resolveJson(service,deferred,result,typeof id!="string"||args&&(args.start||args.count)?undefined:id)}),deferred},_loader:function(callback){var serviceAndId=jr.getServiceAndId(this.__id),self=this;jr.query(serviceAndId.service,serviceAndId.id).addBoth(function(result){result==self?(delete result.$ref,delete result._loadObject):self._loadObject=function(callback){callback(result)},callback(result)})},isDirty:function(item,store){return item?item.__isDirty:store?dojo.some(dirtyObjects,function(dirty){return dojox.data._getStoreForItem(dirty.object||dirty.old)==store}):!!dirtyObjects.length}},dojox.rpc.JsonRest})