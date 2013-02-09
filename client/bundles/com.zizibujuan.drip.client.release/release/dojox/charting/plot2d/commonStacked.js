//>>built
define("dojox/charting/plot2d/commonStacked",["dojo/_base/lang","./common"],function(lang,common){var commonStacked=lang.getObject("dojox.charting.plot2d.commonStacked",!0);return lang.mixin(commonStacked,{collectStats:function(series){var stats=lang.delegate(common.defaultStats);for(var i=0;i<series.length;++i){var run=series[i];for(var j=0;j<run.data.length;j++){var x,y;run.data[j]!==null&&(typeof run.data[j]=="number"||!run.data[j].hasOwnProperty("x")?(y=commonStacked.getIndexValue(series,i,j)[0],x=j+1):(x=run.data[j].x,x!==null&&(y=commonStacked.getValue(series,i,x)[0],y=y!=null&&y.y?y.y:null)),stats.hmin=Math.min(stats.hmin,x),stats.hmax=Math.max(stats.hmax,x),stats.vmin=Math.min(stats.vmin,y),stats.vmax=Math.max(stats.vmax,y))}}return stats},getIndexValue:function(series,i,index){var value=0,v,j,pvalue;for(j=0;j<=i;++j)pvalue=value,v=series[j].data[index],v!=null&&(isNaN(v)&&(v=v.y||0),value+=v);return[value,pvalue]},getValue:function(series,i,x){var value=null,j,z,v,pvalue;for(j=0;j<=i;++j)for(z=0;z<series[j].data.length;z++){pvalue=value,v=series[j].data[z];if(v!==null){if(v.x==x){value||(value={x:x}),v.y!=null&&(value.y==null&&(value.y=0),value.y+=v.y);break}if(v.x>x)break}}return[value,pvalue]}})})