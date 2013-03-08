//>>built
define("mathEditor/Model","dojo/_base/declare,dojo/_base/lang,dojo/_base/array,dojo/dom-construct,dojox/xml/parser,mathEditor/string,mathEditor/dataUtil,mathEditor/lang,mathEditor/xmlUtil".split(","),function(s,p,r,h,o,q,t,l,j){return s(null,{path:null,xmlString:null,doc:null,anchor:null,constructor:function(a){this._init();p.mixin(this,a)},_init:function(){this.doc=o.parse("<root><line></line></root>");this.path=[];this.anchor={};this.anchor.node=this.doc.documentElement.firstChild;this.anchor.offset=
0;this.path.push({nodeName:"root"});this.path.push({nodeName:"line",offset:1})},clear:function(){this._init();this.onChange()},loadData:function(){},setData:function(a){var b=a.data,c=a.nodeName;if((a=a.removeCount)&&0<a)for(var d=0;d<a;d++)this.removeLeft();var e=this.doc,a=this.anchor.node,d=this.anchor.offset;if(c&&""!=c){var f=1,g="last";this._isTextNode(a)&&(f=this.path.pop().offset+1,g="after");if("mfrac"==c)this._isLineNode(a)||this._isTextNode(a)?(this.path.push({nodeName:"math",offset:f}),
this.path.push({nodeName:"mfrac",offset:1}),this.path.push({nodeName:"mrow",offset:1}),this.path.push({nodeName:"mn",offset:1}),c=e.createElement("math"),d=j.createEmptyFrac(e),c.appendChild(d.rootNode),h.place(c,a,g)):(this.path.pop(),this.path.push({nodeName:"mfrac",offset:f}),this.path.push({nodeName:"mrow",offset:2}),this.path.push({nodeName:"mn",offset:1}),b=a.parentNode,g=f-1,d=j.createFracWithNumerator(e,a),h.place(d.rootNode,b,g)),this.anchor.node=d.focusNode,this.anchor.offset=0;else if("msup"==
c)this._isLineNode(a)||this._isTextNode(a)?(this.path.push({nodeName:"math",offset:f}),this.path.push({nodeName:"msup",offset:1}),this.path.push({nodeName:"mrow",offset:2}),this.path.push({nodeName:"mn",offset:1}),c=e.createElement("math"),d=j.createEmptyMsup(e),c.appendChild(d.rootNode),h.place(c,a,g)):(this.path.pop(),this.path.push({nodeName:"msup",offset:1}),this.path.push({nodeName:"mrow",offset:2}),this.path.push({nodeName:"mn",offset:1}),b=a.parentNode,d=j.createMsupWithBase(e,a),h.place(d.rootNode,
b,0)),this.anchor.node=d.focusNode,this.anchor.offset=0;else if("msub"==c)this._isLineNode(a)||this._isTextNode(a)?(this.path.push({nodeName:"math",offset:f}),this.path.push({nodeName:"msub",offset:1}),this.path.push({nodeName:"mrow",offset:2}),this.path.push({nodeName:"mn",offset:1}),c=e.createElement("math"),d=j.createEmptyMsub(e),c.appendChild(d.rootNode),h.place(c,a,g)):(this.path.pop(),this.path.push({nodeName:"msub",offset:1}),this.path.push({nodeName:"mrow",offset:2}),this.path.push({nodeName:"mn",
offset:1}),b=a.parentNode,d=j.createMsubWithBase(e,a),h.place(d.rootNode,b,0)),this.anchor.node=d.focusNode,this.anchor.offset=0;else if("msqrt"==c)this._isLineNode(a)||this._isTextNode(a)?(this.path.push({nodeName:"math",offset:f}),this.path.push({nodeName:"msqrt",offset:1}),this.path.push({nodeName:"mrow",offset:1}),this.path.push({nodeName:"mn",offset:1}),c=e.createElement("math"),f=j.createEmptyMsqrt(e),c.appendChild(f.rootNode),h.place(c,a,g)):(this.path.pop(),this.path.push({nodeName:"msqrt",
offset:d+1}),this.path.push({nodeName:"mrow",offset:1}),this.path.push({nodeName:"mn",offset:1}),b=a.parentNode,f=j.createEmptyMsqrt(e),h.place(f.rootNode,b,d)),this.anchor.node=f.focusNode,this.anchor.offset=0;else if("mroot"==c)this._isLineNode(a)||this._isTextNode(a)?(this.path.push({nodeName:"math",offset:f}),this.path.push({nodeName:"mroot",offset:1}),this.path.push({nodeName:"mrow",offset:2}),this.path.push({nodeName:"mn",offset:1}),c=e.createElement("math"),f=j.createEmptyMroot(e),c.appendChild(f.rootNode),
h.place(c,a,g)):(this.path.pop(),this.path.push({nodeName:"mroot",offset:d+1}),this.path.push({nodeName:"mrow",offset:2}),this.path.push({nodeName:"mn",offset:1}),b=a.parentNode,f=j.createEmptyMroot(e),h.place(f.rootNode,b,d)),this.anchor.node=f.focusNode,this.anchor.offset=0;else if("mi"==c&&/sin|cos|tan|cot/.test(b)&&(this._isLineNode(a)||this._isTextNode(a))){this.path.push({nodeName:"math",offset:d+1});this.path.push({nodeName:"mrow",offset:3});this.path.push({nodeName:"mn",offset:1});var c=e.createElement("math"),
n=e.createElement("mi"),o=e.createElement("mo"),g=e.createElement("mrow"),f=j.getPlaceHolder(e);n.textContent=b;o.textContent="&#x2061;";g.appendChild(f);c.appendChild(n);c.appendChild(o);c.appendChild(g);h.place(c,a,d);this.anchor.node=f;this.anchor.offset=0}this.onChange()}else if(l.isFenced(b)){if(this._isLineNode(a)||this._isTextNode(a))this.path.push({nodeName:"math",offset:d+1}),this.path.push({nodeName:"mfenced",offset:1}),this.path.push({nodeName:"mrow",offset:1}),this.path.push({nodeName:"mn",
offset:1}),c=e.createElement("math"),n=e.createElement("mfenced"),g={"{":{left:"{",right:"}"},"[":{left:"[",right:"]"},"|":{left:"|",right:"|"}},"("!=b&&(n.setAttribute("open",g[b].left),n.setAttribute("close",g[b].right)),g=e.createElement("mrow"),f=j.getPlaceHolder(e),c.appendChild(n),n.appendChild(g),g.appendChild(f),h.place(c,a,d),this.anchor.node=f,this.anchor.offset=0;this.onChange()}else a=[],p.isString(b)?a=q.splitData(b):p.isArray(b)&&(a=b),r.forEach(a,p.hitch(this,function(a){var b=this.anchor.node;
if(l.isNumber(a)){var c="mn",d=b.nodeName;if("line"==d||"text"==d){var d=this.anchor.offset,f="last",g=1;if(this._isLineNode(b))f="last",g=1;else if(this._isTextNode(b)){this._splitNodeIfNeed();var i=this.path.pop();0<d?(f="after",g=i.offset+1):f="before"}var m=e.createElement("math"),k=e.createElement(c);m.appendChild(k);h.place(m,b,f);this.anchor.node=k;this.anchor.offset=0;this._insertChar(a);this.path.push({nodeName:"math",offset:g});this.path.push({nodeName:c,offset:1})}else if(l.isMathTokenNode(b)){b=
this.anchor.node;j.isPlaceHolder(b)&&j.removePlaceHolder(b);if(b.nodeName!=c)d=e.createElement(c),l.insertNodeAfter(d,b),this.anchor.node=d,this.anchor.offset=0,i=this.path.pop(),this.path.push({nodeName:c,offset:i.offset+1});this._insertChar(a)}}else if(l.isOperator(a)){var c="mo";this._isLineNode(b)?(m=e.createElement("math"),k=e.createElement(c),m.appendChild(k),this._updateAnchor(k,0),this._insertChar(a),this.path.push({nodeName:"math",offset:1}),this.path.push({nodeName:c,offset:1}),h.place(m,
b,d)):l.isMathTokenNode(b)?"="==a&&"mo"==b.nodeName&&"="==b.textContent?b.textContent+="=":"="==a&&"mo"==b.nodeName&&"!"==b.textContent?b.textContent+="=":(k=e.createElement(c),this._updateAnchor(k,0),this._insertChar(a),i=this.path.pop(),this.path.push({nodeName:c,offset:i.offset+1}),l.insertNodeAfter(k,b)):this._isTextNode(b)&&(m=e.createElement("math"),k=e.createElement(c),m.appendChild(k),this._updateAnchor(k,0),this._insertChar(a),i=this.path.pop(),this.path.push({nodeName:"math",offset:i.offset+
1}),this.path.push({nodeName:c,offset:1}),l.insertNodeAfter(m,b))}else if(l.isNewLine(a)){a=this._getFocusLine();b=this.doc.createElement("line");l.insertNodeAfter(b,a);this.anchor.node=b;this.anchor.offset=0;for(i=this.path.pop();"line"!=i.nodeName;)i=this.path.pop();this.path.push({nodeName:"line",offset:i.offset+1})}else if(this._isLineNode(b))f=d,c="text",k=e.createElement(c),this._updateAnchor(k,0),this.path.push({nodeName:c,offset:1}),this._insertChar(a),h.place(k,b,f);else if(this._isTextNode(b))this._insertChar(a);
else if(l.isMathTokenNode(b)){do i=this.path.pop();while(i&&"math"!=i.nodeName);c=e.createElement("text");for(m=b;"math"!=m.nodeName;)m=m.parentNode;l.insertNodeAfter(c,m);this.anchor.node=c;this.anchor.offset=0;this._insertChar(a);this.path.push({nodeName:"text",offset:i.offset+1})}})),this.onChange(b)},_updateAnchor:function(a,b){this.anchor.node=a;this.anchor.offset=b},doDelete:function(){if(""!=this.removeLeft())this.onChange()},removeLeft:function(){var a=this.anchor.offset,b=this.anchor.node,
c=b.textContent;if(0==a){a=b;if("text"!=b.nodeName&&"line"!=b.nodeName){for(;"math"!=a.nodeName;)a=a.parentNode;if(a=a.previousSibling){var b=a.textContent,d=b.length,c=q.insertAtOffset(b,d,"",1),d=d-1;""==c?(a.parentNode.removeChild(a),this.path.pop()):(a.textContent=c,this.anchor.node=a,this.anchor.offset=d);return d=b.charAt(d)}}else if("line"==b.nodeName&&1<this.getLineCount()){a=b.previousSibling;d=a.childNodes.length;if(0==d)this.anchor.node=a,this.anchor.offset=0,c=this.path.pop(),c.offset--,
this.path.push(c),b.parentNode.removeChild(b);else if(a=a.lastChild,"text"==a.nodeName)this.anchor.node=a,this.anchor.offset=a.textContent.length,c=this.path.pop(),c.offset--,this.path.push(c),this.path.push({nodeName:a.nodeName,offset:d}),b.parentNode.removeChild(b);else if("math"==a.nodeName){var e=a.childNodes.length,a=a.lastChild;this.anchor.node=a;this.anchor.offset=a.textContent.length;c=this.path.pop();c.offset--;this.path.push(c);this.path.push({nodeName:"math",offset:d});this.path.push({nodeName:a.nodeName,
offset:e});b.parentNode.removeChild(b)}return"\n"}return""}"mo"==b.nodeName?(d=b.textContent,c=""):(d=c.charAt(a-1),c=q.insertAtOffset(c,a,"",1));if(""==c)if(a=b.previousSibling)"math"==a.nodeName?(e=a.childNodes.length,a=a.lastChild,this.anchor.node=a,this.anchor.offset=a.textContent.length,c=this.path.pop(),this.path.push({nodeName:"math",offset:c.offset-1}),this.path.push({nodeName:a.nodeName,offset:e}),b.parentNode.removeChild(b)):(this.anchor.node=a,this.anchor.offset=a.textContent.length,b.parentNode.removeChild(b),
this.path.push({nodeName:this.anchor.node.nodeName,offset:this.path.pop().offset-1}));else{e=c=b;if("text"!=b.nodeName&&"line"!=b.nodeName)for(;"math"!=e.nodeName;)c=e.parentNode,c.removeChild(e),e=c,this.path.pop();a=e.previousSibling;c=e.parentNode;c.removeChild(e);b=this.path.pop().offset;a?(this.anchor.node=a,this.anchor.offset=a.textContent.length,this.path.push({nodeName:this.anchor.node.nodeName,offset:b-1})):(this.anchor.node=c,this.anchor.offset=c.childElementCount)}else this.anchor.node.textContent=
c,this.anchor.offset-=1;return d},moveLeft:function(){var a=this.anchor.node,b=this.anchor.offset;if("line"==a.nodeName){if(b=a.previousSibling){b=b.lastChild;if("math"==b.nodeName)b=b.lastChild;a=b.textContent;this.anchor.node=b;this.anchor.offset=a.length}}else if(0<b)this.anchor.offset--;else if(0==b)if(b=a.previousSibling){if("math"==b.nodeName)b=b.lastChild;a=b.textContent;this.anchor.node=b;this.anchor.offset=a.length-1}else if(b=a.parentNode.previousSibling)if("line"==b.nodeName){b=b.lastChild;
if("math"==b.nodeName)b=b.lastChild;a=b.textContent;this.anchor.node=b;this.anchor.offset=a.length}else a=b.textContent,this.anchor.node=b,this.anchor.offset=a.length-1},moveRight:function(){},moveUp:function(){},moveDown:function(){},getLineCount:function(){return this.doc.documentElement.childNodes.length},_splitNodeIfNeed:function(){var a=this.anchor.offset,b=this.anchor.node,c=b.textContent,d=c.length;if(0<a&&a<d)d=c.substring(0,a),a=c.substring(a),c=this.doc.createElement(b.nodeName),b.textContent=
d,c.textContent=a,l.insertNodeAfter(c,b)},_getFocusLine:function(){for(var a=this.getFocusNode();a&&"line"!=a.nodeName;)a=a.parentNode;return a},_isNotSameNode:function(a,b){return a==b.nodeName},_isLineNode:function(a){return"line"==a.nodeName},_isTextNode:function(a){return"text"==a.nodeName},_insertChar:function(a){var b=this.anchor.node,c=this.anchor.offset,a=q.insertAtOffset(b.textContent,c,a);b.textContent=a;this._updateAnchor(b,c+1)},getXML:function(){return 0==this.doc.firstChild.firstChild.childNodes.length?
"":o.innerXML(this.doc)},isEmpty:function(){return""==this.getXML()},getPath:function(){var a="";r.forEach(this.path,function(b){a+="/";a+=b.nodeName;b.offset&&(a+="["+b.offset+"]")});return a},getFocusNode:function(){return this.anchor.node},getOffset:function(){return this.anchor.offset},getLineAt:function(a){return this.doc.documentElement.childNodes[a]},getHTML:function(){return t.xmlDocToHtml(this.doc)},onChange:function(){}})});