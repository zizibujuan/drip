//>>built
define("dojo/data/ObjectStore",["../_base/lang","../Evented","../_base/declare","../_base/Deferred","../_base/array","../_base/connect","../regexp"],function(lang,Evented,declare,Deferred,array,connect,regexp){function convertRegex(character){return character=="*"?".*":character=="?"?".":character}return declare("dojo.data.ObjectStore",[Evented],{objectStore:null,constructor:function(options){this._dirtyObjects=[],options.labelAttribute&&(options.labelProperty=options.labelAttribute),lang.mixin(this,options)},labelProperty:"label",getValue:function(item,property,defaultValue){return typeof item.get=="function"?item.get(property):property in item?item[property]:defaultValue},getValues:function(item,property){var val=this.getValue(item,property);return val instanceof Array?val:val===undefined?[]:[val]},getAttributes:function(item){var res=[];for(var i in item)item.hasOwnProperty(i)&&(i.charAt(0)!="_"||i.charAt(1)!="_")&&res.push(i);return res},hasAttribute:function(item,attribute){return attribute in item},containsValue:function(item,attribute,value){return array.indexOf(this.getValues(item,attribute),value)>-1},isItem:function(item){return typeof item=="object"&&item&&!(item instanceof Date)},isItemLoaded:function(item){return item&&typeof item.load!="function"},loadItem:function(args){var item;return typeof args.item.load=="function"?Deferred.when(args.item.load(),function(result){item=result;var func=result instanceof Error?args.onError:args.onItem;func&&func.call(args.scope,result)}):args.onItem&&args.onItem.call(args.scope,args.item),item},close:function(request){return request&&request.abort&&request.abort()},fetch:function(args){function errorHandler(error){args.onError&&args.onError.call(scope,error,args)}args=lang.delegate(args,args&&args.queryOptions);var self=this,scope=args.scope||self,query=args.query;if(typeof query=="object"){query=lang.delegate(query);for(var i in query){var required=query[i];typeof required=="string"&&(query[i]=RegExp("^"+regexp.escapeString(required,"*?\\").replace(/\\.|\*|\?/g,convertRegex)+"$",args.ignoreCase?"mi":"m"),query[i].toString=function(original){return function(){return original}}(required))}}var results=this.objectStore.query(query,args);return Deferred.when(results.total,function(totalCount){Deferred.when(results,function(results){args.onBegin&&args.onBegin.call(scope,totalCount||results.length,args);if(args.onItem)for(var i=0;i<results.length;i++)args.onItem.call(scope,results[i],args);return args.onComplete&&args.onComplete.call(scope,args.onItem?null:results,args),results},errorHandler)},errorHandler),args.abort=function(){results.cancel&&results.cancel()},results.observe&&(this.observing&&this.observing.cancel(),this.observing=results.observe(function(object,removedFrom,insertedInto){if(array.indexOf(self._dirtyObjects,object)==-1)if(removedFrom==-1)self.onNew(object);else if(insertedInto==-1)self.onDelete(object);else for(var i in object)i!=self.objectStore.idProperty&&self.onSet(object,i,null,object[i])},!0)),this.onFetch(results),args.store=this,args},getFeatures:function(){return{"dojo.data.api.Read":!!this.objectStore.get,"dojo.data.api.Identity":!0,"dojo.data.api.Write":!!this.objectStore.put,"dojo.data.api.Notification":!0}},getLabel:function(item){return this.isItem(item)?this.getValue(item,this.labelProperty):undefined},getLabelAttributes:function(item){return[this.labelProperty]},getIdentity:function(item){return this.objectStore.getIdentity?this.objectStore.getIdentity(item):item[this.objectStore.idProperty||"id"]},getIdentityAttributes:function(item){return[this.objectStore.idProperty]},fetchItemByIdentity:function(args){var item;return Deferred.when(this.objectStore.get(args.identity),function(result){item=result,args.onItem.call(args.scope,result)},function(error){args.onError.call(args.scope,error)}),item},newItem:function(data,parentInfo){if(parentInfo){var values=this.getValue(parentInfo.parent,parentInfo.attribute,[]);values=values.concat([data]),data.__parent=values,this.setValue(parentInfo.parent,parentInfo.attribute,values)}return this._dirtyObjects.push({object:data,save:!0}),this.onNew(data),data},deleteItem:function(item){this.changing(item,!0),this.onDelete(item)},setValue:function(item,attribute,value){var old=item[attribute];this.changing(item),item[attribute]=value,this.onSet(item,attribute,old,value)},setValues:function(item,attribute,values){if(!lang.isArray(values))throw new Error("setValues expects to be passed an Array object as its value");this.setValue(item,attribute,values)},unsetAttribute:function(item,attribute){this.changing(item);var old=item[attribute];delete item[attribute],this.onSet(item,attribute,old,undefined)},changing:function(object,_deleting){object.__isDirty=!0;for(var i=0;i<this._dirtyObjects.length;i++){var dirty=this._dirtyObjects[i];if(object==dirty.object){_deleting&&(dirty.object=!1,this._saveNotNeeded||(dirty.save=!0));return}}var old=object instanceof Array?[]:{};for(i in object)object.hasOwnProperty(i)&&(old[i]=object[i]);this._dirtyObjects.push({object:!_deleting&&object,old:old,save:!this._saveNotNeeded})},save:function(kwArgs){kwArgs=kwArgs||{};var result,actions=[],savingObjects=[],self=this,dirtyObjects=this._dirtyObjects,left=dirtyObjects.length;try{connect.connect(kwArgs,"onError",function(){if(kwArgs.revertOnError!==!1){var postCommitDirtyObjects=dirtyObjects;dirtyObjects=savingObjects,self.revert(),self._dirtyObjects=postCommitDirtyObjects}else self._dirtyObjects=dirtyObjects.concat(savingObjects)});if(this.objectStore.transaction)var transaction=this.objectStore.transaction();for(var i=0;i<dirtyObjects.length;i++){var dirty=dirtyObjects[i],object=dirty.object,old=dirty.old;delete object.__isDirty,object?result=this.objectStore.put(object,{overwrite:!!old}):typeof old!="undefined"&&(result=this.objectStore.remove(this.getIdentity(old))),savingObjects.push(dirty),dirtyObjects.splice(i--,1),Deferred.when(result,function(value){--left||kwArgs.onComplete&&kwArgs.onComplete.call(kwArgs.scope,actions)},function(value){left=-1,kwArgs.onError.call(kwArgs.scope,value)})}transaction&&transaction.commit()}catch(e){kwArgs.onError.call(kwArgs.scope,value)}},revert:function(){var dirtyObjects=this._dirtyObjects;for(var i=dirtyObjects.length;i>0;){i--;var dirty=dirtyObjects[i],object=dirty.object,old=dirty.old;if(object&&old){for(var j in old)old.hasOwnProperty(j)&&object[j]!==old[j]&&(this.onSet(object,j,object[j],old[j]),object[j]=old[j]);for(j in object)old.hasOwnProperty(j)||(this.onSet(object,j,object[j]),delete object[j])}else old?this.onNew(old):this.onDelete(object);delete (object||old).__isDirty,dirtyObjects.splice(i,1)}},isDirty:function(item){return item?item.__isDirty:!!this._dirtyObjects.length},onSet:function(){},onNew:function(){},onDelete:function(){},onFetch:function(results){}})})