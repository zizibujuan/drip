define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/request/xhr",
        "dojo/on",
        "dojo/string",
        "dojo/dom-form",
        "dojo/dom-construct",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dojo/text!drip/templates/Login.html"], function(
        		declare,
        		lang,
        		xhr,
        		on,
        		string,
        		domForm,
        		domConstruct,
        		_WidgetBase,
        		_TemplatedMixin,
        		loginTemplate){
	
	return declare("drip.mixLogin.Login", [_WidgetBase, _TemplatedMixin], {
		
		templateString: loginTemplate,
		
		errors: [],
		
		postCreate: function(){
			this.inherited(arguments);
			// TODO:敲回车激活按钮
			on(this.btnLogin, "click", lang.hitch(this, this._login));
		},
		
		_login: function(){
			this.validate();
			if(this._hasErrors()){
				this._showErrors();
				return;
			}
			console.log("login");
			var data = domForm.toJson(this.loginForm);
			xhr.post("/login/form", {
				handleAs: "json", 
				data: data
			}).then(lang.hitch(this, this._loginSuccess), lang.hitch(this, this._loginError));
		},
		
		validate: function(){
			var errors = [];
			var login = this.login.value;
			var password = this.password.value;
			
			login = string.trim(login);
			if(login == ""){
				errors.push("请输入邮箱或用户名");
			}
			
			if(password == ""){
				errors.push("请输入密码");
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
				domConstruct.create("li", {innerHTML: errors[i]}, errorContainer);
			}
		},
		
		_loginSuccess: function(){
			// 注册成功，跳转到个人首页
			window.location.href = "/";
		},
		
		_loginError: function(error){
			this.errors = error.response.data;
			this._showErrors();
		}
	});
	
});