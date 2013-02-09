//>>built
define("dojo/fx",["./_base/lang","./Evented","./_base/kernel","./_base/array","./aspect","./_base/fx","./dom","./dom-style","./dom-geometry","./ready","require"],function(lang,Evented,dojo,arrayUtil,aspect,baseFx,dom,domStyle,geom,ready,require){dojo.isAsync||ready(0,function(){var requires=["./fx/Toggler"];require(requires)});var coreFx=dojo.fx={},_baseObj={_fire:function(evt,args){return this[evt]&&this[evt].apply(this,args||[]),this}},_chain=function(animations){this._index=-1,this._animations=animations||[],this._current=this._onAnimateCtx=this._onEndCtx=null,this.duration=0,arrayUtil.forEach(this._animations,function(a){this.duration+=a.duration,a.delay&&(this.duration+=a.delay)},this)};_chain.prototype=new Evented,lang.extend(_chain,{_onAnimate:function(){this._fire("onAnimate",arguments)},_onEnd:function(){this._onAnimateCtx.remove(),this._onEndCtx.remove(),this._onAnimateCtx=this._onEndCtx=null,this._index+1==this._animations.length?this._fire("onEnd"):(this._current=this._animations[++this._index],this._onAnimateCtx=aspect.after(this._current,"onAnimate",lang.hitch(this,"_onAnimate"),!0),this._onEndCtx=aspect.after(this._current,"onEnd",lang.hitch(this,"_onEnd"),!0),this._current.play(0,!0))},play:function(delay,gotoStart){this._current||(this._current=this._animations[this._index=0]);if(!gotoStart&&this._current.status()=="playing")return this;var beforeBegin=aspect.after(this._current,"beforeBegin",lang.hitch(this,function(){this._fire("beforeBegin")}),!0),onBegin=aspect.after(this._current,"onBegin",lang.hitch(this,function(arg){this._fire("onBegin",arguments)}),!0),onPlay=aspect.after(this._current,"onPlay",lang.hitch(this,function(arg){this._fire("onPlay",arguments),beforeBegin.remove(),onBegin.remove(),onPlay.remove()}));return this._onAnimateCtx&&this._onAnimateCtx.remove(),this._onAnimateCtx=aspect.after(this._current,"onAnimate",lang.hitch(this,"_onAnimate"),!0),this._onEndCtx&&this._onEndCtx.remove(),this._onEndCtx=aspect.after(this._current,"onEnd",lang.hitch(this,"_onEnd"),!0),this._current.play.apply(this._current,arguments),this},pause:function(){if(this._current){var e=aspect.after(this._current,"onPause",lang.hitch(this,function(arg){this._fire("onPause",arguments),e.remove()}),!0);this._current.pause()}return this},gotoPercent:function(percent,andPlay){this.pause();var offset=this.duration*percent;return this._current=null,arrayUtil.some(this._animations,function(a){return a.duration<=offset?(this._current=a,!0):(offset-=a.duration,!1)}),this._current&&this._current.gotoPercent(offset/this._current.duration,andPlay),this},stop:function(gotoEnd){if(this._current){if(gotoEnd){for(;this._index+1<this._animations.length;++this._index)this._animations[this._index].stop(!0);this._current=this._animations[this._index]}var e=aspect.after(this._current,"onStop",lang.hitch(this,function(arg){this._fire("onStop",arguments),e.remove()}),!0);this._current.stop()}return this},status:function(){return this._current?this._current.status():"stopped"},destroy:function(){this._onAnimateCtx&&this._onAnimateCtx.remove(),this._onEndCtx&&this._onEndCtx.remove()}}),lang.extend(_chain,_baseObj),coreFx.chain=function(animations){return new _chain(animations)};var _combine=function(animations){this._animations=animations||[],this._connects=[],this._finished=0,this.duration=0,arrayUtil.forEach(animations,function(a){var duration=a.duration;a.delay&&(duration+=a.delay),this.duration<duration&&(this.duration=duration),this._connects.push(aspect.after(a,"onEnd",lang.hitch(this,"_onEnd"),!0))},this),this._pseudoAnimation=new baseFx.Animation({curve:[0,1],duration:this.duration});var self=this;arrayUtil.forEach(["beforeBegin","onBegin","onPlay","onAnimate","onPause","onStop","onEnd"],function(evt){self._connects.push(aspect.after(self._pseudoAnimation,evt,function(){self._fire(evt,arguments)},!0))})};return lang.extend(_combine,{_doAction:function(action,args){return arrayUtil.forEach(this._animations,function(a){a[action].apply(a,args)}),this},_onEnd:function(){++this._finished>this._animations.length&&this._fire("onEnd")},_call:function(action,args){var t=this._pseudoAnimation;t[action].apply(t,args)},play:function(delay,gotoStart){return this._finished=0,this._doAction("play",arguments),this._call("play",arguments),this},pause:function(){return this._doAction("pause",arguments),this._call("pause",arguments),this},gotoPercent:function(percent,andPlay){var ms=this.duration*percent;return arrayUtil.forEach(this._animations,function(a){a.gotoPercent(a.duration<ms?1:ms/a.duration,andPlay)}),this._call("gotoPercent",arguments),this},stop:function(gotoEnd){return this._doAction("stop",arguments),this._call("stop",arguments),this},status:function(){return this._pseudoAnimation.status()},destroy:function(){arrayUtil.forEach(this._connects,function(handle){handle.remove()})}}),lang.extend(_combine,_baseObj),coreFx.combine=function(animations){return new _combine(animations)},coreFx.wipeIn=function(args){var node=args.node=dom.byId(args.node),s=node.style,o,anim=baseFx.animateProperty(lang.mixin({properties:{height:{start:function(){o=s.overflow,s.overflow="hidden";if(s.visibility=="hidden"||s.display=="none")return s.height="1px",s.display="",s.visibility="",1;var height=domStyle.get(node,"height");return Math.max(height,1)},end:function(){return node.scrollHeight}}}},args)),fini=function(){s.height="auto",s.overflow=o};return aspect.after(anim,"onStop",fini,!0),aspect.after(anim,"onEnd",fini,!0),anim},coreFx.wipeOut=function(args){var node=args.node=dom.byId(args.node),s=node.style,o,anim=baseFx.animateProperty(lang.mixin({properties:{height:{end:1}}},args));aspect.after(anim,"beforeBegin",function(){o=s.overflow,s.overflow="hidden",s.display=""},!0);var fini=function(){s.overflow=o,s.height="auto",s.display="none"};return aspect.after(anim,"onStop",fini,!0),aspect.after(anim,"onEnd",fini,!0),anim},coreFx.slideTo=function(args){var node=args.node=dom.byId(args.node),top=null,left=null,init=function(n){return function(){var cs=domStyle.getComputedStyle(n),pos=cs.position;top=pos=="absolute"?n.offsetTop:parseInt(cs.top)||0,left=pos=="absolute"?n.offsetLeft:parseInt(cs.left)||0;if(pos!="absolute"&&pos!="relative"){var ret=geom.position(n,!0);top=ret.y,left=ret.x,n.style.position="absolute",n.style.top=top+"px",n.style.left=left+"px"}}}(node);init();var anim=baseFx.animateProperty(lang.mixin({properties:{top:args.top||0,left:args.left||0}},args));return aspect.after(anim,"beforeBegin",init,!0),anim},coreFx})