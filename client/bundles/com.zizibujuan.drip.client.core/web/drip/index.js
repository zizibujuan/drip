define([ "dojo/parser",
         "dojo/_base/window",
         "dojo/cookie",
         "dojo/dom",
         "dojo/dom-style",
         "dojo/on",
         "drip/mixLogin/Register",
         "drip/mixLogin/Login",
         "dojo/domReady!"], function(
        		 parser,
        		 win,
        		 cookie,
        		 dom,
        		 domStyle,
        		 on,
        		 Register,
        		 Login){
	
	var user = cookie("zzbj_user");
	var loggedIn = cookie("loggedIn");
	var link = dom.byId("link");
	
	var widget = null;
	var showRegister = false;
	if(user == null){
		showRegister = true;
	}else{// 说明已注册过,显示登录部件
		showRegister = false;
	}
	toggle(showRegister);
	
	domStyle.set(win.body(), "visibility", "visible");
	on(link, "click", function(e){
		showRegister = !showRegister;
		toggle(showRegister);
	});
	
	function toggle(showRegister){
		if(widget){
			widget.destroyRecursive();
		}
		if(showRegister){
			widget = new Register();
			link.innerHTML = "我要登录";
		}else{
			widget = new Login();
			link.innerHTML = "我要注册一个新帐号";
		}
		widget.placeAt("authContainer");
	}
		
});