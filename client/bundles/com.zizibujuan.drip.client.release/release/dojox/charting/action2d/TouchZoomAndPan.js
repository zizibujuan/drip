//>>built
define("dojox/charting/action2d/TouchZoomAndPan","dojo/_base/lang,dojo/_base/declare,dojo/_base/event,dojo/sniff,./ChartAction,../Element,dojox/gesture/tap,../plot2d/common,dojo/has!dojo-bidi?../bidi/action2d/ZoomAndPan".split(","),function(j,i,h,f,g,k,l,m,n){var o=i(k,{constructor:function(){},render:function(){this.isDirty()&&(this.cleanGroup(),this.group.createRect({width:this.chart.dim.width,height:this.chart.dim.height}).setFill("rgba(0,0,0,0)"))},clear:function(){this.dirty=!0;this.chart.stack[0]!=
this&&this.chart.movePlotToFront(this.name);return this},getSeriesStats:function(){return j.delegate(m.defaultStats)},initializeScalers:function(){return this},isDirty:function(){return this.dirty}}),g=i(f("dojo-bidi")?"dojox.charting.action2d.NonBidiTouchZoomAndPan":"dojox.charting.action2d.TouchZoomAndPan",g,{defaultParams:{axis:"x",scaleFactor:1.2,maxScale:100,enableScroll:!0,enableZoom:!0},optionalParams:{},constructor:function(a,c,b){this._listeners=[{eventName:"ontouchstart",methodName:"onTouchStart"},
{eventName:"ontouchmove",methodName:"onTouchMove"},{eventName:"ontouchend",methodName:"onTouchEnd"},{eventName:l.doubletap,methodName:"onDoubleTap"}];b||(b={});this.axis=b.axis?b.axis:"x";this.scaleFactor=b.scaleFactor?b.scaleFactor:1.2;this.maxScale=b.maxScale?b.maxScale:100;this.enableScroll=void 0!=b.enableScroll?b.enableScroll:!0;this.enableZoom=void 0!=b.enableScroll?b.enableZoom:!0;this._uName="touchZoomPan"+this.axis;this.connect()},connect:function(){this.inherited(arguments);f("ios")&&-1!=
this.chart.surface.declaredClass.indexOf("svg")&&this.chart.addPlot(this._uName,{type:o})},disconnect:function(){f("ios")&&-1!=this.chart.surface.declaredClass.indexOf("svg")&&this.chart.removePlot(this._uName);this.inherited(arguments)},onTouchStart:function(a){var c=this.chart,b=c.getAxis(this.axis),d=a.touches.length;this._startPageCoord={x:a.touches[0].pageX,y:a.touches[0].pageY};(this.enableZoom||this.enableScroll)&&c._delayedRenderHandle&&c.render();this.enableZoom&&2<=d?(this._endPageCoord=
{x:a.touches[1].pageX,y:a.touches[1].pageY},a={x:(this._startPageCoord.x+this._endPageCoord.x)/2,y:(this._startPageCoord.y+this._endPageCoord.y)/2},c=b.getScaler(),this._initScale=b.getWindowScale(),this._middleCoord=(this._initData=this.plot.toData())(a)[this.axis],this._startCoord=c.bounds.from,this._endCoord=c.bounds.to):this.enableScroll&&(this._startScroll(b),h.stop(a))},onTouchMove:function(a){var c=this.chart,b=c.getAxis(this.axis),d=a.touches.length,e=b.vertical?"pageY":"pageX",b=b.vertical?
"y":"x";this.enableZoom&&2<=d?(d=(this._endPageCoord[b]-this._startPageCoord[b])/(a.touches[1][e]-a.touches[0][e]),this._initScale/d>this.maxScale||(e=this._initData({x:(a.touches[1].pageX+a.touches[0].pageX)/2,y:(a.touches[1].pageY+a.touches[0].pageY)/2})[this.axis],c.zoomIn(this.axis,[d*(this._startCoord-e)+this._middleCoord,d*(this._endCoord-e)+this._middleCoord]),h.stop(a))):this.enableScroll&&(d=this._getDelta(a),c.setAxisWindow(this.axis,this._lastScale,this._initOffset-d/this._lastFactor/this._lastScale),
c.delayedRender(),h.stop(a))},onTouchEnd:function(a){var c=this.chart.getAxis(this.axis);if(1==a.touches.length&&this.enableScroll)this._startPageCoord={x:a.touches[0].pageX,y:a.touches[0].pageY},this._startScroll(c)},_startScroll:function(a){var c=a.getScaler().bounds;this._initOffset=a.getWindowOffset();this._lastScale=a.getWindowScale();this._lastFactor=c.span/(c.upper-c.lower)},onDoubleTap:function(a){var c=this.chart,b=c.getAxis(this.axis),d=1/this.scaleFactor;if(1==b.getWindowScale()){var e=
b.getScaler(),b=e.bounds.from,e=e.bounds.to,f=(b+e)/2,g=this.plot.toData(this._startPageCoord)[this.axis];c.zoomIn(this.axis,[d*(b-f)+g,d*(e-f)+g])}else c.setAxisWindow(this.axis,1,0),c.render();h.stop(a)},_getDelta:function(a){var c=this.chart.getAxis(this.axis),b=c.vertical?"pageY":"pageX",d=c.vertical?"y":"x";return c.vertical?this._startPageCoord[d]-a.touches[0][b]:a.touches[0][b]-this._startPageCoord[d]}});return f("dojo-bidi")?i("dojox.charting.action2d.TouchZoomAndPan",[g,n]):g});