//>>built
define("dojox/charting/action2d/_IndicatorElement","dojo/_base/lang,dojo/_base/array,dojo/_base/declare,../plot2d/Indicator,dojo/has,../plot2d/common,../axis2d/common,dojox/gfx".split(","),function(m,t,j,u,s){var r=function(b,a,d){var f,c=b?{x:a[0],y:d[0][0]}:{x:d[0][0],y:a[0]};1<a.length&&(f=b?{x:a[1],y:d[1][0]}:{x:d[1][0],y:a[1]});return[c,f]},j=j("dojox.charting.action2d._IndicatorElement",u,{constructor:function(b,a){a||(a={});this.inter=a.inter},_updateVisibility:function(b,a,d){var f="x"==d?
this._hAxis:this._vAxis,c=f.getWindowScale();this.chart.setAxisWindow(f.name,c,f.getWindowOffset()+(b[d]-a[d])/c);this._noDirty=!0;this.chart.render();this._noDirty=!1;this._initTrack()},_trackMove:function(){this._updateIndicator(this.pageCoord);this._tracker=setTimeout(m.hitch(this,this._trackMove),100)},_initTrack:function(){if(!this._tracker)this._tracker=setTimeout(m.hitch(this,this._trackMove),500)},stopTrack:function(){if(this._tracker)clearTimeout(this._tracker),this._tracker=null},render:function(){if(this.isDirty()){var b=
this.inter,a=b.plot,d=b.opt.vertical;this.opt.offset=b.opt.offset||(d?{x:0,y:5}:{x:5,y:0});if(b.opt.labelFunc)this.opt.labelFunc=function(a,c,g,e,h){a=r(d,c,g);return b.opt.labelFunc(a[0],a[1],e,h)};if(b.opt.fillFunc)this.opt.fillFunc=function(a,c,g){a=r(d,c,g);return b.opt.fillFunc(a[0],a[1])};this.opt=m.delegate(b.opt,this.opt);this.pageCoord?(this.opt.values=[],this.opt.labels=this.secondCoord?"trend":"marker"):(this.opt.values=null,this.inter.onChange({}));this.hAxis=a.hAxis;this.vAxis=a.vAxis;
this.inherited(arguments)}},_updateIndicator:function(){var b=this._updateCoordinates(this.pageCoord,this.secondCoord);if(1<b.length){var a=this.opt.vertical;this._data=[];this.opt.values=[];t.forEach(b,function(b){b&&(this.opt.values.push(a?b.x:b.y),this._data.push([a?b.y:b.x]))},this);this.inherited(arguments)}else this.inter.onChange({})},_renderText:function(b,a,d,f,c,g,e,h){this.inter.opt.labels&&this.inherited(arguments);var i=r(this.opt.vertical,e,h);this.inter.onChange({start:i[0],end:i[1],
label:a})},_updateCoordinates:function(b,a){s("dojo-bidi")&&this._checkXCoords(b,a);var d=this.inter,f=d.plot,c=d.opt.vertical,g=this.chart.getAxis(f.hAxis),e=this.chart.getAxis(f.vAxis),h=g.name,i=e.name,j=g.getScaler().bounds,m=e.getScaler().bounds,e=c?"x":"y",g=c?h:i,p=c?j:m;if(a){var k;c?b.x>a.x&&(k=a,a=b,b=k):b.y>a.y&&(k=a,a=b,b=k)}var o=f.toData(b),l;a&&(l=f.toData(a));var n={};n[h]=j.from;n[i]=m.from;k=f.toPage(n);n[h]=j.to;n[i]=m.to;h=f.toPage(n);if(o[g]<p.from){if(!l&&d.opt.autoScroll&&!d.opt.mouseOver)return this._updateVisibility(b,
k,e),[];if(d.opt.mouseOver)return[];b[e]=k[e];o=f.toData(b)}else if(o[g]>p.to){if(!l&&d.opt.autoScroll&&!d.opt.mouseOver)return this._updateVisibility(b,h,e),[];if(d.opt.mouseOver)return[];b[e]=h[e];o=f.toData(b)}var d=this._snapData(o,e,c),q;if(null==d.y)return[];a&&(l[g]<p.from?(a[e]=k[e],l=f.toData(a)):l[g]>p.to&&(a[e]=h[e],l=f.toData(a)),q=this._snapData(l,e,c),null==q.y&&(q=null));return[d,q]},_snapData:function(b,a,d){var f=this.chart.getSeries(this.inter.opt.series).data,c,g,e=f.length;for(c=
0;c<e;++c)if(g=f[c],null!=g)if("number"==typeof g){if(c+1>b[a])break}else if(g[a]>b[a])break;var h,i;if("number"==typeof g)e=c+1,0<c&&(h=c,i=f[c-1]);else if(e=g.x,g=g.y,0<c)h=f[c-1].x,i=f[c-1].y;if(0<c&&b[a]<=(d?(e+h)/2:(g+i)/2))e=h,g=i;return{x:e,y:g}},cleanGroup:function(b){this.inherited(arguments);this.group.moveToFront();return this},isDirty:function(){return!this._noDirty&&(this.dirty||this.inter.plot.isDirty())}});s("dojo-bidi")&&j.extend({_checkXCoords:function(b,a){if(this.chart.isRightToLeft()){if(b)b.x=
this.chart.dim.width+(this.chart.offsets.l-this.chart.offsets.r)-b.x;if(a)a.x=this.chart.dim.width+(this.chart.offsets.l-this.chart.offsets.r)-a.x}}});return j});