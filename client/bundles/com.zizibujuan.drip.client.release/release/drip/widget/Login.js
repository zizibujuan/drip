//>>built
require({cache:{"url:drip/widget/templates/Login.html":'<div style="width: 250px">\n<\!-- form\u7684\u5bbd\u5ea6\u8981\u5728\u521d\u59cb\u5316\u65f6\u901a\u8fc7style\u8bbe\u7f6e, style="width: 250px"--\>\n\t<div data-dojo-attach-point="errorMsgNode" style="color: red;font-weight: bold;text-align: center;display: none;">\n\t\t\u65e0\u6548\u7684\u7528\u6237\u540d\u6216\u5bc6\u7801\n\t</div>\n\t<div data-dojo-type="dijit/form/Form" data-dojo-attach-point="loginFormNode">\n\t\t<div data-dojo-type="dijit/form/ValidationTextBox"\n\t\tdata-dojo-attach-point="txtLoginNode"\n\t\tstyle="margin-bottom: 10px;display: block;padding: 8px;width:233px" \n\t\tdata-dojo-props="\'placeholder\':\'\u90ae\u7bb1/\u624b\u673a\u53f7/\u7528\u6237\u540d\',\n\t\t\'required\':true,\n\t\t\'name\':\'login\',\n\t\t\'missingMessage\':\'\u8bf7\u8f93\u5165\u767b\u5f55\u540d\'"></div>\n\t\t<div data-dojo-type="dijit/form/ValidationTextBox"\n\t\tdata-dojo-attach-point="txtPwdNode"\n\t\tstyle="display: block;padding: 8px;width:233px" \n\t\tdata-dojo-props="\'type\':\'password\',\n\t\t\'placeholder\':\'\u5bc6\u7801\',\n\t\t\'required\':true, \n\t\t\'name\':\'password\',\n\t\t\'missingMessage\':\'\u8bf7\u8f93\u5165\u5bc6\u7801\'"></div>\n\t\t<div style="padding-top: 3px; padding-bottom: 3px">\n\t\t\t<div data-dojo-type="dijit/form/CheckBox" id="rememberMe"></div><label for="rememberMe">\u4e0b\u6b21\u81ea\u52a8\u767b\u5f55</label>\n\t\t\t<span style="float: right"><a href="#">\u5fd8\u8bb0\u5bc6\u7801\uff1f</a></span>\n\t\t</div>\n\t\t<div style="text-align: center;">\n\t\t\t<div data-dojo-type="dijit/form/Button" style="font-size: 14px; margin-top: 10px;" data-dojo-attach-point="btnLoginNode">\u767b\u5f55</div>\n\t\t</div>\n\t</div>\n</div>'}});
define("drip/widget/Login","dojo/_base/declare,dojo/_base/lang,dojo/keys,dojo/request/xhr,dojo/dom-style,dojo/dom-form,dijit/_WidgetBase,dijit/_TemplatedMixin,dijit/_WidgetsInTemplateMixin,dojo/text!./templates/Login.html,dijit/form/Form,dijit/form/ValidationTextBox,dijit/form/CheckBox,dijit/form/Button".split(","),function(e,b,c,f,d,g,h,i,j,k){return e("drip.widget.Login",[h,i,j],{templateString:k,url:"/login/form",postCreate:function(){this.btnLoginNode.on("click",b.hitch(this,this._confirmLogin));
this.txtLoginNode.on("keyPress",b.hitch(this,function(a){a.keyCode==c.ENTER&&this._confirmLogin(a)}));this.txtPwdNode.on("keyPress",b.hitch(this,function(a){a.keyCode==c.ENTER&&this._confirmLogin(a)}));this.txtLoginNode.focus()},_confirmLogin:function(){this._showErrorMsg(!1);var a=this.loginFormNode;a.validate()&&(a=g.toJson(a.domNode),f.post(this.url,{data:a,handleAs:"json"}).then(function(){window.location="/"},function(){this._showErrorMsg(!0)}))},_showErrorMsg:function(a){a?d.set(this.errorMsgNode,
"display",""):d.set(this.errorMsgNode,"display","none")}})});