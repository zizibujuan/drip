define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/on",
        "dojo/request/xhr",
        "dojo/dom-construct",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/TooltipDialog",
        "dijit/popup",
        "dojo/text!./templates/MiniCard.html",
        "drip/user",
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
        		user,
        		classCode){
	
	var MiniCardBody = declare("drip.MiniCardBody",[_WidgetBase,_TemplatedMixin],{
		templateString:miniCardTemplate,
		postCreate: function(){
			this.inherited(arguments);
		},
		
		update: function(digitalId){
			// summary:
			//		更新用户信息
			// digitalId:[String]
			//		用户数字帐号
			
			// 注意返回deferred对象
			return xhr("/users/"+digitalId,{handleAs:"json"}).then(lang.hitch(this,function(userInfo){
				// 设置用户名片
				debugger;
				console.log("userInfo:", userInfo);
				var userLinkSubfix = userInfo.id+"?mapUserId="+userInfo.mapUserId;
				var displayName = userInfo.nickName || "";
				var userActionLink = "/actions/"+ userLinkSubfix
				
				this.userImgLinkNode.href =  userActionLink;
				this.userImgNode.src = userInfo.largeImageUrl || "/drip/resources/images/profile_180_180.gif";
				this.userImgNode.alt = displayName;
				this.userNameLinkNode.innerHTML = displayName;
				this.userNameLinkNode.href = userActionLink;
				if(userInfo.sex == null){
					this.userSexNode.innerHTML = "";
				}else{
					this.userSexNode.innerHTML = classCode.sex[userInfo.sex];
				}
				
				if(userInfo.homeCity){
					this.userAddrNode.innerHTML = userInfo.homeCity.province + " " + userInfo.homeCity.city;
				}else{
					this.userAddrNode.innerHTML =  "";
				}
				
				
				this.followNode.href = "/follows/"+userLinkSubfix;
				// 在后面查找text节点，如果没有则添加
				this._appendCount(this.followNode, userInfo.followCount||0);
				
				this.fanNode.href = "/fans/"+userLinkSubfix;
				this._appendCount(this.fanNode, userInfo.fanCount||0);
				
				// FIXME：链接冲突。
				this.exerciseNode.href = "/exercises/"+userLinkSubfix;
				this._appendCount(this.exerciseNode, userInfo.exerCount||0);
				
				this.answerNode.href = "/answers/"+userLinkSubfix;
				this._appendCount(this.answerNode, userInfo.answerCount||0);
				
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
				var loginMapUserId = user.getLoggedUserInfo()["mapped_user_id"];
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
		
		_appendCount: function(previous, count){
			var next = previous.nextSibling;
			if(next == null){
				next = document.createTextNode(count);
				previous.parentNode.appendChild(next);
			}else{
				next.textContent = count;
			}
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
		
		
		
		show: function(target, digitalId){
			// summary:
			//		显示迷你名片
			// target: domNode
			// digitalId: String
			//		数字帐号
			
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
			
			dialog.containerNode.innerHTML = "<i class=\"icon-refresh icon-spin\"></i>  加载中...";
			miniCardBody.update(digitalId).then(function(){
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