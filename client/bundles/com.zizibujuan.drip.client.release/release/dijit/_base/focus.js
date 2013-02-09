//>>built
define("dijit/_base/focus",["dojo/_base/array","dojo/dom","dojo/_base/lang","dojo/topic","dojo/_base/window","../focus","../main"],function(array,dom,lang,topic,win,focus,dijit){var exports={_curFocus:null,_prevFocus:null,isCollapsed:function(){return dijit.getBookmark().isCollapsed},getBookmark:function(){var bm,rg,tg,sel=win.doc.selection,cf=focus.curNode;if(win.global.getSelection){sel=win.global.getSelection();if(sel)if(sel.isCollapsed){tg=cf?cf.tagName:"";if(tg){tg=tg.toLowerCase();if(tg=="textarea"||tg=="input"&&(!cf.type||cf.type.toLowerCase()=="text"))return sel={start:cf.selectionStart,end:cf.selectionEnd,node:cf,pRange:!0},{isCollapsed:sel.end<=sel.start,mark:sel}}bm={isCollapsed:!0},sel.rangeCount&&(bm.mark=sel.getRangeAt(0).cloneRange())}else rg=sel.getRangeAt(0),bm={isCollapsed:!1,mark:rg.cloneRange()}}else if(sel){tg=cf?cf.tagName:"",tg=tg.toLowerCase();if(cf&&tg&&(tg=="button"||tg=="textarea"||tg=="input"))return sel.type&&sel.type.toLowerCase()=="none"?{isCollapsed:!0,mark:null}:(rg=sel.createRange(),{isCollapsed:rg.text&&rg.text.length?!1:!0,mark:{range:rg,pRange:!0}});bm={};try{rg=sel.createRange(),bm.isCollapsed=sel.type=="Text"?!rg.htmlText.length:!rg.length}catch(e){return bm.isCollapsed=!0,bm}if(sel.type.toUpperCase()=="CONTROL")if(rg.length){bm.mark=[];var i=0,len=rg.length;while(i<len)bm.mark.push(rg.item(i++))}else bm.isCollapsed=!0,bm.mark=null;else bm.mark=rg.getBookmark()}else 0;return bm},moveToBookmark:function(bookmark){var _doc=win.doc,mark=bookmark.mark;if(mark)if(win.global.getSelection){var sel=win.global.getSelection();if(sel&&sel.removeAllRanges)if(mark.pRange){var n=mark.node;n.selectionStart=mark.start,n.selectionEnd=mark.end}else sel.removeAllRanges(),sel.addRange(mark);else 0}else if(_doc.selection&&mark){var rg;mark.pRange?rg=mark.range:lang.isArray(mark)?(rg=_doc.body.createControlRange(),array.forEach(mark,function(n){rg.addElement(n)})):(rg=_doc.body.createTextRange(),rg.moveToBookmark(mark)),rg.select()}},getFocus:function(menu,openedForWindow){var node=!focus.curNode||menu&&dom.isDescendant(focus.curNode,menu.domNode)?dijit._prevFocus:focus.curNode;return{node:node,bookmark:node&&node==focus.curNode&&win.withGlobal(openedForWindow||win.global,dijit.getBookmark),openedForWindow:openedForWindow}},_activeStack:[],registerIframe:function(iframe){return focus.registerIframe(iframe)},unregisterIframe:function(handle){handle&&handle.remove()},registerWin:function(targetWindow,effectiveNode){return focus.registerWin(targetWindow,effectiveNode)},unregisterWin:function(handle){handle&&handle.remove()}};return focus.focus=function(handle){if(!handle)return;var node="node"in handle?handle.node:handle,bookmark=handle.bookmark,openedForWindow=handle.openedForWindow,collapsed=bookmark?bookmark.isCollapsed:!1;if(node){var focusNode=node.tagName.toLowerCase()=="iframe"?node.contentWindow:node;if(focusNode&&focusNode.focus)try{focusNode.focus()}catch(e){}focus._onFocusNode(node)}if(bookmark&&win.withGlobal(openedForWindow||win.global,dijit.isCollapsed)&&!collapsed){openedForWindow&&openedForWindow.focus();try{win.withGlobal(openedForWindow||win.global,dijit.moveToBookmark,null,[bookmark])}catch(e2){}}},focus.watch("curNode",function(name,oldVal,newVal){dijit._curFocus=newVal,dijit._prevFocus=oldVal,newVal&&topic.publish("focusNode",newVal)}),focus.watch("activeStack",function(name,oldVal,newVal){dijit._activeStack=newVal}),focus.on("widget-blur",function(widget,by){topic.publish("widgetBlur",widget,by)}),focus.on("widget-focus",function(widget,by){topic.publish("widgetFocus",widget,by)}),lang.mixin(dijit,exports),dijit})