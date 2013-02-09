//>>built
define("dojox/charting/plot2d/common",["dojo/_base/lang","dojo/_base/array","dojo/_base/Color","dojox/gfx","dojox/lang/functional","../scaler/common"],function(lang,arr,Color,g,df,sc){var common=lang.getObject("dojox.charting.plot2d.common",!0);return lang.mixin(common,{doIfLoaded:sc.doIfLoaded,makeStroke:function(stroke){if(!stroke)return stroke;if(typeof stroke=="string"||stroke instanceof Color)stroke={color:stroke};return g.makeParameters(g.defaultStroke,stroke)},augmentColor:function(target,color){var t=new Color(target),c=new Color(color);return c.a=t.a,c},augmentStroke:function(stroke,color){var s=common.makeStroke(stroke);return s&&(s.color=common.augmentColor(s.color,color)),s},augmentFill:function(fill,color){var fc,c=new Color(color);return typeof fill=="string"||fill instanceof Color?common.augmentColor(fill,color):fill},defaultStats:{vmin:Number.POSITIVE_INFINITY,vmax:Number.NEGATIVE_INFINITY,hmin:Number.POSITIVE_INFINITY,hmax:Number.NEGATIVE_INFINITY},collectSimpleStats:function(series){var stats=lang.delegate(common.defaultStats);for(var i=0;i<series.length;++i){var run=series[i];for(var j=0;j<run.data.length;j++)if(run.data[j]!==null){if(typeof run.data[j]=="number"){var old_vmin=stats.vmin,old_vmax=stats.vmax;(!("ymin"in run)||!("ymax"in run))&&arr.forEach(run.data,function(val,i){if(val!==null){var x=i+1,y=val;isNaN(y)&&(y=0),stats.hmin=Math.min(stats.hmin,x),stats.hmax=Math.max(stats.hmax,x),stats.vmin=Math.min(stats.vmin,y),stats.vmax=Math.max(stats.vmax,y)}}),"ymin"in run&&(stats.vmin=Math.min(old_vmin,run.ymin)),"ymax"in run&&(stats.vmax=Math.max(old_vmax,run.ymax))}else{var old_hmin=stats.hmin,old_hmax=stats.hmax,old_vmin=stats.vmin,old_vmax=stats.vmax;(!("xmin"in run)||!("xmax"in run)||!("ymin"in run)||!("ymax"in run))&&arr.forEach(run.data,function(val,i){if(val!==null){var x="x"in val?val.x:i+1,y=val.y;isNaN(x)&&(x=0),isNaN(y)&&(y=0),stats.hmin=Math.min(stats.hmin,x),stats.hmax=Math.max(stats.hmax,x),stats.vmin=Math.min(stats.vmin,y),stats.vmax=Math.max(stats.vmax,y)}}),"xmin"in run&&(stats.hmin=Math.min(old_hmin,run.xmin)),"xmax"in run&&(stats.hmax=Math.max(old_hmax,run.xmax)),"ymin"in run&&(stats.vmin=Math.min(old_vmin,run.ymin)),"ymax"in run&&(stats.vmax=Math.max(old_vmax,run.ymax))}break}}return stats},calculateBarSize:function(availableSize,opt,clusterSize){clusterSize||(clusterSize=1);var gap=opt.gap,size=(availableSize-2*gap)/clusterSize;return"minBarSize"in opt&&(size=Math.max(size,opt.minBarSize)),"maxBarSize"in opt&&(size=Math.min(size,opt.maxBarSize)),size=Math.max(size,1),gap=(availableSize-size*clusterSize)/2,{size:size,gap:gap}},collectStackedStats:function(series){var stats=lang.clone(common.defaultStats);if(series.length){stats.hmin=Math.min(stats.hmin,1),stats.hmax=df.foldl(series,"seed, run -> Math.max(seed, run.data.length)",stats.hmax);for(var i=0;i<stats.hmax;++i){var v=series[0].data[i];v=v&&(typeof v=="number"?v:v.y),isNaN(v)&&(v=0),stats.vmin=Math.min(stats.vmin,v);for(var j=1;j<series.length;++j){var t=series[j].data[i];t=t&&(typeof t=="number"?t:t.y),isNaN(t)&&(t=0),v+=t}stats.vmax=Math.max(stats.vmax,v)}}return stats},curve:function(a,tension){var array=a.slice(0);tension=="x"&&(array[array.length]=array[0]);var p=arr.map(array,function(item,i){if(i==0)return"M"+item.x+","+item.y;if(!isNaN(tension)){var dx=item.x-array[i-1].x,dy=array[i-1].y;return"C"+(item.x-(tension-1)*(dx/tension))+","+dy+" "+(item.x-dx/tension)+","+item.y+" "+item.x+","+item.y}if(tension=="X"||tension=="x"||tension=="S"){var p0,p1=array[i-1],p2=array[i],p3,bz1x,bz1y,bz2x,bz2y,f=1/6;i==1?(tension=="x"?p0=array[array.length-2]:p0=p1,f=1/3):p0=array[i-2],i==array.length-1?(tension=="x"?p3=array[1]:p3=p2,f=1/3):p3=array[i+1];var p1p2=Math.sqrt((p2.x-p1.x)*(p2.x-p1.x)+(p2.y-p1.y)*(p2.y-p1.y)),p0p2=Math.sqrt((p2.x-p0.x)*(p2.x-p0.x)+(p2.y-p0.y)*(p2.y-p0.y)),p1p3=Math.sqrt((p3.x-p1.x)*(p3.x-p1.x)+(p3.y-p1.y)*(p3.y-p1.y)),p0p2f=p0p2*f,p1p3f=p1p3*f;p0p2f>p1p2/2&&p1p3f>p1p2/2?(p0p2f=p1p2/2,p1p3f=p1p2/2):p0p2f>p1p2/2?(p0p2f=p1p2/2,p1p3f=p1p2/2*p1p3/p0p2):p1p3f>p1p2/2&&(p1p3f=p1p2/2,p0p2f=p1p2/2*p0p2/p1p3),tension=="S"&&(p0==p1&&(p0p2f=0),p2==p3&&(p1p3f=0)),bz1x=p1.x+p0p2f*(p2.x-p0.x)/p0p2,bz1y=p1.y+p0p2f*(p2.y-p0.y)/p0p2,bz2x=p2.x-p1p3f*(p3.x-p1.x)/p1p3,bz2y=p2.y-p1p3f*(p3.y-p1.y)/p1p3}return"C"+(bz1x+","+bz1y+" "+bz2x+","+bz2y+" "+p2.x+","+p2.y)});return p.join(" ")},getLabel:function(number,fixed,precision){return sc.doIfLoaded("dojo/number",function(numberLib){return(fixed?numberLib.format(number,{places:precision}):numberLib.format(number))||""},function(){return fixed?number.toFixed(precision):number.toString()})}})})