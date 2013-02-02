//>>built
define("dojox/charting/plot2d/Bars","dojo/_base/lang,dojo/_base/array,dojo/_base/declare,./CartesianBase,./_PlotEvents,./common,dojox/gfx/fx,dojox/lang/utils,dojox/lang/functional,dojox/lang/functional/reversed".split(","),function(o,x,v,B,C,p,D,q,E,F){var G=F.lambda("item.purgeGroup()");return v("dojox.charting.plot2d.Bars",[B,C],{defaultParams:{gap:0,animate:null,enableCache:!1},optionalParams:{minBarSize:1,maxBarSize:1,stroke:{},outline:{},shadow:{},fill:{},styleFunc:null,font:"",fontColor:""},
constructor:function(a,b){this.opt=o.clone(o.mixin(this.opt,this.defaultParams));q.updateWithObject(this.opt,b);q.updateWithPattern(this.opt,b,this.optionalParams);this.animate=this.opt.animate},getSeriesStats:function(){var a=p.collectSimpleStats(this.series),b;a.hmin-=0.5;a.hmax+=0.5;b=a.hmin;a.hmin=a.vmin;a.vmin=b;b=a.hmax;a.hmax=a.vmax;a.vmax=b;return a},createRect:function(a,b,d){var e;this.opt.enableCache&&0<a._rectFreePool.length?(e=a._rectFreePool.pop(),e.setShape(d),b.add(e)):e=b.createRect(d);
this.opt.enableCache&&a._rectUsePool.push(e);return e},createLabel:function(a,b,d,e){this.opt.labels&&"outside"==this.opt.labelStyle?this.renderLabel(a,d.x+d.width+this.opt.labelOffset,d.y+d.height/2,this._getLabel(isNaN(b.y)?b:b.y),e,"start"):this.inherited(arguments)},render:function(a,b){if(this.zoom&&!this.isDataDirty())return this.performZoom(a,b);this.dirty=this.isDirty();this.resetEvents();var d;if(this.dirty)x.forEach(this.series,G),this._eventSeries={},this.cleanGroup(),d=this.getGroup(),
E.forEachRev(this.series,function(a){a.cleanGroup(d)});for(var e=this.chart.theme,r=this._hScaler.scaler.getTransformerFromModel(this._hScaler),p=this._vScaler.scaler.getTransformerFromModel(this._vScaler),w=Math.max(0,this._hScaler.bounds.lower),s=r(w),q=this.events(),t=this.getBarProperties(),m=this.series.length-1;0<=m;--m){var c=this.series[m];if(!this.dirty&&!c.dirty)e.skip(),this._reconnectEvents(c.name);else{c.cleanGroup();if(this.opt.enableCache)c._rectFreePool=(c._rectFreePool?c._rectFreePool:
[]).concat(c._rectUsePool?c._rectUsePool:[]),c._rectUsePool=[];var y=e.next("bar",[this.opt,c]),z=Array(c.data.length);d=c.group;for(var n=x.some(c.data,function(a){return"number"==typeof a||a&&!a.hasOwnProperty("x")}),h=n?Math.max(0,Math.floor(this._vScaler.bounds.from-1)):0,v=n?Math.min(c.data.length,Math.ceil(this._vScaler.bounds.to)):c.data.length;h<v;++h){var l=c.data[h];if(null!=l){var i=this.getValue(l,h,m,n),g=r(i.y),u=Math.abs(g-s),f,j;this.opt.styleFunc||"number"!=typeof l?(f="number"!=
typeof l?[l]:[],this.opt.styleFunc&&f.push(this.opt.styleFunc(l)),f=e.addMixin(y,"bar",f,!0)):f=e.post(y,"bar");if(0<=u&&1<=t.height){g={x:b.l+(i.y<w?g:s),y:a.height-b.b-p(i.x+1.5)+t.gap+t.thickness*(this.series.length-m-1),width:u,height:t.height};f.series.shadow&&(j=o.clone(g),j.x+=f.series.shadow.dx,j.y+=f.series.shadow.dy,j=this.createRect(c,d,j).setFill(f.series.shadow.color).setStroke(f.series.shadow),this.animate&&this._animateBar(j,b.l+s,-u));var k=this._plotFill(f.series.fill,a,b),k=this._shapeFill(k,
g),k=this.createRect(c,d,g).setFill(k).setStroke(f.series.stroke);c.dyn.fill=k.getFill();c.dyn.stroke=k.getStroke();if(q){var A={element:"bar",index:h,run:c,shape:k,shadow:j,cx:i.y,cy:i.x+1.5,x:n?h:c.data[h].x,y:n?c.data[h]:c.data[h].y};this._connectEvents(A);z[h]=A}!isNaN(i.py)&&i.py>w&&(g.x+=r(i.py),g.width-=r(i.py));this.createLabel(d,l,g,f);this.animate&&this._animateBar(k,b.l+s,-u)}}}this._eventSeries[c.name]=z;c.dirty=!1}}this.dirty=!1;this.chart.isRightToLeft&&this.chart.isRightToLeft()&&this.chart.applyMirroring(this.group,
a,b);return this},getValue:function(a,b,d,e){e?(d="number"==typeof a?a:a.y,a=b):(d=a.y,a=a.x-1);return{y:d,x:a}},getBarProperties:function(){var a=p.calculateBarSize(this._vScaler.bounds.scale,this.opt);return{gap:a.gap,height:a.size,thickness:0}},_animateBar:function(a,b,d){0==d&&(d=1);D.animateTransform(o.delegate({shape:a,duration:1200,transform:[{name:"translate",start:[b-b/d,0],end:[0,0]},{name:"scale",start:[1/d,1],end:[1,1]},{name:"original"}]},this.animate)).play()}})});