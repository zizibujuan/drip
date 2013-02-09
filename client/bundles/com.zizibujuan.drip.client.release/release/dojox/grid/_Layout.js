//>>built
define("dojox/grid/_Layout",["dojo/_base/kernel","../main","dojo/_base/declare","dojo/_base/array","dojo/_base/lang","dojo/dom-geometry","./cells","./_RowSelector"],function(dojo,dojox,declare,array,lang,domGeometry){return declare("dojox.grid._Layout",null,{constructor:function(inGrid){this.grid=inGrid},cells:[],structure:null,defaultWidth:"6em",moveColumn:function(sourceViewIndex,destViewIndex,cellIndex,targetIndex,before){var source_cells=this.structure[sourceViewIndex].cells[0],dest_cells=this.structure[destViewIndex].cells[0],cell=null,cell_ri=0,target_ri=0;for(var i=0,c;c=source_cells[i];i++)if(c.index==cellIndex){cell_ri=i;break}cell=source_cells.splice(cell_ri,1)[0],cell.view=this.grid.views.views[destViewIndex];for(i=0,c=null;c=dest_cells[i];i++)if(c.index==targetIndex){target_ri=i;break}before||(target_ri+=1),dest_cells.splice(target_ri,0,cell);var sortedCell=this.grid.getCell(this.grid.getSortIndex());sortedCell&&(sortedCell._currentlySorted=this.grid.getSortAsc()),this.cells=[],cellIndex=0;var v;for(i=0;v=this.structure[i];i++)for(var j=0,cs;cs=v.cells[j];j++)for(var k=0;c=cs[k];k++){c.index=cellIndex,this.cells.push(c);if("_currentlySorted"in c){var si=cellIndex+1;si*=c._currentlySorted?1:-1,this.grid.sortInfo=si,delete c._currentlySorted}cellIndex++}array.forEach(this.cells,function(c){var marks=c.markup[2].split(" "),oldIdx=parseInt(marks[1].substring(5));oldIdx!=c.index&&(marks[1]='idx="'+c.index+'"',c.markup[2]=marks.join(" "))}),this.grid.setupHeaderMenu()},setColumnVisibility:function(columnIndex,visible){var cell=this.cells[columnIndex];if(cell.hidden==visible){cell.hidden=!visible;var v=cell.view,w=v.viewWidth;return w&&w!="auto"&&(v._togglingColumn=domGeometry.getMarginBox(cell.getHeaderNode()).w||0),v.update(),!0}return!1},addCellDef:function(inRowIndex,inCellIndex,inDef){var self=this,getCellWidth=function(inDef){var w=0;return inDef.colSpan>1?w=0:(w=inDef.width||self._defaultCellProps.width||self.defaultWidth,isNaN(w)||(w+="em")),w},props={grid:this.grid,subrow:inRowIndex,layoutIndex:inCellIndex,index:this.cells.length};if(inDef&&inDef instanceof dojox.grid.cells._Base){var new_cell=lang.clone(inDef);return props.unitWidth=getCellWidth(new_cell._props),new_cell=lang.mixin(new_cell,this._defaultCellProps,inDef._props,props),new_cell}var cell_type=inDef.type||inDef.cellType||this._defaultCellProps.type||this._defaultCellProps.cellType||dojox.grid.cells.Cell;return lang.isString(cell_type)&&(cell_type=lang.getObject(cell_type)),props.unitWidth=getCellWidth(inDef),new cell_type(lang.mixin({},this._defaultCellProps,inDef,props))},addRowDef:function(inRowIndex,inDef){var result=[],relSum=0,pctSum=0,doRel=!0;for(var i=0,def,cell;def=inDef[i];i++){cell=this.addCellDef(inRowIndex,i,def),result.push(cell),this.cells.push(cell);if(doRel&&cell.relWidth)relSum+=cell.relWidth;else if(cell.width){var w=cell.width;typeof w=="string"&&w.slice(-1)=="%"?pctSum+=window.parseInt(w,10):w=="auto"&&(doRel=!1)}}return relSum&&doRel&&array.forEach(result,function(cell){cell.relWidth&&(cell.width=cell.unitWidth=cell.relWidth/relSum*(100-pctSum)+"%")}),result},addRowsDef:function(inDef){var result=[];if(lang.isArray(inDef))if(lang.isArray(inDef[0]))for(var i=0,row;inDef&&(row=inDef[i]);i++)result.push(this.addRowDef(i,row));else result.push(this.addRowDef(0,inDef));return result},addViewDef:function(inDef){return this._defaultCellProps=inDef.defaultCell||{},inDef.width&&inDef.width=="auto"&&delete inDef.width,lang.mixin({},inDef,{cells:this.addRowsDef(inDef.rows||inDef.cells)})},setStructure:function(inStructure){this.fieldIndex=0,this.cells=[];var s=this.structure=[];if(this.grid.rowSelector){var sel={type:dojox._scopeName+".grid._RowSelector"};if(lang.isString(this.grid.rowSelector)){var width=this.grid.rowSelector;width=="false"?sel=null:width!="true"&&(sel.width=width)}else this.grid.rowSelector||(sel=null);sel&&s.push(this.addViewDef(sel))}var isCell=function(def){return"name"in def||"field"in def||"get"in def},isRowDef=function(def){if(lang.isArray(def))if(lang.isArray(def[0])||isCell(def[0]))return!0;return!1},isView=function(def){return def!==null&&lang.isObject(def)&&("cells"in def||"rows"in def||"type"in def&&!isCell(def))};if(lang.isArray(inStructure)){var hasViews=!1;for(var i=0,st;st=inStructure[i];i++)if(isView(st)){hasViews=!0;break}if(!hasViews)s.push(this.addViewDef({cells:inStructure}));else for(i=0;st=inStructure[i];i++)isRowDef(st)?s.push(this.addViewDef({cells:st})):isView(st)&&s.push(this.addViewDef(st))}else isView(inStructure)&&s.push(this.addViewDef(inStructure));this.cellCount=this.cells.length,this.grid.setupHeaderMenu()}})})