//>>built
define("dojo/store/JsonRest",["../_base/xhr","../_base/lang","../json","../_base/declare","./util/QueryResults"],function(xhr,lang,JSON,declare,QueryResults){var base=null;return declare("dojo.store.JsonRest",base,{constructor:function(options){this.headers={},declare.safeMixin(this,options)},headers:{},target:"",idProperty:"id",get:function(id,options){options=options||{};var headers=lang.mixin({Accept:this.accepts},this.headers,options.headers||options);return xhr("GET",{url:this.target+id,handleAs:"json",headers:headers})},accepts:"application/javascript, application/json",getIdentity:function(object){return object[this.idProperty]},put:function(object,options){options=options||{};var id="id"in options?options.id:this.getIdentity(object),hasId=typeof id!="undefined";return xhr(hasId&&!options.incremental?"PUT":"POST",{url:hasId?this.target+id:this.target,postData:JSON.stringify(object),handleAs:"json",headers:lang.mixin({"Content-Type":"application/json",Accept:this.accepts,"If-Match":options.overwrite===!0?"*":null,"If-None-Match":options.overwrite===!1?"*":null},this.headers,options.headers)})},add:function(object,options){return options=options||{},options.overwrite=!1,this.put(object,options)},remove:function(id,options){return options=options||{},xhr("DELETE",{url:this.target+id,headers:lang.mixin({},this.headers,options.headers)})},query:function(query,options){options=options||{};var headers=lang.mixin({Accept:this.accepts},this.headers,options.headers);if(options.start>=0||options.count>=0)headers.Range=headers["X-Range"]="items="+(options.start||"0")+"-"+("count"in options&&options.count!=Infinity?options.count+(options.start||0)-1:"");var hasQuestionMark=this.target.indexOf("?")>-1;query&&typeof query=="object"&&(query=xhr.objectToQuery(query),query=query?(hasQuestionMark?"&":"?")+query:"");if(options&&options.sort){var sortParam=this.sortParam;query+=(query||hasQuestionMark?"&":"?")+(sortParam?sortParam+"=":"sort(");for(var i=0;i<options.sort.length;i++){var sort=options.sort[i];query+=(i>0?",":"")+(sort.descending?"-":"+")+encodeURIComponent(sort.attribute)}sortParam||(query+=")")}var results=xhr("GET",{url:this.target+(query||""),handleAs:"json",headers:headers});return results.total=results.then(function(){var range=results.ioArgs.xhr.getResponseHeader("Content-Range");return range&&(range=range.match(/\/(.*)/))&&+range[1]}),QueryResults(results)}})})