//>>built
define("dojox/mobile/Audio",["dojo/_base/declare","dojo/dom-construct","dojo/_base/sniff","dijit/_Contained","dijit/_WidgetBase"],function(declare,domConstruct,has,Contained,WidgetBase){return declare("dojox.mobile.Audio",[WidgetBase,Contained],{source:null,width:"200px",height:"15px",_playable:!1,_tag:"audio",constructor:function(){this.source=[]},buildRendering:function(){this.domNode=this.srcNodeRef||domConstruct.create(this._tag)},_getEmbedRegExp:function(){return has("ff")?/audio\/mpeg/i:has("ie")?/audio\/wav/i:null},startup:function(){if(this._started)return;this.inherited(arguments);if(this.domNode.canPlayType)if(this.source.length>0)for(var i=0,len=this.source.length;i<len;i++)domConstruct.create("source",{src:this.source[i].src,type:this.source[i].type},this.domNode),this._playable=this._playable||!!this.domNode.canPlayType(this.source[i].type);else for(var i=0,len=this.domNode.childNodes.length;i<len;i++){var n=this.domNode.childNodes[i];n.nodeType===1&&n.nodeName==="SOURCE"&&(this.source.push({src:n.src,type:n.type}),this._playable=this._playable||!!this.domNode.canPlayType(n.type))}has.add("mobile-embed-audio-video-support",!0);if(has("mobile-embed-audio-video-support")&&!this._playable)for(var i=0,len=this.source.length,re=this._getEmbedRegExp();i<len;i++)if(this.source[i].type.match(re)){var node=domConstruct.create("embed",{src:this.source[0].src,type:this.source[0].type,width:this.width,height:this.height});this.domNode.parentNode.replaceChild(node,this.domNode),this.domNode=node,this._playable=!0;break}}})})