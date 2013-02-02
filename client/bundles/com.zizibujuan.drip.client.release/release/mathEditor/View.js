//>>built
define("mathEditor/View","dojo/_base/declare,dojo/_base/lang,dojo/_base/array,dojo/_base/event,dojo/dom,dojo/dom-style,dojo/dom-class,dojo/dom-construct,dojo/dom-geometry,dojo/on,dojo/aspect,mathEditor/Model,mathEditor/layer/Cursor,mathEditor/lang".split(","),function(n,f,k,o,j,p,h,l,i,q,r,t,s,m){return n("mathEditor.View",null,{model:null,editorDiv:null,parentNode:null,textarea:null,readOnly:!1,focused:!1,constructor:function(a){f.mixin(this,a);var a=this.editorDiv=l.create("div",{style:{"border-radius":"3px",
height:"100%",width:"100%",border:"solid 1px #CCC",position:"absolute",cursor:"text"}},this.parentNode),b=this.textLayer=l.create("div",{"class":"drip_layer drip_text"},a);this.cursor=new s({parentEl:a});q(a,"mousedown",f.hitch(this,this._onMouseDownHandler));b.innerHTML=this.model.getHTML();r.after(this.model,"onChange",f.hitch(this,this._onChange))},_onMouseDownHandler:function(a){this._focus();o.stop(a)},_focus:function(){if(!1==this.focused){this.focused=!0;var a=this.textarea,b=this.cursor;h.add(this.editorDiv,
"drip_editor_focus");setTimeout(function(){a.focus();b.show()})}},_onChange:function(){this.textLayer.innerHTML=this.model.getHTML();MathJax.Hub.Queue(["Typeset",MathJax.Hub,this.textLayer]);MathJax.Hub.Queue(f.hitch(this,this.showCursor))},blur:function(){if(!0==this.focused)this.focused=!1,h.remove(this.editorDiv,"drip_editor_focus"),this.cursor.hide()},showCursor:function(){var a=this._getCursorConfig();this.cursor.move(a);this.textarea&&p.set(this.textarea,{top:a.top+"px",left:a.left+"px"})},
moveLeft:function(){this.model.moveLeft();this.showCursor()},_getFocusInfo:function(){var a=this.textLayer,b=null,d=null;k.forEach(this.model.path,function(c){if("root"!=c.nodeName)if("line"==c.nodeName)a=a.childNodes[c.offset-1];else if("text"==c.nodeName||"math"==c.nodeName){if(a=k.filter(a.childNodes,function(a){return"span"==a.nodeName.toLowerCase()})[c.offset-1],"math"==c.nodeName)b=a.nextSibling.MathJax.elementJax.root}else b&&(b=m.isMathTokenName(c.nodeName)?b.data[0]:b.data[c.offset-1],a=
j.byId("MathJax-Span-"+b.spanID),h.contains(a,"mstyle")?"mstyle"!=c&&(b=b.data[c.offset-1],a=j.byId("MathJax-Span-"+b.spanID)):h.contains(a,"mrow")&&(d=a,"mrow"!=c&&(b=b.data[c.offset-1],a=j.byId("MathJax-Span-"+b.spanID))))});return{node:a,offset:this.model.getOffset(),mrowNode:d}},_getCursorConfig:function(){var a=0,b=0,d=0,c=0,a=this._getFocusInfo(),e=a.node,f=a.offset,b=this.getTextLayerPosition();if(a=a.mrowNode)var d=i.position(a),a=d.y-b.y,d=d.h,g=i.position(e);else g=i.position(e),a=g.y-b.y,
d=g.h;b=g.x-b.x;if(1==e.nodeType&&(g=e.childNodes,1==g.length&&3==g[0].nodeType))e.textContent.length==f?b+=e.offsetWidth:(c=e.textContent.substring(0,f),c=m.measureTextSize(e,c).width,b+=c);return{top:a,left:b,height:d,width:c}},getCursorPosition:function(){var a=this.getTextLayerPosition(),b=a.x,a=a.y,d=this.cursor.getCursorConfig(),b=b+d.left,a=a+(d.top+d.height);return{x:b,y:a}},getTextLayerPosition:function(){if(!this.textLayerPosition)this.textLayerPosition=i.position(this.textLayer);return this.textLayerPosition}})});