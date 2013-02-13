require({cache:{
'url:drip/templates/MiniCard.html':"<div>\n\t<div class=\"minicard\">\n\t\t<div class=\"minicard_body clearfix\">\n\t\t\t<dl class=\"clearfix\">\n\t\t\t\t<dt class=\"minicard_name\">\n\t\t\t\t\t<a href=\"#\" target=\"_blank\" data-dojo-attach-point=\"userImgLinkNode\">\n\t\t\t\t\t\t<img alt=\"\" src=\"#\" data-dojo-attach-point=\"userImgNode\">\n\t\t\t\t\t</a>\n\t\t\t\t</dt>\n\t\t\t\t<dd>\n\t\t\t\t\t<p>\n\t\t\t\t\t\t<a href=\"#\" target=\"_blank\" data-dojo-attach-point=\"userNameLinkNode\">用户名</a>\n\t\t\t\t\t</p>\n\t\t\t\t\t<p>\n\t\t\t\t\t\t<span data-dojo-attach-point=\"userSexNode\">性别</span>\n\t\t\t\t\t\t<span data-dojo-attach-point=\"userAddrNode\">地址</span>\n\t\t\t\t\t\t<!-- TODO：显示学校信息 -->\n\t\t\t\t\t</p>\n\t\t\t\t\t\n\t\t\t\t\t<div>\n\t\t\t\t\t\t<ul class=\"userData clearfix\">\n\t\t\t\t\t\t\t<li>关注<a href=\"#\" data-dojo-attach-point=\"followNode\">0</a></li>\n\t\t\t\t\t\t\t<li>|</li>\n\t\t\t\t\t\t\t<li>粉丝<a href=\"#\" data-dojo-attach-point=\"fanNode\">0</a></li>\n\t\t\t\t\t\t\t<li>|</li>\n\t\t\t\t\t\t\t<li>答题<a href=\"#\" data-dojo-attach-point=\"answerNode\">0</a></li>\n\t\t\t\t\t\t</ul>\n\t\t\t\t\t</div>\n\t\t\t\t</dd>\n\t\t\t</dl>\n\t\t\t<dl class=\"intro\">\n\t\t\t\t<dt></dt>\n\t\t\t\t<dd data-dojo-attach-point=\"introNode\">自我介绍</dd>\n\t\t\t</dl>\n\t\t</div>\n\t\t<div class=\"minicard_footer dijitDialogPaneActionBar\">\n\t\t\t<div class=\"ft_left\" data-dojo-attach-point=\"fromSiteNode\">\n\t\t\t</div>\n\t\t\t<div class=\"ft_right\" data-dojo-attach-point=\"actionsNode\">\n\t\t\t\t<!-- 关注按钮 -->\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>"}});
define("drip/MiniCard", ["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/on",
        "dojo/request/xhr",
        "dojo/dom-construct",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/TooltipDialog",
        "dijit/popup",
        "dojo/text!./templates/MiniCard.html",
        "drip/userSession",
        "drip/classCode"], function(
        		declare,
        		lang,
        		on,
        		xhr,
        		domConstruct,
        		_WidgetBase,
        		_TemplatedMixin,
        		TooltipDialog,
        		popup,
        		miniCardTemplate,
        		userSession,
        		classCode){
	
	var MiniCardBody = declare("drip.MiniCardBody",[_WidgetBase,_TemplatedMixin],{
		templateString:miniCardTemplate,
		postCreate: function(){
			this.inherited(arguments);
		},
		
		// TODO:删除mapUserId
		update: function(localUserId, mapUserId){
			// summary:
			//		更新用户信息
			// userId:[String]
			//		用户标识
			
			// 注意返回deferred对象
			return xhr("/users/"+localUserId,{handleAs:"json",query:{mapUserId:mapUserId}}).then(lang.hitch(this,function(userInfo){
				// 设置用户名片
				
				0 && console.log("userInfo:", userInfo);
				var userLinkSubfix = userInfo.id+"?mapUserId="+userInfo.mapUserId;
				var displayName = userInfo.nickName || "";
				var userActionLink = "/actions/"+ userLinkSubfix
				
				this.userImgLinkNode.href =  userActionLink;
				this.userImgNode.src = userInfo.largeImageUrl || "";
				this.userImgNode.alt = displayName;
				this.userNameLinkNode.innerHTML = displayName;
				this.userNameLinkNode.href = userActionLink;
				this.userSexNode.innerHTML = classCode.sex[userInfo.sex || ""];
				
				if(userInfo.homeCity){
					this.userAddrNode.innerHTML = userInfo.homeCity.province + " " + userInfo.homeCity.city;
				}else{
					this.userAddrNode.innerHTML =  "";
				}
				
				
				this.followNode.innerHTML = userInfo.followCount || 0;
				this.followNode.href = "/follows/"+userLinkSubfix;
				
				this.fanNode.innerHTML = userInfo.fanCount || 0;
				this.fanNode.href = "/fans/"+userLinkSubfix;
				
				this.answerNode.innerHTML = userInfo.answerCount || 0;
				this.answerNode.href = "/answers/"+userLinkSubfix;
				
				this.introNode.innerHTML = userInfo.introduce || "";
				
				if(userInfo.fromSite == 101){
					var key = "'"+useInfo.fromSite+"'";
					this.fromSiteNode.innerHTML = "来自<strong>"+classCode.site[key]+"</strong>";
				}else{
					this.fromSiteNode.innerHTML = "来自<strong>孜孜不倦</strong>";
				}
				
				// 操作按钮
				// 如果尚未关注，显示关注按钮
				// 如果已经关注，显示取消关注按钮
				// 如果显示的是自己的名片，则不显示操作按钮
				
				// 显示功能
				// 关注和取消关注操作
				// 先清除actionsNode中的操作按钮
				domConstruct.empty(this.actionsNode);
				
				var localUserId = userInfo.id;
				var loginMapUserId = userSession.getLoggedUserInfo()["mapped_user_id"];
				if(loginMapUserId == userInfo.mapUserId){
					// 如果是显示登录用户的名片，则清除操作按钮
					domConstruct.empty(this.actionsNode);
				}else if(userInfo.userRelationId){
					// 用户已关注，显示关注文本和取消链接
					this._createWatchButton(this.actionsNode,localUserId);
				}else{
					// 用户未关注，显示关注按钮
					this._createCancelWatchButton(this.actionsNode,localUserId);
				}
				
			}));
		},
		
		_createWatchButton: function(container,localUserId){
			var label = domConstruct.create("strong",null,container);
			label.innerHTML = "√ 已关注";
			
			var cancelWatch = domConstruct.create("input", {type:"button", value:"取消",style:"margin-left:10px;margin-right:15px"}, container);
			on.once(cancelWatch, "click", lang.hitch(this, function(e){
				xhr.put("/follow/"+localUserId,{handleAs:"json",query:{"op":"off"}},lang.hitch(this, function(response){
					domConstruct.empty(this.actionsNode);
					this._createCancelWatchButton(container,localUserId);
				}),lang.hitch(this, function(error){
					
				}));
				
			}));
		},
		
		_createCancelWatchButton: function(container,localUserId){
			var watch = domConstruct.create("input",{type:"button", value:"+ 关注",style:"margin-right:15px"}, container);
			on.once(watch, "click", lang.hitch(this, function(e){
				xhr.put("/follow/"+localUserId,{handleAs:"json",query:{"op":"on"}},lang.hitch(this, function(response){
					domConstruct.empty(this.actionsNode);
					this._createWatchButton(container,localUserId);
				}),lang.hitch(this, function(error){
					
				}));
				
			}));
		}
	})
	
	return declare("drip.MiniCard", null, {
		
		constructor: function(args){
			lang.mixin(this, args);
			
			var self = this;
			var dialog = this.dialog = new TooltipDialog({
				onMouseLeave: function(){
		            popup.close(dialog);
		        },
		        
		        onMouseEnter: function(){
		        	if(self._closePopup){
		        		clearTimeout(self._closePopup);
		        	}
		        }
			});
			
			this.miniCardBody = new MiniCardBody();
		},
		
		
		
		show: function(target, localUserId, mapUserId){
			// summary:
			//		显示迷你名片
			
			// 在多个链接上切换时，要重新计时。
			if(this._closePopup){
        		clearTimeout(this._closePopup);
        	}
			
			// TODO：如果已经加载过了，则缓存起来。用户信息发生改变后，就从缓存中清除掉。
			
			
			var dialog = this.dialog;
			popup.open({
				popup: dialog,
				around:target
			});
			this._show = true;
			
			var miniCardBody = this.miniCardBody;
			
			dialog.containerNode.innerHTML = "正在加载中，请稍后...";
			miniCardBody.update(localUserId,mapUserId).then(function(){
				dialog.containerNode.innerHTML = "";
				dialog.containerNode.appendChild(miniCardBody.domNode);
			});
			
		},
		
		hide: function(){
			// summary:
			//		隐藏迷你名片
			
			if(this._show){
				var dialog = this.dialog;
				this._closePopup = setTimeout(function(){
					popup.close(dialog);
					self._show = false;
				},300);
			}
				
		}
	
	});
	
});