//>>built
define("dojox/mvc/_atBindingMixin",["dojo/_base/array","dojo/_base/lang","dojo/_base/declare","dojo/has","dojo/Stateful","./resolve","./sync"],function(array,lang,declare,has,Stateful,resolve,sync){function getParent(w){var registry;try{registry=require("dijit/registry")}catch(e){return}var pn=w.domNode&&w.domNode.parentNode,pw,pb;while(pn){pw=registry.getEnclosingWidget(pn);if(pw){var relTargetProp=pw._relTargetProp||"target",pt=lang.isFunction(pw.get)?pw.get(relTargetProp):pw[relTargetProp];if(pt||relTargetProp in pw.constructor.prototype)return pw}pn=pw&&pw.domNode.parentNode}}function bind(source,sourceProp,target,targetProp,options){function resolveAndBind(){_handles.Two&&_handles.Two.unwatch(),delete _handles.Two;var relTarget=parent&&(lang.isFunction(parent.get)?parent.get(relTargetProp):parent[relTargetProp]),resolvedSource=resolve(source,relTarget),resolvedTarget=resolve(target,relTarget);has("mvc-bindings-log-api")&&(!resolvedSource||/^rel:/.test(source)&&!parent)&&logResolveFailure(source,sourceProp),has("mvc-bindings-log-api")&&(!resolvedTarget||/^rel:/.test(target)&&!parent)&&logResolveFailure(target,targetProp);if(!resolvedSource||!resolvedTarget||(/^rel:/.test(source)||/^rel:/.test(target))&&!parent)return;if((!resolvedSource.set||!resolvedSource.watch)&&sourceProp=="*"){has("mvc-bindings-log-api")&&logResolveFailure(source,sourceProp);return}sourceProp==null?(lang.isFunction(resolvedTarget.set)?resolvedTarget.set(targetProp,resolvedSource):resolvedTarget[targetProp]=resolvedSource,has("mvc-bindings-log-api")&&0):_handles.Two=sync(resolvedSource,sourceProp,resolvedTarget,targetProp,options)}var _handles={},parent=getParent(target),relTargetProp=parent&&parent._relTargetProp||"target";resolveAndBind();if(parent&&/^rel:/.test(source)||/^rel:/.test(target)&&lang.isFunction(parent.set)&&lang.isFunction(parent.watch))_handles.rel=parent.watch(relTargetProp,function(name,old,current){old!==current&&(has("mvc-bindings-log-api")&&0,resolveAndBind())});var h={};return h.unwatch=h.remove=function(){for(var s in _handles)_handles[s]&&_handles[s].unwatch(),delete _handles[s]},h}if(has("mvc-bindings-log-api")){function getLogContent(target,targetProp){return[target._setIdAttr||!target.declaredClass?target:target.declaredClass,targetProp].join(":")}function logResolveFailure(target,targetProp){0}}var _atBindingMixin=declare("dojox/mvc/_atBindingMixin",null,{dataBindAttr:"data-mvc-bindings",_dbpostscript:function(params,srcNodeRef){var refs=this._refs=(params||{}).refs||{};for(var prop in params)if((params[prop]||{}).atsignature=="dojox.mvc.at"){var h=params[prop];delete params[prop],refs[prop]=h}var dbParams=new Stateful,_self=this;dbParams.toString=function(){return"[Mixin value of widget "+_self.declaredClass+", "+(_self.id||"NO ID")+"]"},dbParams.canConvertToLoggable=!0,this._startAtWatchHandles(dbParams);for(var prop in refs)dbParams[prop]!==void 0&&((params=params||{})[prop]=dbParams[prop]);this._stopAtWatchHandles()},_startAtWatchHandles:function(bindWith){this.canConvertToLoggable=!0;var refs=this._refs;if(refs){var atWatchHandles=this._atWatchHandles=this._atWatchHandles||{};this._excludes=null;for(var prop in refs){if(!refs[prop]||prop=="*")continue;atWatchHandles[prop]=bind(refs[prop].target,refs[prop].targetProp,bindWith||this,prop,{bindDirection:refs[prop].bindDirection,converter:refs[prop].converter})}(refs["*"]||{}).atsignature=="dojox.mvc.at"&&(atWatchHandles["*"]=bind(refs["*"].target,refs["*"].targetProp,bindWith||this,"*",{bindDirection:refs["*"].bindDirection,converter:refs["*"].converter}))}},_stopAtWatchHandles:function(){for(var s in this._atWatchHandles)this._atWatchHandles[s].unwatch(),delete this._atWatchHandles[s]},_setAtWatchHandle:function(name,value){if(name=="ref")throw new Error(this+": 1.7 ref syntax used in conjuction with 1.8 dojox/mvc/at syntax, which is not supported.");var atWatchHandles=this._atWatchHandles=this._atWatchHandles||{};atWatchHandles[name]&&(atWatchHandles[name].unwatch(),delete atWatchHandles[name]),this[name]=null,this._excludes=null,this._started?atWatchHandles[name]=bind(value.target,value.targetProp,this,name,{bindDirection:value.bindDirection,converter:value.converter}):this._refs[name]=value},_setBind:function(value){var list=eval("({"+value+"})");for(var prop in list){var h=list[prop];(h||{}).atsignature!="dojox.mvc.at"?0:this._setAtWatchHandle(prop,h)}},_getExcludesAttr:function(){if(this._excludes)return this._excludes;var list=[];for(var s in this._atWatchHandles)s!="*"&&list.push(s);return list},_getPropertiesAttr:function(){if(this.constructor._attribs)return this.constructor._attribs;var list=["onClick"].concat(this.constructor._setterAttrs);return array.forEach(["id","excludes","properties","ref","binding"],function(s){var index=array.indexOf(list,s);index>=0&&list.splice(index,1)}),this.constructor._attribs=list}});return _atBindingMixin.prototype[_atBindingMixin.prototype.dataBindAttr]="",_atBindingMixin})