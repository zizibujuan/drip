require({cache:{
'url:drip/templates/LoggedInHeader.html':"<div class=\"drip_header drip_header_logged_out\">\n\t<div class=\"container clearfix\">\n\t\t<a href=\"/\" class=\"drip_header_logo\">\n\t\t\t<img alt=\"孜孜不倦\" width=\"140px\" height=\"40px\" src=\"drip/resources/images/home_logo.png\">\n\t\t</a>\n\t\t<span class=\"drip_version\">测试版</span>\n\t\t<ul class=\"drip_top_nav\">\n\t\t\t<li><a href=\"/exercises\">题库</a></li>\n\t\t\t<!-- <li><a href=\"#\">开发博客</a></li>  -->\n\t\t</ul>\n\t</div>\n</div>",
'url:drip/templates/LoggedOutHeader.html':"<div>\n\n</div>"}});
define("drip/Header", ["dojo/_base/declare",
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
        "drip/userSession"
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
        		userSession) {
	
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
			userSession.getLoggedUserInfo().then(lang.hitch(this,function(userInfo){
				this.userNode.href="#"; //TODO：进入用户自己的活动列表
				this.userImageNode.alt = userInfo.nickName;
				if(userInfo.tinyUrl){
					this.userImageNode.src = userInfo.tinyUrl;
				}
				this.userNameNode.innerHTML = userInfo.nickName;
				
		        on(this.logoutNode, "click", function(e){
		        	userSession.logout();
		        });
			}));
		}
	});
});