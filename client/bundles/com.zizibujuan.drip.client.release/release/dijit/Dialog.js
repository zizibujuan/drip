//>>built
require({cache:{"url:dijit/templates/Dialog.html":'<div class="dijitDialog" role="dialog" aria-labelledby="${id}_title">\n	<div data-dojo-attach-point="titleBar" class="dijitDialogTitleBar">\n		<span data-dojo-attach-point="titleNode" class="dijitDialogTitle" id="${id}_title"\n				role="heading" level="1"></span>\n		<span data-dojo-attach-point="closeButtonNode" class="dijitDialogCloseIcon" data-dojo-attach-event="ondijitclick: onCancel" title="${buttonCancel}" role="button" tabIndex="-1">\n			<span data-dojo-attach-point="closeText" class="closeText" title="${buttonCancel}">x</span>\n		</span>\n	</div>\n	<div data-dojo-attach-point="containerNode" class="dijitDialogPaneContent"></div>\n</div>\n'}}),define("dijit/Dialog",["require","dojo/_base/array","dojo/aspect","dojo/_base/declare","dojo/Deferred","dojo/dom","dojo/dom-class","dojo/dom-geometry","dojo/dom-style","dojo/_base/fx","dojo/i18n","dojo/keys","dojo/_base/lang","dojo/on","dojo/ready","dojo/sniff","dojo/window","dojo/dnd/Moveable","dojo/dnd/TimedMoveable","./focus","./_base/manager","./_Widget","./_TemplatedMixin","./_CssStateMixin","./form/_FormMixin","./_DialogMixin","./DialogUnderlay","./layout/ContentPane","dojo/text!./templates/Dialog.html","dojo/i18n!./nls/common"],function(require,array,aspect,declare,Deferred,dom,domClass,domGeometry,domStyle,fx,i18n,keys,lang,on,ready,has,winUtils,Moveable,TimedMoveable,focus,manager,_Widget,_TemplatedMixin,_CssStateMixin,_FormMixin,_DialogMixin,DialogUnderlay,ContentPane,template){var _DialogBase=declare("dijit._DialogBase"+(has("dojo-bidi")?"_NoBidi":""),[_TemplatedMixin,_FormMixin,_DialogMixin,_CssStateMixin],{templateString:template,baseClass:"dijitDialog",cssStateNodes:{closeButtonNode:"dijitDialogCloseIcon"},_setTitleAttr:{node:"titleNode",type:"innerHTML"},open:!1,duration:manager.defaultDuration,refocus:!0,autofocus:!0,_firstFocusItem:null,_lastFocusItem:null,doLayout:!1,draggable:!0,_setDraggableAttr:function(val){this._set("draggable",val)},"aria-describedby":"",maxRatio:.9,postMixInProperties:function(){var _nlsResources=i18n.getLocalization("dijit","common");lang.mixin(this,_nlsResources),this.inherited(arguments)},postCreate:function(){domStyle.set(this.domNode,{display:"none",position:"absolute"}),this.ownerDocumentBody.appendChild(this.domNode),this.inherited(arguments),aspect.after(this,"onExecute",lang.hitch(this,"hide"),!0),aspect.after(this,"onCancel",lang.hitch(this,"hide"),!0),this._modalconnects=[]},onLoad:function(){this._position(),this.autofocus&&DialogLevelManager.isTop(this)&&(this._getFocusItems(this.domNode),focus.focus(this._firstFocusItem)),this.inherited(arguments)},focus:function(){this._getFocusItems(this.domNode),focus.focus(this._firstFocusItem)},_endDrag:function(){var nodePosition=domGeometry.position(this.domNode),viewport=winUtils.getBox(this.ownerDocument);nodePosition.y=Math.min(Math.max(nodePosition.y,0),viewport.h-nodePosition.h),nodePosition.x=Math.min(Math.max(nodePosition.x,0),viewport.w-nodePosition.w),this._relativePosition=nodePosition,this._position()},_setup:function(){var node=this.domNode;this.titleBar&&this.draggable?(this._moveable=new(has("ie")==6?TimedMoveable:Moveable)(node,{handle:this.titleBar}),aspect.after(this._moveable,"onMoveStop",lang.hitch(this,"_endDrag"),!0)):domClass.add(node,"dijitDialogFixed"),this.underlayAttrs={dialogId:this.id,"class":array.map(this["class"].split(/\s/),function(s){return s+"_underlay"}).join(" "),ownerDocument:this.ownerDocument}},_size:function(){this._checkIfSingleChild(),this._singleChild?typeof this._singleChildOriginalStyle!="undefined"&&(this._singleChild.domNode.style.cssText=this._singleChildOriginalStyle,delete this._singleChildOriginalStyle):domStyle.set(this.containerNode,{width:"auto",height:"auto"});var bb=domGeometry.position(this.domNode),viewport=winUtils.getBox(this.ownerDocument);viewport.w*=this.maxRatio,viewport.h*=this.maxRatio;if(bb.w>=viewport.w||bb.h>=viewport.h){var containerSize=domGeometry.position(this.containerNode),w=Math.min(bb.w,viewport.w)-(bb.w-containerSize.w),h=Math.min(bb.h,viewport.h)-(bb.h-containerSize.h);this._singleChild&&this._singleChild.resize?(typeof this._singleChildOriginalStyle=="undefined"&&(this._singleChildOriginalStyle=this._singleChild.domNode.style.cssText),this._singleChild.resize({w:w,h:h})):domStyle.set(this.containerNode,{width:w+"px",height:h+"px",overflow:"auto",position:"relative"})}else this._singleChild&&this._singleChild.resize&&this._singleChild.resize()},_position:function(){if(!domClass.contains(this.ownerDocumentBody,"dojoMove")){var node=this.domNode,viewport=winUtils.getBox(this.ownerDocument),p=this._relativePosition,bb=p?null:domGeometry.position(node),l=Math.floor(viewport.l+(p?p.x:(viewport.w-bb.w)/2)),t=Math.floor(viewport.t+(p?p.y:(viewport.h-bb.h)/2));domStyle.set(node,{left:l+"px",top:t+"px"})}},_onKey:function(evt){if(evt.keyCode==keys.TAB){this._getFocusItems(this.domNode);var node=evt.target;this._firstFocusItem==this._lastFocusItem?(evt.stopPropagation(),evt.preventDefault()):node==this._firstFocusItem&&evt.shiftKey?(focus.focus(this._lastFocusItem),evt.stopPropagation(),evt.preventDefault()):node==this._lastFocusItem&&!evt.shiftKey&&(focus.focus(this._firstFocusItem),evt.stopPropagation(),evt.preventDefault())}else evt.keyCode==keys.ESCAPE&&(this.onCancel(),evt.stopPropagation(),evt.preventDefault())},show:function(){if(this.open)return;this._started||this.startup(),this._alreadyInitialized||(this._setup(),this._alreadyInitialized=!0),this._fadeOutDeferred&&(this._fadeOutDeferred.cancel(),DialogLevelManager.hide(this));var win=winUtils.get(this.ownerDocument);this._modalconnects.push(on(win,"scroll",lang.hitch(this,"resize"))),this._modalconnects.push(on(this.domNode,"keydown",lang.hitch(this,"_onKey"))),domStyle.set(this.domNode,{opacity:0,display:""}),this._set("open",!0),this._onShow(),this._size(),this._position();var fadeIn;return this._fadeInDeferred=new Deferred(lang.hitch(this,function(){fadeIn.stop(),delete this._fadeInDeferred})),fadeIn=fx.fadeIn({node:this.domNode,duration:this.duration,beforeBegin:lang.hitch(this,function(){DialogLevelManager.show(this,this.underlayAttrs)}),onEnd:lang.hitch(this,function(){this.autofocus&&DialogLevelManager.isTop(this)&&(this._getFocusItems(this.domNode),focus.focus(this._firstFocusItem)),this._fadeInDeferred.resolve(!0),delete this._fadeInDeferred})}).play(),this._fadeInDeferred.promise},hide:function(){if(!this._alreadyInitialized||!this.open)return;this._fadeInDeferred&&this._fadeInDeferred.cancel();var fadeOut;this._fadeOutDeferred=new Deferred(lang.hitch(this,function(){fadeOut.stop(),delete this._fadeOutDeferred})),this._fadeOutDeferred.then(lang.hitch(this,"onHide")),fadeOut=fx.fadeOut({node:this.domNode,duration:this.duration,onEnd:lang.hitch(this,function(){this.domNode.style.display="none",DialogLevelManager.hide(this),this._fadeOutDeferred.resolve(!0),delete this._fadeOutDeferred})}).play(),this._scrollConnected&&(this._scrollConnected=!1);var h;while(h=this._modalconnects.pop())h.remove();return this._relativePosition&&delete this._relativePosition,this._set("open",!1),this._fadeOutDeferred.promise},resize:function(){this.domNode.style.display!="none"&&(this._size(),has("touch")||this._position())},destroy:function(){this._fadeInDeferred&&this._fadeInDeferred.cancel(),this._fadeOutDeferred&&this._fadeOutDeferred.cancel(),this._moveable&&this._moveable.destroy();var h;while(h=this._modalconnects.pop())h.remove();DialogLevelManager.hide(this),this.inherited(arguments)}});has("dojo-bidi")&&(_DialogBase=declare("dijit._DialogBase",_DialogBase,{_setTitleAttr:function(title){this._set("title",title),this.titleNode.innerHTML=title,this.applyTextDir(this.titleNode)},_setTextDirAttr:function(textDir){this._created&&this.textDir!=textDir&&(this._set("textDir",textDir),this.set("title",this.title))}}));var Dialog=declare("dijit.Dialog",[ContentPane,_DialogBase],{});Dialog._DialogBase=_DialogBase;var DialogLevelManager=Dialog._DialogLevelManager={_beginZIndex:950,show:function(dialog,underlayAttrs){ds[ds.length-1].focus=focus.curNode;var zIndex=ds[ds.length-1].dialog?ds[ds.length-1].zIndex+2:Dialog._DialogLevelManager._beginZIndex;domStyle.set(dialog.domNode,"zIndex",zIndex),DialogUnderlay.show(underlayAttrs,zIndex-1,lang.hitch(dialog,"focus")),ds.push({dialog:dialog,underlayAttrs:underlayAttrs,zIndex:zIndex})},hide:function(dialog){if(ds[ds.length-1].dialog==dialog){ds.pop();var pd=ds[ds.length-1];ds.length==1?DialogUnderlay.hide():DialogUnderlay.show(pd.underlayAttrs,pd.zIndex-1,lang.hitch(pd.dialog,"focus"));if(dialog.refocus){var focus=pd.focus;pd.dialog&&(!focus||!dom.isDescendant(focus,pd.dialog.domNode))&&(pd.dialog._getFocusItems(pd.dialog.domNode),focus=pd.dialog._firstFocusItem);if(focus)try{focus.focus()}catch(e){}}}else{var idx=array.indexOf(array.map(ds,function(elem){return elem.dialog}),dialog);idx!=-1&&ds.splice(idx,1)}},isTop:function(dialog){return ds[ds.length-1].dialog==dialog}},ds=Dialog._dialogStack=[{dialog:null,focus:null,underlayAttrs:null}];return has("dijit-legacy-requires")&&ready(0,function(){var requires=["dijit/TooltipDialog"];require(requires)}),Dialog})