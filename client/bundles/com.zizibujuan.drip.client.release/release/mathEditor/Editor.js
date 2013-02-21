//>>built
require({cache:{"mathEditor/Model":function(){define("mathEditor/Model","dojo/_base/declare,dojo/_base/lang,dojo/_base/array,dojo/dom-construct,dojox/xml/parser,mathEditor/string,mathEditor/dataUtil,mathEditor/lang,mathEditor/xmlUtil".split(","),function(g,b,f,e,a,i,j,h,k){return g(null,{path:null,xmlString:null,doc:null,cursorPosition:null,constructor:function(d){this._init();b.mixin(this,d)},_init:function(){this.doc=a.parse("<root><line></line></root>");this.path=[];this.cursorPosition={};this.cursorPosition.node=
this.doc.documentElement.firstChild;this.cursorPosition.offset=0;this.path.push({nodeName:"root"});this.path.push({nodeName:"line",offset:1})},clear:function(){this._init();this.onChange()},loadData:function(){},setData:function(d){var c=d.data,l=d.nodeName;if((d=d.removeCount)&&0<d)for(var a=0;a<d;a++)this.removeLeft();var g=this.doc;if(""!=l&&"mfrac"==l){this._splitNodeIfNeed();c=this.cursorPosition.node;a=1;d="last";!this._isLineNode(c)&&this._isTextNode(c)&&(a=this.path.pop().offset+1,d="after");
this.path.push({nodeName:"math",offset:a});this.path.push({nodeName:"mfrac",offset:1});this.path.push({nodeName:"mrow",offset:1});this.path.push({nodeName:"mn",offset:1});var a=g.createElement("math"),m=k.createEmptyFrac(g);a.appendChild(m.rootNode);e.place(a,c,d);this.cursorPosition.node=m.focusNode;this.cursorPosition.offset=0;this.onChange()}else d=[],b.isString(c)?d=i.splitData(c):b.isArray(c)&&(d=c),f.forEach(d,b.hitch(this,function(d){var c=this.cursorPosition.node;if(h.isNumber(d)){l="mn";
var a=c.nodeName;if("line"==a||"text"==a){var b=this.cursorPosition.offset,a="last",m=1;if(this._isLineNode(c))a="last",m=1;else if(this._isTextNode(c)){this._splitNodeIfNeed();var f=this.path.pop();0<b?(a="after",m=f.offset+1):a="before"}b=g.createElement("math");f=g.createElement(l);b.appendChild(f);e.place(b,c,a);this.cursorPosition.node=f;this.cursorPosition.offset=0;this._insertChar(d);this.path.push({nodeName:"math",offset:m});this.path.push({nodeName:l,offset:1})}else if(h.isMathTokenNode(c)){c=
this.cursorPosition.node;if(c.nodeName!=l)f=g.createElement(l),h.insertNodeAfter(f,c),this.cursorPosition.node=f,this.cursorPosition.offset=0,f=this.path.pop(),this.path.push({nodeName:l,offset:f.offset+1});this._insertChar(d)}}else if(h.isOperator(d))if(this._isLineNode(c))b=g.createElement("math"),c.appendChild(b),f=g.createElement("mo"),b.appendChild(f),this.cursorPosition.node=f,this.cursorPosition.offset=0,this._insertChar(d),this.path.push({nodeName:"math",offset:1}),this.path.push({nodeName:"mo",
offset:1});else if(h.isMathTokenNode(c))c=this.cursorPosition.node,a=g.createElement("mo"),h.insertNodeAfter(a,c),this.cursorPosition.node=a,this.cursorPosition.offset=0,this._insertChar(d),f=this.path.pop(),this.path.push({nodeName:"mo",offset:f.offset+1});else{if(this._isTextNode(c))b=g.createElement("math"),h.insertNodeAfter(b,c),f=g.createElement("mo"),b.appendChild(f),this.cursorPosition.node=f,this.cursorPosition.offset=0,this._insertChar(d),f=this.path.pop(),this.path.push({nodeName:"math",
offset:f.offset+1}),this.path.push({nodeName:"mo",offset:1})}else if(h.isNewLine(d)){d=this._getFocusLine();c=this.doc.createElement("line");h.insertNodeAfter(c,d);this.cursorPosition.node=c;this.cursorPosition.offset=0;for(f=this.path.pop();"line"!=f.nodeName;)f=this.path.pop();this.path.push({nodeName:"line",offset:f.offset+1})}else if(this._isLineNode(c))a=g.createElement("text"),c.appendChild(a),this.cursorPosition.node=a,this.cursorPosition.offset=0,this._insertChar(d),this.path.push({nodeName:"text",
offset:1});else if(this._isTextNode(c))this._insertChar(d);else if(h.isMathTokenNode(c)){do f=this.path.pop();while(f&&"math"!=f.nodeName);a=g.createElement("text");for(b=c;"math"!=b.nodeName;)b=b.parentNode;h.insertNodeAfter(a,b);this.cursorPosition.node=a;this.cursorPosition.offset=0;this._insertChar(d);this.path.push({nodeName:"text",offset:f.offset+1})}})),this.onChange(c)},doDelete:function(){if(""!=this.removeLeft())this.onChange()},removeLeft:function(){var d=this.cursorPosition.offset,c=this.cursorPosition.node,
a=c.textContent;if(0==d){d=c;if("text"!=c.nodeName&&"line"!=c.nodeName){for(;"math"!=d.nodeName;)d=d.parentNode;if(d=d.previousSibling){var c=d.textContent,b=c.length,a=i.insertAtOffset(c,b,"",1),b=b-1;""==a?(d.parentNode.removeChild(d),this.path.pop()):(d.textContent=a,this.cursorPosition.node=d,this.cursorPosition.offset=b);return b=c.charAt(b)}}else if("line"==c.nodeName&&1<this.getLineCount()){d=c.previousSibling;b=d.childNodes.length;if(0==b)this.cursorPosition.node=d,this.cursorPosition.offset=
0,a=this.path.pop(),a.offset--,this.path.push(a),c.parentNode.removeChild(c);else if(d=d.lastChild,"text"==d.nodeName)this.cursorPosition.node=d,this.cursorPosition.offset=d.textContent.length,a=this.path.pop(),a.offset--,this.path.push(a),this.path.push({nodeName:d.nodeName,offset:b}),c.parentNode.removeChild(c);else if("math"==d.nodeName){var f=d.childNodes.length,d=d.lastChild;this.cursorPosition.node=d;this.cursorPosition.offset=d.textContent.length;a=this.path.pop();a.offset--;this.path.push(a);
this.path.push({nodeName:"math",offset:b});this.path.push({nodeName:d.nodeName,offset:f});c.parentNode.removeChild(c)}return"\n"}return""}"mo"==c.nodeName?(b=c.textContent,a=""):(b=a.charAt(d-1),a=i.insertAtOffset(a,d,"",1));if(""==a)if(d=c.previousSibling)"math"==d.nodeName?(f=d.childNodes.length,d=d.lastChild,this.cursorPosition.node=d,this.cursorPosition.offset=d.textContent.length,a=this.path.pop(),this.path.push({nodeName:"math",offset:a.offset-1}),this.path.push({nodeName:d.nodeName,offset:f}),
c.parentNode.removeChild(c)):(this.cursorPosition.node=d,this.cursorPosition.offset=d.textContent.length,c.parentNode.removeChild(c),this.path.push({nodeName:this.cursorPosition.node.nodeName,offset:this.path.pop().offset-1}));else{f=a=c;if("text"!=c.nodeName&&"line"!=c.nodeName)for(;"math"!=f.nodeName;)a=f.parentNode,a.removeChild(f),f=a,this.path.pop();d=f.previousSibling;a=f.parentNode;a.removeChild(f);c=this.path.pop().offset;d?(this.cursorPosition.node=d,this.cursorPosition.offset=d.textContent.length,
this.path.push({nodeName:this.cursorPosition.node.nodeName,offset:c-1})):(this.cursorPosition.node=a,this.cursorPosition.offset=a.childElementCount)}else this.cursorPosition.node.textContent=a,this.cursorPosition.offset-=1;return b},moveLeft:function(){var d=this.cursorPosition.node,c=this.cursorPosition.offset;if("line"==d.nodeName){if(c=d.previousSibling){c=c.lastChild;if("math"==c.nodeName)c=c.lastChild;d=c.textContent;this.cursorPosition.node=c;this.cursorPosition.offset=d.length}}else if(0<c)this.cursorPosition.offset--;
else if(0==c)if(c=d.previousSibling){if("math"==c.nodeName)c=c.lastChild;d=c.textContent;this.cursorPosition.node=c;this.cursorPosition.offset=d.length-1}else if(c=d.parentNode.previousSibling)if("line"==c.nodeName){c=c.lastChild;if("math"==c.nodeName)c=c.lastChild;d=c.textContent;this.cursorPosition.node=c;this.cursorPosition.offset=d.length}else d=c.textContent,this.cursorPosition.node=c,this.cursorPosition.offset=d.length-1},moveRight:function(){},moveUp:function(){},moveDown:function(){},getLineCount:function(){return this.doc.documentElement.childNodes.length},
_splitNodeIfNeed:function(){var d=this.cursorPosition.offset,c=this.cursorPosition.node,a=c.textContent,b=a.length;if(0<d&&d<b)b=a.substring(0,d),d=a.substring(d),a=this.doc.createElement(c.nodeName),c.textContent=b,a.textContent=d,h.insertNodeAfter(a,c)},_getFocusLine:function(){for(var a=this.getFocusNode();a&&"line"!=a.nodeName;)a=a.parentNode;return a},_isNotSameNode:function(a,c){return a==c.nodeName},_isLineNode:function(a){return"line"==a.nodeName},_isTextNode:function(a){return"text"==a.nodeName},
_insertChar:function(a){this.cursorPosition.node.textContent=i.insertAtOffset(this.cursorPosition.node.textContent,this.cursorPosition.offset,a);this.cursorPosition.offset+=1},getXML:function(){return 0==this.doc.firstChild.firstChild.childNodes.length?"":a.innerXML(this.doc)},getPath:function(){var a="";f.forEach(this.path,function(c){a+="/";a+=c.nodeName;c.offset&&(a+="["+c.offset+"]")});return a},getFocusNode:function(){return this.cursorPosition.node},getOffset:function(){return this.cursorPosition.offset},
getLineAt:function(a){return this.doc.documentElement.childNodes[a]},getHTML:function(){return j.xmlDocToHtml(this.doc)},onChange:function(){}})})},"dojox/xml/parser":function(){define("dojox/xml/parser",["dojo/_base/kernel","dojo/_base/lang","dojo/_base/array","dojo/_base/window","dojo/_base/sniff"],function(g){g.getObject("xml.parser",!0,dojox);dojox.xml.parser.parse=function(b,f){var e=g.doc,a,f=f||"text/xml";if(b&&g.trim(b)&&"DOMParser"in g.global){a=(new DOMParser).parseFromString(b,f);e=a.documentElement;
if("parsererror"==e.nodeName&&"http://www.mozilla.org/newlayout/xml/parsererror.xml"==e.namespaceURI){var i=e.getElementsByTagNameNS("http://www.mozilla.org/newlayout/xml/parsererror.xml","sourcetext")[0];if(i)i=i.firstChild.data;throw Error("Error parsing text "+e.firstChild.data+" \n"+i);}return a}if("ActiveXObject"in g.global){e=function(a){return"MSXML"+a+".DOMDocument"};e=["Microsoft.XMLDOM",e(6),e(4),e(3),e(2)];g.some(e,function(b){try{a=new ActiveXObject(b)}catch(f){return!1}return!0});if(b&&
a&&(a.async=!1,a.loadXML(b),e=a.parseError,0!==e.errorCode))throw Error("Line: "+e.line+"\nCol: "+e.linepos+"\nReason: "+e.reason+"\nError Code: "+e.errorCode+"\nSource: "+e.srcText);if(a)return a}else if(e.implementation&&e.implementation.createDocument){if(b&&g.trim(b)&&e.createElement){i=e.createElement("xml");i.innerHTML=b;var j=e.implementation.createDocument("foo","",null);g.forEach(i.childNodes,function(a){j.importNode(a,!0)});return j}return e.implementation.createDocument("","",null)}return null};
dojox.xml.parser.textContent=function(b,f){if(1<arguments.length)return dojox.xml.parser.replaceChildren(b,(b.ownerDocument||g.doc).createTextNode(f)),f;if(void 0!==b.textContent)return b.textContent;var e="";b&&g.forEach(b.childNodes,function(a){switch(a.nodeType){case 1:case 5:e+=dojox.xml.parser.textContent(a);break;case 3:case 2:case 4:e+=a.nodeValue}});return e};dojox.xml.parser.replaceChildren=function(b,f){var e=[];g.isIE&&g.forEach(b.childNodes,function(a){e.push(a)});dojox.xml.parser.removeChildren(b);
g.forEach(e,g.destroy);g.isArray(f)?g.forEach(f,function(a){b.appendChild(a)}):b.appendChild(f)};dojox.xml.parser.removeChildren=function(b){for(var f=b.childNodes.length;b.hasChildNodes();)b.removeChild(b.firstChild);return f};dojox.xml.parser.innerXML=function(b){return b.innerXML?b.innerXML:b.xml?b.xml:"undefined"!=typeof XMLSerializer?(new XMLSerializer).serializeToString(b):null};return dojox.xml.parser})},"mathEditor/string":function(){define([],function(){var g={};g.splitData=function(b){for(var f=
b.length,e=[],a=0,g=!1,j="",h=0,k=0;k<f;k++){var d=b.charAt(k);"&"==d?(h=0,g=!0,j=d):g&&";"==d?(0==h?(e[a]=j,a++,e[a]=d):(j+=d,e[a]=j),a++,g=!1,j=""):g?(j+=d,h++):(e[a]=b.charAt(k),a++)}return e};g.insertAtOffset=function(b,f,e,a){var g=b.length;if(0>f||g<f)return b;a=b.substring(0,f-(a||0));b=b.substring(f);return a+e+b};return g})},"mathEditor/dataUtil":function(){define(["dojox/xml/parser","dojo/_base/array"],function(g,b){var f={};f.xmlDocToHtml=function(f){var a="";b.forEach(f.documentElement.childNodes,
function(f){var e="<div class='drip_line'>";b.forEach(f.childNodes,function(a){"text"==a.nodeName?e+="<span>"+a.textContent+"</span>":"math"==a.nodeName&&(a=g.innerXML(a),e+=a.replace(/&amp;/g,"&"))});e+="</div>";a+=e});return a};f.xmlStringToHtml=function(b){return this.xmlDocToHtml(g.parse(b))};return f})},"mathEditor/lang":function(){define("mathEditor/lang",["dojo/_base/array"],function(g){var b={};b.isNumber=function(b){return!isNaN(parseFloat(b))&&isFinite(b)};b.isOperator=function(b){return"+"==
b||"="==b||"-"==b||"&#xD7;"==b||"&#xF7;"==b?!0:!1};b.isNewLine=function(b){return"\n"===b};b.isTab=function(b){return"\t"===b};b.insertNodeAfter=function(b,e){var a=e.parentNode;a.lastChild==e?a.appendChild(b):a.insertBefore(b,e.nextSibling)};b._fontStyles={fontFamily:1,fontSize:1,fontWeight:1,fontStyle:1,lineHeight:1};b.isMathTokenNode=function(b){return this.isMathTokenName(b.nodeName)};b.isMathTokenName=function(b){var e=!1;g.forEach("mi,mn,mo,mtext,mspace,ms".split(","),function(a){b==a&&(e=!0)});
return e};b.measureTextSize=function(b,e){if(!this.measureNode){var a=document.createElement("div"),g=a.style;g.width=g.height="auto";g.left=g.top="-1000px";g.visibility="hidden";g.position="absolute";g.overflow="visible";g.whiteSpace="nowrap";document.body.appendChild(a);this.measureNode=a}a=this.measureNode;a.innerHTML=e;var g=a.style,j=window.getComputedStyle(b,null),h;for(h in this._fontStyles)g[h]=j[h];return{height:a.offsetHeight,width:a.offsetWidth}};return b})},"mathEditor/xmlUtil":function(){define("mathEditor/xmlUtil",
{createEmptyFrac:function(g){var b=g.createElement("mstyle");b.setAttribute("displaystyle","true");var f=g.createElement("mfrac"),e=g.createElement("mrow"),a=g.createElement("mrow"),i=this._getPlaceHolder(g),g=this._getPlaceHolder(g);b.appendChild(f);f.appendChild(e);f.appendChild(a);e.appendChild(i);a.appendChild(g);return{rootNode:b,focusNode:i}},_getPlaceHolder:function(g){g=g.createElement("mn");g.setAttribute("class","drip_placeholder_box");g.setAttribute("style","border:1px dotted black; padding:1px;background-color: #cccccc;color: #cccccc;");
g.textContent="8";return g}})},"mathEditor/View":function(){define("mathEditor/View","dojo/_base/declare,dojo/_base/lang,dojo/_base/array,dojo/_base/event,dojo/dom,dojo/dom-style,dojo/dom-class,dojo/dom-construct,dojo/dom-geometry,dojo/on,dojo/aspect,mathEditor/Model,mathEditor/layer/Cursor,mathEditor/lang".split(","),function(g,b,f,e,a,i,j,h,k,d,c,l,o,n){return g("mathEditor.View",null,{model:null,editorDiv:null,parentNode:null,textarea:null,readOnly:!1,focused:!1,constructor:function(a){b.mixin(this,
a);var a=this.editorDiv=h.create("div",{style:{"border-radius":"3px",height:"100%",width:"100%",border:"solid 1px #CCC",position:"absolute",cursor:"text"}},this.parentNode),f=this.textLayer=h.create("div",{"class":"drip_layer drip_text"},a);this.cursor=new o({parentEl:a});d(a,"mousedown",b.hitch(this,this._onMouseDownHandler));f.innerHTML=this.model.getHTML();c.after(this.model,"onChange",b.hitch(this,this._onChange))},_onMouseDownHandler:function(a){this._focus();e.stop(a)},_focus:function(){if(!1==
this.focused){this.focused=!0;var a=this.textarea,b=this.cursor;j.add(this.editorDiv,"drip_editor_focus");setTimeout(function(){a.focus();b.show()})}},_onChange:function(){this.textLayer.innerHTML=this.model.getHTML();MathJax.Hub.Queue(["Typeset",MathJax.Hub,this.textLayer]);MathJax.Hub.Queue(b.hitch(this,this.showCursor))},blur:function(){if(!0==this.focused)this.focused=!1,j.remove(this.editorDiv,"drip_editor_focus"),this.cursor.hide()},showCursor:function(){var a=this._getCursorConfig();this.cursor.move(a);
this.textarea&&i.set(this.textarea,{top:a.top+"px",left:a.left+"px"})},moveLeft:function(){this.model.moveLeft();this.showCursor()},_getFocusInfo:function(){var b=this.textLayer,c=null,d=null;f.forEach(this.model.path,function(e){if("root"!=e.nodeName)if("line"==e.nodeName)b=b.childNodes[e.offset-1];else if("text"==e.nodeName||"math"==e.nodeName){if(b=f.filter(b.childNodes,function(a){return"span"==a.nodeName.toLowerCase()})[e.offset-1],"math"==e.nodeName)c=b.nextSibling.MathJax.elementJax.root}else c&&
(c=n.isMathTokenName(e.nodeName)?c.data[0]:c.data[e.offset-1],b=a.byId("MathJax-Span-"+c.spanID),j.contains(b,"mstyle")?"mstyle"!=e&&(c=c.data[e.offset-1],b=a.byId("MathJax-Span-"+c.spanID)):j.contains(b,"mrow")&&(d=b,"mrow"!=e&&(c=c.data[e.offset-1],b=a.byId("MathJax-Span-"+c.spanID))))});return{node:b,offset:this.model.getOffset(),mrowNode:d}},_getCursorConfig:function(){var a=0,b=0,c=0,d=0,a=this._getFocusInfo(),e=a.node,f=a.offset,b=this.getTextLayerPosition();if(a=a.mrowNode)var c=k.position(a),
a=c.y-b.y,c=c.h,g=k.position(e);else g=k.position(e),a=g.y-b.y,c=g.h;b=g.x-b.x;if(1==e.nodeType&&(g=e.childNodes,1==g.length&&3==g[0].nodeType))e.textContent.length==f?b+=e.offsetWidth:(d=e.textContent.substring(0,f),d=n.measureTextSize(e,d).width,b+=d);return{top:a,left:b,height:c,width:d}},getCursorPosition:function(){var a=this.getTextLayerPosition(),b=a.x,a=a.y,c=this.cursor.getCursorConfig(),b=b+c.left,a=a+(c.top+c.height);return{x:b,y:a}},getTextLayerPosition:function(){if(!this.textLayerPosition)this.textLayerPosition=
k.position(this.textLayer);return this.textLayerPosition}})})},"mathEditor/layer/Cursor":function(){define("dojo/_base/declare,dojo/_base/lang,dojo/dom-construct,dojo/dom-class,dojo/dom-style,dojo/dom-geometry".split(","),function(g,b,f){return g("mathEditor.layer.Cursor",null,{parentEl:null,caret:null,isVisible:!1,cursorConfig:{top:0,left:0},constructor:function(e){b.mixin(this,e);e=this.caret=f.create("div",{"class":"drip_cursor"},this.parentEl);e.style.visibility="hidden";this.defaultHeight=e.clientHeight;
this.cursorConfig.height=this.defaultHeight},show:function(){this.isVisible=!0;this.caret.style.visibility="";this._restartTimer()},move:function(b){if(!1!=this.isVisible){this.cursorConfig=b;var a=b.left,f=b.height,g=this.caret.style;g.top=b.top+"px";g.left=a+"px";if(f&&0<f)g.height=f+"px";this.caret.style.visibility="";this._restartTimer()}},getCursorConfig:function(){return this.cursorConfig},hide:function(){this.caret.style.visibility="hidden";this.isVisible=!1;clearInterval(this.intervalId);
this.intervalId=null;clearTimeout(this.timeoutId);this.timeoutId=null},_restartTimer:function(){if(null!=this.intervalId)clearInterval(this.intervalId),this.intervalId=null;var b=this.caret,a=this;this.intervalId=setInterval(function(){b.style.visibility="hidden";a.timeoutId=setTimeout(function(){b.style.visibility=""},400)},1E3)},destroy:function(){null!=this.intervalId&&clearInterval(this.intervalId);f.destroy(this.caret)}})})},"mathEditor/ContentAssist":function(){define("dojo/_base/declare,dojo/_base/array,dojo/_base/lang,dojo/on,dojo/dom-construct,dojo/dom-class,dojo/dom-style,dijit/popup,dijit/DropDownMenu,dijit/MenuItem,mathEditor/mathContentAssist".split(","),
function(g,b,f,e,a,i,j,h,k,d,c){return g("mathEditor.ContentAssist",k,{proposals:null,view:null,cacheString:"",opened:!1,postCreate:function(){this.inherited(arguments);e(this.view.editorDiv,"mousedown",f.hitch(this,function(){this.opened&&h.close(this)}))},startup:function(){this.inherited(arguments)},_scheduleOpen:function(a,b,c){view=this.view;var d=this;if(!this._openTimer)this._openTimer=this.defer(function(){delete this._openTimer;h.open({popup:a,x:b,y:c,onExecute:function(){h.close(a);view.focus();
d.opened=!1},onCancel:function(){h.close(a);d.opened=!1;view.focus()},onClose:function(){view.focus();d.opened=!1}});this.opened=!0;a.select()},0)},_open:function(){var a=this.view.getCursorPosition();this._scheduleOpen(this,a.x,a.y)},_clear:function(){var a=this.getChildren();b.forEach(a,f.hitch(this,function(a){this.removeChild(a)}))},_setProposals:function(a){this._clear();this.proposals=a;b.forEach(a,f.hitch(this,function(a){var b=new d({label:a.label,iconClass:a.iconClass});b.on("click",f.hitch(this,
this._onApplyProposal,a.map,a.nodeName));this.addChild(b)}))},show:function(a){this.cacheString=!1==this.opened?a:this.cacheString+a;a=c.getProposals(this.cacheString);this._setProposals(a);if(0<a.length)return this._open(),a[0].map;this.cacheString="";if(this.opened)h.close(this),this.opened=!1;return null},_onApplyProposal:function(a,b,c){this.apply(a,b,this.cacheString.length,c)},apply:function(){},enter:function(a){this.onItemClick(this.selectedChild,a)},select:function(){this.selectFirstChild()},
selectFirstChild:function(){this.selectChild(this._getFirstSelectableChild())},selectPrev:function(){this.selectChild(this._getNextSelectableChild(this.selectedChild,-1),!0)},selectNext:function(){this.selectChild(this._getNextSelectableChild(this.selectedChild,1))},_getFirstSelectableChild:function(){return this._getNextSelectableChild(null,1)},_getLastFocusableChild:function(){return this._getNextSelectableChild(null,-1)},_getNextSelectableChild:function(a,b){a&&(a=this._getSiblingOfChild(a,b));
for(var c=this.getChildren(),d=0;d<c.length;d++){a||(a=c[0<b?0:c.length-1]);if(a.isFocusable())return a;a=this._getSiblingOfChild(a,b)}return null},selectChild:function(a){if(a)this.selectedChild&&a!==this.selectedChild&&this.selectedChild._setSelected(!1),this.selectedChild=a,a._setSelected(!0)}})})},"dijit/DropDownMenu":function(){require({cache:{"url:dijit/templates/Menu.html":'<table class="dijit dijitMenu dijitMenuPassive dijitReset dijitMenuTable" role="menu" tabIndex="${tabIndex}"\n\t   data-dojo-attach-event="onkeydown:_onKeyDown" cellspacing="0">\n\t<tbody class="dijitReset" data-dojo-attach-point="containerNode"></tbody>\n</table>\n'}});
define("dijit/DropDownMenu",["dojo/_base/declare","dojo/keys","dojo/text!./templates/Menu.html","./_OnDijitClickMixin","./_MenuBase"],function(g,b,f,e,a){return g("dijit.DropDownMenu",[a,e],{templateString:f,baseClass:"dijitMenu",postCreate:function(){this.inherited(arguments);var a=this.isLeftToRight();this._openSubMenuKey=a?b.RIGHT_ARROW:b.LEFT_ARROW;this._closeSubMenuKey=a?b.LEFT_ARROW:b.RIGHT_ARROW;this.connectKeyNavHandlers([b.UP_ARROW],[b.DOWN_ARROW])},_onKeyDown:function(a){if(!a.ctrlKey&&
!a.altKey)switch(a.keyCode){case this._openSubMenuKey:this._moveToPopup(a);a.stopPropagation();a.preventDefault();break;case this._closeSubMenuKey:if(this.parentMenu)if(this.parentMenu._isMenuBar)this.parentMenu.focusPrev();else this.onCancel(!1);else a.stopPropagation(),a.preventDefault()}}})})},"url:dijit/templates/Menu.html":'<table class="dijit dijitMenu dijitMenuPassive dijitReset dijitMenuTable" role="menu" tabIndex="${tabIndex}"\n\t   data-dojo-attach-event="onkeydown:_onKeyDown" cellspacing="0">\n\t<tbody class="dijitReset" data-dojo-attach-point="containerNode"></tbody>\n</table>\n',
"dijit/_MenuBase":function(){define("dijit/_MenuBase","dojo/_base/array,dojo/_base/declare,dojo/dom,dojo/dom-attr,dojo/dom-class,dojo/_base/lang,dojo/mouse,dojo/on,dojo/window,./a11yclick,./popup,./registry,./_Widget,./_CssStateMixin,./_KeyNavContainer,./_TemplatedMixin".split(","),function(g,b,f,e,a,i,j,h,k,d,c,l,o,n,m,q){return b("dijit._MenuBase",[o,q,m,n],{parentMenu:null,popupDelay:500,autoFocus:!1,childSelector:function(a){var b=l.byNode(a);return a.parentNode==this.containerNode&&b&&b.focus},
postCreate:function(){var a=this,b="string"==typeof this.childSelector?this.childSelector:i.hitch(this,"childSelector");this.own(h(this.containerNode,h.selector(b,j.enter),function(){a.onItemHover(l.byNode(this))}),h(this.containerNode,h.selector(b,j.leave),function(){a.onItemUnhover(l.byNode(this))}),h(this.containerNode,h.selector(b,d),function(b){a.onItemClick(l.byNode(this),b);b.stopPropagation();b.preventDefault()}));this.inherited(arguments)},onKeyboardSearch:function(a,b,c,d){this.inherited(arguments);
if(a&&(-1==d||a.popup&&1==d))this.onItemClick(a,b)},_keyboardSearchCompare:function(a,b){return a.shortcutKey?b==a.shortcutKey.toLowerCase()?-1:0:this.inherited(arguments)?1:0},onExecute:function(){},onCancel:function(){},_moveToPopup:function(a){if(this.focusedChild&&this.focusedChild.popup&&!this.focusedChild.disabled)this.onItemClick(this.focusedChild,a);else(a=this._getTopMenu())&&a._isMenuBar&&a.focusNext()},_onPopupHover:function(){if(this.currentPopup&&this.currentPopup._pendingClose_timer){var a=
this.currentPopup.parentMenu;a.focusedChild&&a.focusedChild._setSelected(!1);a.focusedChild=this.currentPopup.from_item;a.focusedChild._setSelected(!0);this._stopPendingCloseTimer(this.currentPopup)}},onItemHover:function(a){if(this.isActive&&(this.focusChild(a),a.popup&&!a.disabled&&!this.hover_timer))this.hover_timer=this.defer(i.hitch(this,"_openPopup",a),this.popupDelay);this.focusedChild&&this.focusChild(a);this._hoveredChild=a;a._set("hovering",!0)},_onChildBlur:function(a){this._stopPopupTimer();
a._setSelected(!1);var b=a.popup;if(b)this._stopPendingCloseTimer(b),b._pendingClose_timer=this.defer(function(){b._pendingClose_timer=null;if(b.parentMenu)b.parentMenu.currentPopup=null;c.close(b)},this.popupDelay)},onItemUnhover:function(a){this.isActive&&this._stopPopupTimer();if(this._hoveredChild==a)this._hoveredChild=null;a._set("hovering",!1)},_stopPopupTimer:function(){if(this.hover_timer)this.hover_timer=this.hover_timer.remove()},_stopPendingCloseTimer:function(a){if(a._pendingClose_timer)a._pendingClose_timer=
a._pendingClose_timer.remove()},_stopFocusTimer:function(){if(this._focus_timer)this._focus_timer=this._focus_timer.remove()},_getTopMenu:function(){for(var a=this;a.parentMenu;a=a.parentMenu);return a},onItemClick:function(a,b){"undefined"==typeof this.isShowingNow&&this._markActive();this.focusChild(a);if(a.disabled)return!1;a.popup?this._openPopup(a,/^key/.test(b.type)):(this.onExecute(),a._onClick?a._onClick(b):a.onClick(b))},_openPopup:function(a,b){this._stopPopupTimer();var d=a.popup;if(!d.isShowingNow){this.currentPopup&&
(this._stopPendingCloseTimer(this.currentPopup),c.close(this.currentPopup));d.parentMenu=this;d.from_item=a;var e=this;c.open({parent:this,popup:d,around:a.domNode,orient:this._orient||["after","before"],onCancel:function(){e.focusChild(a);e._cleanUp();a._setSelected(!0);e.focusedChild=a},onExecute:i.hitch(this,"_cleanUp")});this.currentPopup=d;d.connect(d.domNode,"onmouseenter",i.hitch(e,"_onPopupHover"))}if(b&&d.focus)d._focus_timer=this.defer(i.hitch(d,function(){this._focus_timer=null;this.focus()}))},
_markActive:function(){this.isActive=!0;a.replace(this.domNode,"dijitMenuActive","dijitMenuPassive")},onOpen:function(){this.isShowingNow=!0;this._markActive()},_markInactive:function(){this.isActive=!1;a.replace(this.domNode,"dijitMenuPassive","dijitMenuActive")},onClose:function(){this._stopFocusTimer();this._markInactive();this.isShowingNow=!1;this.parentMenu=null},_closeChild:function(){this._stopPopupTimer();if(this.currentPopup)0<=g.indexOf(this._focusManager.activeStack,this.id)&&(e.set(this.focusedChild.focusNode,
"tabIndex",this.tabIndex),this.focusedChild.focusNode.focus()),c.close(this.currentPopup),this.currentPopup=null;this.focusedChild&&(this.focusedChild._setSelected(!1),this.onItemUnhover(this.focusedChild));e.set(this.domNode,"tabIndex",this.tabIndex);this.focusedChild&&(this.focusedChild.set("tabIndex","-1"),this._set("focusedChild",null))},_onItemFocus:function(a){if(this._hoveredChild&&this._hoveredChild!=a)this.onItemUnhover(this._hoveredChild)},_onBlur:function(){this._cleanUp();this.inherited(arguments)},
_cleanUp:function(){this._closeChild();"undefined"==typeof this.isShowingNow&&this._markInactive()}})})},"dijit/_KeyNavContainer":function(){define("dijit/_KeyNavContainer","dojo/_base/array,dojo/_base/declare,dojo/dom-attr,dojo/_base/kernel,dojo/keys,dojo/_base/lang,./registry,./_Container,./_FocusMixin,./_KeyNavMixin".split(","),function(g,b,f,e,a,i,j,h,k,d){return b("dijit._KeyNavContainer",[k,d,h],{connectKeyNavHandlers:function(b,d){var e=this._keyNavCodes={},f=i.hitch(this,"focusPrev"),k=i.hitch(this,
"focusNext");g.forEach(b,function(a){e[a]=f});g.forEach(d,function(a){e[a]=k});e[a.HOME]=i.hitch(this,"focusFirstChild");e[a.END]=i.hitch(this,"focusLastChild")},startupKeyNavChildren:function(){e.deprecated("startupKeyNavChildren() call no longer needed","","2.0")},startup:function(){this.inherited(arguments);g.forEach(this.getChildren(),i.hitch(this,"_startupChild"))},addChild:function(a,b){this.inherited(arguments);this._startupChild(a)},_startupChild:function(a){a.set("tabIndex","-1")},_getFirst:function(){var a=
this.getChildren();return a.length?a[0]:null},_getLast:function(){var a=this.getChildren();return a.length?a[a.length-1]:null},focusNext:function(){this.focusChild(this._getNextFocusableChild(this.focusedChild,1))},focusPrev:function(){this.focusChild(this._getNextFocusableChild(this.focusedChild,-1),!0)},childSelector:function(a){return(a=j.byNode(a))&&a.getParent()==this}})})},"dijit/_KeyNavMixin":function(){define("dijit/_KeyNavMixin","dojo/_base/array,dojo/_base/declare,dojo/dom-attr,dojo/keys,dojo/_base/lang,dojo/on,dijit/registry,dijit/_FocusMixin".split(","),
function(g,b,f,e,a,i,j,h){return b("dijit._KeyNavMixin",h,{tabIndex:"0",childSelector:null,postCreate:function(){this.inherited(arguments);f.set(this.domNode,"tabIndex",this.tabIndex);if(!this._keyNavCodes){var b=this._keyNavCodes={};b[e.HOME]=a.hitch(this,"focusFirstChild");b[e.END]=a.hitch(this,"focusLastChild");b[this.isLeftToRight()?e.LEFT_ARROW:e.RIGHT_ARROW]=a.hitch(this,"_onLeftArrow");b[this.isLeftToRight()?e.RIGHT_ARROW:e.LEFT_ARROW]=a.hitch(this,"_onRightArrow");b[e.UP_ARROW]=a.hitch(this,
"_onUpArrow");b[e.DOWN_ARROW]=a.hitch(this,"_onDownArrow")}var d=this,b="string"==typeof this.childSelector?this.childSelector:a.hitch(this,"childSelector");this.own(i(this.domNode,"keypress",a.hitch(this,"_onContainerKeypress")),i(this.domNode,"keydown",a.hitch(this,"_onContainerKeydown")),i(this.domNode,"focus",a.hitch(this,"_onContainerFocus")),i(this.containerNode,i.selector(b,"focusin"),function(a){d._onChildFocus(j.getEnclosingWidget(this),a)}))},_onLeftArrow:function(){},_onRightArrow:function(){},
_onUpArrow:function(){},_onDownArrow:function(){},focus:function(){this.focusFirstChild()},_getFirstFocusableChild:function(){return this._getNextFocusableChild(null,1)},_getLastFocusableChild:function(){return this._getNextFocusableChild(null,-1)},focusFirstChild:function(){this.focusChild(this._getFirstFocusableChild())},focusLastChild:function(){this.focusChild(this._getLastFocusableChild())},focusChild:function(a,b){a&&(this.focusedChild&&a!==this.focusedChild&&this._onChildBlur(this.focusedChild),
a.set("tabIndex",this.tabIndex),a.focus(b?"end":"start"))},_onContainerFocus:function(a){a.target!==this.domNode||this.focusedChild||this.focus()},_onFocus:function(){f.set(this.domNode,"tabIndex","-1");this.inherited(arguments)},_onBlur:function(a){f.set(this.domNode,"tabIndex",this.tabIndex);if(this.focusedChild)this.focusedChild.set("tabIndex","-1"),this.lastFocusedChild=this.focusedChild,this._set("focusedChild",null);this.inherited(arguments)},_onChildFocus:function(a){if(a&&a!=this.focusedChild)this.focusedChild&&
!this.focusedChild._destroyed&&this.focusedChild.set("tabIndex","-1"),a.set("tabIndex",this.tabIndex),this.lastFocused=a,this._set("focusedChild",a)},_searchString:"",multiCharSearchDuration:1E3,onKeyboardSearch:function(a){a&&this.focusChild(a)},_keyboardSearchCompare:function(a,b){var c=a.domNode,c=(a.label||(c.focusNode?c.focusNode.label:"")||c.innerText||c.textContent||"").replace(/^\s+/,"").substr(0,b.length).toLowerCase();return b.length&&c==b?-1:0},_onContainerKeydown:function(a){var b=this._keyNavCodes[a.keyCode];
if(b)b(a,this.focusedChild),a.stopPropagation(),a.preventDefault(),this._searchString=""},_onContainerKeypress:function(b){if(!(32>=b.charCode||b.ctrlKey||b.altKey)){var d=null,c,e=0,f=a.hitch(this,function(){this._searchTimer&&this._searchTimer.remove();this._searchString+=g;var a=/^(.)\1*$/.test(this._searchString)?1:this._searchString.length;c=this._searchString.substr(0,a);this._searchTimer=this.defer(function(){this._searchTimer=null;this._searchString=""},this.multiCharSearchDuration);var b=
this.focusedChild||null;if(1==a||!b)if(b=this._getNextFocusableChild(b,1),!b)return;a=b;do{var f=this._keyboardSearchCompare(b,c);f&&0==e++&&(d=b);if(-1==f){e=-1;break}b=this._getNextFocusableChild(b,1)}while(b!=a)}),g=String.fromCharCode(b.charCode).toLowerCase();f();this.onKeyboardSearch(d,b,c,e)}},_onChildBlur:function(){},_getNextFocusableChild:function(a,b){var c=a;do{if(a)a=this._getNext(a,b);else if(a=this[0<b?"_getFirst":"_getLast"](),!a)break;if(null!=a&&a!=c&&a.isFocusable())return a}while(a!=
c);return null},_getFirst:function(){return null},_getLast:function(){return null},_getNext:function(a,b){if(a)for(a=a.domNode;a;)if((a=a[0>b?"previousSibling":"nextSibling"])&&"getAttribute"in a){var c=j.byNode(a);if(c)return c}return null}})})},"dijit/MenuItem":function(){require({cache:{"url:dijit/templates/MenuItem.html":'<tr class="dijitReset dijitMenuItem" data-dojo-attach-point="focusNode" role="menuitem" tabIndex="-1">\n\t<td class="dijitReset dijitMenuItemIconCell" role="presentation">\n\t\t<img src="${_blankGif}" alt="" class="dijitIcon dijitMenuItemIcon" data-dojo-attach-point="iconNode"/>\n\t</td>\n\t<td class="dijitReset dijitMenuItemLabel" colspan="2" data-dojo-attach-point="containerNode,textDirNode"></td>\n\t<td class="dijitReset dijitMenuItemAccelKey" style="display: none" data-dojo-attach-point="accelKeyNode"></td>\n\t<td class="dijitReset dijitMenuArrowCell" role="presentation">\n\t\t<div data-dojo-attach-point="arrowWrapper" style="visibility: hidden">\n\t\t\t<img src="${_blankGif}" alt="" class="dijitMenuExpand"/>\n\t\t\t<span class="dijitMenuExpandA11y">+</span>\n\t\t</div>\n\t</td>\n</tr>\n'}});
define("dijit/MenuItem","dojo/_base/declare,dojo/dom,dojo/dom-attr,dojo/dom-class,dojo/_base/kernel,dojo/sniff,dojo/_base/lang,./_Widget,./_TemplatedMixin,./_Contained,./_CssStateMixin,dojo/text!./templates/MenuItem.html".split(","),function(g,b,f,e,a,i,j,h,k,d,c,l){j=g("dijit.MenuItem"+(i("dojo-bidi")?"_NoBidi":""),[h,k,d,c],{templateString:l,baseClass:"dijitMenuItem",label:"",_setLabelAttr:function(a){this._set("label",a);var b="",c;c=a.search(/{\S}/);if(0<=c){var b=a.charAt(c+1),d=a.substr(0,c),
a=a.substr(c+3);c=d+b+a;a=d+'<span class="dijitMenuItemShortcutKey">'+b+"</span>"+a}else c=a;this.domNode.setAttribute("aria-label",c+" "+this.accelKey);this.containerNode.innerHTML=a;this._set("shortcutKey",b)},iconClass:"dijitNoIcon",_setIconClassAttr:{node:"iconNode",type:"class"},accelKey:"",disabled:!1,_fillContent:function(a){a&&!("label"in this.params)&&this._set("label",a.innerHTML)},buildRendering:function(){this.inherited(arguments);f.set(this.containerNode,"id",this.id+"_text");this.accelKeyNode&&
f.set(this.accelKeyNode,"id",this.id+"_accel");b.setSelectable(this.domNode,!1)},onClick:function(){},focus:function(){try{8==i("ie")&&this.containerNode.focus(),this.focusNode.focus()}catch(a){}},_onFocus:function(){this._setSelected(!0);this.getParent()._onItemFocus(this);this.inherited(arguments)},_setSelected:function(a){e.toggle(this.domNode,"dijitMenuItemSelected",a)},setLabel:function(b){a.deprecated("dijit.MenuItem.setLabel() is deprecated.  Use set('label', ...) instead.","","2.0");this.set("label",
b)},setDisabled:function(b){a.deprecated("dijit.Menu.setDisabled() is deprecated.  Use set('disabled', bool) instead.","","2.0");this.set("disabled",b)},_setDisabledAttr:function(a){this.focusNode.setAttribute("aria-disabled",a?"true":"false");this._set("disabled",a)},_setAccelKeyAttr:function(a){if(this.accelKeyNode)this.accelKeyNode.style.display=a?"":"none",this.accelKeyNode.innerHTML=a,f.set(this.containerNode,"colSpan",a?"1":"2");this._set("accelKey",a)}});i("dojo-bidi")&&(j=g("dijit.MenuItem",
j,{_setLabelAttr:function(a){this.inherited(arguments);"auto"===this.textDir&&this.applyTextDir(this.textDirNode)}}));return j})},"dijit/_Contained":function(){define("dijit/_Contained",["dojo/_base/declare","./registry"],function(g,b){return g("dijit._Contained",null,{_getSibling:function(f){var e=this.domNode;do e=e[f+"Sibling"];while(e&&1!=e.nodeType);return e&&b.byNode(e)},getPreviousSibling:function(){return this._getSibling("previous")},getNextSibling:function(){return this._getSibling("next")},
getIndexInParent:function(){var b=this.getParent();return!b||!b.getIndexOfChild?-1:b.getIndexOfChild(this)}})})},"url:dijit/templates/MenuItem.html":'<tr class="dijitReset dijitMenuItem" data-dojo-attach-point="focusNode" role="menuitem" tabIndex="-1">\n\t<td class="dijitReset dijitMenuItemIconCell" role="presentation">\n\t\t<img src="${_blankGif}" alt="" class="dijitIcon dijitMenuItemIcon" data-dojo-attach-point="iconNode"/>\n\t</td>\n\t<td class="dijitReset dijitMenuItemLabel" colspan="2" data-dojo-attach-point="containerNode,textDirNode"></td>\n\t<td class="dijitReset dijitMenuItemAccelKey" style="display: none" data-dojo-attach-point="accelKeyNode"></td>\n\t<td class="dijitReset dijitMenuArrowCell" role="presentation">\n\t\t<div data-dojo-attach-point="arrowWrapper" style="visibility: hidden">\n\t\t\t<img src="${_blankGif}" alt="" class="dijitMenuExpand"/>\n\t\t\t<span class="dijitMenuExpandA11y">+</span>\n\t\t</div>\n\t</td>\n</tr>\n',
"mathEditor/mathContentAssist":function(){define(["dojo/_base/array"],function(g){return{keywords:[{input:"/",map:"&#xF7;",nodeName:"mo",freq:0,label:"\u9664\u53f7",iconClass:"drip_equation_icon drip_division"},{input:"/",map:"/",nodeName:"text",freq:0,label:"/",iconClass:""},{input:"/",map:"",nodeName:"mfrac",freq:0,label:"\u5206\u6570",iconClass:"drip_equation_icon drip_frac"},{input:"*",map:"&#xD7;",nodeName:"mo",freq:0,label:"\u4e58\u53f7",iconClass:"drip_equation_icon drip_multiplication"},{input:"*",
map:"*",nodeName:"text",freq:0,label:"*",iconClass:""}],getProposals:function(b){return g.filter(this.keywords,function(f){return 0==f.input.indexOf(b)})}}})}}});
define("mathEditor/Editor","dojo/_base/declare,dojo/_base/lang,dojo/_base/event,dijit/_WidgetBase,dojo/on,dojo/sniff,dojo/keys,dojo/aspect,dojo/dom-construct,dojo/dom-style,dojo/dom-class,mathEditor/Model,mathEditor/View,mathEditor/ContentAssist".split(","),function(g,b,f,e,a,i,j,h,k,d,c,l,o,n){return g("mathEditor.Editor",[e],{model:null,view:null,textarea:null,value:"",_getValueAttr:function(){return this.model.getXML()},_setValueAttr:function(a){this.model.clear();a&&""!=a&&this.model.setData({data:a})},
postCreate:function(){this.inherited(arguments);d.set(this.domNode,{position:"relative"});var e=this.textarea=k.create("textarea",{style:{position:"absolute"}},this.domNode);c.add(e,"drip_text_input");e.wrap="off";e.autocorrect="off";e.autocapitalize="off";e.spellcheck=!1;var g=this.model=new l;this.view=new o({model:this.model,parentNode:this.domNode,textarea:this.textarea});var r=this.contentAssist=new n({view:this.view});h.after(r,"apply",function(a,b,c){g.setData({data:a,nodeName:b,removeCount:c});
setTimeout(function(){e.value=""})},!0);if(i("chrome"))a(e,"textInput",b.hitch(this,function(a){this._onTextInput(a.data)}));else{var p=!1;a(e,"input",b.hitch(this,function(){if(!p)inputData=e.value,""!=inputData&&this._onTextInput(inputData)}));a(e,"compositionstart",b.hitch(this,function(){p=!0}));a(e,"compositionend",b.hitch(this,function(){p=!1}))}a(e,"blur",b.hitch(this,function(){this.view.blur()}));a(e,"keydown",b.hitch(this,function(a){a.keyCode===j.LEFT_ARROW?(this.model.moveLeft(),this.view.showCursor()):
a.keyCode===j.RIGHT_ARROW?this.model.moveRight():a.keyCode===j.UP_ARROW?this.contentAssist.opened?this.contentAssist.selectPrev():this.model.moveUp():a.keyCode===j.DOWN_ARROW?this.contentAssist.opened?this.contentAssist.selectNext():this.model.moveDown():a.keyCode===j.BACKSPACE?this.model.doDelete():a.altKey&&191===a.keyCode?(this.contentAssist.open(),f.stop(a)):a.keyCode===j.ENTER&&(this.contentAssist.opened?this.contentAssist.enter(a):this.model.setData({data:"\n"}),f.stop(a))}))},_onTextInput:function(a){var b=
this.contentAssist.show(a);null!=b&&(a=b);this.model.setData({data:a});var c=this.textarea;setTimeout(function(){c.value=""})}})});