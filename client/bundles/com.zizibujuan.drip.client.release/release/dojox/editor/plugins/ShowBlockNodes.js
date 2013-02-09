//>>built
define("dojox/editor/plugins/ShowBlockNodes",["dojo","dijit","dojox","dijit/_editor/_Plugin","dijit/form/Button","dijit/form/ToggleButton","dojo/_base/connect","dojo/_base/declare","dojo/i18n","dojo/i18n!dojox/editor/plugins/nls/ShowBlockNodes"],function(dojo,dijit,dojox,_Plugin){return dojo.declare("dojox.editor.plugins.ShowBlockNodes",_Plugin,{useDefaultCommand:!1,iconClassPrefix:"dijitAdditionalEditorIcon",_styled:!1,_initButton:function(){var strings=dojo.i18n.getLocalization("dojox.editor.plugins","ShowBlockNodes");this.button=new dijit.form.ToggleButton({label:strings.showBlockNodes,showLabel:!1,iconClass:this.iconClassPrefix+" "+this.iconClassPrefix+"ShowBlockNodes",tabIndex:"-1",onChange:dojo.hitch(this,"_showBlocks")}),this.editor.addKeyHandler(dojo.keys.F9,!0,!0,dojo.hitch(this,this.toggle))},updateState:function(){this.button.set("disabled",this.get("disabled"))},setEditor:function(editor){this.editor=editor,this._initButton()},toggle:function(){this.button.set("checked",!this.button.get("checked"))},_showBlocks:function(show){var doc=this.editor.document;if(!this._styled)try{this._styled=!0;var style="",blocks=["div","p","ul","ol","table","h1","h2","h3","h4","h5","h6","pre","dir","center","blockquote","form","fieldset","address","object","pre","hr","ins","noscript","li","map","button","dd","dt"],template="@media screen {\n	.editorShowBlocks {TAG} {\n		background-image: url({MODURL}/images/blockelems/{TAG}.gif);\n		background-repeat: no-repeat;\n		background-position: top left;\n		border-width: 1px;\n		border-style: dashed;\n		border-color: #D0D0D0;\n		padding-top: 15px;\n		padding-left: 15px;\n	}\n}\n";dojo.forEach(blocks,function(tag){style+=template.replace(/\{TAG\}/gi,tag)});var modurl=dojo.moduleUrl(dojox._scopeName,"editor/plugins/resources").toString();if(!modurl.match(/^https?:\/\//i)&&!modurl.match(/^file:\/\//i)){var bUrl;if(modurl.charAt(0)==="/"){var proto=dojo.doc.location.protocol,hostn=dojo.doc.location.host;bUrl=proto+"//"+hostn}else bUrl=this._calcBaseUrl(dojo.global.location.href);bUrl[bUrl.length-1]!=="/"&&modurl.charAt(0)!=="/"&&(bUrl+="/"),modurl=bUrl+modurl}style=style.replace(/\{MODURL\}/gi,modurl);if(!dojo.isIE){var sNode=doc.createElement("style");sNode.appendChild(doc.createTextNode(style)),doc.getElementsByTagName("head")[0].appendChild(sNode)}else{var ss=doc.createStyleSheet("");ss.cssText=style}}catch(e){0}show?dojo.addClass(this.editor.editNode,"editorShowBlocks"):dojo.removeClass(this.editor.editNode,"editorShowBlocks")},_calcBaseUrl:function(fullUrl){var baseUrl=null;if(fullUrl!==null){var index=fullUrl.indexOf("?");index!=-1&&(fullUrl=fullUrl.substring(0,index)),index=fullUrl.lastIndexOf("/"),index>0&&index<fullUrl.length?baseUrl=fullUrl.substring(0,index):baseUrl=fullUrl}return baseUrl}}),dojo.subscribe(dijit._scopeName+".Editor.getPlugin",null,function(o){if(o.plugin)return;var name=o.args.name.toLowerCase();name==="showblocknodes"&&(o.plugin=new dojox.editor.plugins.ShowBlockNodes)}),dojox.editor.plugins.ShowBlockNodes})