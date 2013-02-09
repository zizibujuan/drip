//>>built
define("dojox/data/ClientFilter",["dojo/_base/declare","dojo/_base/lang","dojo/_base/array","dojo/_base/Deferred","dojo/data/util/filter"],function(declare,lang,array,Deferred,filter){var addUpdate=function(store,create,remove){return function(item){store._updates.push({create:create&&item,remove:remove&&item}),ClientFilter.onUpdate()}},ClientFilter=declare("dojox.data.ClientFilter",null,{cacheByDefault:!1,constructor:function(){this.onSet=addUpdate(this,!0,!0),this.onNew=addUpdate(this,!0,!1),this.onDelete=addUpdate(this,!1,!0),this._updates=[],this._fetchCache=[]},clearCache:function(){this._fetchCache=[]},updateResultSet:function(resultSet,request){if(this.isUpdateable(request)){for(var i=request._version||0;i<this._updates.length;i++){var create=this._updates[i].create,remove=this._updates[i].remove;if(remove)for(var j=0;j<resultSet.length;j++)if(this.getIdentity(resultSet[j])==this.getIdentity(remove)){resultSet.splice(j--,1);var updated=!0}create&&this.matchesQuery(create,request)&&array.indexOf(resultSet,create)==-1&&(resultSet.push(create),updated=!0)}return request.sort&&updated&&resultSet.sort(this.makeComparator(request.sort.concat())),resultSet._fullLength=resultSet.length,request.count&&updated&&request.count!==Infinity&&resultSet.splice(request.count,resultSet.length),request._version=this._updates.length,updated?2:1}return 0},querySuperSet:function(argsSuper,argsSub){if(argsSuper.query==argsSub.query)return{};if(argsSub.query instanceof Object&&(!argsSuper.query||typeof argsSuper.query=="object")){var clientQuery=lang.mixin({},argsSub.query);for(var i in argsSuper.query)if(clientQuery[i]==argsSuper.query[i])delete clientQuery[i];else if(typeof argsSuper.query[i]!="string"||!filter.patternToRegExp(argsSuper.query[i]).test(clientQuery[i]))return!1;return clientQuery}return!1},serverVersion:0,cachingFetch:function(args){var self=this;for(var i=0;i<this._fetchCache.length;i++){var cachedArgs=this._fetchCache[i],clientQuery=this.querySuperSet(cachedArgs,args);if(clientQuery!==!1){var defResult=cachedArgs._loading;defResult||(defResult=new Deferred,defResult.callback(cachedArgs.cacheResults)),defResult.addCallback(function(results){return results=self.clientSideFetch(lang.mixin(lang.mixin({},args),{query:clientQuery}),results),defResult.fullLength=results._fullLength,results}),args._version=cachedArgs._version;break}}if(!defResult){var serverArgs=lang.mixin({},args),putInCache=(args.queryOptions||0).cache,fetchCache=this._fetchCache;if(putInCache===undefined?this.cacheByDefault:putInCache){if(args.start||args.count)delete serverArgs.start,delete serverArgs.count,args.clientQuery=lang.mixin(args.clientQuery||{},{start:args.start,count:args.count});args=serverArgs,fetchCache.push(args)}defResult=args._loading=this._doQuery(args),defResult.addErrback(function(){fetchCache.splice(array.indexOf(fetchCache,args),1)})}var version=this.serverVersion;return defResult.addCallback(function(results){delete args._loading;if(results){args._version=typeof args._version=="number"?args._version:version,self.updateResultSet(results,args),args.cacheResults=results;if(!args.count||results.length<args.count)defResult.fullLength=(args.start?args.start:0)+results.length}return results}),defResult},isUpdateable:function(request){return!request.query||typeof request.query=="object"},clientSideFetch:function(request,baseResults){request.queryOptions&&request.queryOptions.results&&(baseResults=request.queryOptions.results);if(request.query){var results=[];for(var i=0;i<baseResults.length;i++){var value=baseResults[i];value&&this.matchesQuery(value,request)&&results.push(baseResults[i])}}else results=request.sort?baseResults.concat():baseResults;return request.sort&&results.sort(this.makeComparator(request.sort.concat())),this.clientSidePaging(request,results)},clientSidePaging:function(request,baseResults){var start=request.start||0,finalResults=start||request.count?baseResults.slice(start,start+(request.count||baseResults.length)):baseResults;return finalResults._fullLength=baseResults.length,finalResults},matchesQuery:function(item,request){var query=request.query,ignoreCase=request.queryOptions&&request.queryOptions.ignoreCase;for(var i in query){var match=query[i],value=this.getValue(item,i);if(typeof match=="string"&&(match.match(/[\*\.]/)||ignoreCase)?!filter.patternToRegExp(match,ignoreCase).test(value):value!=match)return!1}return!0},makeComparator:function(sort){var current=sort.shift();if(!current)return function(){return 0};var attribute=current.attribute,descending=!!current.descending,next=this.makeComparator(sort),store=this;return function(a,b){var av=store.getValue(a,attribute),bv=store.getValue(b,attribute);return av!=bv?av<bv==descending?1:-1:next(a,b)}}});return ClientFilter.onUpdate=function(){},ClientFilter})