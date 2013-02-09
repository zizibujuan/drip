//>>built
define("dojox/geo/openlayers/TouchInteractionSupport",["dojo/_base/declare","dojo/_base/connect","dojo/_base/html","dojo/_base/lang","dojo/_base/event","dojo/_base/window"],function(declare,connect,html,lang,event,win){return declare("dojox.geo.openlayers.TouchInteractionSupport",null,{_map:null,_centerTouchLocation:null,_touchMoveListener:null,_touchEndListener:null,_initialFingerSpacing:null,_initialScale:null,_tapCount:null,_tapThreshold:null,_lastTap:null,constructor:function(map){this._map=map,this._centerTouchLocation=new OpenLayers.LonLat(0,0);var div=this._map.div;connect.connect(div,"touchstart",this,this._touchStartHandler),connect.connect(div,"touchmove",this,this._touchMoveHandler),connect.connect(div,"touchend",this,this._touchEndHandler),this._tapCount=0,this._lastTap={x:0,y:0},this._tapThreshold=100},_getTouchBarycenter:function(touchEvent){var touches=touchEvent.touches,firstTouch=touches[0],secondTouch=null;touches.length>1?secondTouch=touches[1]:secondTouch=touches[0];var marginBox=html.marginBox(this._map.div),middleX=(firstTouch.pageX+secondTouch.pageX)/2-marginBox.l,middleY=(firstTouch.pageY+secondTouch.pageY)/2-marginBox.t;return{x:middleX,y:middleY}},_getFingerSpacing:function(touchEvent){var touches=touchEvent.touches,spacing=-1;if(touches.length>=2){var dx=touches[1].pageX-touches[0].pageX,dy=touches[1].pageY-touches[0].pageY;spacing=Math.sqrt(dx*dx+dy*dy)}return spacing},_isDoubleTap:function(touchEvent){var isDoubleTap=!1,touches=touchEvent.touches;if(this._tapCount>0&&touches.length==1){var dx=touches[0].pageX-this._lastTap.x,dy=touches[0].pageY-this._lastTap.y,distance=dx*dx+dy*dy;distance<this._tapThreshold?isDoubleTap=!0:this._tapCount=0}return this._tapCount++,this._lastTap.x=touches[0].pageX,this._lastTap.y=touches[0].pageY,setTimeout(lang.hitch(this,function(){this._tapCount=0}),300),isDoubleTap},_doubleTapHandler:function(touchEvent){var touches=touchEvent.touches,marginBox=html.marginBox(this._map.div),offX=touches[0].pageX-marginBox.l,offY=touches[0].pageY-marginBox.t,mapPoint=this._map.getLonLatFromPixel(new OpenLayers.Pixel(offX,offY));this._map.setCenter(new OpenLayers.LonLat(mapPoint.lon,mapPoint.lat),this._map.getZoom()+1)},_touchStartHandler:function(touchEvent){event.stop(touchEvent);if(this._isDoubleTap(touchEvent)){this._doubleTapHandler(touchEvent);return}var middlePoint=this._getTouchBarycenter(touchEvent);this._centerTouchLocation=this._map.getLonLatFromPixel(new OpenLayers.Pixel(middlePoint.x,middlePoint.y)),this._initialFingerSpacing=this._getFingerSpacing(touchEvent),this._initialScale=this._map.getScale(),this._touchMoveListener||(this._touchMoveListener=connect.connect(win.global,"touchmove",this,this._touchMoveHandler)),this._touchEndListener||(this._touchEndListener=connect.connect(win.global,"touchend",this,this._touchEndHandler))},_touchEndHandler:function(touchEvent){event.stop(touchEvent);var touches=touchEvent.touches;if(touches.length==0)this._touchMoveListener&&(connect.disconnect(this._touchMoveListener),this._touchMoveListener=null),this._touchEndListener&&(connect.disconnect(this._touchEndListener),this._touchEndListener=null);else{var middlePoint=this._getTouchBarycenter(touchEvent);this._centerTouchLocation=this._map.getLonLatFromPixel(new OpenLayers.Pixel(middlePoint.x,middlePoint.y))}},_touchMoveHandler:function(touchEvent){event.stop(touchEvent);var middlePoint=this._getTouchBarycenter(touchEvent),mapPoint=this._map.getLonLatFromPixel(new OpenLayers.Pixel(middlePoint.x,middlePoint.y)),mapOffsetLon=mapPoint.lon-this._centerTouchLocation.lon,mapOffsetLat=mapPoint.lat-this._centerTouchLocation.lat,scaleFactor=1,touches=touchEvent.touches;if(touches.length>=2){var fingerSpacing=this._getFingerSpacing(touchEvent);scaleFactor=fingerSpacing/this._initialFingerSpacing,this._map.zoomToScale(this._initialScale/scaleFactor)}var currentMapCenter=this._map.getCenter();this._map.setCenter(new OpenLayers.LonLat(currentMapCenter.lon-mapOffsetLon,currentMapCenter.lat-mapOffsetLat))}})})