define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/request/xhr",
        "dojo/on",
        "dojo/keys",
        "dojo/string",
        "dojo/dom-form",
        "dojo/dom-construct",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dojo/text!drip/templates/Register.html"], function(
        		declare,
        		lang,
        		xhr,
        		on,
        		keys,
        		string,
        		domForm,
        		domConstruct,
        		_WidgetBase,
        		_TemplatedMixin,
        		registerTemplate){
	
	return declare("drip.mixLogin.Register", [_WidgetBase, _TemplatedMixin], {
		
		templateString: registerTemplate,
		
		errors: [],
		
		postCreate: function(){
			this.inherited(arguments);
			
			on(this.btnSignup, "click", lang.hitch(this, this._signup));
			
			on(this.email, "keyup", lang.hitch(this, function(e){
				if(event.keyCode == keys.ENTER){
					this._signup();
				}
			}));
			on(this.password, "keyup", lang.hitch(this, function(e){
				if(event.keyCode == keys.ENTER){
					this._signup();
				}
			}));
			on(this.loginName, "keyup", lang.hitch(this, function(e){
				if(event.keyCode == keys.ENTER){
					this._signup();
				}
			}));
			on(this.btnSignup, "keydown", lang.hitch(this, function(e){
				if(event.keyCode == keys.ENTER){
					this._signup();
				}
			}));
		},
		
		_signup: function(){
			this.validate();
			if(this._hasErrors()){
				this._showErrors();
				return;
			}
			console.log("signup");
			var data = domForm.toJson(this.signupForm);
			xhr.post("/users", {
				handleAs: "json", 
				data: data
			}).then(lang.hitch(this, this._signupSuccess), lang.hitch(this, this._signupError));
		},
		
		validate: function(){
			var errors = [];
			var email = this.email.value;
			var password = this.password.value;
			var loginName = this.loginName.value;
			
			email = string.trim(email);
			if(email == ""){
				errors.push("请输入常用邮箱");
			}else if(email.length > 50){
				errors.push("邮箱不能超过50个字符");
			}else if(!/[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/.test(email)){
				errors.push("邮箱格式不正确");
			}
			
			if(password == ""){
				errors.push("请输入密码");
			}else if(password.length > 0 && string.trim(password) == ""){
				errors.push("密码不能全为空格");
			}else if(password.length < 6 || password.length > 20){
				errors.push("密码长度应为6到20个字符");
			}else if(/^[0-9]+$/.test(password)){
				errors.push("密码不能全为数字");
			}else if(/^[A-Za-z]+$/.test(password)){
				errors.push("密码不能全为字母");
			}
			
			loginName = string.trim(loginName);
			if(loginName == ""){
				errors.push("请输入用户名");
			}else if(loginName.length > 20){// 无需计算中文字符，因为下面限制为不能输入中文字符
				errors.push("用户名不能多于20个字符")
			}else if(!/^(?![-_])[a-zA-Z0-9_-]+$/.test(loginName)){
				errors.push("用户名只能包含英文字母，数字,-或_，不能以-或_开头，不区分大小写");
			}
			
			this.errors = errors;
		},
		
		_hasErrors: function(){
			return this.errors.length > 0;
		},
		
		_showErrors: function(){
			var errorContainer = this.errorContainer
			domConstruct.empty(errorContainer);
			
			var errors = this.errors;
			var len = errors.length;
			for(var i = 0; i < len; i++){
				domConstruct.create("li", {innerHTML: errors[i], "class": "error"}, errorContainer);
			}
		},
		
		_signupSuccess: function(){
			// 注册成功，跳转到个人首页
			window.location.href = "/";
		},
		
		_signupError: function(error){
			if(error.response.data){
				this.errors = error.response.data;
				this._showErrors();
			}else{
				console.error(error);
			}
		},
		
		startup: function(){
			this.inherited(arguments);
			setTimeout(lang.hitch(this, function(){
				this.email.focus();
			}),0);
		}
		
	});
	
});