//>>built
define("dijit/DialogUnderlay","dojo/_base/declare,dojo/_base/lang,dojo/aspect,dojo/dom-attr,dojo/dom-construct,dojo/dom-style,dojo/on,dojo/_base/window,dojo/window,./_Widget,./_TemplatedMixin,./BackgroundIframe,./Viewport,./main".split(","),function(h,e,q,i,j,k,f,r,g,l,m,n,o,p){var b=h("dijit.DialogUnderlay",[l,m],{templateString:"<div class='dijitDialogUnderlayWrapper'><div class='dijitDialogUnderlay' tabIndex='0' data-dojo-attach-point='node'></div></div>",dialogId:"","class":"",_modalConnects:[],
_setDialogIdAttr:function(a){i.set(this.node,"id",a+"_underlay");this._set("dialogId",a)},_setClassAttr:function(a){this.node.className="dijitDialogUnderlay "+a;this._set("class",a)},postCreate:function(){this.inherited(arguments);j.place(this.domNode,this.ownerDocumentBody,"first");this.own(f(this.node,"click, focus",e.hitch(this,function(a){if(a.target==this.node)this.onFocus()})))},onFocus:function(){},layout:function(){var a=this.node.style,b=this.domNode.style;b.display="none";var d=g.getBox(this.ownerDocument);
b.top=d.t+"px";b.left=d.l+"px";a.width=d.w+"px";a.height=d.h+"px";b.display="block"},show:function(){this.domNode.style.display="block";this.open=!0;this.layout();this.bgIframe=new n(this.domNode);var a=g.get(this.ownerDocument);this._modalConnects=[o.on("resize",e.hitch(this,"layout")),f(a,"scroll",e.hitch(this,"layout"))]},hide:function(){this.bgIframe.destroy();delete this.bgIframe;for(this.domNode.style.display="none";this._modalConnects.length;)this._modalConnects.pop().remove();this.open=!1},
destroy:function(){for(;this._modalConnects.length;)this._modalConnects.pop().remove();this.inherited(arguments)}});b.show=function(a,e,d){var c=b._singleton;!c||c._destroyed?c=p._underlay=b._singleton=new b(a):a&&c.set(a);k.set(c.domNode,"zIndex",e);c.open||c.show();c.onFocus=d||function(){}};b.hide=function(){var a=b._singleton;a&&!a._destroyed&&a.hide()};return b});