//>>built
define("dojox/form/MonthTextBox",["dojo/_base/kernel","dojo/_base/lang","dojox/widget/MonthlyCalendar","dijit/form/TextBox","./DateTextBox","dojo/_base/declare"],function(kernel,lang,MonthlyCalendar,TextBox,DateTextBox,declare){return kernel.experimental("dojox/form/DateTextBox"),declare("dojox.form.MonthTextBox",DateTextBox,{popupClass:MonthlyCalendar,selector:"date",postMixInProperties:function(){this.inherited(arguments),this.constraints.datePattern="MM"},format:function(value){return!value&&value!==0?1:value.getMonth?value.getMonth()+1:Number(value)+1},parse:function(value,constraints){return Number(value)-1},serialize:function(value,constraints){return String(value)},validator:function(value){var num=Number(value),isInt=/(^-?\d\d*$)/.test(String(value));return value==""||value==null||isInt&&num>=1&&num<=12},_setValueAttr:function(value,priorityChange,formattedValue){value&&value.getMonth&&(value=value.getMonth()),TextBox.prototype._setValueAttr.call(this,value,priorityChange,formattedValue)},openDropDown:function(){this.inherited(arguments),this.dropDown.onValueSelected=lang.hitch(this,function(value){this.focus(),setTimeout(lang.hitch(this,"closeDropDown"),1),TextBox.prototype._setValueAttr.call(this,value,!0,value)})}})})