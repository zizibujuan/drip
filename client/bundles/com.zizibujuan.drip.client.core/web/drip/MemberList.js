/**
 * 我关注的人或者关注我的人的用户列表。目前两者通用。
 */
define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-construct",
        "dojo/on",
        "dojo/topic",
        "dojo/request/xhr",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/MemberNode.html"], function(
		declare,
		lang,
		array,
		domConstruct,
		on,
		topic,
		xhr,
		_WidgetBase,
		_TemplatedMixin,
		memberNodeTemplate){
	
	var MemberNode = declare("drip.MemberNode",[_WidgetBase,_TemplatedMixin],{
		
		templateString:memberNodeTemplate,
		
		data: {},
		
		postCreate: function(){
			this.inherited(arguments);
			
			var userInfo = this.data;
			var localUserId = userInfo.localUserId;
			// FIXME:与MiniCard.js中的代码有重复的部分
			var displayName = userInfo.nickName || userInfo.loginName;
			var userActionLink = "/users/"+userInfo.digitalId;
			
			this.userImgLinkNode.href =  userActionLink;
			this.userImgNode.src = userInfo.smallImageUrl || "/drip/resources/images/profile_50_50.gif";
			this.userImgNode.alt = displayName;
			this.userNickNameLinkNode.innerHTML = displayName;
			this.userNickNameLinkNode.href = userActionLink;
			if(userInfo.realName){
				this.userRealNameNode.innerHTML = "("+userInfo.realName+")";
			}else{
				this.userRealNameNode.innerHTML = "";
			}
			
			// 如果我关注了别人，则打开别人的粉丝页面时，我不能关注自己，即不显示关注按钮
			var connectUserId = userInfo.connectUserId;
			if(userInfo.watched == "0"){
				domConstruct.destroy(this.actionNode);
			}else if(userInfo.watched  == "1"){
				this._cancelWatch(connectUserId);
			}else if(userInfo.watched == "2"){
				this._watch(connectUserId);
			}
		},
		
		_cancelWatch: function(connectUserId){
			this.actionNode.value = "取消关注";
			on.once(this.actionNode, "click", lang.hitch(this,function(e){
				xhr.put("/follow/"+connectUserId,{handleAs:"json",query:{"op":"off"}}).then(lang.hitch(this, function(response){
					this._watch(connectUserId);
					this.updateFollowingCount(-1);
				}),lang.hitch(this, function(error){
					
				}));
			}));
			
		},
		
		_watch: function(connectUserId){
			this.actionNode.value = "+ 关注";
			on.once(this.actionNode, "click", lang.hitch(this, function(response){
				xhr.put("/follow/"+connectUserId,{handleAs:"json",query:{"op":"on"}}).then(lang.hitch(this, function(response){
					this._cancelWatch(connectUserId);
					this.updateFollowingCount(1);
				}),lang.hitch(this, function(error){
					
				}));
			}));
		},
		
		updateFollowingCount: function(deltaNum){
			topic.publish("memberList/updateFollowingCount",deltaNum);
		}
		
		
	});
	
	return declare("drip.MemberList",[_WidgetBase,_TemplatedMixin],{
		
		templateString: "<ul class='members'></ul>",
		
		url: null,
		
		emptyHtml: "",
		
		postCreate: function(){
			this.inherited(arguments);
			console.log("memberList#postCreate",this.url);
			xhr.get(this.url,{handleAs:"json",preventCache:true}).then(lang.hitch(this, this._load));
		},
		
		_load: function(items){
			console.log("用户关系：",items);
			if(items.length == 0){
				 this.domNode.innerHTML = this.emptyHtml;
			 }else{
				 array.forEach(items, lang.hitch(this,function(item, index){
					 var node = new MemberNode({
						 data : item
					 });
					 this.domNode.appendChild(node.domNode);
				 }));
			 }
		}
		
	})
});
