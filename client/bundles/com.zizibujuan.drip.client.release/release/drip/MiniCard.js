//>>built
require({cache:{"url:drip/templates/MiniCard.html":'\x3cdiv\x3e\n\t\x3cdiv class\x3d"minicard"\x3e\n\t\t\x3cdiv class\x3d"minicard_body clearfix"\x3e\n\t\t\t\x3cdl class\x3d"clearfix"\x3e\n\t\t\t\t\x3cdt class\x3d"minicard_name"\x3e\n\t\t\t\t\t\x3ca href\x3d"#" target\x3d"_blank" data-dojo-attach-point\x3d"userImgLinkNode"\x3e\n\t\t\t\t\t\t\x3cimg alt\x3d"" src\x3d"#" data-dojo-attach-point\x3d"userImgNode"\x3e\n\t\t\t\t\t\x3c/a\x3e\n\t\t\t\t\x3c/dt\x3e\n\t\t\t\t\x3cdd\x3e\n\t\t\t\t\t\x3cp\x3e\n\t\t\t\t\t\t\x3ca href\x3d"#" target\x3d"_blank" data-dojo-attach-point\x3d"userNameLinkNode"\x3e\u7528\u6237\u540d\x3c/a\x3e\n\t\t\t\t\t\x3c/p\x3e\n\t\t\t\t\t\x3cp\x3e\n\t\t\t\t\t\t\x3cspan data-dojo-attach-point\x3d"userSexNode"\x3e\u6027\u522b\x3c/span\x3e\n\t\t\t\t\t\t\x3cspan data-dojo-attach-point\x3d"userAddrNode"\x3e\u5730\u5740\x3c/span\x3e\n\t\t\t\t\t\t\x3c!-- TODO\uff1a\u663e\u793a\u5b66\u6821\u4fe1\u606f --\x3e\n\t\t\t\t\t\x3c/p\x3e\n\t\t\t\t\t\n\t\t\t\t\t\x3cdiv\x3e\n\t\t\t\t\t\t\x3cul class\x3d"userData clearfix"\x3e\n\t\t\t\t\t\t\t\x3cli\x3e\x3ca href\x3d"#" data-dojo-attach-point\x3d"followNode"\x3e\u5173\u6ce8 \x3c/a\x3e\x3c/li\x3e\n\t\t\t\t\t\t\t\x3cli\x3e|\x3c/li\x3e\n\t\t\t\t\t\t\t\x3cli\x3e\x3ca href\x3d"#" data-dojo-attach-point\x3d"fanNode"\x3e\u7c89\u4e1d \x3c/a\x3e\x3c/li\x3e\n\t\t\t\t\t\t\t\x3cli\x3e|\x3c/li\x3e\n\t\t\t\t\t\t\t\x3cli\x3e\x3ca href\x3d"#" data-dojo-attach-point\x3d"exerciseNode"\x3e\u5f55\u9898 \x3c/a\x3e\x3c/li\x3e\n\t\t\t\t\t\t\t\x3cli\x3e|\x3c/li\x3e\n\t\t\t\t\t\t\t\x3cli\x3e\x3ca href\x3d"#" data-dojo-attach-point\x3d"answerNode"\x3e\u7b54\u9898 \x3c/a\x3e\x3c/li\x3e\n\t\t\t\t\t\t\x3c/ul\x3e\n\t\t\t\t\t\x3c/div\x3e\n\t\t\t\t\x3c/dd\x3e\n\t\t\t\x3c/dl\x3e\n\t\t\t\x3cdl class\x3d"intro"\x3e\n\t\t\t\t\x3cdt\x3e\x3c/dt\x3e\n\t\t\t\t\x3cdd data-dojo-attach-point\x3d"introNode"\x3e\u81ea\u6211\u4ecb\u7ecd\x3c/dd\x3e\n\t\t\t\x3c/dl\x3e\n\t\t\x3c/div\x3e\n\t\t\x3cdiv class\x3d"minicard_footer dijitDialogPaneActionBar"\x3e\n\t\t\t\x3cdiv class\x3d"ft_left" data-dojo-attach-point\x3d"fromSiteNode"\x3e\n\t\t\t\x3c/div\x3e\n\t\t\t\x3cdiv class\x3d"ft_right" data-dojo-attach-point\x3d"actionsNode"\x3e\n\t\t\t\t\x3c!-- \u5173\u6ce8\u6309\u94ae --\x3e\n\t\t\t\x3c/div\x3e\n\t\t\x3c/div\x3e\n\t\x3c/div\x3e\n\x3c/div\x3e'}});
define("drip/MiniCard","dojo/_base/declare dojo/_base/lang dojo/on dojo/request/xhr dojo/dom-construct dijit/_WidgetBase dijit/_TemplatedMixin dijit/TooltipDialog dijit/popup dojo/text!./templates/MiniCard.html drip/user drip/classCode".split(" "),function(h,d,k,f,e,m,n,p,g,q,r,l){var s=h("drip.MiniCardBody",[m,n],{templateString:q,postCreate:function(){this.inherited(arguments)},update:function(c){return f("/users/"+c,{handleAs:"json"}).then(d.hitch(this,function(a){debugger;var b=a.id+"?mapUserId\x3d"+
a.mapUserId,c=a.nickName||"",d="/actions/"+b;this.userImgLinkNode.href=d;this.userImgNode.src=a.largeImageUrl||"/drip/resources/images/profile_180_180.gif";this.userImgNode.alt=c;this.userNameLinkNode.innerHTML=c;this.userNameLinkNode.href=d;this.userSexNode.innerHTML=null==a.sex?"":l.sex[a.sex];this.userAddrNode.innerHTML=a.homeCity?a.homeCity.province+" "+a.homeCity.city:"";this.followNode.href="/follows/"+b;this._appendCount(this.followNode,a.followCount||0);this.fanNode.href="/fans/"+b;this._appendCount(this.fanNode,
a.fanCount||0);this.exerciseNode.href="/exercises/"+b;this._appendCount(this.exerciseNode,a.exerCount||0);this.answerNode.href="/answers/"+b;this._appendCount(this.answerNode,a.answerCount||0);this.introNode.innerHTML=a.introduce||"";this.fromSiteNode.innerHTML=101==a.fromSite?"\u6765\u81ea\x3cstrong\x3e"+l.site["'"+useInfo.fromSite+"'"]+"\x3c/strong\x3e":"\u6765\u81ea\x3cstrong\x3e\u5b5c\u5b5c\u4e0d\u5026\x3c/strong\x3e";e.empty(this.actionsNode);b=a.id;r.getLoggedUserInfo().mapped_user_id==a.mapUserId?
e.empty(this.actionsNode):a.userRelationId?this._createWatchButton(this.actionsNode,b):this._createCancelWatchButton(this.actionsNode,b)}))},_appendCount:function(c,a){var b=c.nextSibling;null==b?(b=document.createTextNode(a),c.parentNode.appendChild(b)):b.textContent=a},_createWatchButton:function(c,a){e.create("strong",null,c).innerHTML="\u221a \u5df2\u5173\u6ce8";var b=e.create("input",{type:"button",value:"\u53d6\u6d88",style:"margin-left:10px;margin-right:15px"},c);k.once(b,"click",d.hitch(this,
function(b){f.put("/follow/"+a,{handleAs:"json",query:{op:"off"}},d.hitch(this,function(b){e.empty(this.actionsNode);this._createCancelWatchButton(c,a)}),d.hitch(this,function(a){}))}))},_createCancelWatchButton:function(c,a){var b=e.create("input",{type:"button",value:"+ \u5173\u6ce8",style:"margin-right:15px"},c);k.once(b,"click",d.hitch(this,function(b){f.put("/follow/"+a,{handleAs:"json",query:{op:"on"}},d.hitch(this,function(b){e.empty(this.actionsNode);this._createWatchButton(c,a)}),d.hitch(this,
function(a){}))}))}});return h("drip.MiniCard",null,{constructor:function(c){d.mixin(this,c);var a=this,b=this.dialog=new p({onMouseLeave:function(){g.close(b)},onMouseEnter:function(){a._closePopup&&clearTimeout(a._closePopup)}});this.miniCardBody=new s},show:function(c,a){this._closePopup&&clearTimeout(this._closePopup);var b=this.dialog;g.open({popup:b,around:c});this._show=!0;var d=this.miniCardBody;b.containerNode.innerHTML='\x3ci class\x3d"icon-refresh icon-spin"\x3e\x3c/i\x3e  \u52a0\u8f7d\u4e2d...';
d.update(a).then(function(){b.containerNode.innerHTML="";b.containerNode.appendChild(d.domNode)})},hide:function(){if(this._show){var c=this.dialog;this._closePopup=setTimeout(function(){g.close(c);self._show=!1},300)}}})});
//@ sourceMappingURL=MiniCard.js.map