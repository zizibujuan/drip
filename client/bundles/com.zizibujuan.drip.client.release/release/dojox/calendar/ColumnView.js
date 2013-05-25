//>>built
define("dojox/calendar/ColumnView","dojo/_base/declare dojo/_base/event dojo/_base/lang dojo/_base/sniff dojo/_base/fx dojo/dom dojo/dom-class dojo/dom-style dojo/dom-geometry dojo/dom-construct dojo/on dojo/date dojo/date/locale dojo/query dojox/html/metrics ./SimpleColumnView dojo/text!./templates/ColumnView.html ./ColumnViewSecondarySheet".split(" "),function(d,l,e,m,n,p,q,c,f,r,s,t,u,v,w,g,h,k){return d("dojox.calendar.ColumnView",g,{templateString:h,baseClass:"dojoxCalendarColumnView",secondarySheetClass:k,
secondarySheetProps:null,headerPadding:3,buildRendering:function(){this.inherited(arguments);if(this.secondarySheetNode){var a=e.mixin({owner:this},this.secondarySheetProps);this.secondarySheet=new this.secondarySheetClass(a,this.secondarySheetNode);this.secondarySheetNode=this.secondarySheet.domNode}},destroy:function(a){this.secondarySheet&&this.secondarySheet.destroy(a);this.inherited(arguments)},_setVisibility:function(a){this.inherited(arguments);this.secondarySheet&&this.secondarySheet._setVisibility(a)},
resize:function(a){this.inherited(arguments);this.secondarySheet&&this.secondarySheet.resize(a)},invalidateLayout:function(){this._layoutRenderers(this.renderData);this.secondarySheet&&this.secondarySheet._layoutRenderers(this.secondarySheet.renderData)},onRowHeaderClick:function(a){},resizeSecondarySheet:function(a){if(this.secondarySheetNode){var b=f.getMarginBox(this.header).h;c.set(this.secondarySheetNode,"height",a+"px");this.secondarySheet._resizeHandler(null,!0);a=a+b+this.headerPadding+"px";
c.set(this.scrollContainer,"top",a);this.vScrollBar&&c.set(this.vScrollBar,"top",a)}},updateRenderers:function(a,b){this.inherited(arguments);this.secondarySheet&&this.secondarySheet.updateRenderers(a,b)},_setItemsAttr:function(a){this.inherited(arguments);this.secondarySheet&&this.secondarySheet.set("items",a)},_setStartDateAttr:function(a){this.inherited(arguments);this.secondarySheet&&this.secondarySheet.set("startDate",a)},_setColumnCountAttr:function(a){this.inherited(arguments);this.secondarySheet&&
this.secondarySheet.set("columnCount",a)},_setHorizontalRendererAttr:function(a){this.secondarySheet&&this.secondarySheet.set("horizontalRenderer",a)},_getHorizontalRendererAttr:function(){return this.secondarySheet?this.secondarySheet.get("horizontalRenderer"):null},_setExpandRendererAttr:function(a){this.secondarySheet&&this.secondarySheet.set("expandRenderer",a)},_getExpandRendererAttr:function(){return this.secondarySheet?this.secondarySheet.get("expandRenderer"):null},_setTextDirAttr:function(a){this.secondarySheet.set("textDir",
a);this._set("textDir",a)},_defaultItemToRendererKindFunc:function(a){return a.allDay?null:"vertical"},getSecondarySheet:function(){return this.secondarySheet},_onGridTouchStart:function(a){this.inherited(arguments);this._doEndItemEditing(this.secondarySheet,"touch")},_onGridMouseDown:function(a){this.inherited(arguments);this._doEndItemEditing(this.secondarySheet,"mouse")},_configureScrollBar:function(a){this.inherited(arguments);if(this.secondarySheetNode){var b=this.isLeftToRight()?!0:"right"==
this.scrollBarRTLPosition;c.set(this.secondarySheetNode,b?"right":"left",a.scrollbarWidth+"px");c.set(this.secondarySheetNode,b?"left":"right","0")}},_refreshItemsRendering:function(){this.inherited(arguments);if(this.secondarySheet){var a=this.secondarySheet.renderData;this.secondarySheet._computeVisibleItems(a);this.secondarySheet._layoutRenderers(a)}},_layoutRenderers:function(a){this.secondarySheet._domReady||(this.secondarySheet._domReady=!0,this.secondarySheet._layoutRenderers(this.secondarySheet.renderData));
this.inherited(arguments)},invalidateRendering:function(){this.secondarySheet&&this.secondarySheet.invalidateRendering();this.inherited(arguments)}})});require({cache:{"url:dojox/calendar/templates/ColumnView.html":'\x3cdiv data-dojo-attach-events\x3d"keydown:_onKeyDown"\x3e\n\t\n\t\x3cdiv data-dojo-attach-point\x3d"header" class\x3d"dojoxCalendarHeader"\x3e\n\t\t\x3cdiv class\x3d"dojoxCalendarYearColumnHeader" data-dojo-attach-point\x3d"yearColumnHeader"\x3e\n\t\t\t\x3ctable cellspacing\x3d"0" cellpadding\x3d"0"\x3e\x3ctr\x3e\x3ctd\x3e\x3cspan data-dojo-attach-point\x3d"yearColumnHeaderContent"\x3e\x3c/span\x3e\x3c/td\x3e\x3c/tr\x3e\x3c/table\x3e\t\t\n\t\t\x3c/div\x3e\n\t\t\x3cdiv data-dojo-attach-point\x3d"columnHeader" class\x3d"dojoxCalendarColumnHeader"\x3e\n\t\t\t\x3ctable data-dojo-attach-point\x3d"columnHeaderTable" class\x3d"dojoxCalendarColumnHeaderTable" cellpadding\x3d"0" cellspacing\x3d"0"\x3e\x3c/table\x3e\n\t\t\x3c/div\x3e\n\t\x3c/div\x3e\n\t\n\t\x3cdiv data-dojo-attach-point\x3d"secondarySheetNode"\x3e\x3c/div\x3e\n\t\n\t\x3cdiv data-dojo-attach-point\x3d"scrollContainer" class\x3d"dojoxCalendarScrollContainer"\x3e\n\t\t\x3cdiv data-dojo-attach-point\x3d"sheetContainer" style\x3d"position:relative;left:0;right:0;margin:0;padding:0"\x3e\n\t\t\t\x3cdiv data-dojo-attach-point\x3d"rowHeader" class\x3d"dojoxCalendarRowHeader"\x3e\n\t\t\t\t\x3ctable data-dojo-attach-point\x3d"rowHeaderTable" class\x3d"dojoxCalendarRowHeaderTable" cellpadding\x3d"0" cellspacing\x3d"0"\x3e\x3c/table\x3e\n\t\t\t\x3c/div\x3e\n\t\t\t\x3cdiv data-dojo-attach-point\x3d"grid" class\x3d"dojoxCalendarGrid"\x3e\n\t\t\t\t\x3ctable data-dojo-attach-point\x3d"gridTable" class\x3d"dojoxCalendarGridTable" cellpadding\x3d"0" cellspacing\x3d"0" style\x3d"width:100%"\x3e\x3c/table\x3e\n\t\t\t\x3c/div\x3e\n\t\t\t\x3cdiv data-dojo-attach-point\x3d"itemContainer" class\x3d"dojoxCalendarContainer" data-dojo-attach-event\x3d"mousedown:_onGridMouseDown,mouseup:_onGridMouseUp,ondblclick:_onGridDoubleClick,touchstart:_onGridTouchStart,touchmove:_onGridTouchMove,touchend:_onGridTouchEnd"\x3e\n\t\t\t\t\x3ctable data-dojo-attach-point\x3d"itemContainerTable" class\x3d"dojoxCalendarContainerTable" cellpadding\x3d"0" cellspacing\x3d"0" style\x3d"width:100%"\x3e\x3c/table\x3e\n\t\t\t\x3c/div\x3e\n\t\t\x3c/div\x3e \n\t\x3c/div\x3e\n\t\n\t\x3cdiv data-dojo-attach-point\x3d"vScrollBar" class\x3d"dojoxCalendarVScrollBar"\x3e\n\t\t\x3cdiv data-dojo-attach-point\x3d"vScrollBarContent" style\x3d"visibility:hidden;position:relative;width:1px;height:1px;" \x3e\x3c/div\x3e\n\t\x3c/div\x3e\n\t\n\x3c/div\x3e\n'}});
//@ sourceMappingURL=ColumnView.js.map