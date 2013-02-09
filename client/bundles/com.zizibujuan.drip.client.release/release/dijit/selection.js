//>>built
define("dijit/selection",["dojo/dom","dojo/_base/lang","dojo/sniff","dojo/_base/window"],function(dom,lang,has,baseWindow){var SelectionManager=function(win){function isTag(node,tags){if(node&&node.tagName){var _nlc=node.tagName.toLowerCase();for(var i=0;i<tags.length;i++){var _tlc=String(tags[i]).toLowerCase();if(_nlc==_tlc)return _tlc}}return""}var doc=win.document;this.getType=function(){if(doc.getSelection){var stype="text",oSel;try{oSel=win.getSelection()}catch(e){}if(oSel&&oSel.rangeCount==1){var oRange=oSel.getRangeAt(0);oRange.startContainer==oRange.endContainer&&oRange.endOffset-oRange.startOffset==1&&oRange.startContainer.nodeType!=3&&(stype="control")}return stype}return doc.selection.type.toLowerCase()},this.getSelectedText=function(){if(doc.getSelection){var selection=win.getSelection();return selection?selection.toString():""}return this.getType()=="control"?null:doc.selection.createRange().text},this.getSelectedHtml=function(){if(doc.getSelection){var selection=win.getSelection();if(selection&&selection.rangeCount){var i,html="";for(i=0;i<selection.rangeCount;i++){var frag=selection.getRangeAt(i).cloneContents(),div=doc.createElement("div");div.appendChild(frag),html+=div.innerHTML}return html}return null}return this.getType()=="control"?null:doc.selection.createRange().htmlText},this.getSelectedElement=function(){if(this.getType()=="control"){if(doc.getSelection){var selection=win.getSelection();return selection.anchorNode.childNodes[selection.anchorOffset]}var range=doc.selection.createRange();if(range&&range.item)return doc.selection.createRange().item(0)}return null},this.getParentElement=function(){if(this.getType()=="control"){var p=this.getSelectedElement();if(p)return p.parentNode}else{if(!doc.getSelection){var r=doc.selection.createRange();return r.collapse(!0),r.parentElement()}var selection=doc.getSelection();if(selection){var node=selection.anchorNode;while(node&&node.nodeType!=1)node=node.parentNode;return node}}return null},this.hasAncestorElement=function(tagName){return this.getAncestorElement.apply(this,arguments)!=null},this.getAncestorElement=function(tagName){var node=this.getSelectedElement()||this.getParentElement();return this.getParentOfType(node,arguments)},this.getParentOfType=function(node,tags){while(node){if(isTag(node,tags).length)return node;node=node.parentNode}return null},this.collapse=function(beginning){if(doc.getSelection){var selection=win.getSelection();selection.removeAllRanges?beginning?selection.collapseToStart():selection.collapseToEnd():selection.collapse(beginning)}else{var range=doc.selection.createRange();range.collapse(beginning),range.select()}},this.remove=function(){var sel=doc.selection;return doc.getSelection?(sel=win.getSelection(),sel.deleteFromDocument(),sel):(sel.type.toLowerCase()!="none"&&sel.clear(),sel)},this.selectElementChildren=function(element,nochangefocus){var range;element=dom.byId(element);if(doc.getSelection){var selection=win.getSelection();has("opera")?(selection.rangeCount?range=selection.getRangeAt(0):range=doc.createRange(),range.setStart(element,0),range.setEnd(element,element.nodeType==3?element.length:element.childNodes.length),selection.addRange(range)):selection.selectAllChildren(element)}else{range=element.ownerDocument.body.createTextRange(),range.moveToElementText(element);if(!nochangefocus)try{range.select()}catch(e){}}},this.selectElement=function(element,nochangefocus){var range;element=dom.byId(element);if(doc.getSelection){var selection=doc.getSelection();range=doc.createRange(),selection.removeAllRanges&&(has("opera")&&selection.getRangeAt(0)&&(range=selection.getRangeAt(0)),range.selectNode(element),selection.removeAllRanges(),selection.addRange(range))}else try{var tg=element.tagName?element.tagName.toLowerCase():"";tg==="img"||tg==="table"?range=baseWindow.body(doc).createControlRange():range=baseWindow.body(doc).createRange(),range.addElement(element),nochangefocus||range.select()}catch(e){this.selectElementChildren(element,nochangefocus)}},this.inSelection=function(node){if(node){var newRange,range;if(doc.getSelection){var sel=win.getSelection();sel&&sel.rangeCount>0&&(range=sel.getRangeAt(0));if(range&&range.compareBoundaryPoints&&doc.createRange)try{newRange=doc.createRange(),newRange.setStart(node,0);if(range.compareBoundaryPoints(range.START_TO_END,newRange)===1)return!0}catch(e){}}else{range=doc.selection.createRange();try{newRange=node.ownerDocument.body.createControlRange(),newRange&&newRange.addElement(node)}catch(e1){try{newRange=node.ownerDocument.body.createTextRange(),newRange.moveToElementText(node)}catch(e2){}}if(range&&newRange&&range.compareEndPoints("EndToStart",newRange)===1)return!0}}return!1}},selection=new SelectionManager(window);return selection.SelectionManager=SelectionManager,selection})