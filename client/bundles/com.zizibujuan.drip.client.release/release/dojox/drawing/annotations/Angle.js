//>>built
define("dojox/drawing/annotations/Angle",["dojo","../util/oo","../util/positioning"],function(b,e,g){return e.declare(function(b){this.stencil=b.stencil;this.util=b.stencil.util;this.mouse=b.stencil.mouse;this.stencil.connectMult([["onDrag",this,"showAngle"],["onUp",this,"hideAngle"],["onTransformBegin",this,"showAngle"],["onTransform",this,"showAngle"],["onTransformEnd",this,"hideAngle"]])},{type:"dojox.drawing.tools.custom",angle:0,showAngle:function(){if(this.stencil.selected||!this.stencil.created)if(this.stencil.getRadius()<
this.stencil.minimumSize)this.hideAngle();else{var c=this.getAngleNode(),a=this.stencil.pointsToData(),a=g.angle({x:a.x1,y:a.y1},{x:a.x2,y:a.y2}),f=this.mouse.scrollOffset(),d=this.stencil.getTransform(),e=d.dx/this.mouse.zoom,d=d.dy/this.mouse.zoom;a.x/=this.mouse.zoom;a.y/=this.mouse.zoom;b.style(c,{left:this.stencil._offX+a.x-f.left+e+"px",top:this.stencil._offY+a.y-f.top+d+"px",align:a.align});a=this.stencil.getAngle();c.innerHTML=this.stencil.style.zAxis&&"vector"==this.stencil.shortType?0<this.stencil.data.cosphi?
"out of":"into":"line"==this.stencil.shortType?this.stencil.style.zAxis?"out of":Math.ceil(a%180):Math.ceil(a)}},getAngleNode:function(){if(!this._angleNode)this._angleNode=b.create("span",null,b.body()),b.addClass(this._angleNode,"textAnnotation"),b.style(this._angleNode,"opacity",1);return this._angleNode},hideAngle:function(){if(this._angleNode&&0.9<b.style(this._angleNode,"opacity"))b.fadeOut({node:this._angleNode,duration:500,onEnd:function(c){b.destroy(c)}}).play(),this._angleNode=null}})});