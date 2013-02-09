//>>built
define("dijit/tree/_dndSelector",["dojo/_base/array","dojo/_base/connect","dojo/_base/declare","dojo/_base/kernel","dojo/_base/lang","dojo/cookie","dojo/dom","dojo/mouse","dojo/on","dojo/touch","./_dndContainer"],function(array,connect,declare,kernel,lang,cookie,dom,mouse,on,touch,_dndContainer){return declare("dijit.tree._dndSelector",_dndContainer,{constructor:function(){this.selection={},this.anchor=null,!this.cookieName&&this.tree.id&&(this.cookieName=this.tree.id+"SaveSelectedCookie"),this.events.push(on(this.tree.domNode,touch.press,lang.hitch(this,"onMouseDown")),on(this.tree.domNode,touch.release,lang.hitch(this,"onMouseUp")),on(this.tree.domNode,touch.move,lang.hitch(this,"onMouseMove")))},singular:!1,getSelectedTreeNodes:function(){var nodes=[],sel=this.selection;for(var i in sel)nodes.push(sel[i]);return nodes},selectNone:function(){return this.setSelection([]),this},destroy:function(){this.inherited(arguments),this.selection=this.anchor=null},addTreeNode:function(node,isAnchor){return this.setSelection(this.getSelectedTreeNodes().concat([node])),isAnchor&&(this.anchor=node),node},removeTreeNode:function(node){var newSelection=array.filter(this.getSelectedTreeNodes(),function(selectedNode){return!dom.isDescendant(selectedNode.domNode,node.domNode)});return this.setSelection(newSelection),node},isTreeNodeSelected:function(node){return node.id&&!!this.selection[node.id]},setSelection:function(newSelection){var oldSelection=this.getSelectedTreeNodes();array.forEach(this._setDifference(oldSelection,newSelection),lang.hitch(this,function(node){node.setSelected(!1),this.anchor==node&&delete this.anchor,delete this.selection[node.id]})),array.forEach(this._setDifference(newSelection,oldSelection),lang.hitch(this,function(node){node.setSelected(!0),this.selection[node.id]=node})),this._updateSelectionProperties()},_setDifference:function(xs,ys){array.forEach(ys,function(y){y.__exclude__=!0});var ret=array.filter(xs,function(x){return!x.__exclude__});return array.forEach(ys,function(y){delete y.__exclude__}),ret},_updateSelectionProperties:function(){var selected=this.getSelectedTreeNodes(),paths=[],nodes=[],selects=[];array.forEach(selected,function(node){var ary=node.getTreePath(),model=this.tree.model;nodes.push(node),paths.push(ary),ary=array.map(ary,function(item){return model.getIdentity(item)},this),selects.push(ary.join("/"))},this);var items=array.map(nodes,function(node){return node.item});this.tree._set("paths",paths),this.tree._set("path",paths[0]||[]),this.tree._set("selectedNodes",nodes),this.tree._set("selectedNode",nodes[0]||null),this.tree._set("selectedItems",items),this.tree._set("selectedItem",items[0]||null),this.tree.persist&&selects.length>0&&cookie(this.cookieName,selects.join(","),{expires:365})},_getSavedPaths:function(){var tree=this.tree;if(tree.persist&&tree.dndController.cookieName){var oreo,paths=[];return oreo=cookie(tree.dndController.cookieName),oreo&&(paths=array.map(oreo.split(","),function(path){return path.split("/")})),paths}},onMouseDown:function(e){if(!this.current||this.tree.isExpandoNode(e.target,this.current))return;if(mouse.isLeft(e))e.preventDefault();else if(e.type!="touchstart")return;var treeNode=this.current,copy=connect.isCopyKey(e),id=treeNode.id;if(!this.singular&&!e.shiftKey&&this.selection[id]){this._doDeselect=!0;return}this._doDeselect=!1,this.userSelect(treeNode,copy,e.shiftKey)},onMouseUp:function(e){if(!this._doDeselect)return;this._doDeselect=!1,this.userSelect(this.current,connect.isCopyKey(e),e.shiftKey)},onMouseMove:function(){this._doDeselect=!1},_compareNodes:function(n1,n2){if(n1===n2)return 0;if("sourceIndex"in document.documentElement)return n1.sourceIndex-n2.sourceIndex;if("compareDocumentPosition"in document.documentElement)return n1.compareDocumentPosition(n2)&2?1:-1;if(document.createRange){var r1=doc.createRange();r1.setStartBefore(n1);var r2=doc.createRange();return r2.setStartBefore(n2),r1.compareBoundaryPoints(r1.END_TO_END,r2)}throw Error("dijit.tree._compareNodes don't know how to compare two different nodes in this browser")},userSelect:function(node,multi,range){if(this.singular)this.anchor==node&&multi?this.selectNone():(this.setSelection([node]),this.anchor=node);else if(range&&this.anchor){var cr=this._compareNodes(this.anchor.rowNode,node.rowNode),begin,end,anchor=this.anchor;cr<0?(begin=anchor,end=node):(begin=node,end=anchor);var nodes=[];while(begin!=end)nodes.push(begin),begin=this.tree._getNextNode(begin);nodes.push(end),this.setSelection(nodes)}else this.selection[node.id]&&multi?this.removeTreeNode(node):multi?this.addTreeNode(node,!0):(this.setSelection([node]),this.anchor=node)},getItem:function(key){var widget=this.selection[key];return{data:widget,type:["treeNode"]}},forInSelectedItems:function(f,o){o=o||kernel.global;for(var id in this.selection)f.call(o,this.getItem(id),id,this)}})})