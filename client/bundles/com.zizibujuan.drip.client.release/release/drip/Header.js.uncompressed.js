require({cache:{
'url:drip/templates/Header.html':"<div id=\"header\">\n\t<div class=\"wrapper\" style=\"display: block;\">\n\t\t<div class=\"top-logo\">\n\t\t\t<a href=\"/\" title=\"去首页\">孜孜不倦</a>\n\t\t</div>\n\n\t\t<div class=\"top-nav\">\n\t\t\t<!-- 进入此页，用户必须已登录 -->\n\t\t\t<div>\n\t\t\t\t<a data-dojo-attach-point=\"userNode\" href=\"#\">\n\t\t\t\t\t<img data-dojo-attach-point=\"userImageNode\" width=\"20px\" height=\"20px\">\n\t\t\t\t\t<span data-dojo-attach-point=\"userNameNode\" style=\"\">用户名</span>\n\t\t\t\t</a>\n\t\t\t\t<a style=\"margin-left:30px;\" data-dojo-attach-point=\"logoutNode\" href=\"#\">退出</a>\n\t\t\t</div>\n\t\t</div>\n\t\t\n\t\t<div class=\"top-toolbar\" data-dojo-attach-point=\"containerNode\">\n\t\t\t<!-- 这个区域的操作随着页面和用户权限的不同，动态改变 -->\n\t\t\t<!-- 只有登录用户才可以进入该页面 \n\t\t\t\n\t\t\t-->\n\t\t</div>\n\t</div>\n</div>"}});
define("drip/Header", ["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/request/xhr",
        "dojo/on",
        "dijit/_WidgetBase",
        "dijit/form/DropDownButton", 
        "dijit/DropDownMenu", 
        "dijit/MenuItem",
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/Header.html",
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
        		headerTemplate,
        		userSession) {
	
	// TODO：需要一个通用的页面对象，存储页面级别的通用数据。

	return declare("drip.Header", [_WidgetBase,_TemplatedMixin], {
		templateString: headerTemplate,
		
		postCreate : function(){
			// 在服务器端的filter中判断用户是否登录，只有登录的用户才会进入该页面。
			// 这里的功能只是从session中获取用户的登录信息。
			
			// 显示用户头像，用户名和退出链接
			userSession.getLoggedUserInfo().then(lang.hitch(this,function(userInfo){
				this.userNode.href="#"; //TODO：进入用户自己的活动列表
				this.userImageNode.alt = userInfo.displayName;
				if(userInfo.tinyUrl){
					this.userImageNode.src = userInfo.tinyUrl;
				}
				this.userNameNode.innerHTML = userInfo.displayName;
				
		        on(this.logoutNode, "click", function(e){
		        	userSession.logout();
		        });
			}));
		}
	});
});