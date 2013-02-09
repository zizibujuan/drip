//>>built
define("dojox/fx/split",["dojo/_base/lang","dojo/dom","dojo/_base/window","dojo/_base/html","dojo/dom-geometry","dojo/dom-construct","dojo/dom-attr","dojo/_base/fx","dojo/fx","./_base","dojo/fx/easing","dojo/_base/connect"],function(lang,dom,winUtil,htmlUtil,domGeom,domConstruct,domAttr,baseFx,coreFx,fxExt,easingUtil,connectUtil){var dojoxFx=lang.getObject("dojox.fx");return lang.mixin(dojoxFx,{_split:function(args){args.rows=args.rows||3,args.columns=args.columns||3,args.duration=args.duration||1e3;var node=args.node=dom.byId(args.node),parentNode=node.parentNode,pNode=parentNode,body=winUtil.body(),_pos="position";while(pNode&&pNode!=body&&htmlUtil.style(pNode,_pos)=="static")pNode=pNode.parentNode;var pCoords=pNode!=body?domGeom.position(pNode,!0):{x:0,y:0},coords=domGeom.position(node,!0),nodeHeight=htmlUtil.style(node,"height"),nodeWidth=htmlUtil.style(node,"width"),hBorder=htmlUtil.style(node,"borderLeftWidth")+htmlUtil.style(node,"borderRightWidth"),vBorder=htmlUtil.style(node,"borderTopWidth")+htmlUtil.style(node,"borderBottomWidth"),pieceHeight=Math.ceil(nodeHeight/args.rows),pieceWidth=Math.ceil(nodeWidth/args.columns),container=domConstruct.create(node.tagName,{style:{position:"absolute",padding:0,margin:0,border:"none",top:coords.y-pCoords.y+"px",left:coords.x-pCoords.x+"px",height:nodeHeight+vBorder+"px",width:nodeWidth+hBorder+"px",background:"none",overflow:args.crop?"hidden":"visible",zIndex:htmlUtil.style(node,"zIndex")}},node,"after"),animations=[],pieceHelper=domConstruct.create(node.tagName,{style:{position:"absolute",border:"none",padding:0,margin:0,height:pieceHeight+hBorder+"px",width:pieceWidth+vBorder+"px",overflow:"hidden"}});for(var y=0,ly=args.rows;y<ly;y++)for(var x=0,lx=args.columns;x<lx;x++){var piece=lang.clone(pieceHelper),pieceContents=lang.clone(node),pTop=y*pieceHeight,pLeft=x*pieceWidth;pieceContents.style.filter="",domAttr.remove(pieceContents,"id"),htmlUtil.style(piece,{border:"none",overflow:"hidden",top:pTop+"px",left:pLeft+"px"}),htmlUtil.style(pieceContents,{position:"static",opacity:"1",marginTop:-pTop+"px",marginLeft:-pLeft+"px"}),piece.appendChild(pieceContents),container.appendChild(piece);var pieceAnimation=args.pieceAnimation(piece,x,y,coords);lang.isArray(pieceAnimation)?animations=animations.concat(pieceAnimation):animations.push(pieceAnimation)}var anim=coreFx.combine(animations);return connectUtil.connect(anim,"onEnd",anim,function(){container.parentNode.removeChild(container)}),args.onPlay&&connectUtil.connect(anim,"onPlay",anim,args.onPlay),args.onEnd&&connectUtil.connect(anim,"onEnd",anim,args.onEnd),anim},explode:function(args){var node=args.node=dom.byId(args.node);args.rows=args.rows||3,args.columns=args.columns||3,args.distance=args.distance||1,args.duration=args.duration||1e3,args.random=args.random||0,args.fade||(args.fade=!0),typeof args.sync=="undefined"&&(args.sync=!0),args.random=Math.abs(args.random),args.pieceAnimation=function(piece,x,y,coords){var pieceHeight=coords.h/args.rows,pieceWidth=coords.w/args.columns,distance=args.distance*2,duration=args.duration,ps=piece.style,startTop=parseInt(ps.top),startLeft=parseInt(ps.left),delay=0,randomX=0,randomY=0;if(args.random){var seed=Math.random()*args.random+Math.max(1-args.random,0);distance*=seed,duration*=seed,delay=args.unhide&&args.sync||!args.unhide&&!args.sync?args.duration-duration:0,randomX=Math.random()-.5,randomY=Math.random()-.5}var distanceY=(coords.h-pieceHeight)/2-pieceHeight*y,distanceX=(coords.w-pieceWidth)/2-pieceWidth*x,distanceXY=Math.sqrt(Math.pow(distanceX,2)+Math.pow(distanceY,2)),endTop=parseInt(startTop-distanceY*distance+distanceXY*randomY),endLeft=parseInt(startLeft-distanceX*distance+distanceXY*randomX),pieceSlide=baseFx.animateProperty({node:piece,duration:duration,delay:delay,easing:args.easing||(args.unhide?easingUtil.sinOut:easingUtil.circOut),beforeBegin:args.unhide?function(){args.fade&&htmlUtil.style(piece,{opacity:"0"}),ps.top=endTop+"px",ps.left=endLeft+"px"}:undefined,properties:{top:args.unhide?{start:endTop,end:startTop}:{start:startTop,end:endTop},left:args.unhide?{start:endLeft,end:startLeft}:{start:startLeft,end:endLeft}}});if(args.fade){var pieceFade=baseFx.animateProperty({node:piece,duration:duration,delay:delay,easing:args.fadeEasing||easingUtil.quadOut,properties:{opacity:args.unhide?{start:"0",end:"1"}:{start:"1",end:"0"}}});return args.unhide?[pieceFade,pieceSlide]:[pieceSlide,pieceFade]}return pieceSlide};var anim=dojoxFx._split(args);return args.unhide?connectUtil.connect(anim,"onEnd",null,function(){htmlUtil.style(node,{opacity:"1"})}):connectUtil.connect(anim,"onPlay",null,function(){htmlUtil.style(node,{opacity:"0"})}),anim},converge:function(args){return args.unhide=!0,dojoxFx.explode(args)},disintegrate:function(args){var node=args.node=dom.byId(args.node);args.rows=args.rows||5,args.columns=args.columns||5,args.duration=args.duration||1500,args.interval=args.interval||args.duration/(args.rows+args.columns*2),args.distance=args.distance||1.5,args.random=args.random||0,typeof args.fade=="undefined"&&(args.fade=!0);var random=Math.abs(args.random),duration=args.duration-(args.rows+args.columns)*args.interval;args.pieceAnimation=function(piece,x,y,coords){var randomDelay=Math.random()*(args.rows+args.columns)*args.interval,ps=piece.style,uniformDelay=args.reverseOrder||args.distance<0?(x+y)*args.interval:(args.rows+args.columns-(x+y))*args.interval,delay=randomDelay*random+Math.max(1-random,0)*uniformDelay,properties={};args.unhide?(properties.top={start:parseInt(ps.top)-coords.h*args.distance,end:parseInt(ps.top)},args.fade&&(properties.opacity={start:"0",end:"1"})):(properties.top={end:parseInt(ps.top)+coords.h*args.distance},args.fade&&(properties.opacity={end:"0"}));var pieceAnimation=baseFx.animateProperty({node:piece,duration:duration,delay:delay,easing:args.easing||(args.unhide?easingUtil.sinIn:easingUtil.circIn),properties:properties,beforeBegin:args.unhide?function(){args.fade&&htmlUtil.style(piece,{opacity:"0"}),ps.top=properties.top.start+"px"}:undefined});return pieceAnimation};var anim=dojoxFx._split(args);return args.unhide?connectUtil.connect(anim,"onEnd",anim,function(){htmlUtil.style(node,{opacity:"1"})}):connectUtil.connect(anim,"onPlay",anim,function(){htmlUtil.style(node,{opacity:"0"})}),anim},build:function(args){return args.unhide=!0,dojoxFx.disintegrate(args)},shear:function(args){var node=args.node=dom.byId(args.node);args.rows=args.rows||6,args.columns=args.columns||6,args.duration=args.duration||1e3,args.interval=args.interval||0,args.distance=args.distance||1,args.random=args.random||0,typeof args.fade=="undefined"&&(args.fade=!0);var random=Math.abs(args.random),duration=args.duration-(args.rows+args.columns)*Math.abs(args.interval);args.pieceAnimation=function(piece,x,y,coords){var colIsOdd=!(x%2),rowIsOdd=!(y%2),randomDelay=Math.random()*duration,uniformDelay=args.reverseOrder?(args.rows+args.columns-(x+y))*args.interval:(x+y)*args.interval,delay=randomDelay*random+Math.max(1-random,0)*uniformDelay,properties={},ps=piece.style;args.fade&&(properties.opacity=args.unhide?{start:"0",end:"1"}:{end:"0"}),args.columns==1?colIsOdd=rowIsOdd:args.rows==1&&(rowIsOdd=!colIsOdd);var left=parseInt(ps.left),top=parseInt(ps.top),distanceX=args.distance*coords.w,distanceY=args.distance*coords.h;args.unhide?colIsOdd==rowIsOdd?properties.left=colIsOdd?{start:left-distanceX,end:left}:{start:left+distanceX,end:left}:properties.top=colIsOdd?{start:top+distanceY,end:top}:{start:top-distanceY,end:top}:colIsOdd==rowIsOdd?properties.left=colIsOdd?{end:left-distanceX}:{end:left+distanceX}:properties.top=colIsOdd?{end:top+distanceY}:{end:top-distanceY};var pieceAnimation=baseFx.animateProperty({node:piece,duration:duration,delay:delay,easing:args.easing||easingUtil.sinInOut,properties:properties,beforeBegin:args.unhide?function(){args.fade&&(ps.opacity="0"),colIsOdd==rowIsOdd?ps.left=properties.left.start+"px":ps.top=properties.top.start+"px"}:undefined});return pieceAnimation};var anim=dojoxFx._split(args);return args.unhide?connectUtil.connect(anim,"onEnd",anim,function(){htmlUtil.style(node,{opacity:"1"})}):connectUtil.connect(anim,"onPlay",anim,function(){htmlUtil.style(node,{opacity:"0"})}),anim},unShear:function(args){return args.unhide=!0,dojoxFx.shear(args)},pinwheel:function(args){var node=args.node=dom.byId(args.node);args.rows=args.rows||4,args.columns=args.columns||4,args.duration=args.duration||1e3,args.interval=args.interval||0,args.distance=args.distance||1,args.random=args.random||0,typeof args.fade=="undefined"&&(args.fade=!0);var duration=args.duration-(args.rows+args.columns)*Math.abs(args.interval);args.pieceAnimation=function(piece,x,y,coords){var pieceHeight=coords.h/args.rows,pieceWidth=coords.w/args.columns,colIsOdd=!(x%2),rowIsOdd=!(y%2),randomDelay=Math.random()*duration,uniformDelay=args.interval<0?(args.rows+args.columns-(x+y))*args.interval*-1:(x+y)*args.interval,delay=randomDelay*args.random+Math.max(1-args.random,0)*uniformDelay,properties={},ps=piece.style;args.fade&&(properties.opacity=args.unhide?{start:0,end:1}:{end:0}),args.columns==1?colIsOdd=!rowIsOdd:args.rows==1&&(rowIsOdd=colIsOdd);var left=parseInt(ps.left),top=parseInt(ps.top);colIsOdd&&(rowIsOdd?properties.top=args.unhide?{start:top+pieceHeight*args.distance,end:top}:{start:top,end:top+pieceHeight*args.distance}:properties.left=args.unhide?{start:left+pieceWidth*args.distance,end:left}:{start:left,end:left+pieceWidth*args.distance}),colIsOdd!=rowIsOdd?properties.width=args.unhide?{start:pieceWidth*(1-args.distance),end:pieceWidth}:{start:pieceWidth,end:pieceWidth*(1-args.distance)}:properties.height=args.unhide?{start:pieceHeight*(1-args.distance),end:pieceHeight}:{start:pieceHeight,end:pieceHeight*(1-args.distance)};var pieceAnimation=baseFx.animateProperty({node:piece,duration:duration,delay:delay,easing:args.easing||easingUtil.sinInOut,properties:properties,beforeBegin:args.unhide?function(){args.fade&&htmlUtil.style(piece,"opacity",0),colIsOdd?rowIsOdd?ps.top=top+pieceHeight*(1-args.distance)+"px":ps.left=left+pieceWidth*(1-args.distance)+"px":(ps.left=left+"px",ps.top=top+"px"),colIsOdd!=rowIsOdd?ps.width=pieceWidth*(1-args.distance)+"px":ps.height=pieceHeight*(1-args.distance)+"px"}:undefined});return pieceAnimation};var anim=dojoxFx._split(args);return args.unhide?connectUtil.connect(anim,"onEnd",anim,function(){htmlUtil.style(node,{opacity:"1"})}):connectUtil.connect(anim,"play",anim,function(){htmlUtil.style(node,{opacity:"0"})}),anim},unPinwheel:function(args){return args.unhide=!0,dojoxFx.pinwheel(args)},blockFadeOut:function(args){var node=args.node=dom.byId(args.node);args.rows=args.rows||5,args.columns=args.columns||5,args.duration=args.duration||1e3,args.interval=args.interval||args.duration/(args.rows+args.columns*2),args.random=args.random||0;var random=Math.abs(args.random),duration=args.duration-(args.rows+args.columns)*args.interval;args.pieceAnimation=function(piece,x,y,coords){var randomDelay=Math.random()*args.duration,uniformDelay=args.reverseOrder?(args.rows+args.columns-(x+y))*Math.abs(args.interval):(x+y)*args.interval,delay=randomDelay*random+Math.max(1-random,0)*uniformDelay,pieceAnimation=baseFx.animateProperty({node:piece,duration:duration,delay:delay,easing:args.easing||easingUtil.sinInOut,properties:{opacity:args.unhide?{start:"0",end:"1"}:{start:"1",end:"0"}},beforeBegin:args.unhide?function(){htmlUtil.style(piece,{opacity:"0"})}:function(){piece.style.filter=""}});return pieceAnimation};var anim=dojoxFx._split(args);return args.unhide?connectUtil.connect(anim,"onEnd",anim,function(){htmlUtil.style(node,{opacity:"1"})}):connectUtil.connect(anim,"onPlay",anim,function(){htmlUtil.style(node,{opacity:"0"})}),anim},blockFadeIn:function(args){return args.unhide=!0,dojoxFx.blockFadeOut(args)}}),fxExt})