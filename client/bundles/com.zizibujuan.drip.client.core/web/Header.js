define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/request/xhr",
        "dijit/_WidgetBase",
        "dijit/form/DropDownButton", 
        "dijit/DropDownMenu", 
        "dijit/MenuItem",
        "dijit/_TemplatedMixin",
        "dojo/text!/templates/Header.html",
        "userSession"
        ], function(
        		declare,
        		lang,
        		xhr,
        		_WidgetBase,
	       		DropDownButton,
	       		DropDownMenu,
	       		MenuItem,
        		_TemplatedMixin,
        		headerTemplate,
        		userSession) {
	
	// TODO：需要一个通用的页面对象，存储页面级别的通用数据。

	return declare("Header", [_WidgetBase,_TemplatedMixin], {
		templateString: headerTemplate,
		
		postCreate : function(){
			userSession.showProfile();
			
			// 在服务器端的filter中判断用户是否登录，只有登录的用户才会进入该页面。
			// 这里的功能只是从session中获取用户的登录信息。
			userSession.getLoggedUserInfo().then(lang.hitch(this,function(response){
				var menu = new DropDownMenu({ style: "display: none;"});
//		        var menuSetting = new MenuItem({
//		            label: "设置"
//		        });
//		        menu.addChild(menuSetting);
//		        
//		        menuSetting.on("click", function(e){
//		        	window.location = "/settings";
//		        });

		        var menuLogout = new MenuItem({
		            label: "注销"
		        });
		        menu.addChild(menuLogout);

		        var button = new DropDownButton({
		            label: response.displayName,
		            dropDown: menu
		        });
		        this.userMenu.appendChild(button.domNode);
		        
		        
		        menuLogout.on("click", function(e){
		        	userSession.logout();
		        });
				
			}),function(error){
				window.location = "/";
			});
		}
	});
});