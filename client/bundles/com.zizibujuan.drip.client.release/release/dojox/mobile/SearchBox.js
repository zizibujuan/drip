//>>built
define("dojox/mobile/SearchBox",["dojo/_base/declare","dojo/_base/lang","dijit/form/_SearchMixin","dojox/mobile/TextBox","dojo/dom-class","dojo/keys","./sniff"],function(declare,lang,SearchMixin,TextBox,domClass,keys,has){return declare("dojox.mobile.SearchBox",[TextBox,SearchMixin],{baseClass:"mblTextBox mblSearchBox",type:"search",placeHolder:"",incremental:!0,_setIncrementalAttr:function(val){this.incremental=val},_onInput:function(e){e.charOrCode==keys.ENTER?e.charOrCode=229:this.incremental||(e.charOrCode=0),this.inherited(arguments)},postCreate:function(){this.inherited(arguments),this.textbox.removeAttribute("incremental"),this.textbox.hasAttribute("results")||this.textbox.setAttribute("results","0"),has("iphone")<5&&(domClass.add(this.domNode,"iphone4"),this.connect(this.textbox,"onfocus",function(){this.textbox.value!==""&&setTimeout(lang.hitch(this,function(){this.textbox.value===""&&this._onInput({charOrCode:keys.ENTER})}),0)})),this.connect(this.textbox,"onsearch",function(){this._onInput({charOrCode:keys.ENTER})})}})})