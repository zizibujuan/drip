//>>built
define("dojox/form/MonthTextBox","dojo/_base/kernel,dojo/_base/lang,dojox/widget/MonthlyCalendar,dijit/form/TextBox,./DateTextBox,dojo/_base/declare".split(","),function(f,d,g,e,h,i){f.experimental("dojox/form/DateTextBox");return i("dojox.form.MonthTextBox",h,{popupClass:g,selector:"date",postMixInProperties:function(){this.inherited(arguments);this.constraints.datePattern="MM"},format:function(a){return!a&&0!==a?1:a.getMonth?a.getMonth()+1:Number(a)+1},parse:function(a){return Number(a)-1},serialize:function(a){return""+
a},validator:function(a){var b=Number(a),c=/(^-?\d\d*$)/.test(""+a);return""==a||null==a||c&&1<=b&&12>=b},_setValueAttr:function(a,b,c){a&&a.getMonth&&(a=a.getMonth());e.prototype._setValueAttr.call(this,a,b,c)},openDropDown:function(){this.inherited(arguments);this.dropDown.onValueSelected=d.hitch(this,function(a){this.focus();setTimeout(d.hitch(this,"closeDropDown"),1);e.prototype._setValueAttr.call(this,a,!0,a)})}})});