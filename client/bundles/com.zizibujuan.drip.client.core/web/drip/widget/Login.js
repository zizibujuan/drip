define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/keys",
        "dojo/request/xhr",
        "dojo/dom-style",
        "dojo/dom-form",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "dojo/text!./templates/Login.html",
        "dijit/form/Form",
        "dijit/form/ValidationTextBox",
        "dijit/form/CheckBox",
        "dijit/form/Button"], function(
        		declare,
        		lang,
        		keys,
        		xhr,
        		domStyle,
        		domForm,
        		_WidgetBase,
        		_TemplatedMixin,
        		_WidgetsInTemplateMixin,
        		loginTemplate){
	// summary:
	//		登录部件，提供登录到一个网站需要的界面元素和事件。
	//		使用form登录
	
	return declare("drip.widget.Login",[_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin],{
		
		templateString: loginTemplate,
		
		url: "/login/form", // 默认值
		
		// redirectUrl: String
		//		登录成功后跳转的页面
		homeUrl:"/",
		
		// signupUrl: String
		//		用户没有注册时，跳转到注册页面
		signupUrl:"/drip/signup.html",
		
		postCreate: function(){
			this.btnLoginNode.on("click",lang.hitch(this,this._confirmLogin));
			
			this.txtLoginNode.on("keyPress",lang.hitch(this,function(e){
				if(e.keyCode == keys.ENTER){
					this._confirmLogin(e);
				}
			}));
			this.txtPwdNode.on("keyPress",lang.hitch(this,function(e){
				if(e.keyCode == keys.ENTER){
					this._confirmLogin(e);
				}
			}));
			
			this.txtLoginNode.focus();
		},
		
		_confirmLogin: function(e){
			this._showErrorMsg(false);
			var loginForm = this.loginFormNode;
			
			if(loginForm.validate()){
				var sessionInfo = domForm.toJson(loginForm.domNode);
				xhr.post(this.url,{data:sessionInfo, handleAs:"json"}).then(lang.hitch(this,function(response){
					// 登录成功后，跳转到个人首页
					var status = response.status;
					var redirectUrl = "/";
					if(status == "1"){
						redirectUrl = this.homeUrl;
					}else{
						redirectUrl = this.signupUrl;
					}
					window.location = redirectUrl;
				}), function(error){
					// 登录失败后，显示错误信息
					this._showErrorMsg(true);
				});
			}
		},
		
		_showErrorMsg: function(show){
			// summary:
			//		显示错误信息
			// show: boolean
			//		如果值为true，则显示；为false，则不显示。
			
			if(show){
				domStyle.set(this.errorMsgNode,"display","");
			}else{
				domStyle.set(this.errorMsgNode,"display","none");
			}
		}
		
	});
	
});