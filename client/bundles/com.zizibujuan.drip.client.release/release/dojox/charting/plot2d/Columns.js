//>>built
define("dojox/charting/plot2d/Columns","dojo/_base/lang,dojo/_base/array,dojo/_base/declare,dojo/has,./CartesianBase,./_PlotEvents,./common,dojox/lang/functional,dojox/lang/functional/reversed,dojox/lang/utils,dojox/gfx/fx".split(","),function(o,y,u,C,D,E,p,F,G,q,H){var I=G.lambda("item.purgeGroup()");return u("dojox.charting.plot2d.Columns",[D,E],{defaultParams:{gap:0,animate:null,enableCache:!1},optionalParams:{minBarSize:1,maxBarSize:1,stroke:{},outline:{},shadow:{},fill:{},styleFunc:null,font:"",
fontColor:""},constructor:function(a,c){this.opt=o.clone(o.mixin(this.opt,this.defaultParams));q.updateWithObject(this.opt,c);q.updateWithPattern(this.opt,c,this.optionalParams);this.animate=this.opt.animate},getSeriesStats:function(){var a=p.collectSimpleStats(this.series);a.hmin-=0.5;a.hmax+=0.5;return a},createRect:function(a,c,d){var e;this.opt.enableCache&&0<a._rectFreePool.length?(e=a._rectFreePool.pop(),e.setShape(d),c.add(e)):e=c.createRect(d);this.opt.enableCache&&a._rectUsePool.push(e);
return e},render:function(a,c){if(this.zoom&&!this.isDataDirty())return this.performZoom(a,c);this.resetEvents();this.dirty=this.isDirty();var d;if(this.dirty)y.forEach(this.series,I),this._eventSeries={},this.cleanGroup(),d=this.getGroup(),F.forEachRev(this.series,function(a){a.cleanGroup(d)});for(var e=this.chart.theme,p=this._hScaler.scaler.getTransformerFromModel(this._hScaler),v=this._vScaler.scaler.getTransformerFromModel(this._vScaler),w=Math.max(0,this._vScaler.bounds.lower),r=v(w),q=this.events(),
s=this.getBarProperties(),l=this.series.length-1;0<=l;--l){var b=this.series[l];if(!this.dirty&&!b.dirty)e.skip(),this._reconnectEvents(b.name);else{b.cleanGroup();if(this.opt.enableCache)b._rectFreePool=(b._rectFreePool?b._rectFreePool:[]).concat(b._rectUsePool?b._rectUsePool:[]),b._rectUsePool=[];var z=e.next("column",[this.opt,b]),A=Array(b.data.length);d=b.group;for(var m=y.some(b.data,function(a){return"number"==typeof a||a&&!a.hasOwnProperty("x")}),g=m?Math.max(0,Math.floor(this._hScaler.bounds.from-
1)):0,u=m?Math.min(b.data.length,Math.ceil(this._hScaler.bounds.to)):b.data.length;g<u;++g){var k=b.data[g];if(null!=k){var i=this.getValue(k,g,l,m),x=v(i.y),t=Math.abs(x-r),f,h;this.opt.styleFunc||"number"!=typeof k?(f="number"!=typeof k?[k]:[],this.opt.styleFunc&&f.push(this.opt.styleFunc(k)),f=e.addMixin(z,"column",f,!0)):f=e.post(z,"column");if(1<=s.width&&0<=t){var n={x:c.l+p(i.x+0.5)+s.gap+s.thickness*l,y:a.height-c.b-(i.y>w?x:r),width:s.width,height:t};f.series.shadow&&(h=o.clone(n),h.x+=f.series.shadow.dx,
h.y+=f.series.shadow.dy,h=this.createRect(b,d,h).setFill(f.series.shadow.color).setStroke(f.series.shadow),this.animate&&this._animateColumn(h,a.height-c.b+r,t));var j=this._plotFill(f.series.fill,a,c),j=this._shapeFill(j,n),j=this.createRect(b,d,n).setFill(j).setStroke(f.series.stroke);b.dyn.fill=j.getFill();b.dyn.stroke=j.getStroke();if(q){var B={element:"column",index:g,run:b,shape:j,shadow:h,cx:i.x+0.5,cy:i.y,x:m?g:b.data[g].x,y:m?b.data[g]:b.data[g].y};this._connectEvents(B);A[g]=B}if(!isNaN(i.py)&&
i.py>w)n.height=x-v(i.py);this.createLabel(d,k,n,f);this.animate&&this._animateColumn(j,a.height-c.b-r,t)}}}this._eventSeries[b.name]=A;b.dirty=!1}}this.dirty=!1;C("dojo-bidi")&&this._checkOrientation(this.group,a,c);return this},getValue:function(a,c,d,e){e?(d="number"==typeof a?a:a.y,a=c):(d=a.y,a=a.x-1);return{x:a,y:d}},getBarProperties:function(){var a=p.calculateBarSize(this._hScaler.bounds.scale,this.opt);return{gap:a.gap,width:a.size,thickness:0}},_animateColumn:function(a,c,d){0==d&&(d=1);
H.animateTransform(o.delegate({shape:a,duration:1200,transform:[{name:"translate",start:[0,c-c/d],end:[0,0]},{name:"scale",start:[1,1/d],end:[1,1]},{name:"original"}]},this.animate)).play()}})});