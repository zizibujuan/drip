define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/request/notify",
        "dojo/on",
        "dojo/cookie",
        "dojo/dom-class",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/HeaderLoggedIn.html",
        "dojo/text!./templates/HeaderLoggedOut.html",
        "drip/user",
        "drip/browserSupport"], function(
		declare,
		lang,
		notify,
		on,
		cookie,
		domClass,
		_WidgetBase,
		_TemplatedMixin,
		headerLoggedInTemplate,
		headerLoggedOutTemplate,
		user){
	
	// 监控xhr全局事件
	notify("error", function(error){
		if(error.response.status == 401 /*SC_UNAUTHORIZED*/){
			// 约定ajax返回401的数据是一段js脚本。
			eval(error.response.data);
		}
	});
	
	var COOKIE_KEY_LOGGED = "logged_in";
	var COOKIE_KEY_LOGIN_NAME = "zzbj_user";
	
	var loggedIn = cookie(COOKIE_KEY_LOGGED);
	var loginName = cookie(COOKIE_KEY_LOGIN_NAME) || "";
	
	var LoggedInHeader = declare("drip.widget.LoggedInHeader", [_WidgetBase, _TemplatedMixin], {
		templateString: headerLoggedInTemplate,
		
		postCreate: function(){
			this.inherited(arguments);
			
			// 在顶部用户信息区域显示
			var profileImage = this.profileImage;
			// 先设置一个默认头像
			profileImage.src = "/drip/resources/images/profile_50_50.gif";
			profileImage.alt = loginName;
			this.userName.innerHTML = loginName;
			user.getLoggedUserInfo().then(lang.hitch(this,function(userInfo){
				this.userLink.href  = "/users/" + userInfo.id;
				this.userName.innerHTML = profileImage.alt = userInfo.loginName || userInfo.nickName;
				
				var smallImageUrl = userInfo.smallImageUrl;
				if(smallImageUrl != null && smallImageUrl != ""){
					profileImage.src = userInfo.smallImageUrl;
				}
			}), function(error){
				// 获取登录用户信息失败后，要跳转到非登录header
			});
			on(this.logout,"click",user.logout);
		}
	});
	
	var LoggedOutHeader = declare("drip.widget.LoggedOutHeader", [_WidgetBase, _TemplatedMixin], {
		templateString: headerLoggedOutTemplate,
		postCreate: function(){
			this.inherited(arguments);
			
		}
	});
	
	
	
	return declare("drip.widget.Header", [_WidgetBase], {
		
		postCreate: function(){
			this.inherited(arguments);
			
			var header = null;
			// 虽然根据这个cookie判断用户是否登录，有一定的风险，但是却能加快header的渲染，值得承担。
			if(loggedIn && loggedIn == "1"){
				domClass.add(this.domNode, "drip_header drip_header_logged_in");
				header = new LoggedInHeader({});
			}else{
				domClass.add(this.domNode, "drip_header drip_header_logged_out");
				header = new LoggedOutHeader({});
			}
			header.placeAt(this.domNode);
		}
		
	});
	
});