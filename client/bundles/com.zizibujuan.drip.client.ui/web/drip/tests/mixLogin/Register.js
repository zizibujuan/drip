define(["intern!tdd",
        "intern/chai!assert",
        "dojo/_base/window",
        "dojo/string",
        "dojo/dom-construct",
        "drip/mixLogin/Register"], function(
        		tdd,
        		assert,
        		win,
        		string,
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
				register.email.value = " ";
				register.password.value = " ";
				register.loginName.value = " ";
				register.validate();
				var errors = register.errors;
				assert.isTrue(errors.length == 3, "有三个错误信息");
				assert.equal("请输入常用邮箱", errors[0]);
				assert.equal("密码不能全为空格", errors[1]);
				assert.equal("请输入用户名", errors[2]);
			});
			
			test("注册，所有内容都超过默认的长度", function(){
				register.email.value = string.rep("a", 51);
				register.password.value = string.rep("a", 21);
				register.loginName.value = string.rep("a", 21);
				register.validate();
				var errors = register.errors;
				assert.isTrue(errors.length == 3, "有三个错误信息");
				assert.equal("邮箱不能超过50个字符", errors[0]);
				assert.equal("密码长度应为6到20个字符", errors[1]);
				assert.equal("用户名不能多于20个字符", errors[2]);
			});
			
			test("注册，密码小于指定的长度", function(){
				register.email.value = "a@a.com";
				register.password.value = string.rep("a", 5);
				register.loginName.value = "abc";
				register.validate();
				var errors = register.errors;
				assert.isTrue(errors.length == 1, "有一个错误信息");
				assert.equal("密码长度应为6到20个字符", errors[0]);
			});
			
			test("注册，邮箱格式不正确", function(){
				register.email.value = "aa.com";
				register.password.value = "";
				register.loginName.value = "";
				register.validate();
				var errors = register.errors;
				assert.isTrue(errors.length == 3, "有三个错误信息");
				assert.equal("邮箱格式不正确", errors[0]);
			});
			
			test("注册，密码不能全为数字", function(){
				register.email.value = "";
				register.password.value = "123456";
				register.loginName.value = "";
				register.validate();
				var errors = register.errors;
				assert.isTrue(errors.length == 3, "有三个错误信息");
				assert.equal("密码不能全为数字", errors[1]);
			});
			
			test("注册，密码不能全为字母", function(){
				register.email.value = "";
				register.password.value = "abcdef";
				register.loginName.value = "";
				register.validate();
				var errors = register.errors;
				assert.isTrue(errors.length == 3, "有三个错误信息");
				assert.equal("密码不能全为字母", errors[1]);
			});
			
			test("注册，用户名不能以-开头", function(){
				register.email.value = "";
				register.password.value = "";
				register.loginName.value = "-a";
				register.validate();
				var errors = register.errors;
				assert.isTrue(errors.length == 3, "有三个错误信息");
				assert.equal("用户名只能包含英文字母，数字,-或_，不能以-或_开头，不区分大小写", errors[2]);
			});
			
			test("注册，用户名不能包含中文", function(){
				register.email.value = "";
				register.password.value = "";
				register.loginName.value = "一abc";
				register.validate();
				var errors = register.errors;
				assert.isTrue(errors.length == 3, "有三个错误信息");
				assert.equal("用户名只能包含英文字母，数字,-或_，不能以-或_开头，不区分大小写", errors[2]);
			});
			
			test("注册，一个有效的用户名", function(){
				register.email.value = "a@a.com";
				register.password.value = "abc123";
				register.loginName.value = "a-1";
				register.validate();
				var errors = register.errors;
				assert.isTrue(errors.length == 0, "没有错误信息");
			});
		});
	}
	
});