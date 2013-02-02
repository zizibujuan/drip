//>>built
define("dijit/_editor/RichText","dojo/_base/array,dojo/_base/config,dojo/_base/declare,dojo/_base/Deferred,dojo/dom,dojo/dom-attr,dojo/dom-class,dojo/dom-construct,dojo/dom-geometry,dojo/dom-style,dojo/_base/kernel,dojo/keys,dojo/_base/lang,dojo/on,dojo/query,dojo/domReady,dojo/sniff,dojo/topic,dojo/_base/unload,dojo/_base/url,dojo/_base/window,../_Widget,../_CssStateMixin,./selection,./range,./html,../focus,../main".split(","),function(o,B,G,C,w,x,D,k,H,s,y,r,i,q,z,I,d,E,J,A,t,K,L,M,p,u,F,v){var m=
G("dijit._editor.RichText",[K,L],{constructor:function(a){this.contentPreFilters=[];this.contentPostFilters=[];this.contentDomPreFilters=[];this.contentDomPostFilters=[];this.editingAreaStyleSheets=[];this.events=[].concat(this.events);this._keyHandlers={};if(a&&i.isString(a.value))this.value=a.value;this.onLoadDeferred=new C},baseClass:"dijitEditor",inheritWidth:!1,focusOnLoad:!1,name:"",styleSheets:"",height:"300px",minHeight:"1em",isClosed:!0,isLoaded:!1,_SEPARATOR:"@@**%%__RICHTEXTBOUNDRY__%%**@@",
_NAME_CONTENT_SEP:"@@**%%:%%**@@",onLoadDeferred:null,isTabIndent:!1,disableSpellCheck:!1,postCreate:function(){this.domNode.tagName.toLowerCase();this.contentPreFilters=[i.hitch(this,"_preFixUrlAttributes")].concat(this.contentPreFilters);if(d("mozilla"))this.contentPreFilters=[this._normalizeFontStyle].concat(this.contentPreFilters),this.contentPostFilters=[this._removeMozBogus].concat(this.contentPostFilters);if(d("webkit"))this.contentPreFilters=[this._removeWebkitBogus].concat(this.contentPreFilters),
this.contentPostFilters=[this._removeWebkitBogus].concat(this.contentPostFilters);if(d("ie"))this.contentPostFilters=[this._normalizeFontStyle].concat(this.contentPostFilters),this.contentDomPostFilters=[i.hitch(this,this._stripBreakerNodes)].concat(this.contentDomPostFilters);this.inherited(arguments);E.publish(v._scopeName+"._editor.RichText::init",this);this.open();this.setupDefaultShortcuts()},setupDefaultShortcuts:function(){var a=i.hitch(this,function(a,b){return function(){return!this.execCommand(a,
b)}}),b={b:a("bold"),i:a("italic"),u:a("underline"),a:a("selectall"),s:function(){this.save(!0)},m:function(){this.isTabIndent=!this.isTabIndent},1:a("formatblock","h1"),2:a("formatblock","h2"),3:a("formatblock","h3"),4:a("formatblock","h4"),"\\":a("insertunorderedlist")};if(!d("ie"))b.Z=a("redo");for(var c in b)this.addKeyHandler(c,!0,!1,b[c])},events:["onKeyDown","onKeyUp"],captureEvents:[],_editorCommandsLocalized:!1,_localizeEditorCommands:function(){if(m._editorCommandsLocalized)this._local2NativeFormatNames=
m._local2NativeFormatNames,this._native2LocalFormatNames=m._native2LocalFormatNames;else{m._editorCommandsLocalized=!0;m._local2NativeFormatNames={};m._native2LocalFormatNames={};this._local2NativeFormatNames=m._local2NativeFormatNames;this._native2LocalFormatNames=m._native2LocalFormatNames;for(var a="div,p,pre,h1,h2,h3,h4,h5,h6,ol,ul,address".split(","),b="",c,f=0;c=a[f++];)b="l"!==c.charAt(1)?b+("<"+c+"><span>content</span></"+c+"><br/>"):b+("<"+c+"><li>content</li></"+c+"><br/>");var e=k.create("div",
{style:{position:"absolute",top:"0px",zIndex:10,opacity:0.01},innerHTML:b});this.ownerDocumentBody.appendChild(e);this.defer(i.hitch(this,function(){for(var a=e.firstChild;a;)try{this._sCall("selectElement",[a.firstChild]);var b=a.tagName.toLowerCase();this._local2NativeFormatNames[b]=document.queryCommandValue("formatblock");this._native2LocalFormatNames[this._local2NativeFormatNames[b]]=b;a=a.nextSibling.nextSibling}catch(c){}k.destroy(e)}))}},open:function(a){if(!this.onLoadDeferred||0<=this.onLoadDeferred.fired)this.onLoadDeferred=
new C;this.isClosed||this.close();E.publish(v._scopeName+"._editor.RichText::open",this);if(1===arguments.length&&a.nodeName)this.domNode=a;var b=this.domNode,c;if(i.isString(this.value))c=this.value,delete this.value,b.innerHTML="";else if(b.nodeName&&"textarea"==b.nodeName.toLowerCase()){var f=this.textarea=b;this.name=f.name;c=f.value;b=this.domNode=this.ownerDocument.createElement("div");b.setAttribute("widgetId",this.id);f.removeAttribute("widgetId");b.cssText=f.cssText;b.className+=" "+f.className;
k.place(b,f,"before");var e=i.hitch(this,function(){s.set(f,{display:"block",position:"absolute",top:"-1000px"});if(d("ie")){var a=f.style;this.__overflow=a.overflow;a.overflow="hidden"}});d("ie")?this.defer(e,10):e();if(f.form){var n=f.value;this.reset=function(){this.getValue()!==n&&this.replaceValue(n)};q(f.form,"submit",i.hitch(this,function(){x.set(f,"disabled",this.disabled);f.value=this.getValue()}))}}else c=u.getChildrenHtml(b),b.innerHTML="";this.value=c;if(b.nodeName&&"LI"===b.nodeName)b.innerHTML=
" <br>";this.header=b.ownerDocument.createElement("div");b.appendChild(this.header);this.editingArea=b.ownerDocument.createElement("div");b.appendChild(this.editingArea);this.footer=b.ownerDocument.createElement("div");b.appendChild(this.footer);if(!this.name)this.name=this.id+"_AUTOGEN";if(""!==this.name&&(!B.useXDomain||B.allowXdRichTextSave)){if((e=w.byId(v._scopeName+"._editor.RichText.value"))&&""!==e.value)for(var g=e.value.split(this._SEPARATOR),h=0,j;j=g[h++];)if(j=j.split(this._NAME_CONTENT_SEP),
j[0]===this.name){c=j[1];g=g.splice(h,1);e.value=g.join(this._SEPARATOR);break}if(!m._globalSaveHandler)m._globalSaveHandler={},J.addOnUnload(function(){for(var a in m._globalSaveHandler){var b=m._globalSaveHandler[a];i.isFunction(b)&&b()}});m._globalSaveHandler[this.id]=i.hitch(this,"_saveContent")}this.isClosed=!1;e=this.editorObject=this.iframe=this.ownerDocument.createElement("iframe");e.id=this.id+"_iframe";e.style.border="none";e.style.width="100%";if(this._layoutMode)e.style.height="100%";
else if(7<=d("ie")){if(this.height)e.style.height=this.height;if(this.minHeight)e.style.minHeight=this.minHeight}else e.style.height=this.height?this.height:this.minHeight;e.frameBorder=0;e._loadFunc=i.hitch(this,function(a){this.window=a;this.document=this.window.document;d("ie")&&this._localizeEditorCommands();this.onLoad(c)});g="javascript: '"+this._getIframeDocTxt().replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'";9<=d("ie")?(this.editingArea.appendChild(e),e.src=g):(e.setAttribute("src",g),this.editingArea.appendChild(e));
if("LI"===b.nodeName)b.lastChild.style.marginTop="-1.2em";D.add(this.domNode,this.baseClass)},_local2NativeFormatNames:{},_native2LocalFormatNames:{},_getIframeDocTxt:function(){var a=s.getComputedStyle(this.domNode),b="",c=!0;if(d("ie")||d("webkit")||!this.height&&!d("mozilla"))b="<div id='dijitEditorBody'></div>",c=!1;else if(d("mozilla"))this._cursorToStart=!0,b="&#160;";var f=[a.fontWeight,a.fontSize,a.fontFamily].join(" "),e=a.lineHeight,e=0<=e.indexOf("px")?parseFloat(e)/parseFloat(a.fontSize):
0<=e.indexOf("em")?parseFloat(e):"normal",n="",g=this;this.style.replace(/(^|;)\s*(line-|font-?)[^;]+/ig,function(a){var a=a.replace(/^;/ig,"")+";",b=a.split(":")[0];if(b){var b=i.trim(b),b=b.toLowerCase(),c,e="";for(c=0;c<b.length;c++){var f=b.charAt(c);switch(f){case "-":c++,f=b.charAt(c).toUpperCase();default:e+=f}}s.set(g.domNode,e,"")}n+=a+";"});var a=z('label[for="'+this.id+'"]'),h="";if(a.length)h=a[0].innerHTML;else if(this["aria-label"])h=this["aria-label"];else if(this["aria-labelledby"])h=
w.byId(this["aria-labelledby"]).innerHTML;this.iframe.setAttribute("title",h);return[this.isLeftToRight()?"<html lang='"+this.lang+"'>\n<head>\n":"<html dir='rtl' lang='"+this.lang+"'>\n<head>\n",h?"<title>"+h+"</title>":"","<meta http-equiv='Content-Type' content='text/html'>\n<style>\n\tbody,html {\n\t\tbackground:transparent;\n\t\tpadding: 1px 0 0 0;\n\t\tmargin: -1px 0 0 0;\n",d("webkit")?"\t\twidth: 100%;\n":"",d("webkit")?"\t\theight: 100%;\n":"","\t}\n\tbody{\n\t\ttop:0px;\n\t\tleft:0px;\n\t\tright:0px;\n\t\tfont:",
f,";\n",this.height||d("opera")?"":"\t\tposition: fixed;\n","\t\tmin-height:",this.minHeight,";\n\t\tline-height:",e,";\n\t}\n\tp{ margin: 1em 0; }\n",!c&&!this.height?"\tbody,html {overflow-y: hidden;}\n":"","\t#dijitEditorBody{overflow-x: auto; overflow-y:"+(this.height?"auto;":"hidden;")+" outline: 0px;}\n","\tli > ul:-moz-first-node, li > ol:-moz-first-node{ padding-top: 1.2em; }\n",!d("ie")?"\tli{ min-height:1.2em; }\n":"","</style>\n",this._applyEditingAreaStyleSheets(),"\n</head>\n<body role='main' ",
c?"id='dijitEditorBody' ":"","onload='frameElement && frameElement._loadFunc(window,document)' ","style='"+n+"'>",b,"</body>\n</html>"].join("")},_applyEditingAreaStyleSheets:function(){var a=[];if(this.styleSheets)a=this.styleSheets.split(";"),this.styleSheets="";a=a.concat(this.editingAreaStyleSheets);this.editingAreaStyleSheets=[];for(var b="",c=0,f;f=a[c++];)f=(new A(t.global.location,f)).toString(),this.editingAreaStyleSheets.push(f),b+='<link rel="stylesheet" type="text/css" href="'+f+'"/>';
return b},addStyleSheet:function(a){var b=a.toString();if("."===b.charAt(0)||"/"!==b.charAt(0)&&!a.host)b=(new A(t.global.location,b)).toString();-1<o.indexOf(this.editingAreaStyleSheets,b)||(this.editingAreaStyleSheets.push(b),this.onLoadDeferred.then(i.hitch(this,function(){if(this.document.createStyleSheet)this.document.createStyleSheet(b);else{var a=this.document.getElementsByTagName("head")[0],f=this.document.createElement("link");f.rel="stylesheet";f.type="text/css";f.href=b;a.appendChild(f)}})))},
removeStyleSheet:function(a){var b=a.toString();if("."===b.charAt(0)||"/"!==b.charAt(0)&&!a.host)b=(new A(t.global.location,b)).toString();a=o.indexOf(this.editingAreaStyleSheets,b);-1!==a&&(delete this.editingAreaStyleSheets[a],z('link:[href="'+b+'"]',this.window.document).orphan())},disabled:!1,_mozSettingProps:{styleWithCSS:!1},_setDisabledAttr:function(a){a=!!a;this._set("disabled",a);if(this.isLoaded){if(d("ie")||d("webkit")||d("opera")){var b=d("ie")&&(this.isLoaded||!this.focusOnLoad);if(b)this.editNode.unselectable=
"on";this.editNode.contentEditable=!a;b&&this.defer(function(){if(this.editNode)this.editNode.unselectable="off"})}else{try{this.document.designMode=a?"off":"on"}catch(c){return}if(!a&&this._mozSettingProps)for(b in a=this._mozSettingProps,a)if(a.hasOwnProperty(b))try{this.document.execCommand(b,!1,a[b])}catch(f){}}this._disabledOK=!0}},onLoad:function(a){if(!this.window.__registeredWindow)this.window.__registeredWindow=!0,this._iframeRegHandle=F.registerIframe(this.iframe);if(!d("ie")&&!d("webkit")&&
(this.height||d("mozilla")))this.editNode=this.document.body;else{this.editNode=this.document.body.firstChild;var b=this;if(d("ie"))this.tabStop=k.create("div",{tabIndex:-1},this.editingArea),this.iframe.onfocus=function(){b.editNode.setActive()}}this.focusNode=this.editNode;var c=this.events.concat(this.captureEvents),f=this.iframe?this.document:this.editNode;this.own(o.map(c,function(a){var b=a.toLowerCase().replace(/^on/,"");q(f,b,i.hitch(this,a))},this));this.own(q(f,"mouseup",i.hitch(this,"onClick")));
d("ie")?(this.own(q(this.document,"mousedown",i.hitch(this,"_onIEMouseDown"))),this.editNode.style.zoom=1):this.own(q(this.document,"mousedown",i.hitch(this,function(){delete this._cursorToStart})));if(d("webkit"))this._webkitListener=this.own(q(this.document,"mouseup",i.hitch(this,"onDisplayChanged")))[0],this.own(q(this.document,"mousedown",i.hitch(this,function(a){(a=a.target)&&(a===this.document.body||a===this.document)&&this.defer("placeCursorAtEnd")})));if(d("ie"))try{this.document.execCommand("RespectVisibilityInDesign",
!0,null)}catch(e){}this.isLoaded=!0;this.set("disabled",this.disabled);c=i.hitch(this,function(){this.setValue(a);this.onLoadDeferred&&this.onLoadDeferred.resolve(!0);this.onDisplayChanged();this.focusOnLoad&&I(i.hitch(this,"defer","focus",this.updateInterval));this.value=this.getValue(!0)});this.setValueDeferred?this.setValueDeferred.then(c):c()},onKeyDown:function(a){if(a.keyCode===r.TAB&&this.isTabIndent&&(a.stopPropagation(),a.preventDefault(),this.queryCommandEnabled(a.shiftKey?"outdent":"indent")))this.execCommand(a.shiftKey?
"outdent":"indent");d("ie")&&(a.keyCode==r.TAB&&!this.isTabIndent?a.shiftKey&&!a.ctrlKey&&!a.altKey?this.iframe.focus():!a.shiftKey&&!a.ctrlKey&&!a.altKey&&this.tabStop.focus():a.keyCode===r.BACKSPACE&&"Control"===this.document.selection.type&&(a.stopPropagation(),a.preventDefault(),this.execCommand("delete")));d("ff")&&(a.keyCode===r.PAGE_UP||a.keyCode===r.PAGE_DOWN)&&this.editNode.clientHeight>=this.editNode.scrollHeight&&a.preventDefault();var b=this._keyHandlers[a.keyCode],c=arguments;b&&!a.altKey&&
o.some(b,function(b){if(!(b.shift^a.shiftKey)&&!(b.ctrl^(a.ctrlKey||a.metaKey)))return b.handler.apply(this,c)||a.preventDefault(),!0},this);this.defer("onKeyPressed",1);return!0},onKeyUp:function(){},setDisabled:function(a){y.deprecated("dijit.Editor::setDisabled is deprecated",'use dijit.Editor::attr("disabled",boolean) instead',2);this.set("disabled",a)},_setValueAttr:function(a){this.setValue(a)},_setDisableSpellCheckAttr:function(a){this.document?x.set(this.document.body,"spellcheck",!a):this.onLoadDeferred.then(i.hitch(this,
function(){x.set(this.document.body,"spellcheck",!a)}));this._set("disableSpellCheck",a)},addKeyHandler:function(a,b,c,f){"string"==typeof a&&(a=a.toUpperCase().charCodeAt(0));i.isArray(this._keyHandlers[a])||(this._keyHandlers[a]=[]);this._keyHandlers[a].push({shift:c||!1,ctrl:b||!1,handler:f})},onKeyPressed:function(){this.onDisplayChanged()},onClick:function(a){this.onDisplayChanged(a)},_onIEMouseDown:function(){!this.focused&&!this.disabled&&this.focus()},_onBlur:function(a){this.inherited(arguments);
var b=this.getValue(!0);if(b!==this.value)this.onChange(b);this._set("value",b)},_onFocus:function(a){this.disabled||(this._disabledOK||this.set("disabled",!1),this.inherited(arguments))},blur:function(){!d("ie")&&this.window.document.documentElement&&this.window.document.documentElement.focus?this.window.document.documentElement.focus():this.ownerDocumentBody.focus&&this.ownerDocumentBody.focus()},focus:function(){if(this.isLoaded){if(this._cursorToStart&&(delete this._cursorToStart,this.editNode.childNodes)){this.placeCursorAtStart();
return}d("ie")?this.editNode&&this.editNode.focus&&this.iframe.fireEvent("onfocus",document.createEventObject()):F.focus(this.iframe)}else this.focusOnLoad=!0},updateInterval:200,_updateTimer:null,onDisplayChanged:function(){this._updateTimer&&this._updateTimer.remove();this._updateTimer=this.defer("onNormalizedDisplayChanged",this.updateInterval)},onNormalizedDisplayChanged:function(){delete this._updateTimer},onChange:function(){},_normalizeCommand:function(a,b){var c=a.toLowerCase();"formatblock"===
c?d("safari")&&void 0===b&&(c="heading"):"hilitecolor"===c&&!d("mozilla")&&(c="backcolor");return c},_qcaCache:{},queryCommandAvailable:function(a){var b=this._qcaCache[a];return void 0!==b?b:this._qcaCache[a]=this._queryCommandAvailable(a)},_queryCommandAvailable:function(a){function b(a){return{ie:Boolean(a&c),mozilla:Boolean(a&f),webkit:Boolean(a&e),opera:Boolean(a&n)}}var c=1,f=2,e=4,n=8,g=null;switch(a.toLowerCase()){case "bold":case "italic":case "underline":case "subscript":case "superscript":case "fontname":case "fontsize":case "forecolor":case "hilitecolor":case "justifycenter":case "justifyfull":case "justifyleft":case "justifyright":case "delete":case "selectall":case "toggledir":g=
b(f|c|e|n);break;case "createlink":case "unlink":case "removeformat":case "inserthorizontalrule":case "insertimage":case "insertorderedlist":case "insertunorderedlist":case "indent":case "outdent":case "formatblock":case "inserthtml":case "undo":case "redo":case "strikethrough":case "tabindent":g=b(f|c|n|e);break;case "blockdirltr":case "blockdirrtl":case "dirltr":case "dirrtl":case "inlinedirltr":case "inlinedirrtl":g=b(c);break;case "cut":case "copy":case "paste":g=b(c|f|e|n);break;case "inserttable":g=
b(f|c);break;case "insertcell":case "insertcol":case "insertrow":case "deletecells":case "deletecols":case "deleterows":case "mergecells":case "splitcell":g=b(c|f);break;default:return!1}return d("ie")&&g.ie||d("mozilla")&&g.mozilla||d("webkit")&&g.webkit||d("opera")&&g.opera},execCommand:function(a,b){var c;this.focus();a=this._normalizeCommand(a,b);if(void 0!==b){if("heading"===a)throw Error("unimplemented");"formatblock"===a&&d("ie")&&(b="<"+b+">")}var f="_"+a+"Impl";if(this[f])c=this[f](b);else if((b=
1<arguments.length?b:null)||"createlink"!==a)c=this.document.execCommand(a,!1,b);this.onDisplayChanged();return c},queryCommandEnabled:function(a){if(this.disabled||!this._disabledOK)return!1;var a=this._normalizeCommand(a),b="_"+a+"EnabledImpl";return this[b]?this[b](a):this._browserQueryCommandEnabled(a)},queryCommandState:function(a){if(this.disabled||!this._disabledOK)return!1;a=this._normalizeCommand(a);try{return this.document.queryCommandState(a)}catch(b){return!1}},queryCommandValue:function(a){if(this.disabled||
!this._disabledOK)return!1;a=this._normalizeCommand(a);if(d("ie")&&"formatblock"===a)a=this._native2LocalFormatNames[this.document.queryCommandValue(a)];else if(d("mozilla")&&"hilitecolor"===a){var b;try{b=this.document.queryCommandValue("styleWithCSS")}catch(c){b=!1}this.document.execCommand("styleWithCSS",!1,!0);a=this.document.queryCommandValue(a);this.document.execCommand("styleWithCSS",!1,b)}else a=this.document.queryCommandValue(a);return a},_sCall:function(a,b){return t.withGlobal(this.window,
a,M,b)},placeCursorAtStart:function(){this.focus();var a=!1;if(d("mozilla"))for(var b=this.editNode.firstChild;b;){if(3===b.nodeType){if(0<b.nodeValue.replace(/^\s+|\s+$/g,"").length){a=!0;this._sCall("selectElement",[b]);break}}else if(1===b.nodeType){a=!0;/br|input|img|base|meta|area|basefont|hr|link/.test(b.tagName?b.tagName.toLowerCase():"")?this._sCall("selectElement",[b]):this._sCall("selectElementChildren",[b]);break}b=b.nextSibling}else a=!0,this._sCall("selectElementChildren",[this.editNode]);
a&&this._sCall("collapse",[!0])},placeCursorAtEnd:function(){this.focus();var a=!1;if(d("mozilla"))for(var b=this.editNode.lastChild;b;){if(3===b.nodeType){if(0<b.nodeValue.replace(/^\s+|\s+$/g,"").length){a=!0;this._sCall("selectElement",[b]);break}}else if(1===b.nodeType){a=!0;this._sCall("selectElement",[b.lastChild||b]);break}b=b.previousSibling}else a=!0,this._sCall("selectElementChildren",[this.editNode]);a&&this._sCall("collapse",[!1])},getValue:function(a){return this.textarea&&(this.isClosed||
!this.isLoaded)?this.textarea.value:this._postFilterContent(null,a)},_getValueAttr:function(){return this.getValue(!0)},setValue:function(a){if(this.isLoaded){this._cursorToStart=!0;if(this.textarea&&(this.isClosed||!this.isLoaded))this.textarea.value=a;else{var a=this._preFilterContent(a),b=this.isClosed?this.domNode:this.editNode;a&&d("mozilla")&&"<p></p>"===a.toLowerCase()&&(a="<p>&#160;</p>");!a&&d("webkit")&&(a="&#160;");b.innerHTML=a;this._preDomFilterContent(b)}this.onDisplayChanged();this._set("value",
this.getValue(!0))}else this.onLoadDeferred.then(i.hitch(this,function(){this.setValue(a)}))},replaceValue:function(a){if(this.isClosed)this.setValue(a);else if(this.window&&this.window.getSelection&&!d("mozilla"))this.setValue(a);else if(this.window&&this.window.getSelection){a=this._preFilterContent(a);this.execCommand("selectall");if(!a)this._cursorToStart=!0,a="&#160;";this.execCommand("inserthtml",a);this._preDomFilterContent(this.editNode)}else this.document&&this.document.selection&&this.setValue(a);
this._set("value",this.getValue(!0))},_preFilterContent:function(a){var b=a;o.forEach(this.contentPreFilters,function(a){a&&(b=a(b))});return b},_preDomFilterContent:function(a){a=a||this.editNode;o.forEach(this.contentDomPreFilters,function(b){b&&i.isFunction(b)&&b(a)},this)},_postFilterContent:function(a,b){var c;i.isString(a)?c=a:(a=a||this.editNode,this.contentDomPostFilters.length&&(b&&(a=i.clone(a)),o.forEach(this.contentDomPostFilters,function(b){a=b(a)})),c=u.getChildrenHtml(a));i.trim(c.replace(/^\xA0\xA0*/,
"").replace(/\xA0\xA0*$/,"")).length||(c="");o.forEach(this.contentPostFilters,function(a){c=a(c)});return c},_saveContent:function(){var a=w.byId(v._scopeName+"._editor.RichText.value");a&&(a.value&&(a.value+=this._SEPARATOR),a.value+=this.name+this._NAME_CONTENT_SEP+this.getValue(!0))},escapeXml:function(a,b){a=a.replace(/&/gm,"&amp;").replace(/</gm,"&lt;").replace(/>/gm,"&gt;").replace(/"/gm,"&quot;");b||(a=a.replace(/'/gm,"&#39;"));return a},getNodeHtml:function(a){y.deprecated("dijit.Editor::getNodeHtml is deprecated",
"use dijit/_editor/html::getNodeHtml instead",2);return u.getNodeHtml(a)},getNodeChildrenHtml:function(a){y.deprecated("dijit.Editor::getNodeChildrenHtml is deprecated","use dijit/_editor/html::getChildrenHtml instead",2);return u.getChildrenHtml(a)},close:function(a){if(!this.isClosed){arguments.length||(a=!0);a&&this._set("value",this.getValue(!0));this.interval&&clearInterval(this.interval);this._webkitListener&&(this.disconnect(this._webkitListener),delete this._webkitListener);if(d("ie"))this.iframe.onfocus=
null;this.iframe._loadFunc=null;this._iframeRegHandle&&(this._iframeRegHandle.remove(),delete this._iframeRegHandle);if(this.textarea){var b=this.textarea.style;b.position="";b.left=b.top="";if(d("ie"))b.overflow=this.__overflow,this.__overflow=null;this.textarea.value=this.value;k.destroy(this.domNode);this.domNode=this.textarea}else this.domNode.innerHTML=this.value;delete this.iframe;D.remove(this.domNode,this.baseClass);this.isClosed=!0;this.isLoaded=!1;delete this.editNode;delete this.focusNode;
if(this.window&&this.window._frameElement)this.window._frameElement=null;this.editorObject=this.editingArea=this.document=this.window=null}},destroy:function(){this.isClosed||this.close(!1);this._updateTimer&&this._updateTimer.remove();this.inherited(arguments);m._globalSaveHandler&&delete m._globalSaveHandler[this.id]},_removeMozBogus:function(a){return a.replace(/\stype="_moz"/gi,"").replace(/\s_moz_dirty=""/gi,"").replace(/_moz_resizing="(true|false)"/gi,"")},_removeWebkitBogus:function(a){a=a.replace(/\sclass="webkit-block-placeholder"/gi,
"");a=a.replace(/\sclass="apple-style-span"/gi,"");return a=a.replace(/<meta charset=\"utf-8\" \/>/gi,"")},_normalizeFontStyle:function(a){return a.replace(/<(\/)?strong([ \>])/gi,"<$1b$2").replace(/<(\/)?em([ \>])/gi,"<$1i$2")},_preFixUrlAttributes:function(a){return a.replace(/(?:(<a(?=\s).*?\shref=)("|')(.*?)\2)|(?:(<a\s.*?href=)([^"'][^ >]+))/gi,"$1$4$2$3$5$2 _djrealurl=$2$3$5$2").replace(/(?:(<img(?=\s).*?\ssrc=)("|')(.*?)\2)|(?:(<img\s.*?src=)([^"'][^ >]+))/gi,"$1$4$2$3$5$2 _djrealurl=$2$3$5$2")},
_browserQueryCommandEnabled:function(a){if(!a)return!1;var b=d("ie")?this.document.selection.createRange():this.document;try{return b.queryCommandEnabled(a)}catch(c){return!1}},_createlinkEnabledImpl:function(){var a=!0;return a=d("opera")?this.window.getSelection().isCollapsed?!0:this.document.queryCommandEnabled("createlink"):this._browserQueryCommandEnabled("createlink")},_unlinkEnabledImpl:function(){var a=!0;return a=d("mozilla")||d("webkit")?this._sCall("hasAncestorElement",["a"]):this._browserQueryCommandEnabled("unlink")},
_inserttableEnabledImpl:function(){var a=!0;return a=d("mozilla")||d("webkit")?!0:this._browserQueryCommandEnabled("inserttable")},_cutEnabledImpl:function(){var a=!0;d("webkit")?((a=this.window.getSelection())&&(a=a.toString()),a=!!a):a=this._browserQueryCommandEnabled("cut");return a},_copyEnabledImpl:function(){var a=!0;d("webkit")?((a=this.window.getSelection())&&(a=a.toString()),a=!!a):a=this._browserQueryCommandEnabled("copy");return a},_pasteEnabledImpl:function(){var a=!0;return d("webkit")?
!0:a=this._browserQueryCommandEnabled("paste")},_inserthorizontalruleImpl:function(a){return d("ie")?this._inserthtmlImpl("<hr>"):this.document.execCommand("inserthorizontalrule",!1,a)},_unlinkImpl:function(a){return this.queryCommandEnabled("unlink")&&(d("mozilla")||d("webkit"))?(this._sCall("selectElement",[this._sCall("getAncestorElement",["a"])]),this.document.execCommand("unlink",!1,null)):this.document.execCommand("unlink",!1,a)},_hilitecolorImpl:function(a){var b;this._handleTextColorOrProperties("hilitecolor",
a)||(d("mozilla")?(this.document.execCommand("styleWithCSS",!1,!0),b=this.document.execCommand("hilitecolor",!1,a),this.document.execCommand("styleWithCSS",!1,!1)):b=this.document.execCommand("hilitecolor",!1,a));return b},_backcolorImpl:function(a){d("ie")&&(a=a?a:null);var b=this._handleTextColorOrProperties("backcolor",a);b||(b=this.document.execCommand("backcolor",!1,a));return b},_forecolorImpl:function(a){d("ie")&&(a=a?a:null);var b=!1;(b=this._handleTextColorOrProperties("forecolor",a))||(b=
this.document.execCommand("forecolor",!1,a));return b},_inserthtmlImpl:function(a){var a=this._preFilterContent(a),b=!0;if(d("ie")){var c=this.document.selection.createRange();if("CONTROL"===this.document.selection.type.toUpperCase()){for(var f=c.item(0);c.length;)c.remove(c.item(0));f.outerHTML=a}else c.pasteHTML(a);c.select()}else d("mozilla")&&!a.length?this._sCall("remove"):b=this.document.execCommand("inserthtml",!1,a);return b},_boldImpl:function(a){var b=!1;d("ie")&&(this._adaptIESelection(),
b=this._adaptIEFormatAreaAndExec("bold"));b||(b=this.document.execCommand("bold",!1,a));return b},_italicImpl:function(a){var b=!1;d("ie")&&(this._adaptIESelection(),b=this._adaptIEFormatAreaAndExec("italic"));b||(b=this.document.execCommand("italic",!1,a));return b},_underlineImpl:function(a){var b=!1;d("ie")&&(this._adaptIESelection(),b=this._adaptIEFormatAreaAndExec("underline"));b||(b=this.document.execCommand("underline",!1,a));return b},_strikethroughImpl:function(a){var b=!1;d("ie")&&(this._adaptIESelection(),
b=this._adaptIEFormatAreaAndExec("strikethrough"));b||(b=this.document.execCommand("strikethrough",!1,a));return b},_superscriptImpl:function(a){var b=!1;d("ie")&&(this._adaptIESelection(),b=this._adaptIEFormatAreaAndExec("superscript"));b||(b=this.document.execCommand("superscript",!1,a));return b},_subscriptImpl:function(a){var b=!1;d("ie")&&(this._adaptIESelection(),b=this._adaptIEFormatAreaAndExec("subscript"));b||(b=this.document.execCommand("subscript",!1,a));return b},_fontnameImpl:function(a){var b;
d("ie")&&(b=this._handleTextColorOrProperties("fontname",a));b||(b=this.document.execCommand("fontname",!1,a));return b},_fontsizeImpl:function(a){var b;d("ie")&&(b=this._handleTextColorOrProperties("fontsize",a));b||(b=this.document.execCommand("fontsize",!1,a));return b},_insertorderedlistImpl:function(a){var b=!1;d("ie")&&(b=this._adaptIEList("insertorderedlist",a));b||(b=this.document.execCommand("insertorderedlist",!1,a));return b},_insertunorderedlistImpl:function(a){var b=!1;d("ie")&&(b=this._adaptIEList("insertunorderedlist",
a));b||(b=this.document.execCommand("insertunorderedlist",!1,a));return b},getHeaderHeight:function(){return this._getNodeChildrenHeight(this.header)},getFooterHeight:function(){return this._getNodeChildrenHeight(this.footer)},_getNodeChildrenHeight:function(a){var b=0;if(a&&a.childNodes){var c;for(c=0;c<a.childNodes.length;c++)var f=H.position(a.childNodes[c]),b=b+f.h}return b},_isNodeEmpty:function(a,b){return 1===a.nodeType?0<a.childNodes.length?this._isNodeEmpty(a.childNodes[0],b):!0:3===a.nodeType?
""===a.nodeValue.substring(b):!1},_removeStartingRangeFromRange:function(a,b){if(a.nextSibling)b.setStart(a.nextSibling,0);else{for(var c=a.parentNode;c&&null==c.nextSibling;)c=c.parentNode;c&&b.setStart(c.nextSibling,0)}return b},_adaptIESelection:function(){var a=p.getSelection(this.window);if(a&&a.rangeCount&&!a.isCollapsed){for(var b=a.getRangeAt(0),c=b.startContainer,f=b.startOffset;3===c.nodeType&&f>=c.length&&c.nextSibling;)f-=c.length,c=c.nextSibling;for(var e=null;this._isNodeEmpty(c,f)&&
c!==e;)e=c,b=this._removeStartingRangeFromRange(c,b),c=b.startContainer,f=0;a.removeAllRanges();a.addRange(b)}},_adaptIEFormatAreaAndExec:function(a){var b=p.getSelection(this.window),c=this.document,f,e,d,g,h,j,l;if(a&&b&&b.isCollapsed){if(this.queryCommandValue(a)){a=this._tagNamesForCommand(a);d=b.getRangeAt(0);g=d.startContainer;if(3===g.nodeType&&(e=d.endOffset,g.length<e))e=this._adjustNodeAndOffset(f,e),g=e.node;for(;g&&g!==this.editNode;){f=g.tagName?g.tagName.toLowerCase():"";if(-1<o.indexOf(a,
f)){l=g;break}g=g.parentNode}if(l&&(f=d.startContainer,a=c.createElement(l.tagName),k.place(a,l,"after"),f&&3===f.nodeType)){e=d.endOffset;if(f.length<e)e=this._adjustNodeAndOffset(f,e),f=e.node,e=e.offset;g=f.nodeValue;d=c.createTextNode(g.substring(0,e));var i=g.substring(e,g.length);i&&(h=c.createTextNode(i));k.place(d,f,"before");if(h)j=c.createElement("span"),j.className="ieFormatBreakerSpan",k.place(j,f,"after"),k.place(h,j,"after"),h=j;k.destroy(f);d=d.parentNode;for(f=[];d!==l;){g=d.tagName;
e={tagName:g};f.push(e);g=c.createElement(g);if(d.style&&g.style&&d.style.cssText)g.style.cssText=d.style.cssText,e.cssText=d.style.cssText;if("FONT"===d.tagName){if(d.color)g.color=d.color,e.color=d.color;if(d.face)g.face=d.face,e.face=d.face;if(d.size)g.size=d.size,e.size=d.size}if(d.className)g.className=d.className,e.className=d.className;if(h)for(;h;)e=h.nextSibling,g.appendChild(h),h=e;g.tagName==d.tagName?(j=c.createElement("span"),j.className="ieFormatBreakerSpan",k.place(j,d,"after"),k.place(g,
j,"after")):k.place(g,d,"after");h=g;d=d.parentNode}if(h){if(1===h.nodeType||3===h.nodeType&&h.nodeValue)a.innerHTML="";for(;h;)e=h.nextSibling,a.appendChild(h),h=e}if(f.length){e=f.pop();h=c.createElement(e.tagName);if(e.cssText&&h.style)h.style.cssText=e.cssText;if(e.className)h.className=e.className;if("FONT"===e.tagName){if(e.color)h.color=e.color;if(e.face)h.face=e.face;if(e.size)h.size=e.size}for(k.place(h,a,"before");f.length;){e=f.pop();l=c.createElement(e.tagName);if(e.cssText&&l.style)l.style.cssText=
e.cssText;if(e.className)l.className=e.className;if("FONT"===e.tagName){if(e.color)l.color=e.color;if(e.face)l.face=e.face;if(e.size)l.size=e.size}h.appendChild(l);h=l}l=c.createTextNode(".");j.appendChild(l);h.appendChild(l)}else j=c.createElement("span"),j.className="ieFormatBreakerSpan",l=c.createTextNode("."),j.appendChild(l),k.place(j,a,"before");h=p.create(this.window);h.setStart(l,0);h.setEnd(l,l.length);b.removeAllRanges();b.addRange(h);this._sCall("collapse",[!1]);l.parentNode.innerHTML=
"";a.firstChild||k.destroy(a);return!0}return!1}d=b.getRangeAt(0);if((f=d.startContainer)&&3===f.nodeType){e=d.startOffset;if(f.length<e)e=this._adjustNodeAndOffset(f,e),f=e.node,e=e.offset;g=f.nodeValue;d=c.createTextNode(g.substring(0,e));i=g.substring(e);""!==i&&(h=c.createTextNode(g.substring(e)));j=c.createElement("span");l=c.createTextNode(".");j.appendChild(l);d.length?k.place(d,f,"after"):d=f;k.place(j,d,"after");h&&k.place(h,j,"after");k.destroy(f);h=p.create(this.window);h.setStart(l,0);
h.setEnd(l,l.length);b.removeAllRanges();b.addRange(h);c.execCommand(a);k.place(j.firstChild,j,"before");k.destroy(j);h.setStart(l,0);h.setEnd(l,l.length);b.removeAllRanges();b.addRange(h);this._sCall("collapse",[!1]);l.parentNode.innerHTML="";return!0}}else return!1},_adaptIEList:function(a){var b=p.getSelection(this.window);if(b.isCollapsed&&b.rangeCount&&!this.queryCommandValue(a)){var c=b.getRangeAt(0),d=c.startContainer;if(d&&3==d.nodeType&&!c.startOffset)return c="ul","insertorderedlist"===
a&&(c="ol"),a=this.document.createElement(c),c=k.create("li",null,a),k.place(a,d,"before"),c.appendChild(d),k.create("br",null,a,"after"),a=p.create(this.window),a.setStart(d,0),a.setEnd(d,d.length),b.removeAllRanges(),b.addRange(a),this._sCall("collapse",[!0]),!0}return!1},_handleTextColorOrProperties:function(a,b){var c=p.getSelection(this.window),f=this.document,e,i,g,h,j,b=b||null;if(a&&c&&c.isCollapsed&&c.rangeCount&&(i=c.getRangeAt(0),(e=i.startContainer)&&3===e.nodeType)){j=i.startOffset;if(e.length<
j)i=this._adjustNodeAndOffset(e,j),e=i.node,j=i.offset;g=e.nodeValue;i=f.createTextNode(g.substring(0,j));""!==g.substring(j)&&(h=f.createTextNode(g.substring(j)));g=f.createElement("span");j=f.createTextNode(".");g.appendChild(j);f=f.createElement("span");g.appendChild(f);i.length?k.place(i,e,"after"):i=e;k.place(g,i,"after");h&&k.place(h,g,"after");k.destroy(e);e=p.create(this.window);e.setStart(j,0);e.setEnd(j,j.length);c.removeAllRanges();c.addRange(e);if(d("webkit")){c="color";if("hilitecolor"===
a||"backcolor"===a)c="backgroundColor";s.set(g,c,b);this._sCall("remove",[]);k.destroy(f);g.innerHTML="&#160;";this._sCall("selectElement",[g]);this.focus()}else this.execCommand(a,b),k.place(g.firstChild,g,"before"),k.destroy(g),e.setStart(j,0),e.setEnd(j,j.length),c.removeAllRanges(),c.addRange(e),this._sCall("collapse",[!1]),j.parentNode.removeChild(j);return!0}return!1},_adjustNodeAndOffset:function(a,b){for(;a.length<b&&a.nextSibling&&3===a.nextSibling.nodeType;)b-=a.length,a=a.nextSibling;return{node:a,
offset:b}},_tagNamesForCommand:function(a){return"bold"===a?["b","strong"]:"italic"===a?["i","em"]:"strikethrough"===a?["s","strike"]:"superscript"===a?["sup"]:"subscript"===a?["sub"]:"underline"===a?["u"]:[]},_stripBreakerNodes:function(a){if(this.isLoaded)return z(".ieFormatBreakerSpan",a).forEach(function(a){for(;a.firstChild;)k.place(a.firstChild,a,"before");k.destroy(a)}),a}});return m});