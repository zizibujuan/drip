//>>built
define("dijit/form/_TextBoxMixin","dojo/_base/array dojo/_base/declare dojo/dom dojo/has dojo/keys dojo/_base/lang dojo/on ../main".split(" "),function(p,h,n,k,b,g,l,m){var e=h("dijit.form._TextBoxMixin"+(k("dojo-bidi")?"_NoBidi":""),null,{trim:!1,uppercase:!1,lowercase:!1,propercase:!1,maxLength:"",selectOnClick:!1,placeHolder:"",_getValueAttr:function(){return this.parse(this.get("displayedValue"),this.constraints)},_setValueAttr:function(a,c,b){var d;void 0!==a&&(d=this.filter(a),"string"!=typeof b&&
(b=null!==d&&("number"!=typeof d||!isNaN(d))?this.filter(this.format(d,this.constraints)):""));if(null!=b&&("number"!=typeof b||!isNaN(b))&&this.textbox.value!=b)this.textbox.value=b,this._set("displayedValue",this.get("displayedValue"));this.inherited(arguments,[d,c])},displayedValue:"",_getDisplayedValueAttr:function(){return this.filter(this.textbox.value)},_setDisplayedValueAttr:function(a){null==a?a="":"string"!=typeof a&&(a=String(a));this.textbox.value=a;this._setValueAttr(this.get("value"),
void 0);this._set("displayedValue",this.get("displayedValue"))},format:function(a){return null==a?"":a.toString?a.toString():a},parse:function(a){return a},_refreshState:function(){},onInput:function(){},__skipInputEvent:!1,_onInput:function(a){this._processInput(a);this.intermediateChanges&&this.defer(function(){this._handleOnChange(this.get("value"),!1)})},_processInput:function(a){this._refreshState();this._set("displayedValue",this.get("displayedValue"))},postCreate:function(){this.textbox.setAttribute("value",
this.textbox.value);this.inherited(arguments);this.own(l(this.textbox,"keydown, keypress, paste, cut, input, compositionend",g.hitch(this,function(a){var c;if("keydown"==a.type){c=a.keyCode;switch(c){case b.SHIFT:case b.ALT:case b.CTRL:case b.META:case b.CAPS_LOCK:case b.NUM_LOCK:case b.SCROLL_LOCK:return}if(!a.ctrlKey&&!a.metaKey&&!a.altKey){switch(c){case b.NUMPAD_0:case b.NUMPAD_1:case b.NUMPAD_2:case b.NUMPAD_3:case b.NUMPAD_4:case b.NUMPAD_5:case b.NUMPAD_6:case b.NUMPAD_7:case b.NUMPAD_8:case b.NUMPAD_9:case b.NUMPAD_MULTIPLY:case b.NUMPAD_PLUS:case b.NUMPAD_ENTER:case b.NUMPAD_MINUS:case b.NUMPAD_PERIOD:case b.NUMPAD_DIVIDE:return}if(65<=
c&&90>=c||48<=c&&57>=c||c==b.SPACE)return;c=!1;for(var f in b)if(b[f]===a.keyCode){c=!0;break}if(!c)return}}(c=32<=a.charCode?String.fromCharCode(a.charCode):a.charCode)||(c=65<=a.keyCode&&90>=a.keyCode||48<=a.keyCode&&57>=a.keyCode||a.keyCode==b.SPACE?String.fromCharCode(a.keyCode):a.keyCode);c||(c=229);if("keypress"==a.type){if("string"!=typeof c)return;if("a"<=c&&"z">=c||"A"<=c&&"Z">=c||"0"<=c&&"9">=c||" "===c)if(a.ctrlKey||a.metaKey||a.altKey)return}if("input"==a.type){if(this.__skipInputEvent){this.__skipInputEvent=
!1;return}}else this.__skipInputEvent=!0;var d={faux:!0},e;for(e in a)"layerX"!=e&&"layerY"!=e&&(f=a[e],"function"!=typeof f&&"undefined"!=typeof f&&(d[e]=f));g.mixin(d,{charOrCode:c,_wasConsumed:!1,preventDefault:function(){d._wasConsumed=!0;a.preventDefault()},stopPropagation:function(){a.stopPropagation()}});!1===this.onInput(d)&&(d.preventDefault(),d.stopPropagation());d._wasConsumed||this.defer(function(){this._onInput(d)})})))},_blankValue:"",filter:function(a){if(null===a)return this._blankValue;
if("string"!=typeof a)return a;this.trim&&(a=g.trim(a));this.uppercase&&(a=a.toUpperCase());this.lowercase&&(a=a.toLowerCase());this.propercase&&(a=a.replace(/[^\s]+/g,function(a){return a.substring(0,1).toUpperCase()+a.substring(1)}));return a},_setBlurValue:function(){this._setValueAttr(this.get("value"),!0)},_onBlur:function(a){this.disabled||(this._setBlurValue(),this.inherited(arguments))},_isTextSelected:function(){return this.textbox.selectionStart!=this.textbox.selectionEnd},_onFocus:function(a){!this.disabled&&
!this.readOnly&&(this.selectOnClick&&"mouse"==a&&(this._selectOnClickHandle=l.once(this.domNode,"mouseup, touchend",g.hitch(this,function(a){this._isTextSelected()||e.selectInputText(this.textbox)})),this.own(this._selectOnClickHandle),this.defer(function(){this._selectOnClickHandle&&(this._selectOnClickHandle.remove(),this._selectOnClickHandle=null)},500)),this.inherited(arguments),this._refreshState())},reset:function(){this.textbox.value="";this.inherited(arguments)}});k("dojo-bidi")&&(e=h("dijit.form._TextBoxMixin",
e,{_setValueAttr:function(){this.inherited(arguments);this.applyTextDir(this.focusNode)},_setDisplayedValueAttr:function(){this.inherited(arguments);this.applyTextDir(this.focusNode)},_onInput:function(){this.applyTextDir(this.focusNode);this.inherited(arguments)}}));e._setSelectionRange=m._setSelectionRange=function(a,b,e){a.setSelectionRange&&a.setSelectionRange(b,e)};e.selectInputText=m.selectInputText=function(a,b,f){a=n.byId(a);isNaN(b)&&(b=0);isNaN(f)&&(f=a.value?a.value.length:0);try{a.focus(),
e._setSelectionRange(a,b,f)}catch(d){}};return e});
//@ sourceMappingURL=_TextBoxMixin.js.map