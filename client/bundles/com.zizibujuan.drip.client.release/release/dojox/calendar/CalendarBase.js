//>>built
define("dojox/calendar/CalendarBase","dojo/_base/declare dojo/_base/sniff dojo/_base/event dojo/_base/lang dojo/_base/array dojo/cldr/supplemental dojo/dom dojo/dom-class dojo/dom-style dojo/dom-construct dojo/date dojo/date/locale dojo/_base/fx dojo/fx dojo/on dijit/_WidgetBase dijit/_TemplatedMixin dijit/_WidgetsInTemplateMixin ./StoreMixin dojox/widget/_Invalidating dojox/widget/Selection dojox/calendar/time dojo/i18n!./nls/buttons".split(" "),function(s,m,C,f,p,D,E,q,h,t,r,u,n,v,g,w,x,y,z,A,B,
l,k){return s("dojox.calendar.CalendarBase",[w,x,y,z,A,B],{baseClass:"dojoxCalendar",datePackage:r,startDate:null,endDate:null,date:null,dateInterval:"week",dateIntervalSteps:1,viewContainer:null,firstDayOfWeek:-1,formatItemTimeFunc:null,editable:!0,moveEnabled:!0,resizeEnabled:!0,columnView:null,matrixView:null,columnViewProps:null,matrixViewProps:null,createOnGridClick:!1,createItemFunc:null,currentView:null,_currentViewIndex:-1,views:null,_calendar:"gregorian",constructor:function(a){this.views=
[];this.invalidatingProperties="store items startDate endDate views date dateInterval dateIntervalSteps firstDayOfWeek".split(" ");a=a||{};this._calendar=a.datePackage?a.datePackage.substr(a.datePackage.lastIndexOf(".")+1):this._calendar;this.dateModule=a.datePackage?f.getObject(a.datePackage,!1):r;this.dateClassObj=this.dateModule.Date||Date;this.dateLocaleModule=a.datePackage?f.getObject(a.datePackage+".locale",!1):u;this.invalidateRendering()},buildRendering:function(){this.inherited(arguments);
(null==this.views||0==this.views.length)&&this.set("views",this._createDefaultViews())},_applyAttributes:function(){this._applyAttr=!0;this.inherited(arguments);delete this._applyAttr},_setStartDateAttr:function(a){this._set("startDate",a);this._timeRangeInvalidated=!0},_setEndDateAttr:function(a){this._set("endDate",a);this._timeRangeInvalidated=!0},_setDateAttr:function(a){this._set("date",a);this._timeRangeInvalidated=!0},_setDateIntervalAttr:function(a){this._set("dateInterval",a);this._timeRangeInvalidated=
!0},_setDateIntervalStepsAttr:function(a){this._set("dateIntervalSteps",a);this._timeRangeInvalidated=!0},_setFirstDayOfWeekAttr:function(a){this._set("firstDayOfWeek",a);null!=this.get("date")&&"week"==this.get("dateInterval")&&(this._timeRangeInvalidated=!0)},_setTextDirAttr:function(a){p.forEach(this.views,function(b){b.set("textDir",a)})},refreshRendering:function(){this.inherited(arguments);this._validateProperties()},_refreshItemsRendering:function(){this.currentView&&this.currentView._refreshItemsRendering()},
resize:function(){this.currentView&&this.currentView.resize()},_validateProperties:function(){var a=this.dateModule,b=this.get("startDate"),c=this.get("endDate"),d=this.get("date");(-1>this.firstDayOfWeek||6<this.firstDayOfWeek)&&this._set("firstDayOfWeek",0);null==d&&(null!=b||null!=c)?(null==b&&(b=new this.dateClassObj,this._set("startDate",b),this._timeRangeInvalidated=!0),null==c&&(c=new this.dateClassObj,this._set("endDate",c),this._timeRangeInvalidated=!0),0<=a.compare(b,c)&&(c=a.add(b,"day",
1),this._set("endDate",c),this._timeRangeInvalidated=!0)):(null==this.date&&(this._set("date",new this.dateClassObj),this._timeRangeInvalidated=!0),b=this.get("dateInterval"),"day"!=b&&("week"!=b&&"month"!=b)&&(this._set("dateInterval","day"),this._timeRangeInvalidated=!0),b=this.get("dateIntervalSteps"),f.isString(b)&&(b=parseInt(b),this._set("dateIntervalSteps",b)),0>=b&&(this.set("dateIntervalSteps",1),this._timeRangeInvalidated=!0));if(this._timeRangeInvalidated){this._timeRangeInvalidated=!1;
var e=this.computeTimeInterval();if(null==this._timeInterval||a.compare(this._timeInterval[0],0!=e[0])||a.compare(this._timeInterval[1],0!=e[1]))this.onTimeIntervalChange({oldStartTime:null==this._timeInterval?null:this._timeInterval[0],oldEndTime:null==this._timeInterval?null:this._timeInterval[1],startTime:e[0],endTime:e[1]});this._timeInterval=e;var h=this.dateModule.difference(this._timeInterval[0],this._timeInterval[1],"day"),g=this._computeCurrentView(e[0],e[1],h),k=p.indexOf(this.views,g);
if(!(null==g||-1==k))if(this.animateRange&&(!m("ie")||8<m("ie")))if(this.currentView){var l=this.isLeftToRight(),n="left"==this._animRangeInDir||null==this._animRangeInDir,a="left"==this._animRangeOutDir||null==this._animRangeOutDir;this._animateRange(this.currentView.domNode,a&&l,!1,0,a?-100:100,f.hitch(this,function(){this.animateRangeTimer=setTimeout(f.hitch(this,function(){this._applyViewChange(g,k,e,h);this._animateRange(this.currentView.domNode,n&&l,!0,n?-100:100,0);this._animRangeOutDir=this._animRangeInDir=
null}),100)}))}else this._applyViewChange(g,k,e,h);else this._applyViewChange(g,k,e,h)}},_applyViewChange:function(a,b,c,d){this._configureView(a,b,c,d);b!=this._currentViewIndex&&(null==this.currentView?(a.set("items",this.items),this.set("currentView",a)):null==this.items||0==this.items.length?(this.set("currentView",a),this.animateRange&&(!m("ie")||8<m("ie"))&&h.set(this.currentView.domNode,"opacity",0),a.set("items",this.items)):(this.currentView=a,a.set("items",this.items),this.set("currentView",
a),this.animateRange&&(!m("ie")||8<m("ie"))&&h.set(this.currentView.domNode,"opacity",0)))},_timeInterval:null,computeTimeInterval:function(){var a=this.dateModule,b=this.get("date");if(null==b)return[this.floorToDay(this.get("startDate")),a.add(this.get("endDate"),"day",1)];var b=this.floorToDay(b),c=this.get("dateInterval"),d=this.get("dateIntervalSteps"),e;switch(c){case "day":e=a.add(b,"day",d);break;case "week":b=this.floorToWeek(b);e=a.add(b,"week",d);break;case "month":b.setDate(1),e=a.add(b,
"month",d)}return[b,e]},onTimeIntervalChange:function(a){},views:null,_setViewsAttr:function(a){if(!this._applyAttr)for(var b=0;b<this.views.length;b++)this._onViewRemoved(this.views[b]);if(null!=a)for(b=0;b<a.length;b++)this._onViewAdded(a[b]);this._set("views",null==a?[]:a.concat())},_getViewsAttr:function(){return this.views.concat()},_createDefaultViews:function(){},addView:function(a,b){if(0>=b||b>this.views.length)b=this.views.length;this.views.splice(b,a);this._onViewAdded(a)},removeView:function(a){0>
index||index>=this.views.length||(this._onViewRemoved(this.views[index]),this.views.splice(index,1))},_onViewAdded:function(a){a.owner=this;a.buttonContainer=this.buttonContainer;a._calendar=this._calendar;a.datePackage=this.datePackage;a.dateModule=this.dateModule;a.dateClassObj=this.dateClassObj;a.dateLocaleModule=this.dateLocaleModule;h.set(a.domNode,"display","none");q.add(a.domNode,"view");t.place(a.domNode,this.viewContainer);this.onViewAdded(a)},onViewAdded:function(a){},_onViewRemoved:function(a){a.owner=
null;a.buttonContainer=null;q.remove(a.domNode,"view");this.viewContainer.removeChild(a.domNode);this.onViewRemoved(a)},onViewRemoved:function(a){},_setCurrentViewAttr:function(a){var b=p.indexOf(this.views,a);if(-1!=b){var c=this.get("currentView");this._currentViewIndex=b;this._set("currentView",a);this._showView(c,a);this.onCurrentViewChange({oldView:c,newView:a})}},_getCurrentViewAttr:function(){return this.views[this._currentViewIndex]},onCurrentViewChange:function(a){},_configureView:function(a,
b,c,d){b=this.dateModule;if("columns"==a.viewKind)a.set("startDate",c[0]),a.set("columnCount",d);else if("matrix"==a.viewKind)if(7<d){var e=this.floorToWeek(c[0]);d=this.floorToWeek(c[1]);0!=b.compare(d,c[1])&&(d=this.dateModule.add(d,"week",1));d=this.dateModule.difference(e,d,"day");a.set("startDate",e);a.set("columnCount",7);a.set("rowCount",Math.ceil(d/7));a.set("refStartTime",c[0]);a.set("refEndTime",c[1])}else a.set("startDate",c[0]),a.set("columnCount",d),a.set("rowCount",1),a.set("refStartTime",
null),a.set("refEndTime",null)},_computeCurrentView:function(a,b,c){return 7>=c?this.columnView:this.matrixView},matrixViewRowHeaderClick:function(a){var b=this.matrixView.getExpandedRowIndex();if(b==a.index)this.matrixView.collapseRow();else if(-1==b)this.matrixView.expandRow(a.index);else{var c=this.matrixView.on("expandAnimationEnd",f.hitch(this,function(){c.remove();this.matrixView.expandRow(a.index)}));this.matrixView.collapseRow()}},columnViewColumnHeaderClick:function(a){0==this.dateModule.compare(a.date,
this._timeInterval[0])&&"day"==this.dateInterval&&1==this.dateIntervalSteps?this.set("dateInterval","week"):(this.set("date",a.date),this.set("dateInterval","day"),this.set("dateIntervalSteps",1))},viewChangeDuration:0,_showView:function(a,b){null!=a&&h.set(a.domNode,"display","none");null!=b&&(h.set(b.domNode,"display","block"),b.resize(),(!m("ie")||7<m("ie"))&&h.set(b.domNode,"opacity","1"))},_setItemsAttr:function(a){this._set("items",a);this.currentView&&(this.currentView.set("items",a),this._isEditing||
this.currentView.invalidateRendering())},floorToDay:function(a,b){return l.floorToDay(a,b,this.dateClassObj)},floorToWeek:function(a){return l.floorToWeek(a,this.dateClassObj,this.dateModule,this.firstDayOfWeek,this.locale)},newDate:function(a){return l.newDate(a,this.dateClassObj)},isToday:function(a){return l.isToday(a,this.dateClassObj)},isStartOfDay:function(a){return l.isStartOfDay(a,this.dateClassObj,this.dateModule)},floorDate:function(a,b,c,d){return l.floor(a,b,c,d,this.classFuncObj)},animateRange:!0,
animationRangeDuration:400,_animateRange:function(a,b,c,d,e,f){this.animateRangeTimer&&(clearTimeout(this.animateRangeTimer),delete this.animateRangeTimer);b=c?n.fadeIn:n.fadeOut;h.set(a,{left:d+"px",right:-d+"px"});v.combine([n.animateProperty({node:a,properties:{left:e,right:-e},duration:this.animationRangeDuration/2,onEnd:f}),b({node:a,duration:this.animationRangeDuration/2})]).play()},_animRangeOutDir:null,_animRangeOutDir:null,nextRange:function(){this._animRangeOutDir="left";this._animRangeInDir=
"right";this._navigate(1)},previousRange:function(){this._animRangeOutDir="right";this._animRangeInDir="left";this._navigate(-1)},_navigate:function(a){var b=this.get("date"),c=this.dateModule;if(null==b){var b=this.get("startDate"),d=this.get("endDate"),e=c.difference(b,d,"day");1==a?(d=c.add(d,"day",1),this.set("startDate",d),this.set("endDate",c.add(d,"day",e))):(b=c.add(b,"day",-1),this.set("startDate",c.add(b,"day",-e)),this.set("endDate",b))}else d=this.get("dateInterval"),e=this.get("dateIntervalSteps"),
this.set("date",c.add(b,d,a*e))},goToday:function(){this.set("date",this.floorToDay(new this.dateClassObj,!0));this.set("dateInterval","day");this.set("dateIntervalSteps",1)},postCreate:function(){this.inherited(arguments);this.configureButtons()},configureButtons:function(){var a=!this.isLeftToRight();this.previousButton&&(this.previousButton.set("label",k[a?"nextButton":"previousButton"]),this.own(g(this.previousButton,"click",f.hitch(this,a?this.nextRange:this.previousRange))));this.nextButton&&
(this.nextButton.set("label",k[a?"previousButton":"nextButton"]),this.own(g(this.nextButton,"click",f.hitch(this,a?this.previousRange:this.nextRange))));a&&(this.previousButton&&this.nextButton)&&(a=this.previousButton,this.previousButton=this.nextButton,this.nextButton=a);this.todayButton&&(this.todayButton.set("label",k.todayButton),this.own(g(this.todayButton,"click",f.hitch(this,this.todayButtonClick))));this.dayButton&&(this.dayButton.set("label",k.dayButton),this.own(g(this.dayButton,"click",
f.hitch(this,this.dayButtonClick))));this.weekButton&&(this.weekButton.set("label",k.weekButton),this.own(g(this.weekButton,"click",f.hitch(this,this.weekButtonClick))));this.fourDaysButton&&(this.fourDaysButton.set("label",k.fourDaysButton),this.own(g(this.fourDaysButton,"click",f.hitch(this,this.fourDaysButtonClick))));this.monthButton&&(this.monthButton.set("label",k.monthButton),this.own(g(this.monthButton,"click",f.hitch(this,this.monthButtonClick))))},todayButtonClick:function(a){this.goToday()},
dayButtonClick:function(a){null==this.get("date")&&this.set("date",this.floorToDay(new this.dateClassObj,!0));this.set("dateInterval","day");this.set("dateIntervalSteps",1)},weekButtonClick:function(a){this.set("dateInterval","week");this.set("dateIntervalSteps",1)},fourDaysButtonClick:function(a){this.set("dateInterval","day");this.set("dateIntervalSteps",4)},monthButtonClick:function(a){this.set("dateInterval","month");this.set("dateIntervalSteps",1)},updateRenderers:function(a,b){this.currentView&&
this.currentView.updateRenderers(a,b)},getIdentity:function(a){return a?a.id:null},_setHoveredItem:function(a,b){if(this.hoveredItem&&a&&this.hoveredItem.id!=a.id||null==a||null==this.hoveredItem){var c=this.hoveredItem;this.hoveredItem=a;this.updateRenderers([c,this.hoveredItem],!0);a&&b&&this.currentView._updateEditingCapabilities(a._item?a._item:a,b)}},hoveredItem:null,isItemHovered:function(a){return null!=this.hoveredItem&&this.hoveredItem.id==a.id},isItemEditable:function(a,b){return this.editable},
isItemMoveEnabled:function(a,b){return this.isItemEditable(a,b)&&this.moveEnabled},isItemResizeEnabled:function(a,b){return this.isItemEditable(a,b)&&this.resizeEnabled},onGridClick:function(a){},onGridDoubleClick:function(a){},onItemClick:function(a){},onItemDoubleClick:function(a){},onItemContextMenu:function(a){},onItemEditBegin:function(a){},onItemEditEnd:function(a){},onItemEditBeginGesture:function(a){},onItemEditMoveGesture:function(a){},onItemEditResizeGesture:function(a){},onItemEditEndGesture:function(a){},
onItemRollOver:function(a){},onItemRollOut:function(a){},onColumnHeaderClick:function(a){},onRowHeaderClick:function(a){},onExpandRendererClick:function(a){},_onRendererCreated:function(a){this.onRendererCreated(a)},onRendererCreated:function(a){},_onRendererRecycled:function(a){this.onRendererRecycled(a)},onRendererRecycled:function(a){},_onRendererReused:function(a){this.onRendererReused(a)},onRendererReused:function(a){},_onRendererDestroyed:function(a){this.onRendererDestroyed(a)},onRendererDestroyed:function(a){},
_onRenderersLayoutDone:function(a){this.onRenderersLayoutDone(a)},onRenderersLayoutDone:function(a){}})});
//@ sourceMappingURL=CalendarBase.js.map