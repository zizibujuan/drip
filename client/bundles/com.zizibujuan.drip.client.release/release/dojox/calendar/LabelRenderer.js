//>>built
define("dojox/calendar/LabelRenderer",["dojo/_base/declare","dijit/_WidgetBase","dijit/_TemplatedMixin","dojox/calendar/_RendererMixin","dojo/text!./templates/LabelRenderer.html"],function(b,c,d,e,f){return b("dojox.calendar.LabelRenderer",[c,d,e],{templateString:f,_orientation:"horizontal",resizeEnabled:!1,visibilityLimits:{resizeStartHandle:50,resizeEndHandle:-1,summaryLabel:15,startTimeLabel:45,endTimeLabel:30},_isElementVisible:function(b,c,d,e){switch(b){case "startTimeLabel":var a=this.item.startTime;
if(this.item.isAllDay||0==a.getHours()&&0==a.getMinutes()&&0==a.getSeconds()&&0==a.getMilliseconds())return!1}return this.inherited(arguments)},_displayValue:"inline",postCreate:function(){this.inherited(arguments);this._applyAttributes()}})});require({cache:{"url:dojox/calendar/templates/LabelRenderer.html":'\x3cdiv class\x3d"dojoxCalendarEvent dojoxCalendarLabel" onselectstart\x3d"return false;"\x3e\t\n\t\x3cdiv class\x3d"labels"\x3e\n\t\t\x3cspan data-dojo-attach-point\x3d"startTimeLabel" class\x3d"startTime"\x3e\x3c/span\x3e\n\t\t\x3cspan data-dojo-attach-point\x3d"summaryLabel" class\x3d"summary"\x3e\x3c/span\x3e\n\t\t\x3cspan data-dojo-attach-point\x3d"endTimeLabel" class\x3d"endTime"\x3e\x3c/span\x3e\n\t\x3c/div\x3e\t\n\t\x3cdiv data-dojo-attach-point\x3d"moveHandle" class\x3d"handle moveHandle" \x3e\x3c/div\x3e\n\x3c/div\x3e\n'}});
//@ sourceMappingURL=LabelRenderer.js.map