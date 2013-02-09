//>>built
require({cache:{"url:dojox/form/resources/Uploader.html":'<span class="dijit dijitReset dijitInline"\n	><span class="dijitReset dijitInline dijitButtonNode"\n		data-dojo-attach-event="ondijitclick:_onClick"\n		><span class="dijitReset dijitStretch dijitButtonContents"\n			data-dojo-attach-point="titleNode,focusNode"\n			role="button" aria-labelledby="${id}_label"\n			><span class="dijitReset dijitInline dijitIcon" data-dojo-attach-point="iconNode"></span\n			><span class="dijitReset dijitToggleButtonIconChar">&#x25CF;</span\n			><span class="dijitReset dijitInline dijitButtonText"\n				id="${id}_label"\n				data-dojo-attach-point="containerNode"\n			></span\n		></span\n	></span\n	> \n	<input ${!nameAttrSetting} type="${type}" value="${value}" class="dijitOffScreen" tabIndex="-1" data-dojo-attach-point="valueNode" />\n</span>\n'}}),define("dojox/form/Uploader",["dojo/_base/kernel","dojo/_base/declare","dojo/_base/lang","dojo/_base/array","dojo/_base/connect","dojo/_base/window","dojo/dom-style","dojo/dom-class","dojo/dom-geometry","dojo/dom-attr","dojo/dom-construct","dojo/dom-form","dijit","dijit/form/Button","./uploader/_Base","./uploader/_HTML5","./uploader/_IFrame","./uploader/_Flash","dojo/i18n!./nls/Uploader","dojo/text!./resources/Uploader.html"],function(kernel,declare,lang,array,connect,win,domStyle,domClass,domGeometry,domAttr,domConstruct,domForm,dijit,Button,Base,HTML5,IFrame,Flash,res,template){return declare("dojox.form.Uploader",[Base,Button,HTML5,IFrame,Flash],{uploadOnSelect:!1,tabIndex:0,multiple:!1,label:res.label,url:"",name:"uploadedfile",flashFieldName:"",force:"",uploadType:"",showInput:"",focusedClass:"dijitButtonHover",_nameIndex:0,templateString:template,baseClass:"dijitUploader "+Button.prototype.baseClass,postMixInProperties:function(){this._inputs=[],this._cons=[],this.force=this.force.toLowerCase(),this.supports("multiple")?this.uploadType=this.force==="form"?"form":"html5":this.uploadType=this.force==="flash"?"flash":"iframe",this.inherited(arguments)},buildRendering:function(){this.inherited(arguments),domStyle.set(this.domNode,{overflow:"hidden",position:"relative"}),this._buildDisplay(),domAttr.set(this.titleNode,"tabIndex",-1)},_buildDisplay:function(){this.showInput&&(this.displayInput=domConstruct.create("input",{"class":"dijitUploadDisplayInput",tabIndex:-1,autocomplete:"off"},this.containerNode,this.showInput),this._attachPoints.push("displayInput"),this.connect(this,"onChange",function(files){var i=0,l=files.length,f,r=[];while(f=files[i++])f&&f.name&&r.push(f.name);this.displayInput.value=r.join(", ")}),this.connect(this,"reset",function(){this.displayInput.value=""}))},startup:function(){if(this._buildInitialized)return;this._buildInitialized=!0,this._getButtonStyle(this.domNode),this._setButtonStyle(),this.inherited(arguments)},onChange:function(fileArray){},onBegin:function(dataArray){},onProgress:function(customEvent){},onComplete:function(customEvent){this.reset()},onCancel:function(){},onAbort:function(){},onError:function(evtObject){},upload:function(formData){formData.uploadType=this.uploadType,this.inherited(arguments)},submit:function(form){form=form?form.tagName?form:this.getForm():this.getForm();var data=domForm.toObject(form);data.uploadType=this.uploadType,this.upload(data)},reset:function(){delete this._files,this._disconnectButton(),array.forEach(this._inputs,domConstruct.destroy,dojo),this._inputs=[],this._nameIndex=0,this._createInput()},getFileList:function(){var fileArray=[];return this.supports("multiple")?array.forEach(this._files,function(f,i){fileArray.push({index:i,name:f.name,size:f.size,type:f.type})},this):array.forEach(this._inputs,function(n,i){n.value&&fileArray.push({index:i,name:n.value.substring(n.value.lastIndexOf("\\")+1),size:0,type:n.value.substring(n.value.lastIndexOf(".")+1)})},this),fileArray},_getValueAttr:function(){return this.getFileList()},_setValueAttr:function(disabled){0},_setDisabledAttr:function(disabled){if(this.disabled==disabled||!this.inputNode)return;this.inherited(arguments),domStyle.set(this.inputNode,"display",disabled?"none":"")},_getButtonStyle:function(node){this.btnSize={w:domStyle.get(node,"width"),h:domStyle.get(node,"height")}},_setButtonStyle:function(){this.inputNodeFontSize=Math.max(2,Math.max(Math.ceil(this.btnSize.w/60),Math.ceil(this.btnSize.h/15))),this._createInput()},_getFileFieldName:function(){var name;return this.supports("multiple")?name=this.name+"s[]":name=this.name+(this.multiple?this._nameIndex:""),name},_createInput:function(){this._inputs.length&&(domStyle.set(this.inputNode,{top:"500px"}),this._disconnectButton(),this._nameIndex++);var name=this._getFileFieldName();this.focusNode=this.inputNode=domConstruct.create("input",{type:"file",name:name},this.domNode,"first"),this.supports("multiple")&&this.multiple&&domAttr.set(this.inputNode,"multiple",!0),this._inputs.push(this.inputNode),domStyle.set(this.inputNode,{position:"absolute",fontSize:this.inputNodeFontSize+"em",top:"-3px",right:"-3px",opacity:0}),this._connectButton()},_connectButton:function(){this._cons.push(connect.connect(this.inputNode,"change",this,function(evt){this._files=this.inputNode.files,this.onChange(this.getFileList(evt)),!this.supports("multiple")&&this.multiple&&this._createInput()})),this.tabIndex>-1&&(this.inputNode.tabIndex=this.tabIndex,this._cons.push(connect.connect(this.inputNode,"focus",this,function(){domClass.add(this.domNode,this.focusedClass)})),this._cons.push(connect.connect(this.inputNode,"blur",this,function(){domClass.remove(this.domNode,this.focusedClass)})))},_disconnectButton:function(){array.forEach(this._cons,connect.disconnect),this._cons.splice(0,this._cons.length)}})})