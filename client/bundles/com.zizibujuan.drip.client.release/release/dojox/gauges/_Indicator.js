//>>built
define("dojox/gauges/_Indicator",["dojo/_base/lang","dojo/_base/declare","dojo/_base/fx","dojo/_base/html","dojo/_base/connect","dijit/_Widget","dojo/dom-construct","dojo/dom-class"],function(lang,declare,fx,html,connect,Widget,dom,domClass){return declare("dojox.gauges._Indicator",[Widget],{value:0,type:"",color:"black",strokeColor:"",label:"",font:{family:"sans-serif",size:"12px"},length:0,width:0,offset:0,hover:"",front:!1,easing:fx._defaultEasing,duration:1e3,hideValue:!1,noChange:!1,interactionMode:"indicator",_gauge:null,title:"",startup:function(){this.onDragMove&&(this.onDragMove=lang.hitch(this.onDragMove)),this.strokeColor===""&&(this.strokeColor=undefined)},postCreate:function(){this.title===""&&html.style(this.domNode,"display","none"),lang.isString(this.easing)&&(this.easing=lang.getObject(this.easing))},buildRendering:function(){var n=this.domNode=this.srcNodeRef?this.srcNodeRef:dom.create("div");domClass.add(n,"dojoxGaugeIndicatorDiv");var title=dom.create("label");this.title&&(title.innerHTML=this.title+":"),dom.place(title,n),this.valueNode=dom.create("input",{className:"dojoxGaugeIndicatorInput",size:5,value:this.value}),dom.place(this.valueNode,n),connect.connect(this.valueNode,"onchange",this,this._update)},_update:function(){this._updateValue(!0)},_updateValue:function(animate){var value=this.valueNode.value;value===""?this.value=null:(this.value=Number(value),this.hover=this.title+": "+value),this._gauge&&(this.draw(this._gauge._indicatorsGroup,animate||animate==undefined?!1:!0),this.valueNode.value=this.value,(this.title=="Target"||this.front)&&this._gauge.moveIndicator&&this._gauge.moveIndicatorToFront(this),this.valueChanged())},valueChanged:function(){},update:function(value,animate){this.noChange||(this.valueNode.value=value,this._updateValue(animate))},handleMouseOver:function(e){this._gauge._handleMouseOverIndicator(this,e)},handleMouseOut:function(e){this._gauge._handleMouseOutIndicator(this,e),this._gauge.gaugeContent.style.cursor=""},handleMouseDown:function(e){this._gauge._handleMouseDownIndicator(this,e)},handleTouchStart:function(e){this._gauge.handleTouchStartIndicator(this,e)},onDragMove:function(){this.value=Math.floor(this.value),this.valueNode.value=this.value,this.hover=this.title+": "+this.value},draw:function(dontAnimate){},remove:function(){this.shape&&this.shape.parent.remove(this.shape),this.shape=null,this.text&&this.text.parent.remove(this.text),this.text=null}})})