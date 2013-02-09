//>>built
define("dojox/mobile/_ItemBase",["dojo/_base/array","dojo/_base/declare","dojo/_base/lang","dojo/_base/window","dojo/dom-class","dojo/touch","dijit/registry","dijit/_Contained","dijit/_Container","dijit/_WidgetBase","./TransitionEvent","./iconUtils","./sniff","dojo/has!dojo-bidi?dojox/mobile/bidi/_ItemBase"],function(array,declare,lang,win,domClass,touch,registry,Contained,Container,WidgetBase,TransitionEvent,iconUtils,has,BidiItemBase){var _ItemBase=declare(has("dojo-bidi")?"dojox.mobile._NonBidiItemBase":"dojox.mobile._ItemBase",[WidgetBase,Container,Contained],{icon:"",iconPos:"",alt:"",href:"",hrefTarget:"",moveTo:"",scene:"",clickable:!1,url:"",urlTarget:"",back:!1,transition:"",transitionDir:1,transitionOptions:null,callback:null,label:"",toggle:!1,selected:!1,tabIndex:"0",_setTabIndexAttr:"",paramsToInherit:"transition,icon",_selStartMethod:"none",_selEndMethod:"none",_delayedSelection:!1,_duration:800,_handleClick:!0,buildRendering:function(){this.inherited(arguments),this._isOnLine=this.inheritParams()},startup:function(){if(this._started)return;this._isOnLine||this.inheritParams(),this._handleClick&&this._selStartMethod==="touch"&&(this._onTouchStartHandle=this.connect(this.domNode,touch.press,"_onTouchStart")),this.inherited(arguments)},inheritParams:function(){var parent=this.getParent();return parent&&array.forEach(this.paramsToInherit.split(/,/),function(p){if(p.match(/icon/i)){var base=p+"Base",pos=p+"Pos";this[p]&&parent[base]&&parent[base].charAt(parent[base].length-1)==="/"&&(this[p]=parent[base]+this[p]),this[p]||(this[p]=parent[base]),this[pos]||(this[pos]=parent[pos])}this[p]||(this[p]=parent[p])},this),!!parent},getTransOpts:function(){var opts=this.transitionOptions||{};return array.forEach(["moveTo","href","hrefTarget","url","target","urlTarget","scene","transition","transitionDir"],function(p){opts[p]=opts[p]||this[p]},this),opts},userClickAction:function(){},defaultClickAction:function(e){this.handleSelection(e);if(this.userClickAction(e)===!1)return;this.makeTransition(e)},handleSelection:function(e){this._delayedSelection&&this.set("selected",!0),this._onTouchEndHandle&&(this.disconnect(this._onTouchEndHandle),this._onTouchEndHandle=null);var p=this.getParent();if(this.toggle)this.set("selected",!this._currentSel);else if(p&&p.selectOne)this.set("selected",!0);else if(this._selEndMethod==="touch")this.set("selected",!1);else if(this._selEndMethod==="timer"){var _this=this;this.defer(function(){_this.set("selected",!1)},this._duration)}},makeTransition:function(e){if(this.back&&history){history.back();return}if(this.href&&this.hrefTarget){win.global.open(this.href,this.hrefTarget||"_blank"),this._onNewWindowOpened(e);return}var opts=this.getTransOpts(),doTransition=!!(opts.moveTo||opts.href||opts.url||opts.target||opts.scene);if(this._prepareForTransition(e,doTransition?opts:null)===!1)return;doTransition&&(this.setTransitionPos(e),(new TransitionEvent(this.domNode,opts,e)).dispatch())},_onNewWindowOpened:function(){},_prepareForTransition:function(e,transOpts){},_onTouchStart:function(e){if(this.getParent().isEditing||this.onTouchStart(e)===!1)return;!this._onTouchEndHandle&&this._selStartMethod==="touch"&&(this._onTouchMoveHandle=this.connect(win.body(),touch.move,"_onTouchMove"),this._onTouchEndHandle=this.connect(win.body(),touch.release,"_onTouchEnd")),this.touchStartX=e.touches?e.touches[0].pageX:e.clientX,this.touchStartY=e.touches?e.touches[0].pageY:e.clientY,this._currentSel=this.selected,this._delayedSelection?this._selTimer=this.defer(function(){lang.hitch(this,function(){this.set("selected",!0)})},100):this.set("selected",!0)},onTouchStart:function(){},_onTouchMove:function(e){var x=e.touches?e.touches[0].pageX:e.clientX,y=e.touches?e.touches[0].pageY:e.clientY;if(Math.abs(x-this.touchStartX)>=4||Math.abs(y-this.touchStartY)>=4){this.cancel();var p=this.getParent();p&&p.selectOne?this._prevSel&&this._prevSel.set("selected",!0):this.set("selected",!1)}},_disconnect:function(){this.disconnect(this._onTouchMoveHandle),this.disconnect(this._onTouchEndHandle),this._onTouchMoveHandle=this._onTouchEndHandle=null},cancel:function(){this._selTimer&&(this._selTimer.remove(),this._selTimer=null),this._disconnect()},_onTouchEnd:function(e){if(!this._selTimer&&this._delayedSelection)return;this.cancel(),this._onClick(e)},setTransitionPos:function(e){var w=this;for(;;){w=w.getParent();if(!w||domClass.contains(w.domNode,"mblView"))break}w&&(w.clickedPosX=e.clientX,w.clickedPosY=e.clientY)},transitionTo:function(moveTo,href,url,scene){var opts=moveTo&&typeof moveTo=="object"?moveTo:{moveTo:moveTo,href:href,url:url,scene:scene,transition:this.transition,transitionDir:this.transitionDir};(new TransitionEvent(this.domNode,opts)).dispatch()},_setIconAttr:function(icon){if(!this._isOnLine){this._pendingIcon=icon;return}this._set("icon",icon),this.iconNode=iconUtils.setIcon(icon,this.iconPos,this.iconNode,this.alt,this.iconParentNode,this.refNode,this.position)},_setLabelAttr:function(text){this._set("label",text),this.labelNode.innerHTML=this._cv?this._cv(text):text},_setSelectedAttr:function(selected){if(selected){var p=this.getParent();if(p&&p.selectOne){var arr=array.filter(p.getChildren(),function(w){return w.selected});array.forEach(arr,function(c){this._prevSel=c,c.set("selected",!1)},this)}}this._set("selected",selected)}});return has("dojo-bidi")?declare("dojox.mobile._ItemBase",[_ItemBase,BidiItemBase]):_ItemBase})