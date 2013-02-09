//>>built
define("dojox/editor/plugins/TextColor",["dojo","dijit","dojox","dijit/_base/popup","dijit/_Widget","dijit/_TemplatedMixin","dijit/_WidgetsInTemplateMixin","dijit/_editor/_Plugin","dijit/TooltipDialog","dijit/form/Button","dijit/form/DropDownButton","dojox/widget/ColorPicker","dojo/_base/connect","dojo/_base/declare","dojo/i18n","dojo/i18n!dojox/editor/plugins/nls/TextColor"],function(dojo,dijit,dojox,popup,_Widget,_TemplatedMixin,_WidgetsInTemplateMixin,_Plugin){return dojo.experimental("dojox.editor.plugins.TextColor"),dojo.declare("dojox.editor.plugins._TextColorDropDown",[_Widget,_TemplatedMixin,_WidgetsInTemplateMixin],{templateString:"<div style='display: none; position: absolute; top: -10000; z-index: -10000'><div dojoType='dijit.TooltipDialog' dojoAttachPoint='dialog' class='dojoxEditorColorPicker'><div dojoType='dojox.widget.ColorPicker' dojoAttachPoint='_colorPicker'></div><br><center><button dojoType='dijit.form.Button' type='button' dojoAttachPoint='_setButton'>${setButtonText}</button>&nbsp;<button dojoType='dijit.form.Button' type='button' dojoAttachPoint='_cancelButton'>${cancelButtonText}</button></center></div></div>",widgetsInTemplate:!0,constructor:function(){var strings=dojo.i18n.getLocalization("dojox.editor.plugins","TextColor");dojo.mixin(this,strings)},startup:function(){this._started||(this.inherited(arguments),this.connect(this._setButton,"onClick",dojo.hitch(this,function(){this.onChange(this.get("value"))})),this.connect(this._cancelButton,"onClick",dojo.hitch(this,function(){dijit.popup.close(this.dialog),this.onCancel()})),dojo.style(this.domNode,"display","block"))},_setValueAttr:function(value,priorityChange){this._colorPicker.set("value",value,priorityChange)},_getValueAttr:function(){return this._colorPicker.get("value")},onChange:function(value){},onCancel:function(){}}),dojo.declare("dojox.editor.plugins.TextColor",_Plugin,{buttonClass:dijit.form.DropDownButton,useDefaultCommand:!1,constructor:function(){this._picker=new dojox.editor.plugins._TextColorDropDown,dojo.body().appendChild(this._picker.domNode),this._picker.startup(),this.dropDown=this._picker.dialog,this.connect(this._picker,"onChange",function(color){this.editor.execCommand(this.command,color)}),this.connect(this._picker,"onCancel",function(){this.editor.focus()})},updateState:function(){var _e=this.editor,_c=this.command;if(!_e||!_e.isLoaded||!_c.length)return;var disabled=this.get("disabled"),value;if(this.button){this.button.set("disabled",disabled);if(disabled)return;try{value=_e.queryCommandValue(_c)||""}catch(e){value=""}}value==""&&(value="#000000"),value=="transparent"&&(value="#ffffff"),typeof value=="string"?value.indexOf("rgb")>-1&&(value=dojo.colorFromRgb(value).toHex()):(value=(value&255)<<16|value&65280|(value&16711680)>>>16,value=value.toString(16),value="#000000".slice(0,7-value.length)+value),value!==this._picker.get("value")&&this._picker.set("value",value,!1)},destroy:function(){this.inherited(arguments),this._picker.destroyRecursive(),delete this._picker}}),dojo.subscribe(dijit._scopeName+".Editor.getPlugin",null,function(o){if(o.plugin)return;switch(o.args.name){case"foreColor":case"hiliteColor":o.plugin=new dojox.editor.plugins.TextColor({command:o.args.name})}}),dojox.editor.plugins.TextColor})