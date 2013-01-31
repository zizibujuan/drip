//>>built
define("dojox/geo/charting/KeyboardInteractionSupport","dojo/_base/lang,dojo/_base/declare,dojo/_base/event,dojo/_base/connect,dojo/_base/html,dojo/dom,dojox/lang/functional,dojo/keys".split(","),function(s,o,p,b,q,r,l,c){return o("dojox.geo.charting.KeyboardInteractionSupport",null,{_map:null,_zoomEnabled:!1,constructor:function(a,d){this._map=a;if(d)this._zoomEnabled=d.enableZoom},connect:function(){var a=r.byId(this._map.container);q.attr(a,{tabindex:0,role:"presentation","aria-label":"map"});
this._keydownListener=b.connect(a,"keydown",this,"keydownHandler");this._onFocusListener=b.connect(a,"focus",this,"onFocus");this._onBlurListener=b.connect(a,"blur",this,"onBlur")},disconnect:function(){b.disconnect(this._keydownListener);this._keydownListener=null;b.disconnect(this._onFocusListener);this._onFocusListener=null;b.disconnect(this._onBlurListener);this._onBlurListener=null},keydownHandler:function(a){switch(a.keyCode){case c.LEFT_ARROW:this._directTo(-1,-1,1,-1);break;case c.RIGHT_ARROW:this._directTo(-1,
-1,-1,1);break;case c.UP_ARROW:this._directTo(1,-1,-1,-1);break;case c.DOWN_ARROW:this._directTo(-1,1,-1,-1);break;case c.SPACE:this._map.selectedFeature&&!this._map.selectedFeature._isZoomIn&&this._zoomEnabled&&this._map.selectedFeature._zoomIn();break;case c.ESCAPE:this._map.selectedFeature&&this._map.selectedFeature._isZoomIn&&this._zoomEnabled&&this._map.selectedFeature._zoomOut();break;default:return}p.stop(a)},onFocus:function(){if(!this._map.selectedFeature&&!this._map.focused){this._map.focused=
!0;var a,d=!1;if(this._map.lastSelectedFeature)a=this._map.lastSelectedFeature;else{var b=this._map.getMapCenter(),c=Infinity;l.forIn(this._map.mapObj.features,function(d){var f=Math.sqrt(Math.pow(d._center[0]-b.x,2)+Math.pow(d._center[1]-b.y,2));f<c&&(c=f,a=d)});d=!0}a&&(d&&a._onclickHandler(null),this._map.mapObj.marker.show(a.id))}},onBlur:function(){this._map.lastSelectedFeature=this._map.selectedFeature},_directTo:function(a,d,b,c){var m=this._map.selectedFeature,f=m._center[0],n=m._center[1],
h=Infinity,g=null;l.forIn(this._map.mapObj.features,function(e){var j=Math.abs(f-e._center[0]),k=Math.abs(n-e._center[1]),i=j+k;0<(a-d)*(n-e._center[1])&&j<k&&h>i&&(h=i,g=e);0<(b-c)*(f-e._center[0])&&j>k&&h>i&&(h=i,g=e)});g&&(this._map.mapObj.marker.hide(),g._onclickHandler(null),this._map.mapObj.marker.show(g.id))}})});