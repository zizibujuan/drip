define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/request/xhr",
        "dojo/on",
        "dijit/_WidgetBase",
        "dijit/form/DropDownButton",
        "dijit/DropDownMenu",
        "dijit/MenuItem",
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/LoggedInHeader.html",
        "dojo/text!./templates/LoggedOutHeader.html",
        "drip/user"
        ], function(
        		declare,
        		lang,
        		xhr,
        		on,
        		_WidgetBase,
	       		DropDownButton,
	       		DropDownMenu,
	       		MenuItem,
        		_TemplatedMixin,
        		loggedInHeaderTemplate,
        		loggedOutHeaderTemplate,
        		user) {
	
	// TODO：需要一个通用的页面对象，存储页面级别的通用数据。 FIXME NOW!!!
	
	// 添加两个头部模块，一个是登录的，一个是未登录的。
	
	var LoggedInHeader = declare("drip.LoggedInHeader",[_WidgetBase,_TemplatedMixin],{
		
		templateString: loggedInHeaderTemplate,
		
		postCreate: function(){
			this.inherited(arguments);
			
			
		}
	});
	
	var LoggedOutHeader = declare("drip.LoggedOutHeader",[_WidgetBase,_TemplatedMixin],{
		
		templateString: loggedOutHeaderTemplate,
		
		postCreate: function(){
			this.inherited(arguments);
			
		}
	});
	

	return declare("drip.Header", [_WidgetBase,_TemplatedMixin], {
		templateString: headerTemplate,
		
		postCreate : function(){
			// 在服务器端的filter中判断用户是否登录，只有登录的用户才会进入该页面。
			// 这里的功能只是从session中获取用户的登录信息。
			
			// 显示用户头像，用户名和退出链接
			user.getLoggedUserInfo().then(lang.hitch(this,function(userInfo){
				this.userNode.href="#"; //TODO：进入用户自己的活动列表
				this.userImageNode.alt = userInfo.nickName;
				if(userInfo.tinyUrl){
					this.userImageNode.src = userInfo.tinyUrl;
				}
				this.userNameNode.innerHTML = userInfo.nickName;
				
		        on(this.logoutNode, "click", function(e){
		        	user.logout();
		        });
			}));
		}
	});
});