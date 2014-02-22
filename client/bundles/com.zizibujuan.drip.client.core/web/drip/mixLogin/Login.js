define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/request/xhr",
        "dojo/on",
        "dojo/keys",
        "dojo/string",
        "dojo/dom-form",
        "dojo/dom-construct",
        "dojo/dom-attr",
        "dojo/dom-class",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dojo/text!drip/templates/Login.html",
        "dojo/i18n!drip/nls/Login"], function(
        		declare,
        		lang,
        		xhr,
        		on,
        		keys,
        		string,
        		domForm,
        		domConstruct,
        		domAttr,
        		domClass,
        		_WidgetBase,
        		_TemplatedMixin,
        		loginTemplate,
        		LoginMessages){
	
	return declare("drip.mixLogin.Login", [_WidgetBase, _TemplatedMixin], {
		
		templateString: loginTemplate,
		
		errors: [],
		
		postCreate: function(){
			this.inherited(arguments);

			domAttr.set(this.login, "placeholder", LoginMessages.placeholder_user);
			domAttr.set(this.password, "placeholder", LoginMessages.placeholder_pwd);
			domAttr.set(this.btnLogin, "innerHTML", LoginMessages.label_btn_login);
			
			on(this.btnLogin, "click", lang.hitch(this, this._login));
			
			on(this.login, "keydown", lang.hitch(this, function(e){
				if(e.keyCode == keys.ENTER){
					this._login();
				}
			}));
			on(this.password, "keydown", lang.hitch(this, function(e){
				if(e.keyCode == keys.ENTER){
					this._login();
				}
			}));
			on(this.btnLogin, "keydown", lang.hitch(this, function(e){
				if(e.keyCode == keys.ENTER){
					this._login();
				}
			}));
		},
		
		_login: function(e){
			this.validate();
			if(this._hasErrors()){
				this._showErrors();
				return;
			}
			console.log("login");
			domAttr.set(this.btnLogin, "disabled", true);
			domClass.add(this.btnLogin, "submit_tip");
			this.btnLogin.innerHTML = LoginMessages.label_btn_logining;
			
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
				errors.push(LoginMessages.tip_user_required);
			}
			
			if(password == ""){
				errors.push(LoginMessages.tip_pwd_required);
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
		
		_loginSuccess: function(){
			// 注册成功，跳转到个人首页
			window.location.href = "/";
		},
		
		_loginError: function(error){
			
			domAttr.set(this.btnLogin, "disabled", false);
			this.btnLogin.innerHTML = LoginMessages.label_btn_login;
			domClass.remove(this.btnLogin, "submit_tip");
			
			
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
				this.login.focus();
			}),0);
		}
	});
	
});