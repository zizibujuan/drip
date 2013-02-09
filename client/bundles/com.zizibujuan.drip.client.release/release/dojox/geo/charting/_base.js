//>>built
define("dojox/geo/charting/_base",["dojo/_base/lang","dojo/_base/array","../../main","dojo/_base/html","dojo/dom-geometry","dojox/gfx/matrix","dijit/Tooltip","dojo/_base/NodeList","dojo/NodeList-traverse"],function(lang,arr,dojox,html,domGeom,matrix,Tooltip,NodeList,NodeListTraverse){var dgc=lang.getObject("geo.charting",!0,dojox);return dgc.showTooltip=function(innerHTML,gfxObject,positions){var arroundNode=dgc._normalizeArround(gfxObject);return Tooltip.show(innerHTML,arroundNode,positions)},dgc.hideTooltip=function(gfxObject){return Tooltip.hide(gfxObject)},dgc._normalizeArround=function(gfxObject){var bbox=dgc._getRealBBox(gfxObject),realMatrix=gfxObject._getRealMatrix()||{xx:1,xy:0,yx:0,yy:1,dx:0,dy:0},point=matrix.multiplyPoint(realMatrix,bbox.x,bbox.y),gfxDomContainer=dgc._getGfxContainer(gfxObject);return gfxObject.x=domGeom.position(gfxDomContainer,!0).x+point.x,gfxObject.y=domGeom.position(gfxDomContainer,!0).y+point.y,gfxObject.w=bbox.width*realMatrix.xx,gfxObject.h=bbox.height*realMatrix.yy,gfxObject},dgc._getGfxContainer=function(gfxObject){return gfxObject.surface?(new NodeList(gfxObject.surface.rawNode)).parents("div")[0]:(new NodeList(gfxObject.rawNode)).parents("div")[0]},dgc._getRealBBox=function(gfxObject){var bboxObject=gfxObject.getBoundingBox();if(!bboxObject){var shapes=gfxObject.children;bboxObject=lang.clone(dgc._getRealBBox(shapes[0])),arr.forEach(shapes,function(item){var nextBBox=dgc._getRealBBox(item);bboxObject.x=Math.min(bboxObject.x,nextBBox.x),bboxObject.y=Math.min(bboxObject.y,nextBBox.y),bboxObject.endX=Math.max(bboxObject.x+bboxObject.width,nextBBox.x+nextBBox.width),bboxObject.endY=Math.max(bboxObject.y+bboxObject.height,nextBBox.y+nextBBox.height)}),bboxObject.width=bboxObject.endX-bboxObject.x,bboxObject.height=bboxObject.endY-bboxObject.y}return bboxObject},dgc})