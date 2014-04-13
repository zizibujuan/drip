define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/request/xhr",
        "dojo/on",
        "dojo/keys",
        "dojo/string",
        "dojo/dom-class",
        "dojo/dom-form",
        "dojo/dom-construct",
        "dojo/dom-attr",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/Register.html",
        "dojo/i18n!./nls/Register"], function(
        		declare,
        		lang,
        		xhr,
        		on,
        		keys,
        		string,
        		domClass,
        		domForm,
        		domConstruct,
        		domAttr,
        		_WidgetBase,
        		_TemplatedMixin,
        		registerTemplate,
        		RegisterMessages){
	
	return declare("drip.mixLogin.Register", [_WidgetBase, _TemplatedMixin], {
		
		templateString: registerTemplate,
		
		errors: [],
		
		postCreate: function(){
			this.inherited(arguments);
			
			domAttr.set(this.email, "placeholder", RegisterMessages.placeholder_email);
			domAttr.set(this.password, "placeholder", RegisterMessages.placeholder_pwd);
			domAttr.set(this.loginName, "placeholder", RegisterMessages.placeholder_login_name);
			
			domAttr.set(this.btnSignup, "innerHTML", RegisterMessages.label_btn_register);
			
			on(this.btnSignup, "click", lang.hitch(this, this._signup));
			
			on(this.email, "keydown", lang.hitch(this, function(e){
				if(e.keyCode == keys.ENTER){
					this._signup();
				}
			}));
			on(this.password, "keydown", lang.hitch(this, function(e){
				if(e.keyCode == keys.ENTER){
					this._signup();
				}
			}));
			on(this.loginName, "keydown", lang.hitch(this, function(e){
				if(e.keyCode == keys.ENTER){
					this._signup();
				}
			}));
			on(this.btnSignup, "keydown", lang.hitch(this, function(e){
				if(e.keyCode == keys.ENTER){
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
			domAttr.set(this.btnSignup, "disabled", true);
			domClass.add(this.btnSignup, "submit_tip");
			this.btnSignup.innerHTML = RegisterMessages.label_btn_registering;
			
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
				errors.push(RegisterMessages.tip_email_required);
			}else if(email.length > 50){
				errors.push(RegisterMessages.tip_email_max_length);
			}else if(!/[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/.test(email)){
				errors.push(RegisterMessages.tip_email_invalid);
			}
			
			if(password == ""){
				errors.push(RegisterMessages.tip_pwd_required);
			}else if(password.length > 0 && string.trim(password) == ""){
				errors.push(RegisterMessages.tip_pwd_not_blank);
			}else if(password.length < 6 || password.length > 20){
				errors.push(RegisterMessages.tip_pwd_length);
			}else if(/^[0-9]+$/.test(password)){
				errors.push(RegisterMessages.tip_pwd_not_all_number);
			}else if(/^[A-Za-z]+$/.test(password)){
				errors.push(RegisterMessages.tip_pwd_not_all_letter);
			}
			
			loginName = string.trim(loginName);
			if(loginName == ""){
				errors.push(RegisterMessages.tip_login_name_required);
			}else if(loginName.length > 20){// 无需计算中文字符，因为下面限制为不能输入中文字符
				errors.push(RegisterMessages.tip_login_name_length)
			}else if(!/^(?![-_])[a-zA-Z0-9_-]+$/.test(loginName)){
				errors.push(RegisterMessages.tip_login_name_invalid);
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
			domAttr.set(this.btnSignup, "disabled", false);
			this.btnSignup.innerHTML = RegisterMessages.label_btn_register;
			domClass.remove(this.btnSignup, "submit_tip");
			
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