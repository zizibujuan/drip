//>>built
require({cache:{"url:dojox/widget/Calendar/CalendarDay.html":'<div class="dijitCalendarDayLabels" style="left: 0px;" dojoAttachPoint="dayContainer">\n	<div dojoAttachPoint="header">\n		<div dojoAttachPoint="monthAndYearHeader">\n			<span dojoAttachPoint="monthLabelNode" class="dojoxCalendarMonthLabelNode"></span>\n			<span dojoAttachPoint="headerComma" class="dojoxCalendarComma">,</span>\n			<span dojoAttachPoint="yearLabelNode" class="dojoxCalendarDayYearLabel"></span>\n		</div>\n	</div>\n	<table cellspacing="0" cellpadding="0" border="0" style="margin: auto;">\n		<thead>\n			<tr>\n				<td class="dijitCalendarDayLabelTemplate"><div class="dijitCalendarDayLabel"></div></td>\n			</tr>\n		</thead>\n		<tbody dojoAttachEvent="onclick: _onDayClick">\n			<tr class="dijitCalendarWeekTemplate">\n				<td class="dojoxCalendarNextMonth dijitCalendarDateTemplate">\n					<div class="dijitCalendarDateLabel"></div>\n				</td>\n			</tr>\n		</tbody>\n	</table>\n</div>\n'}}),define("dojox/widget/_CalendarDayView",["dojo/_base/declare","./_CalendarView","dijit/_TemplatedMixin","dojo/query","dojo/dom-class","dojo/_base/event","dojo/date","dojo/date/locale","dojo/text!./Calendar/CalendarDay.html","dojo/cldr/supplemental","dojo/NodeList-dom"],function(declare,_CalendarView,_TemplatedMixin,query,domClass,event,date,locale,template,supplemental){return declare("dojox.widget._CalendarDayView",[_CalendarView,_TemplatedMixin],{templateString:template,datePart:"month",dayWidth:"narrow",postCreate:function(){this.cloneClass(".dijitCalendarDayLabelTemplate",6),this.cloneClass(".dijitCalendarDateTemplate",6),this.cloneClass(".dijitCalendarWeekTemplate",5);var dayNames=locale.getNames("days",this.dayWidth,"standAlone",this.getLang()),dayOffset=supplemental.getFirstDayOfWeek(this.getLang());query(".dijitCalendarDayLabel",this.domNode).forEach(function(label,i){this._setText(label,dayNames[(i+dayOffset)%7])},this)},onDisplay:function(){this._addedFx||(this._addedFx=!0,this.addFx(".dijitCalendarDateTemplate div",this.domNode))},_onDayClick:function(e){if(typeof e.target._date=="undefined")return;var displayMonth=new Date(this.get("displayMonth")),p=e.target.parentNode,c="dijitCalendar",d=domClass.contains(p,c+"PreviousMonth")?-1:domClass.contains(p,c+"NextMonth")?1:0;d&&(displayMonth=date.add(displayMonth,"month",d)),displayMonth.setDate(e.target._date);if(this.isDisabledDate(displayMonth)){event.stop(e);return}this.parent._onDateSelected(displayMonth)},_setValueAttr:function(value){this._populateDays()},_populateDays:function(){var currentDate=new Date(this.get("displayMonth"));currentDate.setDate(1);var firstDay=currentDate.getDay(),daysInMonth=date.getDaysInMonth(currentDate),daysInPreviousMonth=date.getDaysInMonth(date.add(currentDate,"month",-1)),today=new Date,selected=this.get("value"),dayOffset=supplemental.getFirstDayOfWeek(this.getLang());dayOffset>firstDay&&(dayOffset-=7);var compareDate=date.compare,templateCls=".dijitCalendarDateTemplate",selectedCls="dijitCalendarSelectedDate",oldDate=this._lastDate,redrawRequired=oldDate==null||oldDate.getMonth()!=currentDate.getMonth()||oldDate.getFullYear()!=currentDate.getFullYear();this._lastDate=currentDate;if(!redrawRequired){query(templateCls,this.domNode).removeClass(selectedCls).filter(function(node){return node.className.indexOf("dijitCalendarCurrent")>-1&&node._date==selected.getDate()}).addClass(selectedCls);return}query(templateCls,this.domNode).forEach(function(template,i){i+=dayOffset;var eachDate=new Date(currentDate),number,clazz="dijitCalendar",adj=0;i<firstDay?(number=daysInPreviousMonth-firstDay+i+1,adj=-1,clazz+="Previous"):i>=firstDay+daysInMonth?(number=i-firstDay-daysInMonth+1,adj=1,clazz+="Next"):(number=i-firstDay+1,clazz+="Current"),adj&&(eachDate=date.add(eachDate,"month",adj)),eachDate.setDate(number),compareDate(eachDate,today,"date")||(clazz="dijitCalendarCurrentDate "+clazz),!compareDate(eachDate,selected,"date")&&!compareDate(eachDate,selected,"month")&&!compareDate(eachDate,selected,"year")&&(clazz=selectedCls+" "+clazz),this.isDisabledDate(eachDate,this.getLang())&&(clazz=" dijitCalendarDisabledDate "+clazz);var clazz2=this.getClassForDate(eachDate,this.getLang());clazz2&&(clazz=clazz2+" "+clazz),template.className=clazz+"Month dijitCalendarDateTemplate",template.dijitDateValue=eachDate.valueOf();var label=query(".dijitCalendarDateLabel",template)[0];this._setText(label,eachDate.getDate()),label._date=label.parentNode._date=eachDate.getDate()},this);var monthNames=locale.getNames("months","wide","standAlone",this.getLang());this._setText(this.monthLabelNode,monthNames[currentDate.getMonth()]),this._setText(this.yearLabelNode,currentDate.getFullYear())}})})