//>>built
require({cache:{"url:drip/templates/MiniCard.html":'<div>\n\t<div class="minicard">\n\t\t<div class="minicard_body clearfix">\n\t\t\t<dl class="clearfix">\n\t\t\t\t<dt class="minicard_name">\n\t\t\t\t\t<a href="#" target="_blank" data-dojo-attach-point="userImgLinkNode">\n\t\t\t\t\t\t<img alt="" src="#" data-dojo-attach-point="userImgNode">\n\t\t\t\t\t</a>\n\t\t\t\t</dt>\n\t\t\t\t<dd>\n\t\t\t\t\t<p>\n\t\t\t\t\t\t<a href="#" target="_blank" data-dojo-attach-point="userNameLinkNode">\u7528\u6237\u540d</a>\n\t\t\t\t\t</p>\n\t\t\t\t\t<p>\n\t\t\t\t\t\t<span data-dojo-attach-point="userSexNode">\u6027\u522b</span>\n\t\t\t\t\t\t<span data-dojo-attach-point="userAddrNode">\u5730\u5740</span>\n\t\t\t\t\t\t<\!-- TODO\uff1a\u663e\u793a\u5b66\u6821\u4fe1\u606f --\>\n\t\t\t\t\t</p>\n\t\t\t\t\t\n\t\t\t\t\t<div>\n\t\t\t\t\t\t<ul class="userData clearfix">\n\t\t\t\t\t\t\t<li>\u5173\u6ce8<a href="#" data-dojo-attach-point="followNode">0</a></li>\n\t\t\t\t\t\t\t<li>|</li>\n\t\t\t\t\t\t\t<li>\u7c89\u4e1d<a href="#" data-dojo-attach-point="fanNode">0</a></li>\n\t\t\t\t\t\t\t<li>|</li>\n\t\t\t\t\t\t\t<li>\u7b54\u9898<a href="#" data-dojo-attach-point="answerNode">0</a></li>\n\t\t\t\t\t\t</ul>\n\t\t\t\t\t</div>\n\t\t\t\t</dd>\n\t\t\t</dl>\n\t\t\t<dl class="intro">\n\t\t\t\t<dt></dt>\n\t\t\t\t<dd data-dojo-attach-point="introNode">\u81ea\u6211\u4ecb\u7ecd</dd>\n\t\t\t</dl>\n\t\t</div>\n\t\t<div class="minicard_footer dijitDialogPaneActionBar">\n\t\t\t<div class="ft_left" data-dojo-attach-point="fromSiteNode">\n\t\t\t</div>\n\t\t\t<div class="ft_right" data-dojo-attach-point="actionsNode">\n\t\t\t\t<\!-- \u5173\u6ce8\u6309\u94ae --\>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>'}});
define("drip/MiniCard","dojo/_base/declare,dojo/_base/lang,dojo/on,dojo/request/xhr,dojo/dom-construct,dijit/_WidgetBase,dijit/_TemplatedMixin,dijit/TooltipDialog,dijit/popup,dojo/text!./templates/MiniCard.html,drip/userSession,drip/classCode".split(","),function(h,c,i,f,e,k,l,m,g,n,o,j){var p=h("drip.MiniCardBody",[k,l],{templateString:n,postCreate:function(){this.inherited(arguments)},update:function(b,d){return f("/users/"+b,{handleAs:"json",query:{mapUserId:d}}).then(c.hitch(this,function(a){var b=
a.id+"?mapUserId="+a.mapUserId,d=a.nickName||"",c="/actions/"+b;this.userImgLinkNode.href=c;this.userImgNode.src=a.largeImageUrl||"";this.userImgNode.alt=d;this.userNameLinkNode.innerHTML=d;this.userNameLinkNode.href=c;this.userSexNode.innerHTML=j.sex[a.sex||""];this.userAddrNode.innerHTML=a.homeCity?a.homeCity.province+" "+a.homeCity.city:"";this.followNode.innerHTML=a.followCount||0;this.followNode.href="/follows/"+b;this.fanNode.innerHTML=a.fanCount||0;this.fanNode.href="/fans/"+b;this.answerNode.innerHTML=
a.answerCount||0;this.answerNode.href="/answers/"+b;this.introNode.innerHTML=a.introduce||"";this.fromSiteNode.innerHTML=101==a.fromSite?"\u6765\u81ea<strong>"+j.site["'"+useInfo.fromSite+"'"]+"</strong>":"\u6765\u81ea<strong>\u5b5c\u5b5c\u4e0d\u5026</strong>";e.empty(this.actionsNode);b=a.id;o.getLoggedUserInfo().mapped_user_id==a.mapUserId?e.empty(this.actionsNode):a.userRelationId?this._createWatchButton(this.actionsNode,b):this._createCancelWatchButton(this.actionsNode,b)}))},_createWatchButton:function(b,
d){e.create("strong",null,b).innerHTML="\u221a \u5df2\u5173\u6ce8";var a=e.create("input",{type:"button",value:"\u53d6\u6d88",style:"margin-left:10px;margin-right:15px"},b);i.once(a,"click",c.hitch(this,function(){f.put("/follow/"+d,{handleAs:"json",query:{op:"off"}},c.hitch(this,function(){e.empty(this.actionsNode);this._createCancelWatchButton(b,d)}),c.hitch(this,function(){}))}))},_createCancelWatchButton:function(b,d){var a=e.create("input",{type:"button",value:"+ \u5173\u6ce8",style:"margin-right:15px"},
b);i.once(a,"click",c.hitch(this,function(){f.put("/follow/"+d,{handleAs:"json",query:{op:"on"}},c.hitch(this,function(){e.empty(this.actionsNode);this._createWatchButton(b,d)}),c.hitch(this,function(){}))}))}});return h("drip.MiniCard",null,{constructor:function(b){c.mixin(this,b);var d=this,a=this.dialog=new m({onMouseLeave:function(){g.close(a)},onMouseEnter:function(){d._closePopup&&clearTimeout(d._closePopup)}});this.miniCardBody=new p},show:function(b,d,a){this._closePopup&&clearTimeout(this._closePopup);
var c=this.dialog;g.open({popup:c,around:b});this._show=!0;var e=this.miniCardBody;c.containerNode.innerHTML="\u6b63\u5728\u52a0\u8f7d\u4e2d\uff0c\u8bf7\u7a0d\u540e...";e.update(d,a).then(function(){c.containerNode.innerHTML="";c.containerNode.appendChild(e.domNode)})},hide:function(){if(this._show){var b=this.dialog;this._closePopup=setTimeout(function(){g.close(b);self._show=!1},300)}}})});