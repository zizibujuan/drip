//>>built
define("dojox/charting/action2d/MoveSlice","dojo/_base/connect,dojo/_base/declare,dojo/_base/array,./PlotAction,dojo/fx/easing,dojox/gfx/matrix,dojox/gfx/fx,dojox/lang/functional,dojox/lang/functional/scan,dojox/lang/functional/fold".split(","),function(m,e,n,f,g,h,o,d){return e("dojox.charting.action2d.MoveSlice",f,{defaultParams:{duration:400,easing:g.backOut,scale:1.05,shift:7},optionalParams:{},constructor:function(a,d,b){b||(b={});this.scale="number"==typeof b.scale?b.scale:1.05;this.shift="number"==
typeof b.shift?b.shift:7;this.connect()},process:function(a){if(a.shape&&"slice"==a.element&&a.type in this.overOutEvents){if(!this.angles){var e=h._degToRad(a.plot.opt.startAngle);this.angles="number"==typeof a.run.data[0]?d.map(d.scanl(a.run.data,"+",0),"* 2 * Math.PI / this",d.foldl(a.run.data,"+",0)):d.map(d.scanl(a.run.data,"a + b.y",0),"* 2 * Math.PI / this",d.foldl(a.run.data,"a + b.y",0));this.angles=n.map(this.angles,function(a){return a+e})}var b=a.index,c,i,j,k,l;c=(this.angles[b]+this.angles[b+
1])/2;var f=h.rotateAt(-c,a.cx,a.cy),g=h.rotateAt(c,a.cx,a.cy);(c=this.anim[b])?c.action.stop(!0):this.anim[b]=c={};"onmouseover"==a.type?(k=0,l=this.shift,i=1,j=this.scale):(k=this.shift,l=0,i=this.scale,j=1);c.action=o.animateTransform({shape:a.shape,duration:this.duration,easing:this.easing,transform:[g,{name:"translate",start:[k,0],end:[l,0]},{name:"scaleAt",start:[i,a.cx,a.cy],end:[j,a.cx,a.cy]},f]});"onmouseout"==a.type&&m.connect(c.action,"onEnd",this,function(){delete this.anim[b]});c.action.play()}},
reset:function(){delete this.angles}})});