require({cache:{
'url:drip/widget/templates/Login.html':"<div style=\"width: 250px\">\n<!-- form的宽度要在初始化时通过style设置, style=\"width: 250px\"-->\n\t<div data-dojo-attach-point=\"errorMsgNode\" style=\"color: red;font-weight: bold;text-align: center;display: none;\">\n\t\t无效的用户名或密码\n\t</div>\n\t<div data-dojo-type=\"dijit/form/Form\" data-dojo-attach-point=\"loginFormNode\">\n\t\t<div data-dojo-type=\"dijit/form/ValidationTextBox\"\n\t\tdata-dojo-attach-point=\"txtLoginNode\"\n\t\tstyle=\"margin-bottom: 10px;display: block;padding: 8px;width:233px\" \n\t\tdata-dojo-props=\"'placeholder':'邮箱/手机号/用户名',\n\t\t'required':true,\n\t\t'name':'login',\n\t\t'value':'c@c.com',\n\t\t'missingMessage':'请输入登录名'\"></div>\n\t\t<div data-dojo-type=\"dijit/form/ValidationTextBox\"\n\t\tdata-dojo-attach-point=\"txtPwdNode\"\n\t\tstyle=\"display: block;padding: 8px;width:233px\" \n\t\tdata-dojo-props=\"'type':'password',\n\t\t'placeholder':'密码',\n\t\t'required':true, \n\t\t'name':'password',\n\t\t'value':'123qaz',\n\t\t'missingMessage':'请输入密码'\"></div>\n\t\t<div style=\"padding-top: 3px; padding-bottom: 3px\">\n\t\t\t<div data-dojo-type=\"dijit/form/CheckBox\" id=\"rememberMe\"></div><label for=\"rememberMe\">下次自动登录</label>\n\t\t\t<span style=\"float: right\"><a href=\"#\">忘记密码？</a></span>\n\t\t</div>\n\t\t<div style=\"text-align: center;\">\n\t\t\t<div data-dojo-type=\"dijit/form/Button\" style=\"font-size: 14px; margin-top: 10px;\" data-dojo-attach-point=\"btnLoginNode\">登录</div>\n\t\t</div>\n\t</div>\n</div>"}});
define("drip/widget/Login", ["dojo/_base/declare",
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
				xhr.post(this.url,{data:sessionInfo, handleAs:"json"}).then(function(response){
					// 登录成功后，跳转到个人首页
					window.location = "/";
				}, function(error){
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