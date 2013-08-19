define(["intern!tdd",
        "intern/chai!assert",
        "dojo/_base/window",
        "dojo/dom-construct",
        "drip/mixLogin/Register"], function(
        		tdd,
        		assert,
        		win,
        		domConstruct,
        		Register){
	
	with(tdd){
		suite("User Register", function(){
			var register, div;
			
			before(function () {
				div = domConstruct.create("div", {}, win.body());
				register = new Register({}, div);
			});
			
			after(function(){
				register.destroyRecursive();
				domConstruct.destroy(div);
			});
			
			
			test("注册，用户名、密码和邮箱输入正确", function(){
				register.set("loginName", "aa");
				register.set("password", "123456");
				register.set("email", "a@a.com");
				register.signUp().then(function(result){
					// 注册成功之后返回什么信息呢？
				});
			});
		});
	}
	
});