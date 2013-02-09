//>>built
define("dojox/mdnd/dropMode/DefaultDropMode",["dojo/_base/kernel","dojo/_base/declare","dojo/_base/array","dojo/dom-geometry","dojox/mdnd/AreaManager"],function(dojo,declare,array,geom){var ddm=declare("dojox.mdnd.dropMode.DefaultDropMode",null,{_oldXPoint:null,_oldYPoint:null,_oldBehaviour:"up",addArea:function(areas,object){var length=areas.length,position=geom.position(object.node,!0);object.coords={x:position.x,y:position.y};if(length==0)areas.push(object);else{var x=object.coords.x;for(var i=0;i<length;i++)if(x<areas[i].coords.x){for(var j=length-1;j>=i;j--)areas[j+1]=areas[j];areas[i]=object;break}i==length&&areas.push(object)}return areas},updateAreas:function(areaList){var length=areaList.length;if(length>1){var currentRight,nextLeft;for(var i=0;i<length;i++){var area=areaList[i],nextArea;area.coords.x1=-1,area.coords.x2=-1,i==0?(nextArea=areaList[i+1],this._updateArea(area),this._updateArea(nextArea),currentRight=area.coords.x+area.node.offsetWidth,nextLeft=nextArea.coords.x,area.coords.x2=currentRight+(nextLeft-currentRight)/2):i==length-1?area.coords.x1=areaList[i-1].coords.x2:(nextArea=areaList[i+1],this._updateArea(nextArea),currentRight=area.coords.x+area.node.offsetWidth,nextLeft=nextArea.coords.x,area.coords.x1=areaList[i-1].coords.x2,area.coords.x2=currentRight+(nextLeft-currentRight)/2)}}},_updateArea:function(area){var position=geom.position(area.node,!0);area.coords.x=position.x,area.coords.y=position.y},initItems:function(area){array.forEach(area.items,function(obj){var node=obj.item.node,position=geom.position(node,!0),y=position.y+position.h/2;obj.y=y}),area.initItems=!0},refreshItems:function(area,indexItem,size,added){if(indexItem==-1)return;if(area&&size&&size.h){var height=size.h;area.margin&&(height+=area.margin.t);var length=area.items.length;for(var i=indexItem;i<length;i++){var item=area.items[i];added?item.y+=height:item.y-=height}}},getDragPoint:function(coords,size,mousePosition){var y=coords.y;return this._oldYPoint&&(y>this._oldYPoint?(this._oldBehaviour="down",y+=size.h):y<=this._oldYPoint&&(this._oldBehaviour="up")),this._oldYPoint=y,{x:coords.x+size.w/2,y:y}},getTargetArea:function(areaList,coords,currentIndexArea){var index=0,x=coords.x,end=areaList.length;if(end>1){var start=0,direction="right",compute=!1;currentIndexArea==-1||arguments.length<3?compute=!0:this._checkInterval(areaList,currentIndexArea,x)?index=currentIndexArea:(this._oldXPoint<x?start=currentIndexArea+1:(start=currentIndexArea-1,end=0,direction="left"),compute=!0);if(compute)if(direction==="right"){for(var i=start;i<end;i++)if(this._checkInterval(areaList,i,x)){index=i;break}}else for(var i=start;i>=end;i--)if(this._checkInterval(areaList,i,x)){index=i;break}}return this._oldXPoint=x,index},_checkInterval:function(areaList,index,x){var coords=areaList[index].coords;if(coords.x1==-1){if(x<=coords.x2)return!0}else if(coords.x2==-1){if(x>coords.x1)return!0}else if(coords.x1<x&&x<=coords.x2)return!0;return!1},getDropIndex:function(targetArea,coords){var length=targetArea.items.length,coordinates=targetArea.coords,y=coords.y;if(length>0)for(var i=0;i<length;i++){if(y<targetArea.items[i].y)return i;if(i==length-1)return-1}return-1},destroy:function(){}});return dojox.mdnd.areaManager()._dropMode=new dojox.mdnd.dropMode.DefaultDropMode,ddm})