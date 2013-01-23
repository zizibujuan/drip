define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/request/xhr",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/TooltipDialog",
        "dijit/popup",
        "dojo/text!/templates/MiniCard.html",
        "userSession"], function(
        		declare,
        		lang,
        		xhr,
        		_WidgetBase,
        		_TemplatedMixin,
        		TooltipDialog,
        		popup,
        		miniCardTemplate,
        		userSession){
	
	var MiniCardBody = declare("MiniCardBody",[_WidgetBase,_TemplatedMixin],{
		templateString:miniCardTemplate,
		postCreate: function(){
			this.inherited(arguments);
		},
		
		update: function(localUserId, mapUserId){
			// summary:
			//		更新用户信息
			// userId:[String]
			//		用户标识
			
			// 注意返回deferred对象
			return xhr("/users/"+localUserId,{handleAs:"json",query:{mapUserId:mapUserId}}).then(lang.hitch(this,function(userInfo){
				// 设置用户名片
				
				console.log("userInfo:", userInfo);
				var userLinkSubfix = userInfo.id+"?mapUserId="+userInfo.mapUserId;
				var displayName = userInfo.displayName || "";
				var userActionLink = "/actions/"+ userLinkSubfix
				
				this.userImgLinkNode.href =  userActionLink;
				this.userImgNode.src = userInfo.largeImageUrl || "";
				this.userImgNode.alt = displayName;
				this.userNameLinkNode.innerHTML = displayName;
				this.userNameLinkNode.href = userActionLink;
				this.userSexNode.innerHTML = userInfo.sex || "";
				this.userAddrNode.innerHTML = userInfo.address || "";
				
				this.followNode.innerHTML = userInfo.followCount || 0;
				this.followNode.href = "/follows/"+userLinkSubfix;
				
				this.fanNode.innerHTML = userInfo.fanCount || 0;
				this.fanNode.href = "/fans/"+userLinkSubfix;
				
				this.answerNode.innerHTML = userInfo.answerCount || 0;
				this.answerNode.href = "/answers/"+userLinkSubfix;
				
				this.introNode.innerHTML = userInfo.introduce || "";
				
				if(userInfo.fromSite == 101){
					this.fromSiteNode.innerHTML = "来自<strong>人人</strong>网";
				}
				
				// 操作按钮
				// 如果尚未关注，显示关注按钮
				// 如果已经关注，显示取消关注按钮
				// 如果显示的是自己的名片，则不显示操作按钮
				
				
				
				
				/*
				id: 本地用户标识，即localUserId
		 		mapUserId：用户映射标识
		 		displayName: 显示名
		 		fanCount：粉丝数
		 		followCount: 关注人数
		 		exerDraftCount： 习题草稿数
		 		exerPublishCount：发布的习题数
		 		answerCount： 习题总数 = 习题草稿数+发布的习题数
		 		smallImageUrl: 小头像
		 		largeImageUrl: 
		 		largerImageUrl:
		 		xLargeImageUrl:
		 		*/
		 			
			}));
		}
	})
	
	return declare("MiniCard", null, {
		
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