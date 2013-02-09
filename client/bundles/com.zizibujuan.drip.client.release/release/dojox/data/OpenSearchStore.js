//>>built
define("dojox/data/OpenSearchStore",["dojo/_base/kernel","dojo/_base/lang","dojo/_base/declare","dojo/_base/xhr","dojo/_base/array","dojo/_base/window","dojo/query","dojo/data/util/simpleFetch","dojox/xml/parser"],function(kernel,lang,declare,dxhr,array,window,query,simpleFetch,parser){kernel.experimental("dojox.data.OpenSearchStore");var OpenSearchStore=declare("dojox.data.OpenSearchStore",null,{constructor:function(args){args&&(this.label=args.label,this.url=args.url,this.itemPath=args.itemPath,"urlPreventCache"in args&&(this.urlPreventCache=args.urlPreventCache?!0:!1));var def=dxhr.get({url:this.url,handleAs:"xml",sync:!0,preventCache:this.urlPreventCache});def.addCallback(this,"_processOsdd"),def.addErrback(function(){throw new Error("Unable to load OpenSearch Description document from ".args.url)})},url:"",itemPath:"",_storeRef:"_S",urlElement:null,iframeElement:null,urlPreventCache:!0,ATOM_CONTENT_TYPE:3,ATOM_CONTENT_TYPE_STRING:"atom",RSS_CONTENT_TYPE:2,RSS_CONTENT_TYPE_STRING:"rss",XML_CONTENT_TYPE:1,XML_CONTENT_TYPE_STRING:"xml",_assertIsItem:function(item){if(!this.isItem(item))throw new Error("dojox.data.OpenSearchStore: a function was passed an item argument that was not an item")},_assertIsAttribute:function(attribute){if(typeof attribute!="string")throw new Error("dojox.data.OpenSearchStore: a function was passed an attribute argument that was not an attribute name string")},getFeatures:function(){return{"dojo.data.api.Read":!0}},getValue:function(item,attribute,defaultValue){var values=this.getValues(item,attribute);return values?values[0]:defaultValue},getAttributes:function(item){return["content"]},hasAttribute:function(item,attribute){return this.getValue(item,attribute)?!0:!1},isItemLoaded:function(item){return this.isItem(item)},loadItem:function(keywordArgs){},getLabel:function(item){return undefined},getLabelAttributes:function(item){return null},containsValue:function(item,attribute,value){var values=this.getValues(item,attribute);for(var i=0;i<values.length;i++)if(values[i]===value)return!0;return!1},getValues:function(item,attribute){this._assertIsItem(item),this._assertIsAttribute(attribute);var value=this.processItem(item,attribute);return value?[value]:undefined},isItem:function(item){return item&&item[this._storeRef]===this?!0:!1},close:function(request){},process:function(data){return this["_processOSD"+this.contentType](data)},processItem:function(item,attribute){return this["_processItem"+this.contentType](item.node,attribute)},_createSearchUrl:function(request){var template=this.urlElement.attributes.getNamedItem("template").nodeValue,attrs=this.urlElement.attributes,index=template.indexOf("{searchTerms}");return template=template.substring(0,index)+request.query.searchTerms+template.substring(index+13),array.forEach([{name:"count",test:request.count,def:"10"},{name:"startIndex",test:request.start,def:this.urlElement.attributes.getNamedItem("indexOffset")?this.urlElement.attributes.getNamedItem("indexOffset").nodeValue:0},{name:"startPage",test:request.startPage,def:this.urlElement.attributes.getNamedItem("pageOffset")?this.urlElement.attributes.getNamedItem("pageOffset").nodeValue:0},{name:"language",test:request.language,def:"*"},{name:"inputEncoding",test:request.inputEncoding,def:"UTF-8"},{name:"outputEncoding",test:request.outputEncoding,def:"UTF-8"}],function(item){template=template.replace("{"+item.name+"}",item.test||item.def),template=template.replace("{"+item.name+"?}",item.test||item.def)}),template},_fetchItems:function(request,fetchHandler,errorHandler){request.query||(request.query={});var self=this,url=this._createSearchUrl(request),getArgs={url:url,preventCache:this.urlPreventCache},xhr=dxhr.get(getArgs);xhr.addErrback(function(error){errorHandler(error,request)}),xhr.addCallback(function(data){var items=[];if(data){items=self.process(data);for(var i=0;i<items.length;i++)items[i]={node:items[i]},items[i][self._storeRef]=self}fetchHandler(items,request)})},_processOSDxml:function(data){var div=window.doc.createElement("div");return div.innerHTML=data,query(this.itemPath,div)},_processItemxml:function(item,attribute){return attribute==="content"?item.innerHTML:undefined},_processOSDatom:function(data){return this._processOSDfeed(data,"entry")},_processItematom:function(item,attribute){return this._processItemfeed(item,attribute,"content")},_processOSDrss:function(data){return this._processOSDfeed(data,"item")},_processItemrss:function(item,attribute){return this._processItemfeed(item,attribute,"description")},_processOSDfeed:function(data,type){data=dojox.xml.parser.parse(data);var items=[],nodeList=data.getElementsByTagName(type);for(var i=0;i<nodeList.length;i++)items.push(nodeList.item(i));return items},_processItemfeed:function(item,attribute,type){if(attribute==="content"){var content=item.getElementsByTagName(type).item(0);return this._getNodeXml(content,!0)}return undefined},_getNodeXml:function(node,skipFirst){var i;switch(node.nodeType){case 1:var xml=[];if(!skipFirst){xml.push("<"+node.tagName);var attr;for(i=0;i<node.attributes.length;i++)attr=node.attributes.item(i),xml.push(" "+attr.nodeName+'="'+attr.nodeValue+'"');xml.push(">")}for(i=0;i<node.childNodes.length;i++)xml.push(this._getNodeXml(node.childNodes.item(i)));return skipFirst||xml.push("</"+node.tagName+">\n"),xml.join("");case 3:case 4:return node.nodeValue}return undefined},_processOsdd:function(doc){var urlnodes=doc.getElementsByTagName("Url"),types=[],contentType,i;for(i=0;i<urlnodes.length;i++){contentType=urlnodes[i].attributes.getNamedItem("type").nodeValue;switch(contentType){case"application/rss+xml":types[i]=this.RSS_CONTENT_TYPE;break;case"application/atom+xml":types[i]=this.ATOM_CONTENT_TYPE;break;default:types[i]=this.XML_CONTENT_TYPE}}var index=0,currentType=types[0];for(i=1;i<urlnodes.length;i++)types[i]>currentType&&(index=i,currentType=types[i]);var label=urlnodes[index].nodeName.toLowerCase();if(label=="url"){var urlattrs=urlnodes[index].attributes;this.urlElement=urlnodes[index];switch(types[index]){case this.ATOM_CONTENT_TYPE:this.contentType=this.ATOM_CONTENT_TYPE_STRING;break;case this.RSS_CONTENT_TYPE:this.contentType=this.RSS_CONTENT_TYPE_STRING;break;case this.XML_CONTENT_TYPE:this.contentType=this.XML_CONTENT_TYPE_STRING}}}});return lang.extend(OpenSearchStore,simpleFetch)})