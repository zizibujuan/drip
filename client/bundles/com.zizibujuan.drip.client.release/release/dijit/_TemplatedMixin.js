//>>built
define("dijit/_TemplatedMixin",["require","dojo/_base/array","dojo/cache","dojo/_base/connect","dojo/_base/declare","dojo/dom-construct","dojo/_base/lang","dojo/mouse","dojo/on","dojo/sniff","dojo/string","dojo/touch","dojo/_base/unload","./_WidgetBase"],function(require,array,cache,connect,declare,domConstruct,lang,mouse,on,has,string,touch,unload,_WidgetBase){var synthEvents=lang.delegate(touch,{mouseenter:mouse.enter,mouseleave:mouse.leave,keypress:connect._keypress}),a11yclick,_TemplatedMixin=declare("dijit._TemplatedMixin",null,{templateString:null,templatePath:null,_skipNodeCache:!1,constructor:function(){this._attachPoints=[],this._attachEvents=[]},_stringRepl:function(tmpl){var className=this.declaredClass,_this=this;return string.substitute(tmpl,this,function(value,key){key.charAt(0)=="!"&&(value=lang.getObject(key.substr(1),!1,_this));if(typeof value=="undefined")throw new Error(className+" template:"+key);return value==null?"":key.charAt(0)=="!"?value:value.toString().replace(/"/g,"&quot;")},this)},buildRendering:function(){this.templateString||(this.templateString=cache(this.templatePath,{sanitize:!0}));var cached=_TemplatedMixin.getCachedTemplate(this.templateString,this._skipNodeCache,this.ownerDocument),node;if(lang.isString(cached)){node=domConstruct.toDom(this._stringRepl(cached),this.ownerDocument);if(node.nodeType!=1)throw new Error("Invalid template: "+cached)}else node=cached.cloneNode(!0);this.domNode=node,this.inherited(arguments),this._attachTemplateNodes(node,function(n,p){return n.getAttribute(p)}),this._beforeFillContent(),this._fillContent(this.srcNodeRef)},_beforeFillContent:function(){},_fillContent:function(source){var dest=this.containerNode;if(source&&dest)while(source.hasChildNodes())dest.appendChild(source.firstChild)},_attachTemplateNodes:function(rootNode,getAttrFunc){var nodes=lang.isArray(rootNode)?rootNode:rootNode.all||rootNode.getElementsByTagName("*"),x=lang.isArray(rootNode)?0:-1;for(;x<0||nodes[x];x++){var baseNode=x==-1?rootNode:nodes[x];if(this.widgetsInTemplate&&(getAttrFunc(baseNode,"dojoType")||getAttrFunc(baseNode,"data-dojo-type")))continue;var attachPoint=getAttrFunc(baseNode,"dojoAttachPoint")||getAttrFunc(baseNode,"data-dojo-attach-point");if(attachPoint){var point,points=attachPoint.split(/\s*,\s*/);while(point=points.shift())lang.isArray(this[point])?this[point].push(baseNode):this[point]=baseNode,this._attachPoints.push(point)}var attachEvent=getAttrFunc(baseNode,"dojoAttachEvent")||getAttrFunc(baseNode,"data-dojo-attach-event");if(attachEvent){var event,events=attachEvent.split(/\s*,\s*/),trim=lang.trim;while(event=events.shift())if(event){var thisFunc=null;if(event.indexOf(":")!=-1){var funcNameArr=event.split(":");event=trim(funcNameArr[0]),thisFunc=trim(funcNameArr[1])}else event=trim(event);thisFunc||(thisFunc=event),event=event.replace(/^on/,"").toLowerCase(),event=="dijitclick"?event=a11yclick||(a11yclick=require("./a11yclick")):event=synthEvents[event]||event,this._attachEvents.push(this.own(on(baseNode,event,lang.hitch(this,thisFunc)))[0])}}}},destroyRendering:function(){array.forEach(this._attachPoints,function(point){delete this[point]},this),this._attachPoints=[],array.forEach(this._attachEvents,this.disconnect,this),this._attachEvents=[],this.inherited(arguments)}});return _TemplatedMixin._templateCache={},_TemplatedMixin.getCachedTemplate=function(templateString,alwaysUseString,doc){var tmplts=_TemplatedMixin._templateCache,key=templateString,cached=tmplts[key];if(cached){try{if(!cached.ownerDocument||cached.ownerDocument==(doc||document))return cached}catch(e){}domConstruct.destroy(cached)}templateString=string.trim(templateString);if(alwaysUseString||templateString.match(/\$\{([^\}]+)\}/g))return tmplts[key]=templateString;var node=domConstruct.toDom(templateString,doc);if(node.nodeType!=1)throw new Error("Invalid template: "+templateString);return tmplts[key]=node},has("ie")&&unload.addOnWindowUnload(function(){var cache=_TemplatedMixin._templateCache;for(var key in cache){var value=cache[key];typeof value=="object"&&domConstruct.destroy(value),delete cache[key]}}),lang.extend(_WidgetBase,{dojoAttachEvent:"",dojoAttachPoint:""}),_TemplatedMixin})