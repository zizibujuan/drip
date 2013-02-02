//>>built
define("dojox/mobile/ValuePickerSlot","dojo/_base/array,dojo/_base/declare,dojo/_base/event,dojo/_base/lang,dojo/_base/window,dojo/dom-class,dojo/dom-construct,dojo/touch,dijit/_WidgetBase,./iconUtils,dojo/has,dojo/has!dojo-bidi?dojox/mobile/bidi/ValuePickerSlot".split(","),function(e,j,n,h,k,i,d,f,g,l,m,o){g=j(m("dojo-bidi")?"dojox.mobile.NonBidiValuePickerSlot":"dojox.mobile.ValuePickerSlot",g,{items:[],labels:[],labelFrom:0,labelTo:0,zeroPad:0,value:"",step:1,readOnly:!1,tabIndex:"0",baseClass:"mblValuePickerSlot",
buildRendering:function(){this.inherited(arguments);this.initLabels();if(0<this.labels.length){this.items=[];for(var a=0;a<this.labels.length;a++)this.items.push([a,this.labels[a]])}this.plusBtnNode=d.create("div",{className:"mblValuePickerSlotPlusButton mblValuePickerSlotButton",title:"+"},this.domNode);this.plusIconNode=d.create("div",{className:"mblValuePickerSlotIcon"},this.plusBtnNode);l.createIcon("mblDomButtonGrayPlus",null,this.plusIconNode);this.inputAreaNode=d.create("div",{className:"mblValuePickerSlotInputArea"},
this.domNode);this.inputNode=d.create("input",{className:"mblValuePickerSlotInput",readonly:this.readOnly},this.inputAreaNode);this.minusBtnNode=d.create("div",{className:"mblValuePickerSlotMinusButton mblValuePickerSlotButton",title:"-"},this.domNode);this.minusIconNode=d.create("div",{className:"mblValuePickerSlotIcon"},this.minusBtnNode);l.createIcon("mblDomButtonGrayMinus",null,this.minusIconNode);if(""===this.value&&0<this.items.length)this.value=this.items[0][1];this._initialValue=this.value},
startup:function(){if(!this._started)this._handlers=[this.connect(this.plusBtnNode,f.press,"_onTouchStart"),this.connect(this.minusBtnNode,f.press,"_onTouchStart"),this.connect(this.plusBtnNode,"onkeydown","_onClick"),this.connect(this.minusBtnNode,"onkeydown","_onClick"),this.connect(this.inputNode,"onchange",h.hitch(this,function(a){this._onChange(a)}))],this.inherited(arguments)},initLabels:function(){if(this.labelFrom!==this.labelTo)for(var a=this.labels=[],b=this.zeroPad&&Array(this.zeroPad).join("0"),
c=this.labelFrom;c<=this.labelTo;c+=this.step)a.push(this.zeroPad?(b+c).slice(-this.zeroPad):c+"")},spin:function(a){for(var b=-1,c=this.get("value"),d=this.items.length,e=0;e<d;e++)if(this.items[e][1]===c){b=e;break}-1!=c&&(b+=a,0>b&&(b+=(Math.abs(Math.ceil(b/d))+1)*d),this.set("value",this.items[b%d][1]))},setInitialValue:function(){this.set("value",this._initialValue)},_onClick:function(a){if(!(a&&"keydown"===a.type&&13!==a.keyCode||!1===this.onClick(a))){a=a.currentTarget;if(a===this.plusBtnNode||
a===this.minusBtnNode)this._btn=a;this.spin(this._btn===this.plusBtnNode?1:-1)}},onClick:function(){},_onChange:function(a){!1!==this.onChange(a)&&(a=this.validate(this.get("value")),this.set("value",a.length?a[0][1]:this.value))},onChange:function(){},validate:function(a){return e.filter(this.items,function(b){return(b[1]+"").toLowerCase()==(a+"").toLowerCase()})},_onTouchStart:function(a){this._conn=[this.connect(k.body(),f.move,"_onTouchMove"),this.connect(k.body(),f.release,"_onTouchEnd")];this.touchStartX=
a.touches?a.touches[0].pageX:a.clientX;this.touchStartY=a.touches?a.touches[0].pageY:a.clientY;i.add(a.currentTarget,"mblValuePickerSlotButtonSelected");this._btn=a.currentTarget;if(this._timer)clearTimeout(this._timer),this._timer=null;if(this._interval)clearInterval(this._interval),this._interval=null;this._timer=setTimeout(h.hitch(this,function(){this._interval=setInterval(h.hitch(this,function(){this.spin(this._btn===this.plusBtnNode?1:-1)}),60);this._timer=null}),1E3);n.stop(a)},_onTouchMove:function(a){var b=
a.touches?a.touches[0].pageY:a.clientY;if(4<=Math.abs((a.touches?a.touches[0].pageX:a.clientX)-this.touchStartX)||4<=Math.abs(b-this.touchStartY)){if(this._timer)clearTimeout(this._timer),this._timer=null;if(this._interval)clearInterval(this._interval),this._interval=null;e.forEach(this._conn,this.disconnect,this);i.remove(this._btn,"mblValuePickerSlotButtonSelected")}},_onTouchEnd:function(a){if(this._timer)clearTimeout(this._timer),this._timer=null;e.forEach(this._conn,this.disconnect,this);i.remove(this._btn,
"mblValuePickerSlotButtonSelected");this._interval?(clearInterval(this._interval),this._interval=null):this._onClick(a)},_getKeyAttr:function(){var a=this.get("value"),b=e.filter(this.items,function(b){return b[1]===a})[0];return b?b[0]:null},_getValueAttr:function(){return this.inputNode.value},_setValueAttr:function(a){this._spinToValue(a,!0)},_spinToValue:function(a,b){if(this.get("value")!=a){this.inputNode.value=a;b&&this._set("value",a);var c=this.getParent();if(c&&c.onValueChanged)c.onValueChanged(this)}},
_setTabIndexAttr:function(a){this.plusBtnNode.setAttribute("tabIndex",a);this.minusBtnNode.setAttribute("tabIndex",a)}});return m("dojo-bidi")?j("dojox.mobile.ValuePickerSlot",[g,o]):g});