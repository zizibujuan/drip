//>>built
define("dijit/form/_FormWidget","dojo/_base/declare dojo/sniff dojo/_base/kernel dojo/ready ../_Widget ../_CssStateMixin ../_TemplatedMixin ./_FormWidgetMixin".split(" "),function(d,c,b,e,f,g,h,k){c("dijit-legacy-requires")&&e(0,function(){require(["dijit/form/_FormValueWidget"])});return d("dijit.form._FormWidget",[f,h,g,k],{setDisabled:function(a){b.deprecated("setDisabled("+a+") is deprecated. Use set('disabled',"+a+") instead.","","2.0");this.set("disabled",a)},setValue:function(a){b.deprecated("dijit.form._FormWidget:setValue("+
a+") is deprecated.  Use set('value',"+a+") instead.","","2.0");this.set("value",a)},getValue:function(){b.deprecated(this.declaredClass+"::getValue() is deprecated. Use get('value') instead.","","2.0");return this.get("value")},postMixInProperties:function(){this.nameAttrSetting=this.name&&!c("msapp")?'name\x3d"'+this.name.replace(/"/g,"\x26quot;")+'"':"";this.inherited(arguments)}})});
//@ sourceMappingURL=_FormWidget.js.map