//>>built
define("dojox/widget/PortletSettings",["dojo/_base/declare","dojo/_base/kernel","dojo/fx","dijit/TitlePane"],function(b,c,d,e){return b("dojox.widget.PortletSettings",[dijit._Container,dijit.layout.ContentPane],{portletIconClass:"dojoxPortletSettingsIcon",portletIconHoverClass:"dojoxPortletSettingsIconHover",postCreate:function(){dojo.style(this.domNode,"display","none");dojo.addClass(this.domNode,"dojoxPortletSettingsContainer");dojo.removeClass(this.domNode,"dijitContentPane")},_setPortletAttr:function(a){this.portlet=
a},toggle:function(){var a=this.domNode;"none"==dojo.style(a,"display")?(dojo.style(a,{display:"block",height:"1px",width:"auto"}),dojo.fx.wipeIn({node:a}).play()):dojo.fx.wipeOut({node:a,onEnd:dojo.hitch(this,function(){dojo.style(a,{display:"none",height:"",width:""})})}).play()}})});
//@ sourceMappingURL=PortletSettings.js.map