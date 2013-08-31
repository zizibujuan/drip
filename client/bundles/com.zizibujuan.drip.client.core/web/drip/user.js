define(["dojo/dom",
        "dojo/dom-construct",
        "dojo/request/xhr"], function(
        		dom,
        		domConstruct,
        		xhr){
	// summary:
	//	获取当前登录用户信息,返回一个deffered对象，或者直接提供一个方法，用来在浏览器中显示用户信息。
	
	var user = {};
	
	var userInfo = null;
	
	user.getLoggedUserInfo = function(){
		// summary:
		//		获取用户信息，返回一个deferred对象。
		//		注意，该方法触发的越早越好。
		
		if(userInfo != null)return userInfo;
		
		userInfo =  xhr.get("/users/",{handleAs:"json"}).then(function(data){
			console.log("user:",data);
			return data;
		},function(error){
			console.error(error);
			// 如果获取登录信息失败，则跳转到公共首页
			window.location.href="/";
		});
		return userInfo;
	};
	
	user.getLoggedUserStatistics = function(){
		return  xhr("/users/",{handleAs:"json",query:{type:"statistics"}}).then(function(data){
			console.log("statistics:",data);
			return data;
		});
	};
	
	user.showProfile = function(){
		// summary:
		//		显示用户信息。
		//		在两个地方显示用户信息，一是在最顶部的工具栏中；二是在右侧的用户信息区域。
		//		TODO:该方法放在这里不合适
		
		this.getLoggedUserInfo().then(function(user){
			var profileDiv = dom.byId("userProfile");
			
			var href = "#"
			// 这里需要一个url和用户标识，点击这个链接后，进入一个页面，该页面只显示用户自己的操作，不显示关注好友的操作。
			var aImg = domConstruct.create("a",{href:href},profileDiv);
			// 系统中给出一个默认的头像
			if(!user.headUrl)user.headUrl = "";
			var imgUser = domConstruct.create("img",{alt:user.nickName,src:user.headUrl,width:"80px",height:"80px"},aImg);
			
			var aLabel = domConstruct.create("a",{href:href,alt:user.nickName,innerHTML:user.nickName},profileDiv);
			
			// 粉丝数
			var aFanCount = domConstruct.create("a",{href:"#"}, profileDiv);
			var fanCountSpan = domConstruct.create("span",{innerHTML:"粉丝"+user.fanCount},aFanCount);
			// 关注数
			var aFollowCount = domConstruct.create("a",{href:"#"},profileDiv);
			var followCountSpan = domConstruct.create("span",{innerHTML:"关注"+user.followCount},aFollowCount);
		});
	};
	
	// 提供logout方法
	user.logout = function(){
		xhr("/logout/",{method:"POST", handleAs:"json"}).then(function(data){
    		
    	},function(error){
    		window.location.href = "/";
    	});
	};
	
	user.getSimpleUserInfo = function(digitalId/*用户的数字帐号*/){
		// summary:
		//		根据用户帐号获取用户信息
		// digitalId: String
		//		用户的数字帐号，如果为null，则默认获取登录用户的信息
		
		digitalId = digitalId || "";
		return xhr("/users/"+digitalId,{handleAs:"json", query:{type:"simple"}}).then(function(data){
			return data;
		},function(error){
			console.error(error);
		});
	};
	
	return user;
});