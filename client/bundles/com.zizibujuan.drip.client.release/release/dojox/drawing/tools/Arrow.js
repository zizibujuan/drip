//>>built
define("dojox/drawing/tools/Arrow",["dojo/_base/lang","../util/oo","../manager/_registry","./Line","../annotations/Arrow","../util/positioning"],function(lang,oo,registry,Line,AnnotationArrow,positioning){var Arrow=oo.declare(Line,function(options){this.arrowStart&&(this.begArrow=new AnnotationArrow({stencil:this,idx1:0,idx2:1})),this.arrowEnd&&(this.endArrow=new AnnotationArrow({stencil:this,idx1:1,idx2:0})),this.points.length&&(this.render(),options.label&&this.setLabel(options.label))},{draws:!0,type:"dojox.drawing.tools.Arrow",baseRender:!1,arrowStart:!1,arrowEnd:!0,labelPosition:function(){var d=this.data,pt=positioning.label({x:d.x1,y:d.y1},{x:d.x2,y:d.y2});return{x:pt.x,y:pt.y}},onUp:function(obj){if(this.created||!this.shape)return;var p=this.points,len=this.util.distance(p[0].x,p[0].y,p[1].x,p[1].y);if(len<this.minimumSize){this.remove(this.shape,this.hit);return}var pt=this.util.snapAngle(obj,this.angleSnap/180);this.setPoints([{x:p[0].x,y:p[0].y},{x:pt.x,y:pt.y}]),this.renderedOnce=!0,this.onRender(this)}});return lang.setObject("dojox.drawing.tools.Arrow",Arrow),Arrow.setup={name:"dojox.drawing.tools.Arrow",tooltip:"Arrow Tool",iconClass:"iconArrow"},registry.register(Arrow.setup,"tool"),Arrow})