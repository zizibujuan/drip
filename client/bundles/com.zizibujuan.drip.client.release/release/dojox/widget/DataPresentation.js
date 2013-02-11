//>>built
define("dojox/widget/DataPresentation",["dojo","dijit","dojox","dojo/require!dojox/grid/DataGrid,dojox/charting/Chart2D,dojox/charting/widget/Legend,dojox/charting/action2d/Tooltip,dojox/charting/action2d/Highlight,dojo/colors,dojo/data/ItemFileWriteStore"],function(f,D,n){f.provide("dojox.widget.DataPresentation");f.experimental("dojox.widget.DataPresentation");f.require("dojox.grid.DataGrid");f.require("dojox.charting.Chart2D");f.require("dojox.charting.widget.Legend");f.require("dojox.charting.action2d.Tooltip");
f.require("dojox.charting.action2d.Highlight");f.require("dojo.colors");f.require("dojo.data.ItemFileWriteStore");(function(){var z=function(b,c,a,d){var o=[{value:0,text:""}],f=b.length;if("ClusteredBars"!==a&&"StackedBars"!==a&&(a=d.offsetWidth,d=7*(""+b[0]).length*b.length,1==c))for(var h=1;500>h&&!(d/h<a);++h)++c;for(a=0;a<f;a++)o.push({value:a+1,text:!c||a%c?"":b[a]});o.push({value:f+1,text:""});return o},A=function(b,c){var a={vertical:!1,labels:c,min:0,max:c.length-1,majorTickStep:1,minorTickStep:1};
if("ClusteredBars"===b||"StackedBars"===b)a.vertical=!0;if("Lines"===b||"Areas"===b||"StackedAreas"===b)a.min++,a.max--;return a},y=function(b,c,a,d){var f={vertical:!0,fixLower:"major",fixUpper:"major",natural:!0};if("secondary"===c)f.leftBottom=!1;if("ClusteredBars"===b||"StackedBars"===b)f.vertical=!1;if(a==d)f.min=a-1,f.max=d+1;return f},B=function(b,c,a){c={type:b,hAxis:"independent",vAxis:"dependent-"+c,gap:4,lines:!1,areas:!1,markers:!1};if("ClusteredBars"===b||"StackedBars"===b)c.hAxis=c.vAxis,
c.vAxis="independent";if("Lines"===b||"Hybrid-Lines"===b||"Areas"===b||"StackedAreas"===b)c.lines=!0;if("Areas"===b||"StackedAreas"===b)c.areas=!0;if("Lines"===b)c.markers=!0;if("Hybrid-Lines"===b)c.shadows={dx:2,dy:2,dw:2},c.type="Lines";if("Hybrid-ClusteredColumns"===b)c.type="ClusteredColumns";if(a)c.animate=a;return c},C=function(b,c,a,d,o,l,h,s,j){if(!c)b.innerHTML="",c=new n.charting.Chart2D(b);if(h)h._clone=function(){var a=new n.charting.Theme({chart:this.chart,plotarea:this.plotarea,axis:this.axis,
series:this.series,marker:this.marker,antiAlias:this.antiAlias,assignColors:this.assignColors,assignMarkers:this.assigneMarkers,colors:f.delegate(this.colors)});a.markers=this.markers;a._buildMarkerArray();return a},c.setTheme(h);var w=j.series_data[0].slice(0);d&&w.reverse();var b=z(w,l,a,b),l={},r=h=null,t={},p;for(p in c.runs)t[p]=!0;for(var e=j.series_name.length,g=0;g<e;g++)if(j.series_chart[g]&&0<j.series_data[g].length){var k=a,i=j.series_axis[g];"Hybrid"==k&&(k="line"==j.series_charttype[g]?
"Hybrid-Lines":"Hybrid-ClusteredColumns");l[i]||(l[i]={});if(!l[i][k]){var m=i+"-"+k;c.addPlot(m,B(k,i,o));var q={};if("string"==typeof s)q.text=function(a){return f.replace(s,[a.element,a.run.name,w[a.index],"ClusteredBars"===k||"StackedBars"===k?a.x:a.y])};else if("function"==typeof s)q.text=s;new n.charting.action2d.Tooltip(c,m,q);"Lines"!==k&&"Hybrid-Lines"!==k&&new n.charting.action2d.Highlight(c,m);l[i][k]=!0}for(var m=[],q=j.series_data[g].length,u=0;u<q;u++){var v=j.series_data[g][u];m.push(v);
if(null===h||v>h)h=v;if(null===r||v<r)r=v}d&&m.reverse();i={plot:i+"-"+k};if(j.series_linestyle[g])i.stroke={style:j.series_linestyle[g]};c.addSeries(j.series_name[g],m,i);delete t[j.series_name[g]]}for(p in t)c.removeSeries(p);c.addAxis("independent",A(a,b));c.addAxis("dependent-primary",y(a,"primary",r,h));c.addAxis("dependent-secondary",y(a,"secondary",r,h));return c},x=function(b,c){var a=b;if(c)for(var d=c.split(/[.\[\]]+/),f=0,l=d.length;f<l;f++)a&&(a=a[d[f]]);return a};f.declare("dojox.widget.DataPresentation",
null,{type:"chart",chartType:"clusteredBars",reverse:!1,animate:null,labelMod:1,legendHorizontal:!0,constructor:function(b,c){f.mixin(this,c);this.domNode=f.byId(b);this[this.type+"Node"]=this.domNode;if("string"==typeof this.theme)this.theme=f.getObject(this.theme);this.chartNode=f.byId(this.chartNode);this.legendNode=f.byId(this.legendNode);this.gridNode=f.byId(this.gridNode);this.titleNode=f.byId(this.titleNode);this.footerNode=f.byId(this.footerNode);if(this.legendVertical)this.legendHorizontal=
!this.legendVertical;this.url?this.setURL(null,null,this.refreshInterval):this.data?this.setData(null,this.refreshInterval):this.setStore()},setURL:function(b,c,a){a&&this.cancelRefresh();this.url=b||this.url;this.urlContent=c||this.urlContent;this.refreshInterval=a||this.refreshInterval;var d=this;f.xhrGet({url:this.url,content:this.urlContent,handleAs:"json-comment-optional",load:function(a){d.setData(a)},error:function(a,b){d.urlError&&"function"==typeof d.urlError&&d.urlError(a,b)}});if(a&&0<
this.refreshInterval)this.refreshIntervalPending=setInterval(function(){d.setURL()},this.refreshInterval)},setData:function(b,c){c&&this.cancelRefresh();this.data=b||this.data;this.refreshInterval=c||this.refreshInterval;for(var a="function"==typeof this.series?this.series(this.data):this.series,d=[],o=[],l=[],h=[],s=[],j=[],n=[],r=[],t=[],p=0,e=0;e<a.length;e++){d[e]=x(this.data,a[e].datapoints);if(d[e]&&d[e].length>p)p=d[e].length;o[e]=[];l[e]=a[e].name||(a[e].namefield?x(this.data,a[e].namefield):
null)||"series "+e;h[e]=!1!==a[e].chart;s[e]=a[e].charttype||"bar";j[e]=a[e].linestyle;n[e]=a[e].axis||"primary";r[e]=!1!==a[e].grid;t[e]=a[e].gridformatter}var g,k,i,m,q=[];for(g=0;g<p;g++){k={index:g};for(e=0;e<a.length;e++)d[e]&&d[e].length>g&&(i=x(d[e][g],a[e].field),h[e]&&(m=parseFloat(i),isNaN(m)||(i=m)),k["data."+e]=i,o[e].push(i));q.push(k)}0>=p&&q.push({index:0});a=new f.data.ItemFileWriteStore({data:{identifier:"index",items:q}});if(this.data.title)a.title=this.data.title;if(this.data.footer)a.footer=
this.data.footer;a.series_data=o;a.series_name=l;a.series_chart=h;a.series_charttype=s;a.series_linestyle=j;a.series_axis=n;a.series_grid=r;a.series_gridformatter=t;this.setPreparedStore(a);if(c&&0<this.refreshInterval){var u=this;this.refreshIntervalPending=setInterval(function(){u.setData()},this.refreshInterval)}},refresh:function(){this.url?this.setURL(this.url,this.urlContent,this.refreshInterval):this.data&&this.setData(this.data,this.refreshInterval)},cancelRefresh:function(){if(this.refreshIntervalPending)clearInterval(this.refreshIntervalPending),
this.refreshIntervalPending=void 0},setStore:function(b,c,a){this.setPreparedStore(b,c,a)},setPreparedStore:function(b,c,a){this.preparedstore=b||this.store;this.query=c||this.query;this.queryOptions=a||this.queryOptions;if(this.preparedstore){if(this.chartNode)this.chartWidget=C(this.chartNode,this.chartWidget,this.chartType,this.reverse,this.animate,this.labelMod,this.theme,this.tooltip,this.preparedstore,this.query,this.queryOptions),this.renderChartWidget();if(this.legendNode){var b=this.legendNode,
c=this.chartWidget,a=this.legendHorizontal,d=this.legendWidget;d?d.refresh():d=new n.charting.widget.Legend({chart:c,horizontal:a},b);this.legendWidget=d}if(this.gridNode){b=this.preparedstore;a=this.query;d=this.queryOptions;c=this.gridWidget||new n.grid.DataGrid({},this.gridNode);c.startup();c.setStore(b,a,d);a=[];for(d=0;d<b.series_name.length;d++)b.series_grid[d]&&0<b.series_data[d].length&&a.push({field:"data."+d,name:b.series_name[d],width:"auto",formatter:b.series_gridformatter[d]});c.setStructure(a);
this.gridWidget=c;this.renderGridWidget()}if(this.titleNode&&(b=this.preparedstore,b.title))this.titleNode.innerHTML=b.title;if(this.footerNode&&(b=this.preparedstore,b.footer))this.footerNode.innerHTML=b.footer}},renderChartWidget:function(){this.chartWidget&&this.chartWidget.render()},renderGridWidget:function(){this.gridWidget&&this.gridWidget.render()},getChartWidget:function(){return this.chartWidget},getGridWidget:function(){return this.gridWidget},destroy:function(){this.cancelRefresh();this.chartWidget&&
(this.chartWidget.destroy(),delete this.chartWidget);this.legendWidget&&delete this.legendWidget;this.gridWidget&&delete this.gridWidget;if(this.chartNode)this.chartNode.innerHTML="";if(this.legendNode)this.legendNode.innerHTML="";if(this.gridNode)this.gridNode.innerHTML="";if(this.titleNode)this.titleNode.innerHTML="";if(this.footerNode)this.footerNode.innerHTML=""}})})()});