//>>built
define("dojox/charting/plot2d/Spider",["dojo/_base/lang","dojo/_base/declare","dojo/_base/connect","dojo/_base/array","dojo/dom-geometry","dojo/_base/fx","dojo/fx","dojo/sniff","./Base","./_PlotEvents","./common","../axis2d/common","dojox/gfx","dojox/gfx/matrix","dojox/gfx/fx","dojox/lang/functional","dojox/lang/utils","dojo/fx/easing"],function(lang,declare,hub,arr,domGeom,baseFx,coreFx,has,Base,PlotEvents,dc,da,g,m,gfxfx,df,du,easing){var FUDGE_FACTOR=.2,Spider=declare("dojox.charting.plot2d.Spider",[Base,PlotEvents],{defaultParams:{labels:!0,ticks:!1,fixed:!0,precision:1,labelOffset:-10,labelStyle:"default",htmlLabels:!0,startAngle:-90,divisions:3,axisColor:"",axisWidth:0,spiderColor:"",spiderWidth:0,seriesWidth:0,seriesFillAlpha:.2,spiderOrigin:.16,markerSize:3,spiderType:"polygon",animationType:easing.backOut,axisTickFont:"",axisTickFontColor:"",axisFont:"",axisFontColor:""},optionalParams:{radius:0,font:"",fontColor:""},constructor:function(chart,kwArgs){this.opt=lang.clone(this.defaultParams),du.updateWithObject(this.opt,kwArgs),du.updateWithPattern(this.opt,kwArgs,this.optionalParams),this.dyn=[],this.datas={},this.labelKey=[],this.oldSeriePoints={},this.animations={}},clear:function(){return this.inherited(arguments),this.dyn=[],this.axes=[],this.datas={},this.labelKey=[],this.oldSeriePoints={},this.animations={},this},setAxis:function(axis){return axis&&(axis.opt.min!=undefined&&(this.datas[axis.name].min=axis.opt.min),axis.opt.max!=undefined&&(this.datas[axis.name].max=axis.opt.max)),this},addSeries:function(run){this.series.push(run);var key;for(key in run.data){var val=run.data[key],data=this.datas[key];if(data)data.vlist.push(val),data.min=Math.min(data.min,val),data.max=Math.max(data.max,val);else{var axisKey="__"+key;this.axes.push(axisKey),this[axisKey]=key,this.datas[key]={min:val,max:val,vlist:[val]}}}if(this.labelKey.length<=0)for(key in run.data)this.labelKey.push(key);return this},getSeriesStats:function(){return dc.collectSimpleStats(this.series)},render:function(dim,offsets){if(!this.dirty)return this;this.dirty=!1,this.cleanGroup();var s=this.group,t=this.chart.theme;this.resetEvents();if(!this.series||!this.series.length)return this;var o=this.opt,ta=t.axis,rx=(dim.width-offsets.l-offsets.r)/2,ry=(dim.height-offsets.t-offsets.b)/2,r=Math.min(rx,ry),axisTickFont=o.font||ta.majorTick&&ta.majorTick.font||ta.tick&&ta.tick.font||"normal normal normal 7pt Tahoma",axisFont=o.axisFont||ta.tick&&ta.tick.titleFont||"normal normal normal 11pt Tahoma",axisTickFontColor=o.axisTickFontColor||ta.majorTick&&ta.majorTick.fontColor||ta.tick&&ta.tick.fontColor||"silver",axisFontColor=o.axisFontColor||ta.tick&&ta.tick.titleFontColor||"black",axisColor=o.axisColor||ta.tick&&ta.tick.axisColor||"silver",spiderColor=o.spiderColor||ta.tick&&ta.tick.spiderColor||"silver",axisWidth=o.axisWidth||ta.stroke&&ta.stroke.width||2,spiderWidth=o.spiderWidth||ta.stroke&&ta.stroke.width||2,seriesWidth=o.seriesWidth||ta.stroke&&ta.stroke.width||2,asize=g.normalizedLength(g.splitFontString(axisFont).size),startAngle=m._degToRad(o.startAngle),start=startAngle,labels,shift,labelR,outerPoints,innerPoints,divisionPoints,divisionRadius,labelPoints,ro=o.spiderOrigin,dv=o.divisions>=3?o.divisions:3,ms=o.markerSize,spt=o.spiderType,at=o.animationType,lboffset=o.labelOffset<-10?o.labelOffset:-10,axisExtra=.2,i,j,point,len,fontWidth,render,serieEntry,run,data,min,max,distance;o.labels&&(labels=arr.map(this.series,function(s){return s.name},this),shift=df.foldl1(df.map(labels,function(label){var font=t.series.font;return g._base._getTextBox(label,{font:font}).w},this),"Math.max(a, b)")/2,r=Math.min(rx-2*shift,ry-asize)+lboffset,labelR=r-lboffset),"radius"in o&&(r=o.radius,labelR=r-lboffset),r/=1+axisExtra;var circle={cx:offsets.l+rx,cy:offsets.t+ry,r:r};for(i=this.series.length-1;i>=0;i--){serieEntry=this.series[i];if(!this.dirty&&!serieEntry.dirty){t.skip();continue}serieEntry.cleanGroup(),run=serieEntry.data;if(run!==null){len=this._getObjectLength(run);if(!outerPoints||outerPoints.length<=0){outerPoints=[],innerPoints=[],labelPoints=[],this._buildPoints(outerPoints,len,circle,r,start,!0),this._buildPoints(innerPoints,len,circle,r*ro,start,!0),this._buildPoints(labelPoints,len,circle,labelR,start);if(dv>2){divisionPoints=[],divisionRadius=[];for(j=0;j<dv-2;j++)divisionPoints[j]=[],this._buildPoints(divisionPoints[j],len,circle,r*(ro+(1-ro)*(j+1)/(dv-1)),start,!0),divisionRadius[j]=r*(ro+(1-ro)*(j+1)/(dv-1))}}}}var axisGroup=s.createGroup(),axisStroke={color:axisColor,width:axisWidth},spiderStroke={color:spiderColor,width:spiderWidth};for(j=outerPoints.length-1;j>=0;--j){point=outerPoints[j];var st={x:point.x+(point.x-circle.cx)*axisExtra,y:point.y+(point.y-circle.cy)*axisExtra},nd={x:point.x+(point.x-circle.cx)*axisExtra/2,y:point.y+(point.y-circle.cy)*axisExtra/2};axisGroup.createLine({x1:circle.cx,y1:circle.cy,x2:st.x,y2:st.y}).setStroke(axisStroke),this._drawArrow(axisGroup,st,nd,axisStroke)}var labelGroup=s.createGroup();for(j=labelPoints.length-1;j>=0;--j){point=labelPoints[j],fontWidth=g._base._getTextBox(this.labelKey[j],{font:axisFont}).w||0,render=this.opt.htmlLabels&&g.renderer!="vml"?"html":"gfx";var elem=da.createText[render](this.chart,labelGroup,!domGeom.isBodyLtr()&&render=="html"?point.x+fontWidth-dim.width:point.x,point.y,"middle",this.labelKey[j],axisFont,axisFontColor);this.opt.htmlLabels&&this.htmlElements.push(elem)}var spiderGroup=s.createGroup();if(spt=="polygon"){spiderGroup.createPolyline(outerPoints).setStroke(spiderStroke),spiderGroup.createPolyline(innerPoints).setStroke(spiderStroke);if(divisionPoints.length>0)for(j=divisionPoints.length-1;j>=0;--j)spiderGroup.createPolyline(divisionPoints[j]).setStroke(spiderStroke)}else{spiderGroup.createCircle({cx:circle.cx,cy:circle.cy,r:r}).setStroke(spiderStroke),spiderGroup.createCircle({cx:circle.cx,cy:circle.cy,r:r*ro}).setStroke(spiderStroke);if(divisionRadius.length>0)for(j=divisionRadius.length-1;j>=0;--j)spiderGroup.createCircle({cx:circle.cx,cy:circle.cy,r:divisionRadius[j]}).setStroke(spiderStroke)}len=this._getObjectLength(this.datas);var textGroup=s.createGroup(),k=0;for(var key in this.datas){data=this.datas[key],min=data.min,max=data.max,distance=max-min,end=start+2*Math.PI*k/len;for(i=0;i<dv;i++){var text=min+distance*i/(dv-1);point=this._getCoordinate(circle,r*(ro+(1-ro)*i/(dv-1)),end),text=this._getLabel(text),fontWidth=g._base._getTextBox(text,{font:axisTickFont}).w||0,render=this.opt.htmlLabels&&g.renderer!="vml"?"html":"gfx",this.opt.htmlLabels&&this.htmlElements.push(da.createText[render](this.chart,textGroup,!domGeom.isBodyLtr()&&render=="html"?point.x+fontWidth-dim.width:point.x,point.y,"start",text,axisTickFont,axisTickFontColor))}k++}this.chart.seriesShapes={};for(i=this.series.length-1;i>=0;i--){serieEntry=this.series[i],run=serieEntry.data;if(run!==null){var seriePoints=[],tipData=[];k=0;for(key in run){data=this.datas[key],min=data.min,max=data.max,distance=max-min;var entry=run[key],end=start+2*Math.PI*k/len;point=this._getCoordinate(circle,r*(ro+(1-ro)*(entry-min)/distance),end),seriePoints.push(point),tipData.push({sname:serieEntry.name,key:key,data:entry}),k++}seriePoints[seriePoints.length]=seriePoints[0],tipData[tipData.length]=tipData[0];var polygonBoundRect=this._getBoundary(seriePoints),theme=t.next("spider",[o,serieEntry]),ts=serieEntry.group,f=g.normalizeColor(theme.series.fill),sk={color:theme.series.fill,width:seriesWidth};f.a=o.seriesFillAlpha,serieEntry.dyn={fill:f,stroke:sk};var osps=this.oldSeriePoints[serieEntry.name],cs=this._createSeriesEntry(ts,osps||innerPoints,seriePoints,f,sk,r,ro,ms,at);this.chart.seriesShapes[serieEntry.name]=cs,this.oldSeriePoints[serieEntry.name]=seriePoints;var po={element:"spider_poly",index:i,id:"spider_poly_"+serieEntry.name,run:serieEntry,plot:this,shape:cs.poly,parent:ts,brect:polygonBoundRect,cx:circle.cx,cy:circle.cy,cr:r,f:f,s:s};this._connectEvents(po);var so={element:"spider_plot",index:i,id:"spider_plot_"+serieEntry.name,run:serieEntry,plot:this,shape:serieEntry.group};this._connectEvents(so),arr.forEach(cs.circles,function(c,i){var co={element:"spider_circle",index:i,id:"spider_circle_"+serieEntry.name+i,run:serieEntry,plot:this,shape:c,parent:ts,tdata:tipData[i],cx:seriePoints[i].x,cy:seriePoints[i].y,f:f,s:s};this._connectEvents(co)},this)}}return this},_createSeriesEntry:function(ts,osps,sps,f,sk,r,ro,ms,at){var spoly=ts.createPolyline(osps).setFill(f).setStroke(sk),scircle=[];for(var j=0;j<osps.length;j++){var point=osps[j],cr=ms,circle=ts.createCircle({cx:point.x,cy:point.y,r:cr}).setFill(f).setStroke(sk);scircle.push(circle)}var anims=arr.map(sps,function(np,j){var sp=osps[j],anim=new baseFx.Animation({duration:1e3,easing:at,curve:[sp.y,np.y]}),spl=spoly,sc=scircle[j];return hub.connect(anim,"onAnimate",function(y){var pshape=spl.getShape();pshape.points[j].y=y,spl.setShape(pshape);var cshape=sc.getShape();cshape.cy=y,sc.setShape(cshape)}),anim}),anims1=arr.map(sps,function(np,j){var sp=osps[j],anim=new baseFx.Animation({duration:1e3,easing:at,curve:[sp.x,np.x]}),spl=spoly,sc=scircle[j];return hub.connect(anim,"onAnimate",function(x){var pshape=spl.getShape();pshape.points[j].x=x,spl.setShape(pshape);var cshape=sc.getShape();cshape.cx=x,sc.setShape(cshape)}),anim}),masterAnimation=coreFx.combine(anims.concat(anims1));return masterAnimation.play(),{group:ts,poly:spoly,circles:scircle}},plotEvent:function(o){o.element=="spider_plot"&&o.type=="onmouseover"&&!has("ie")&&o.shape.moveToFront()},tooltipFunc:function(o){return o.element=="spider_circle"?o.tdata.sname+"<br/>"+o.tdata.key+"<br/>"+o.tdata.data:null},_getBoundary:function(points){var xmax=points[0].x,xmin=points[0].x,ymax=points[0].y,ymin=points[0].y;for(var i=0;i<points.length;i++){var point=points[i];xmax=Math.max(point.x,xmax),ymax=Math.max(point.y,ymax),xmin=Math.min(point.x,xmin),ymin=Math.min(point.y,ymin)}return{x:xmin,y:ymin,width:xmax-xmin,height:ymax-ymin}},_drawArrow:function(s,start,end,stroke){var len=Math.sqrt(Math.pow(end.x-start.x,2)+Math.pow(end.y-start.y,2)),sin=(end.y-start.y)/len,cos=(end.x-start.x)/len,point2={x:end.x+len/3*-sin,y:end.y+len/3*cos},point3={x:end.x+len/3*sin,y:end.y+len/3*-cos};s.createPolyline([start,point2,point3]).setFill(stroke.color).setStroke(stroke)},_buildPoints:function(points,count,circle,radius,angle,recursive){for(var i=0;i<count;i++){var end=angle+2*Math.PI*i/count;points.push(this._getCoordinate(circle,radius,end))}recursive&&points.push(this._getCoordinate(circle,radius,angle+2*Math.PI))},_getCoordinate:function(circle,radius,angle){return{x:circle.cx+radius*Math.cos(angle),y:circle.cy+radius*Math.sin(angle)}},_getObjectLength:function(obj){var count=0;if(lang.isObject(obj))for(var key in obj)count++;return count},_getLabel:function(number){return dc.getLabel(number,this.opt.fixed,this.opt.precision)}});return Spider})