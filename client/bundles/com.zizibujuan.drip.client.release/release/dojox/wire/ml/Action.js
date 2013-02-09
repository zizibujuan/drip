//>>built
define("dojox/wire/ml/Action",["dojo","dijit","dojox","dojo/require!dijit/_Widget,dijit/_Container,dojox/wire/Wire,dojox/wire/ml/util"],function(dojo,dijit,dojox){dojo.provide("dojox.wire.ml.Action"),dojo.require("dijit._Widget"),dojo.require("dijit._Container"),dojo.require("dojox.wire.Wire"),dojo.require("dojox.wire.ml.util"),dojo.declare("dojox.wire.ml.Action",[dijit._Widget,dijit._Container],{trigger:"",triggerEvent:"",triggerTopic:"",postCreate:function(){this._connect()},_connect:function(){if(this.triggerEvent)if(this.trigger){var scope=dojox.wire.ml._getValue(this.trigger);scope&&(scope[this.triggerEvent]||(scope[this.triggerEvent]=function(){}),this._triggerHandle=dojo.connect(scope,this.triggerEvent,this,"run"))}else{var event=this.triggerEvent.toLowerCase();if(event=="onload"){var self=this;dojo.addOnLoad(function(){self._run.apply(self,arguments)})}}else this.triggerTopic&&(this._triggerHandle=dojo.subscribe(this.triggerTopic,this,"run"))},_disconnect:function(){this._triggerHandle&&(this.triggerTopic?dojo.unsubscribe(this.triggerTopic,this._triggerHandle):dojo.disconnect(this._triggerHandle))},run:function(){var children=this.getChildren();for(var i in children){var child=children[i];if(child instanceof dojox.wire.ml.ActionFilter&&!child.filter.apply(child,arguments))return}this._run.apply(this,arguments)},_run:function(){var children=this.getChildren();for(var i in children){var child=children[i];child instanceof dojox.wire.ml.Action&&child.run.apply(child,arguments)}},uninitialize:function(){return this._disconnect(),!0}}),dojo.declare("dojox.wire.ml.ActionFilter",dijit._Widget,{required:"",requiredValue:"",type:"",message:"",error:"",filter:function(){if(this.required==="")return!0;var value=dojox.wire.ml._getValue(this.required,arguments);if(this.requiredValue===""){if(value)return!0}else{var reqValue=this.requiredValue;if(this.type!==""){var lType=this.type.toLowerCase();lType==="boolean"?reqValue.toLowerCase()==="false"?reqValue=!1:reqValue=!0:lType==="number"&&(reqValue=parseInt(reqValue,10))}if(value===reqValue)return!0}return this.message&&(this.error?dojox.wire.ml._setValue(this.error,this.message):alert(this.message)),!1}})})