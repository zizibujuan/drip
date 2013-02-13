require({cache:{
'url:drip/templates/MemberNode.html':"<li>\n\t<a data-dojo-attach-point=\"userImgLinkNode\"><img data-dojo-attach-point=\"userImgNode\"/></a>\n\t<span><a  data-dojo-attach-point=\"userNickNameLinkNode\">昵称</a><em data-dojo-attach-point=\"userRealNameNode\">(姓名)</em></span>\n\t<span><input type=\"button\" data-dojo-attach-point=\"actionNode\"/></span>\n</li>"}});
/**
 * 我关注的人或者关注我的人的用户列表。目前两者通用。
 */
define("drip/MemberList", ["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/request/xhr",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/MemberNode.html"], function(
		declare,
		lang,
		array,
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
			var localUserId = userInfo.id;
			// FIXME:与MiniCard.js中的代码有重复的部分
			// TODO:删除mapUserId
			var userLinkSubfix = userInfo.id+"?mapUserId="+userInfo.mapUserId;
			var displayName = userInfo.displayName || "";
			var userActionLink = "/actions/"+ userLinkSubfix
			
			this.userImgLinkNode.href =  userActionLink;
			this.userImgNode.src = userInfo.largeImageUrl || "";
			this.userImgNode.alt = displayName;
			this.userNickNameLinkNode.innerHTML = displayName;
			this.userNickNameLinkNode.href = userActionLink;
			this.userRealNameNode = userInfo.realName;
			
			if(userInfo.userRelationId){
				this._cancelWatch(localUserId);
			}else{
				this._watch(localUserId);
			}
		},
		
		_cancelWatch: function(localUserId){
			this.actionNode.value = "取消关注";
			on.once(this.actionNode, "click", lang.hitch(this,function(e){
				xhr.put("/follow/"+localUserId,{handleAs:"json",query:{"op":"off"}},lang.hitch(this, function(response){
					this._watch(localUserId);
				}),lang.hitch(this, function(error){
					
				}));
			}));
			
		},
		
		_watch: function(localUserId){
			this.actionNode.value = "+ 关注";
			on.once(this.actionNode, "click", lang.hitch(this, function(response){
				xhr.put("/follow/"+localUserId,{handleAs:"json",query:{"op":"on"}},lang.hitch(this, function(response){
					this._cancelWatch(localUserId);
				}),lang.hitch(this, function(error){
					
				}));
			}));
		}
		
		
	});
	
	declare("drip.MemberList",[_WidgetBase,_TemplatedMixin],{
		
		templateString: "<ul></ul>",
		
		url: null,
		
		emptyHtml: "",
		
		postCreate: function(){
			this.inherited(arguments);
			xhr.get(url,{handleAs:"json"}).then(lang.hitch(this, this._load));
		},
		
		_load: function(items){
			if(items.length == 0){
				 this.domNode.innerHTML = this.emptyHtml;
			 }else{
				 console.log("用户关系：",items);
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
