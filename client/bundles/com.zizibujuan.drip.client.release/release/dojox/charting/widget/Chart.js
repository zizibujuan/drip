//>>built
define("dojox/charting/widget/Chart","dojo/_base/kernel,dojo/_base/lang,dojo/_base/array,dojo/dom-attr,dojo/_base/declare,dojo/query,dijit/_WidgetBase,../Chart,dojo/has,dojo/has!dojo-bidi?../bidi/widget/Chart,dojox/lang/utils,dojox/lang/functional,dojox/lang/functional/lambda".split(","),function(g,h,o,v,p,i,j,w,q,x,k,y,z){var l,r,s,t,u,m=function(c){return c},n=h.getObject("dojox.charting");l=function(c,d,b){var a=eval("("+d+".prototype.defaultParams)"),e,f;for(e in a)e in b||(f=c.getAttribute(e),
b[e]=k.coerceType(a[e],null==f||"undefined"==typeof f?a[e]:f));d=eval("("+d+".prototype.optionalParams)");for(e in d)e in b||(f=c.getAttribute(e),null!=f&&(b[e]=k.coerceType(d[e],f)))};r=function(c){var d=c.getAttribute("name"),b=c.getAttribute("type");if(!d)return null;var d={name:d,kwArgs:{}},a=d.kwArgs;if(b){n.axis2d[b]&&(b=g._scopeName+"x.charting.axis2d."+b);var e=eval("("+b+")");if(e)a.type=e}else b=g._scopeName+"x.charting.axis2d.Default";l(c,b,a);if(a.font||a.fontColor){if(!a.tick)a.tick=
{};if(a.font)a.tick.font=a.font;if(a.fontColor)a.tick.fontColor=a.fontColor}return d};s=function(c){var d=c.getAttribute("name"),b=c.getAttribute("type");if(!d)return null;var d={name:d,kwArgs:{}},a=d.kwArgs;if(b){n.plot2d&&n.plot2d[b]&&(b=g._scopeName+"x.charting.plot2d."+b);var e=eval("("+b+")");if(e)a.type=e}else b=g._scopeName+"x.charting.plot2d.Default";l(c,b,a);var b=eval("("+b+".prototype.baseParams)"),f;for(f in b)f in a||(e=c.getAttribute(f),a[f]=k.coerceType(b[f],null==e||"undefined"==typeof e?
b[f]:e));return d};t=function(c){var d=c.getAttribute("plot"),b=c.getAttribute("type");d||(d="default");var d={plot:d,kwArgs:{}},a=d.kwArgs;if(b){n.action2d[b]&&(b=g._scopeName+"x.charting.action2d."+b);var e=eval("("+b+")");if(!e)return null;d.action=e}else return null;l(c,b,a);return d};u=function(c){var c=h.partial(v.get,c),d=c("name");if(!d)return null;var d={name:d,kwArgs:{}},b=d.kwArgs,a;a=c("plot");if(null!=a)b.plot=a;a=c("marker");if(null!=a)b.marker=a;a=c("stroke");if(null!=a)b.stroke=eval("("+
a+")");a=c("outline");if(null!=a)b.outline=eval("("+a+")");a=c("shadow");if(null!=a)b.shadow=eval("("+a+")");a=c("fill");if(null!=a)b.fill=eval("("+a+")");a=c("font");if(null!=a)b.font=a;a=c("fontColor");if(null!=a)b.fontColor=eval("("+a+")");a=c("legend");if(null!=a)b.legend=a;a=c("data");if(null!=a)return d.type="data",d.data=a?o.map((""+a).split(","),Number):[],d;a=c("array");if(null!=a)return d.type="data",d.data=eval("("+a+")"),d;a=c("store");if(null!=a){d.type="store";d.data=eval("("+a+")");
a=c("field");d.field=null!=a?a:"value";if(a=c("query"))b.query=a;if(a=c("queryOptions"))b.queryOptions=eval("("+a+")");if(a=c("start"))b.start=Number(a);if(a=c("count"))b.count=Number(a);if(a=c("sort"))b.sort=eval("("+a+")");if(a=c("valueFn"))b.valueFn=z.lambda(a);return d}return null};j=p(q("dojo-bidi")?"dojox.charting.widget.NonBidiChart":"dojox.charting.widget.Chart",j,{theme:null,margins:null,stroke:void 0,fill:void 0,buildRendering:function(){this.inherited(arguments);var c=this.domNode,d=i("> .axis",
c).map(r).filter(m),b=i("> .plot",c).map(s).filter(m),a=i("> .action",c).map(t).filter(m),e=i("> .series",c).map(u).filter(m);c.innerHTML="";var f=this.chart=new w(c,{margins:this.margins,stroke:this.stroke,fill:this.fill,textDir:this.textDir});this.theme&&f.setTheme(this.theme);d.forEach(function(a){f.addAxis(a.name,a.kwArgs)});b.forEach(function(a){f.addPlot(a.name,a.kwArgs)});this.actions=a.map(function(a){return new a.action(f,a.plot,a.kwArgs)});y.foldl(e,function(a,b){if("data"==b.type)f.addSeries(b.name,
b.data,b.kwArgs),a=!0;else{f.addSeries(b.name,[0],b.kwArgs);var c={};k.updateWithPattern(c,b.kwArgs,{query:"",queryOptions:null,start:0,count:1},!0);if(b.kwArgs.sort)c.sort=h.clone(b.kwArgs.sort);h.mixin(c,{onComplete:function(a){if("valueFn"in b.kwArgs)var c=b.kwArgs.valueFn,a=o.map(a,function(a){return c(b.data.getValue(a,b.field,0))});else a=o.map(a,function(a){return b.data.getValue(a,b.field,0)});f.addSeries(b.name,a,b.kwArgs).render()}});b.data.fetch(c)}return a},!1)&&f.render()},destroy:function(){this.chart.destroy();
this.inherited(arguments)},resize:function(c){this.chart.resize.apply(this.chart,arguments)}});return q("dojo-bidi")?p("dojox.charting.widget.Chart",[j,x]):j});