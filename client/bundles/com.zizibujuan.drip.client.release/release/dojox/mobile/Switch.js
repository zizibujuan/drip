//>>built
define("dojox/mobile/Switch",["dojo/_base/array","dojo/_base/connect","dojo/_base/declare","dojo/_base/event","dojo/_base/window","dojo/dom-class","dojo/dom-construct","dojo/dom-style","dojo/touch","dijit/_Contained","dijit/_WidgetBase","./sniff","./_maskUtils","dojo/has!dojo-bidi?dojox/mobile/bidi/Switch"],function(array,connect,declare,event,win,domClass,domConstruct,domStyle,touch,Contained,WidgetBase,has,maskUtils,BidiSwitch){var Switch=declare(has("dojo-bidi")?"dojox.mobile.NonBidiSwitch":"dojox.mobile.Switch",[WidgetBase,Contained],{value:"on",name:"",leftLabel:"ON",rightLabel:"OFF",shape:"mblSwDefaultShape",tabIndex:"0",_setTabIndexAttr:"",baseClass:"mblSwitch",role:"",buildRendering:function(){this.domNode=this.srcNodeRef&&this.srcNodeRef.tagName==="SPAN"?this.srcNodeRef:domConstruct.create("span"),typeof this.domNode.style.msTouchAction!="undefined"&&(this.domNode.style.msTouchAction="none"),this.inherited(arguments);var c=this.srcNodeRef&&this.srcNodeRef.className||this.className||this["class"];if(c=c.match(/mblSw.*Shape\d*/))this.shape=c;domClass.add(this.domNode,this.shape);var nameAttr=this.name?' name="'+this.name+'"':"";this.domNode.innerHTML='<div class="mblSwitchInner"><div class="mblSwitchBg mblSwitchBgLeft"><div class="mblSwitchText mblSwitchTextLeft"></div></div><div class="mblSwitchBg mblSwitchBgRight"><div class="mblSwitchText mblSwitchTextRight"></div></div><div class="mblSwitchKnob"></div><input type="hidden"'+nameAttr+"></div>"+"</div>";var n=this.inner=this.domNode.firstChild;this.left=n.childNodes[0],this.right=n.childNodes[1],this.knob=n.childNodes[2],this.input=n.childNodes[3]},postCreate:function(){this._clickHandle=this.connect(this.domNode,"onclick","_onClick"),this._keydownHandle=this.connect(this.domNode,"onkeydown","_onClick"),this._startHandle=this.connect(this.domNode,touch.press,"onTouchStart"),this._initialValue=this.value},_changeState:function(state,anim){var on=state==="on";this.left.style.display="",this.right.style.display="",this.inner.style.left="",anim&&domClass.add(this.domNode,"mblSwitchAnimation"),domClass.remove(this.domNode,on?"mblSwitchOff":"mblSwitchOn"),domClass.add(this.domNode,on?"mblSwitchOn":"mblSwitchOff");var _this=this;setTimeout(function(){_this.left.style.display=on?"":"none",_this.right.style.display=on?"none":"",domClass.remove(_this.domNode,"mblSwitchAnimation")},anim?300:0)},_createMaskImage:function(){this._timer&&(clearTimeout(this._timer),delete this._timer);if(this._hasMaskImage)return;this._width=this.domNode.offsetWidth-this.knob.offsetWidth,this._hasMaskImage=!0;if(!has("webkit")&&!has("svg"))return;var rDef=domStyle.get(this.left,"borderTopLeftRadius");if(rDef=="0px")return;var rDefs=rDef.split(" "),rx=parseFloat(rDefs[0]),ry=rDefs.length==1?rx:parseFloat(rDefs[1]),w=this.domNode.offsetWidth,h=this.domNode.offsetHeight,id=(this.shape+"Mask"+w+h+rx+ry).replace(/\./,"_");maskUtils.createRoundMask(this.domNode,0,0,0,0,w,h,rx,ry,1)},_onClick:function(e){if(e&&e.type==="keydown"&&e.keyCode!==13)return;if(this.onClick(e)===!1)return;if(this._moved)return;this.value=this.input.value=this.value=="on"?"off":"on",this._changeState(this.value,!0),this.onStateChanged(this.value)},onClick:function(){},onTouchStart:function(e){this._moved=!1,this.innerStartX=this.inner.offsetLeft,this._conn||(this._conn=[this.connect(this.inner,touch.move,"onTouchMove"),this.connect(this.inner,touch.release,"onTouchEnd")]),this.touchStartX=e.touches?e.touches[0].pageX:e.clientX,this.left.style.display="",this.right.style.display="",event.stop(e),this._createMaskImage()},onTouchMove:function(e){e.preventDefault();var dx;if(e.targetTouches){if(e.targetTouches.length!=1)return;dx=e.targetTouches[0].clientX-this.touchStartX}else dx=e.clientX-this.touchStartX;var pos=this.innerStartX+dx,d=10;pos<=-(this._width-d)&&(pos=-this._width),pos>=-d&&(pos=0),this.inner.style.left=pos+"px",Math.abs(dx)>d&&(this._moved=!0)},onTouchEnd:function(e){array.forEach(this._conn,connect.disconnect),this._conn=null;if(this.innerStartX==this.inner.offsetLeft){if(has("touch")&&!(has("android")>=4.1)){var ev=win.doc.createEvent("MouseEvents");ev.initMouseEvent("click",!0,!0,win.global,1,e.screenX,e.screenY,e.clientX,e.clientY),this.inner.dispatchEvent(ev)}return}var newState=this.inner.offsetLeft<-(this._width/2)?"off":"on";this._changeState(newState,!0),newState!=this.value&&(this.value=this.input.value=newState,this.onStateChanged(newState))},onStateChanged:function(newState){},_setValueAttr:function(value){this._changeState(value,!1),this.value!=value&&this.onStateChanged(value),this.value=this.input.value=value},_setLeftLabelAttr:function(label){this.leftLabel=label,this.left.firstChild.innerHTML=this._cv?this._cv(label):label},_setRightLabelAttr:function(label){this.rightLabel=label,this.right.firstChild.innerHTML=this._cv?this._cv(label):label},reset:function(){this.set("value",this._initialValue)}});return has("dojo-bidi")?declare("dojox.mobile.Switch",[Switch,BidiSwitch]):Switch})