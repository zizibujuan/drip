//>>built
define("dojox/grid/Selection",["dojo/_base/declare","dojo/_base/array","dojo/_base/lang","dojo/dom-attr"],function(declare,array,lang,domAttr){return declare("dojox.grid.Selection",null,{constructor:function(inGrid){this.grid=inGrid,this.selected=[],this.setMode(inGrid.selectionMode)},mode:"extended",selected:null,updating:0,selectedIndex:-1,rangeStartIndex:-1,setMode:function(mode){this.selected.length&&this.deselectAll(),mode!="extended"&&mode!="multiple"&&mode!="single"&&mode!="none"?this.mode="extended":this.mode=mode},onCanSelect:function(inIndex){return this.grid.onCanSelect(inIndex)},onCanDeselect:function(inIndex){return this.grid.onCanDeselect(inIndex)},onSelected:function(inIndex){},onDeselected:function(inIndex){},onChanging:function(){},onChanged:function(){},isSelected:function(inIndex){return this.mode=="none"?!1:this.selected[inIndex]},getFirstSelected:function(){if(!this.selected.length||this.mode=="none")return-1;for(var i=0,l=this.selected.length;i<l;i++)if(this.selected[i])return i;return-1},getNextSelected:function(inPrev){if(this.mode=="none")return-1;for(var i=inPrev+1,l=this.selected.length;i<l;i++)if(this.selected[i])return i;return-1},getSelected:function(){var result=[];for(var i=0,l=this.selected.length;i<l;i++)this.selected[i]&&result.push(i);return result},getSelectedCount:function(){var c=0;for(var i=0;i<this.selected.length;i++)this.selected[i]&&c++;return c},_beginUpdate:function(){this.updating===0&&this.onChanging(),this.updating++},_endUpdate:function(){this.updating--,this.updating===0&&this.onChanged()},select:function(inIndex){if(this.mode=="none")return;this.mode!="multiple"?(this.deselectAll(inIndex),this.addToSelection(inIndex)):this.toggleSelect(inIndex)},addToSelection:function(inIndex){if(this.mode=="none")return;if(lang.isArray(inIndex)){array.forEach(inIndex,this.addToSelection,this);return}inIndex=Number(inIndex);if(this.selected[inIndex])this.selectedIndex=inIndex;else if(this.onCanSelect(inIndex)!==!1){this.selectedIndex=inIndex;var rowNode=this.grid.getRowNode(inIndex);rowNode&&domAttr.set(rowNode,"aria-selected","true"),this._beginUpdate(),this.selected[inIndex]=!0,this.onSelected(inIndex),this._endUpdate()}},deselect:function(inIndex){if(this.mode=="none")return;if(lang.isArray(inIndex)){array.forEach(inIndex,this.deselect,this);return}inIndex=Number(inIndex),this.selectedIndex==inIndex&&(this.selectedIndex=-1);if(this.selected[inIndex]){if(this.onCanDeselect(inIndex)===!1)return;var rowNode=this.grid.getRowNode(inIndex);rowNode&&domAttr.set(rowNode,"aria-selected","false"),this._beginUpdate(),delete this.selected[inIndex],this.onDeselected(inIndex),this._endUpdate()}},setSelected:function(inIndex,inSelect){this[inSelect?"addToSelection":"deselect"](inIndex)},toggleSelect:function(inIndex){if(lang.isArray(inIndex)){array.forEach(inIndex,this.toggleSelect,this);return}this.setSelected(inIndex,!this.selected[inIndex])},_range:function(inFrom,inTo,func){var s=inFrom>=0?inFrom:inTo,e=inTo;s>e&&(e=s,s=inTo);for(var i=s;i<=e;i++)func(i)},selectRange:function(inFrom,inTo){this._range(inFrom,inTo,lang.hitch(this,"addToSelection"))},deselectRange:function(inFrom,inTo){this._range(inFrom,inTo,lang.hitch(this,"deselect"))},insert:function(inIndex){this.selected.splice(inIndex,0,!1),this.selectedIndex>=inIndex&&this.selectedIndex++},remove:function(inIndex){this.selected.splice(inIndex,1),this.selectedIndex>=inIndex&&this.selectedIndex--},deselectAll:function(inExcept){for(var i in this.selected)i!=inExcept&&this.selected[i]===!0&&this.deselect(i)},clickSelect:function(inIndex,inCtrlKey,inShiftKey){if(this.mode=="none")return;this._beginUpdate();if(this.mode!="extended")this.select(inIndex);else{if(!inShiftKey||this.rangeStartIndex<0)this.rangeStartIndex=inIndex;inCtrlKey||this.deselectAll(inIndex),inShiftKey?this.selectRange(this.rangeStartIndex,inIndex):inCtrlKey?this.toggleSelect(inIndex):this.addToSelection(inIndex)}this._endUpdate()},clickSelectEvent:function(e){this.clickSelect(e.rowIndex,dojo.isCopyKey(e),e.shiftKey)},clear:function(){this._beginUpdate(),this.deselectAll(),this._endUpdate()}})})