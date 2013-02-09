//>>built
define("dijit/form/_FormMixin",["dojo/_base/array","dojo/_base/declare","dojo/_base/kernel","dojo/_base/lang","dojo/on","dojo/window"],function(array,declare,kernel,lang,on,winUtils){return declare("dijit.form._FormMixin",null,{state:"",_getDescendantFormWidgets:function(children){var res=[];return array.forEach(children||this.getChildren(),function(child){"value"in child?res.push(child):res=res.concat(this._getDescendantFormWidgets(child.getChildren()))},this),res},reset:function(){array.forEach(this._getDescendantFormWidgets(),function(widget){widget.reset&&widget.reset()})},validate:function(){var didFocus=!1;return array.every(array.map(this._getDescendantFormWidgets(),function(widget){widget._hasBeenBlurred=!0;var valid=widget.disabled||!widget.validate||widget.validate();return!valid&&!didFocus&&(winUtils.scrollIntoView(widget.containerNode||widget.domNode),widget.focus(),didFocus=!0),valid}),function(item){return item})},setValues:function(val){return kernel.deprecated(this.declaredClass+"::setValues() is deprecated. Use set('value', val) instead.","","2.0"),this.set("value",val)},_setValueAttr:function(obj){var map={};array.forEach(this._getDescendantFormWidgets(),function(widget){if(!widget.name)return;var entry=map[widget.name]||(map[widget.name]=[]);entry.push(widget)});for(var name in map){if(!map.hasOwnProperty(name))continue;var widgets=map[name],values=lang.getObject(name,!1,obj);if(values===undefined)continue;values=[].concat(values),typeof widgets[0].checked=="boolean"?array.forEach(widgets,function(w){w.set("value",array.indexOf(values,w.value)!=-1)}):widgets[0].multiple?widgets[0].set("value",values):array.forEach(widgets,function(w,i){w.set("value",values[i])})}},getValues:function(){return kernel.deprecated(this.declaredClass+"::getValues() is deprecated. Use get('value') instead.","","2.0"),this.get("value")},_getValueAttr:function(){var obj={};return array.forEach(this._getDescendantFormWidgets(),function(widget){var name=widget.name;if(!name||widget.disabled)return;var value=widget.get("value");if(typeof widget.checked=="boolean")if(/Radio/.test(widget.declaredClass))value!==!1?lang.setObject(name,value,obj):(value=lang.getObject(name,!1,obj),value===undefined&&lang.setObject(name,null,obj));else{var ary=lang.getObject(name,!1,obj);ary||(ary=[],lang.setObject(name,ary,obj)),value!==!1&&ary.push(value)}else{var prev=lang.getObject(name,!1,obj);typeof prev!="undefined"?lang.isArray(prev)?prev.push(value):lang.setObject(name,[prev,value],obj):lang.setObject(name,value,obj)}}),obj},isValid:function(){return this.state==""},onValidStateChange:function(){},_getState:function(){var states=array.map(this._descendants,function(w){return w.get("state")||""});return array.indexOf(states,"Error")>=0?"Error":array.indexOf(states,"Incomplete")>=0?"Incomplete":""},disconnectChildren:function(){},connectChildren:function(inStartup){this._descendants=this._getDescendantFormWidgets(),array.forEach(this._descendants,function(child){child._started||child.startup()}),inStartup||this._onChildChange()},_onChildChange:function(attr){(!attr||attr=="state"||attr=="disabled")&&this._set("state",this._getState());if(!attr||attr=="value"||attr=="disabled"||attr=="checked")this._onChangeDelayTimer&&this._onChangeDelayTimer.remove(),this._onChangeDelayTimer=this.defer(function(){delete this._onChangeDelayTimer,this._set("value",this.get("value"))},10)},startup:function(){this.inherited(arguments),this._descendants=this._getDescendantFormWidgets(),this.value=this.get("value"),this.state=this._getState();var self=this;this.own(on(this.containerNode,"attrmodified-state, attrmodified-disabled, attrmodified-value, attrmodified-checked",function(evt){if(evt.target==self.domNode)return;self._onChildChange(evt.type.replace("attrmodified-",""))})),this.watch("state",function(attr,oldVal,newVal){this.onValidStateChange(newVal=="")})},destroy:function(){this.inherited(arguments)}})})