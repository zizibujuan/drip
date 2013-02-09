//>>built
define("dijit/popup",["dojo/_base/array","dojo/aspect","dojo/_base/declare","dojo/dom","dojo/dom-attr","dojo/dom-construct","dojo/dom-geometry","dojo/dom-style","dojo/has","dojo/keys","dojo/_base/lang","dojo/on","./place","./BackgroundIframe","./main"],function(array,aspect,declare,dom,domAttr,domConstruct,domGeometry,domStyle,has,keys,lang,on,place,BackgroundIframe,dijit){function destroyWrapper(){this._popupWrapper&&(domConstruct.destroy(this._popupWrapper),delete this._popupWrapper)}var PopupManager=declare(null,{_stack:[],_beginZIndex:1e3,_idGen:1,_createWrapper:function(widget){var wrapper=widget._popupWrapper,node=widget.domNode;if(!wrapper){wrapper=domConstruct.create("div",{"class":"dijitPopup",style:{display:"none"},role:"region","aria-label":widget["aria-label"]||widget.label||widget.name||widget.id},widget.ownerDocumentBody),wrapper.appendChild(node);var s=node.style;s.display="",s.visibility="",s.position="",s.top="0px",widget._popupWrapper=wrapper,aspect.after(widget,"destroy",destroyWrapper,!0)}return wrapper},moveOffScreen:function(widget){var wrapper=this._createWrapper(widget);domStyle.set(wrapper,{visibility:"hidden",top:"-9999px",display:""})},hide:function(widget){var wrapper=this._createWrapper(widget);domStyle.set(wrapper,"display","none")},getTopPopup:function(){var stack=this._stack;for(var pi=stack.length-1;pi>0&&stack[pi].parent===stack[pi-1].widget;pi--);return stack[pi]},open:function(args){var stack=this._stack,widget=args.popup,orient=args.orient||["below","below-alt","above","above-alt"],ltr=args.parent?args.parent.isLeftToRight():domGeometry.isBodyLtr(widget.ownerDocument),around=args.around,id=args.around&&args.around.id?args.around.id+"_dropdown":"popup_"+this._idGen++;while(stack.length&&(!args.parent||!dom.isDescendant(args.parent.domNode,stack[stack.length-1].widget.domNode)))this.close(stack[stack.length-1].widget);var wrapper=this._createWrapper(widget);domAttr.set(wrapper,{id:id,style:{zIndex:this._beginZIndex+stack.length},"class":"dijitPopup "+(widget.baseClass||widget["class"]||"").split(" ")[0]+"Popup",dijitPopupParent:args.parent?args.parent.id:""}),has("config-bgIframe")&&!widget.bgIframe&&(widget.bgIframe=new BackgroundIframe(wrapper));var layoutFunc=widget.orient?lang.hitch(widget,"orient"):null,best=around?place.around(wrapper,around,orient,ltr,layoutFunc):place.at(wrapper,args,orient=="R"?["TR","BR","TL","BL"]:["TL","BL","TR","BR"],args.padding,layoutFunc);wrapper.style.display="",wrapper.style.visibility="visible",widget.domNode.style.visibility="visible";var handlers=[];return handlers.push(on(wrapper,"keydown",lang.hitch(this,function(evt){if(evt.keyCode==keys.ESCAPE&&args.onCancel)evt.stopPropagation(),evt.preventDefault(),args.onCancel();else if(evt.keyCode==keys.TAB){evt.stopPropagation(),evt.preventDefault();var topPopup=this.getTopPopup();topPopup&&topPopup.onCancel&&topPopup.onCancel()}}))),widget.onCancel&&args.onCancel&&handlers.push(widget.on("cancel",args.onCancel)),handlers.push(widget.on(widget.onExecute?"execute":"change",lang.hitch(this,function(){var topPopup=this.getTopPopup();topPopup&&topPopup.onExecute&&topPopup.onExecute()}))),stack.push({widget:widget,parent:args.parent,onExecute:args.onExecute,onCancel:args.onCancel,onClose:args.onClose,handlers:handlers}),widget.onOpen&&widget.onOpen(best),best},close:function(popup){var stack=this._stack;while(popup&&array.some(stack,function(elem){return elem.widget==popup})||!popup&&stack.length){var top=stack.pop(),widget=top.widget,onClose=top.onClose;widget.onClose&&widget.onClose();var h;while(h=top.handlers.pop())h.remove();widget&&widget.domNode&&this.hide(widget),onClose&&onClose()}}});return dijit.popup=new PopupManager})