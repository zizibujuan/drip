//>>built
define("dijit/form/FilteringSelect",["dojo/_base/declare","dojo/_base/lang","dojo/when","./MappedTextBox","./ComboBoxMixin"],function(j,f,i,k,l){return j("dijit.form.FilteringSelect",[k,l],{required:!0,_lastDisplayedValue:"",_isValidSubset:function(){return this._opened},isValid:function(){return!!this.item||!this.required&&""==this.get("displayedValue")},_refreshState:function(){this.searchTimer||this.inherited(arguments)},_callbackSetLabel:function(a,b,c,d){b&&b[this.searchAttr]!==this._lastQuery||
!b&&a.length&&this.store.getIdentity(a[0])!=this._lastQuery||(a.length?this.set("item",a[0],d):this.set("value","",d||void 0===d&&!this.focused,this.textbox.value,null))},_openResultList:function(a,b,c){b[this.searchAttr]===this._lastQuery&&(this.inherited(arguments),void 0===this.item&&this.validate(!0))},_getValueAttr:function(){return this.valueNode.value},_getValueField:function(){return"value"},_setValueAttr:function(a,b,c,d){this._onChangeActive||(b=null);if(void 0===d){if(null===a||""===a)if(a=
"",!f.isString(c)){this._setDisplayedValueAttr(c||"",b);return}var e=this;this._lastQuery=a;i(this.store.get(a),function(a){e._callbackSetLabel(a?[a]:[],void 0,void 0,b)})}else this.valueNode.value=a,this.inherited(arguments)},_setItemAttr:function(a,b,c){this.inherited(arguments);this._lastDisplayedValue=this.textbox.value},_getDisplayQueryString:function(a){return a.replace(/([\\\*\?])/g,"\\$1")},_setDisplayedValueAttr:function(a,b){null==a&&(a="");if(!this._created){if(!("displayedValue"in this.params))return;
b=!1}if(this.store){this.closeDropDown();var c=f.clone(this.query),d=this._getDisplayQueryString(a),e;this.store._oldAPI?e=d:(e=this._patternToRegExp(d),e.toString=function(){return d});this._lastQuery=c[this.searchAttr]=e;this._lastDisplayedValue=this.textbox.value=a;this._set("displayedValue",a);var g=this,h={ignoreCase:this.ignoreCase,deep:!0};f.mixin(h,this.fetchProperties);this._fetchHandle=this.store.query(c,h);i(this._fetchHandle,function(a){g._fetchHandle=null;g._callbackSetLabel(a||[],c,
h,b)},function(){g._fetchHandle=null})}},undo:function(){this.set("displayedValue",this._lastDisplayedValue)}})});