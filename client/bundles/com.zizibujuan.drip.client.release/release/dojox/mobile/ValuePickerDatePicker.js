//>>built
define("dojox/mobile/ValuePickerDatePicker",["dojo/_base/declare","dojo/dom-class","./_DatePickerMixin","./ValuePicker","./ValuePickerSlot"],function(d,e,f,g,c){return d("dojox.mobile.ValuePickerDatePicker",[g,f],{readOnly:!1,slotClasses:[c,c,c],slotProps:[{labelFrom:1970,labelTo:2038,style:{width:"87px"}},{style:{width:"72px"}},{style:{width:"72px"}}],buildRendering:function(){var a=this.slotProps;a[0].readOnly=a[1].readOnly=a[2].readOnly=this.readOnly;this.initSlots();this.inherited(arguments);
e.add(this.domNode,"mblValuePickerDatePicker");this._conn=[this.connect(this.slots[0],"_spinToValue","_onYearSet"),this.connect(this.slots[1],"_spinToValue","_onMonthSet"),this.connect(this.slots[2],"_spinToValue","_onDaySet")]},disableValues:function(a){var b=this.slots[2].items;if(this._tail)this.slots[2].items=b=b.concat(this._tail);this._tail=b.slice(a);b.splice(a)}})});