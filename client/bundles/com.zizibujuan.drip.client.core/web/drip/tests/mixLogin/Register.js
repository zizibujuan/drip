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
			
			
			test("注册，所有内容都没有输入", function(){
				register.validate();
				var errors = register.errors;
				assert.isTrue(errors.length == 3, "有三个错误信息");
				assert.equal("请输入常用邮箱", errors[0]);
				assert.equal("请输入密码", errors[1]);
				assert.equal("请输入用户名", errors[2]);
			});
			
			test("注册，所有内容都输入空字符串", function(){
				register.validate();
				var errors = register.errors;
				assert.isTrue(errors.length == 3, "有三个错误信息");
				assert.equal("请输入常用邮箱", errors[0]);
				assert.equal("请输入密码", errors[1]);
				assert.equal("请输入用户名", errors[2]);
			});
		});
	}
	
});