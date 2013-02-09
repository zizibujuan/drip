//>>built
define("dojox/treemap/ScaledLabel",["dojo/_base/declare","dojo/dom-geometry","dojo/dom-construct","dojo/dom-style"],function(declare,domGeom,domConstruct,domStyle){return declare("dojox.treemap.ScaledLabel",null,{onRendererUpdated:function(evt){if(evt.kind=="leaf"){var renderer=evt.renderer,oldSize=domStyle.get(renderer,"fontSize");domStyle.set(renderer.firstChild,"fontSize",oldSize),oldSize=parseInt(oldSize);var hRatio=.75*domGeom.getContentBox(renderer).w/domGeom.getMarginBox(renderer.firstChild).w,vRatio=domGeom.getContentBox(renderer).h/domGeom.getMarginBox(renderer.firstChild).h,hDiff=domGeom.getContentBox(renderer).w-domGeom.getMarginBox(renderer.firstChild).w,vDiff=domGeom.getContentBox(renderer).h-domGeom.getMarginBox(renderer.firstChild).h,newSize=Math.floor(oldSize*Math.min(hRatio,vRatio));while(vDiff>0&&hDiff>0)domStyle.set(renderer.firstChild,"fontSize",newSize+"px"),hDiff=domGeom.getContentBox(renderer).w-domGeom.getMarginBox(renderer.firstChild).w,vDiff=domGeom.getContentBox(renderer).h-domGeom.getMarginBox(renderer.firstChild).h,oldSize=newSize,newSize+=1;(vDiff<0||hDiff<0)&&domStyle.set(renderer.firstChild,"fontSize",oldSize+"px")}},createRenderer:function(item,level,kind){var renderer=this.inherited(arguments);if(kind=="leaf"){var p=domConstruct.create("div");domStyle.set(p,{position:"absolute",width:"auto"}),domConstruct.place(p,renderer)}return renderer},styleRenderer:function(renderer,item,level,kind){kind!="leaf"?this.inherited(arguments):(domStyle.set(renderer,"background",this.getColorForItem(item).toHex()),renderer.firstChild.innerHTML=this.getLabelForItem(item))}})})