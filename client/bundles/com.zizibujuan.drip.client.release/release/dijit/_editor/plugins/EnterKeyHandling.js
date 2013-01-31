//>>built
define("dijit/_editor/plugins/EnterKeyHandling","dojo/_base/declare,dojo/dom-construct,dojo/keys,dojo/_base/lang,dojo/on,dojo/sniff,dojo/_base/window,dojo/window,../_Plugin,../RichText,../range,../../_base/focus".split(","),function(s,k,t,n,r,o,u,p,v,q,h,w){return s("dijit._editor.plugins.EnterKeyHandling",v,{blockNodeForEnter:"BR",constructor:function(b){if(b){if("blockNodeForEnter"in b)b.blockNodeForEnter=b.blockNodeForEnter.toUpperCase();n.mixin(this,b)}},setEditor:function(b){if(this.editor!==
b)if(this.editor=b,"BR"==this.blockNodeForEnter)this.editor.customUndo=!0,b.onLoadDeferred.then(n.hitch(this,function(a){this.own(r(b.document,"keydown",n.hitch(this,function(a){if(a.keyCode==t.ENTER){var b=n.mixin({},a);b.shiftKey=!0;this.handleEnterKey(b)||(a.stopPropagation(),a.preventDefault())}})));9<=o("ie")&&this.own(r(b.document,"paste",n.hitch(this,function(){setTimeout(n.hitch(this,function(){var a=this.editor.document.selection.createRange();a.move("character",-1);a.select();a.move("character",
1);a.select()}),0)})));return a}));else if(this.blockNodeForEnter){var a=n.hitch(this,"handleEnterKey");b.addKeyHandler(13,0,0,a);b.addKeyHandler(13,0,1,a);this.own(this.editor.on("KeyPressed",n.hitch(this,"onKeyPressed")))}},onKeyPressed:function(){if(this._checkListLater){if(u.withGlobal(this.editor.window,"isCollapsed",w)){var b=this.editor._sCall("getAncestorElement",["LI"]);if(b){if(o("mozilla")&&"LI"==b.parentNode.parentNode.nodeName)b=b.parentNode.parentNode;var a=b.firstChild;if(a&&1==a.nodeType&&
("UL"==a.nodeName||"OL"==a.nodeName))b.insertBefore(a.ownerDocument.createTextNode("\u00a0"),a),a=h.create(this.editor.window),a.setStart(b.firstChild,0),b=h.getSelection(this.editor.window,!0),b.removeAllRanges(),b.addRange(a)}else if(q.prototype.execCommand.call(this.editor,"formatblock",this.blockNodeForEnter),b=this.editor._sCall("getAncestorElement",[this.blockNodeForEnter]))b.innerHTML=this.bogusHtmlContent,9>=o("ie")&&(b=this.editor.document.selection.createRange(),b.move("character",-1),b.select())}this._checkListLater=
!1}this._pressedEnterInBlock&&(this._pressedEnterInBlock.previousSibling&&this.removeTrailingBr(this._pressedEnterInBlock.previousSibling),delete this._pressedEnterInBlock)},bogusHtmlContent:"&#160;",blockNodes:/^(?:P|H1|H2|H3|H4|H5|H6|LI)$/,handleEnterKey:function(b){var x;var a,g,d,e,i=this.editor.document,c,f;if(b.shiftKey){var b=this.editor._sCall("getParentElement",[]),l=h.getAncestor(b,this.blockNodes);if(l){if("LI"==l.tagName)return!0;b=h.getSelection(this.editor.window);a=b.getRangeAt(0);
a.collapsed||(a.deleteContents(),b=h.getSelection(this.editor.window),a=b.getRangeAt(0));if(h.atBeginningOfContainer(l,a.startContainer,a.startOffset))c=i.createElement("br"),a=h.create(this.editor.window),l.insertBefore(c,l.firstChild),a.setStartAfter(c),b.removeAllRanges(),b.addRange(a);else if(h.atEndOfContainer(l,a.startContainer,a.startOffset))a=h.create(this.editor.window),c=i.createElement("br"),l.appendChild(c),l.appendChild(i.createTextNode("\u00a0")),a.setStart(l.lastChild,0),b.removeAllRanges(),
b.addRange(a);else return(f=a.startContainer)&&3==f.nodeType?(d=f.nodeValue,g=i.createTextNode(d.substring(0,a.startOffset)),d=i.createTextNode(d.substring(a.startOffset)),e=i.createElement("br"),""==d.nodeValue&&o("webkit")&&(d=i.createTextNode("\u00a0")),k.place(g,f,"after"),k.place(e,g,"after"),k.place(d,e,"after"),k.destroy(f),a=h.create(this.editor.window),a.setStart(d,0),b.removeAllRanges(),b.addRange(a),!1):!0}else if(b=h.getSelection(this.editor.window),b.rangeCount){if((a=b.getRangeAt(0))&&
a.startContainer)if(a.collapsed||(a.deleteContents(),b=h.getSelection(this.editor.window),a=b.getRangeAt(0)),(f=a.startContainer)&&3==f.nodeType){l=!1;c=a.startOffset;if(f.length<c)d=this._adjustNodeAndOffset(f,c),f=d.node,c=d.offset;d=f.nodeValue;g=i.createTextNode(d.substring(0,c));d=i.createTextNode(d.substring(c));e=i.createElement("br");d.length||(d=i.createTextNode("\u00a0"),l=!0);g.length?k.place(g,f,"after"):g=f;k.place(e,g,"after");k.place(d,e,"after");k.destroy(f);a=h.create(this.editor.window);
a.setStart(d,0);a.setEnd(d,d.length);b.removeAllRanges();b.addRange(a);l&&!o("webkit")?this.editor._sCall("remove",[]):this.editor._sCall("collapse",[!0])}else 0<=a.startOffset&&(c=f.childNodes[a.startOffset]),e=i.createElement("br"),d=i.createTextNode("\u00a0"),c?(k.place(e,c,"before"),k.place(d,e,"after")):(f.appendChild(e),f.appendChild(d)),a=h.create(this.editor.window),a.setStart(d,0),a.setEnd(d,d.length),b.removeAllRanges(),b.addRange(a),this.editor._sCall("collapse",[!0])}else q.prototype.execCommand.call(this.editor,
"inserthtml","<br>");return!1}var m=!0,b=h.getSelection(this.editor.window);a=b.getRangeAt(0);a.collapsed||(a.deleteContents(),b=h.getSelection(this.editor.window),a=b.getRangeAt(0));c=h.getBlockAncestor(a.endContainer,null,this.editor.editNode);if(this._checkListLater=(e=c.blockNode)&&("LI"==e.nodeName||"LI"==e.parentNode.nodeName)){if(o("mozilla"))this._pressedEnterInBlock=e;if(/^(\s|&nbsp;|&#160;|\xA0|<span\b[^>]*\bclass=['"]Apple-style-span['"][^>]*>(\s|&nbsp;|&#160;|\xA0)<\/span>)?(<br>)?$/.test(e.innerHTML))e.innerHTML=
"",o("webkit")&&(a=h.create(this.editor.window),a.setStart(e,0),b.removeAllRanges(),b.addRange(a)),this._checkListLater=!1;return!0}if(!c.blockNode||c.blockNode===this.editor.editNode){try{q.prototype.execCommand.call(this.editor,"formatblock",this.blockNodeForEnter)}catch(n){}c={blockNode:this.editor._sCall("getAncestorElement",[this.blockNodeForEnter]),blockContainer:this.editor.editNode};if(c.blockNode){if(c.blockNode!=this.editor.editNode&&!(c.blockNode.textContent||c.blockNode.innerHTML).replace(/^\s+|\s+$/g,
"").length)return this.removeTrailingBr(c.blockNode),!1}else c.blockNode=this.editor.editNode;b=h.getSelection(this.editor.window);a=b.getRangeAt(0)}e=i.createElement(this.blockNodeForEnter);e.innerHTML=this.bogusHtmlContent;this.removeTrailingBr(c.blockNode);var j=a.endOffset,m=a.endContainer;if(m.length<j)d=this._adjustNodeAndOffset(m,j),m=d.node,j=d.offset;if(h.atEndOfContainer(c.blockNode,m,j))c.blockNode===c.blockContainer?c.blockNode.appendChild(e):k.place(e,c.blockNode,"after"),m=!1,a=h.create(this.editor.window),
a.setStart(e,0),b.removeAllRanges(),b.addRange(a),this.editor.height&&p.scrollIntoView(e);else if(h.atBeginningOfContainer(c.blockNode,a.startContainer,a.startOffset))k.place(e,c.blockNode,c.blockNode===c.blockContainer?"first":"before"),e.nextSibling&&this.editor.height&&(a=h.create(this.editor.window),a.setStart(e.nextSibling,0),b.removeAllRanges(),b.addRange(a),p.scrollIntoView(e.nextSibling)),m=!1;else{c.blockNode===c.blockContainer?c.blockNode.appendChild(e):k.place(e,c.blockNode,"after");m=
!1;if(c.blockNode.style&&e.style&&c.blockNode.style.cssText)e.style.cssText=c.blockNode.style.cssText;if((f=a.startContainer)&&3==f.nodeType){j=a.endOffset;if(f.length<j)d=this._adjustNodeAndOffset(f,j),f=d.node,j=d.offset;d=f.nodeValue;g=i.createTextNode(d.substring(0,j));d=i.createTextNode(d.substring(j,d.length));k.place(g,f,"before");k.place(d,f,"after");k.destroy(f);for(g=g.parentNode;g!==c.blockNode;){j=i.createElement(g.tagName);if(g.style&&j.style&&g.style.cssText)j.style.cssText=g.style.cssText;
if("FONT"===g.tagName){if(g.color)j.color=g.color;if(g.face)j.face=g.face;if(g.size)j.size=g.size}for(a=d;a;)f=a.nextSibling,j.appendChild(a),a=f;k.place(j,g,"after");d=j;g=g.parentNode}a=d;if(1==a.nodeType||3==a.nodeType&&a.nodeValue)e.innerHTML="";for(g=a;a;)f=a.nextSibling,e.appendChild(a),a=f}a=h.create(this.editor.window);i=g;if("BR"!==this.blockNodeForEnter){for(;i;)l=i,x=f=i.firstChild,i=x;if(l&&l.parentNode){if(e=l.parentNode,a.setStart(e,0),b.removeAllRanges(),b.addRange(a),this.editor.height&&
p.scrollIntoView(e),o("mozilla"))this._pressedEnterInBlock=c.blockNode}else m=!0}else if(a.setStart(e,0),b.removeAllRanges(),b.addRange(a),this.editor.height&&p.scrollIntoView(e),o("mozilla"))this._pressedEnterInBlock=c.blockNode}return m},_adjustNodeAndOffset:function(b,a){for(;b.length<a&&b.nextSibling&&3==b.nextSibling.nodeType;)a-=b.length,b=b.nextSibling;return{node:b,offset:a}},removeTrailingBr:function(b){if(b=/P|DIV|LI/i.test(b.tagName)?b:this.editor._sCall("getParentOfType",[b,["P","DIV",
"LI"]]))if(b.lastChild&&(1<b.childNodes.length&&3==b.lastChild.nodeType&&/^[\s\xAD]*$/.test(b.lastChild.nodeValue)||"BR"==b.lastChild.tagName)&&k.destroy(b.lastChild),!b.childNodes.length)b.innerHTML=this.bogusHtmlContent}})});