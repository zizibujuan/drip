define([
	"dojo/_base/fx",
	"dojo/dom-style",
	"dojo/dom-class",
	"dojo/dom-prop",
	"dojo/dom-construct",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/on",
	"dijit/_base/manager",
	"dojox/form/uploader/Base"
],function(
		fx, 
		domStyle, 
		domClass,
		domProp,
		domConstruct,
		declare, 
		lang, 
		array,
		on,
		manager, 
		formUploaderBase){

	// TODO：如果需要支持上传多个，则需要定义两个类，一个保存单条记录的信息，一个保存集合信息
	
return declare("widget.form.uploader.FileList", [formUploaderBase], {
	// summary:
	//		A simple widget that provides a list of the files currently selected by
	//		dojox.form.Uploader
	// description:
	//		There is a required CSS file: resources/UploaderFileList.css.
	//		This is a very simple widget, and not beautifully styled. It is here mainly for test
	//		cases, but could very easily be used, extended, modified, or copied.

	// uploaderId: String
	//		The id of the dojox.form.Uploader to connect to.
	uploaderId:"",

	// uploader: dojox.form.Uploader
	//		The dojox.form.Uploader to connect to. Use either this property of unploaderId. This
	//		property is populated if uploaderId is used.
	uploader:null,

	_upCheckCnt:0,
	
	/**
	 * 存储上传成功后，从服务器端返回的文件标识
	 */
	fileId:"",
	
	fileInfo:null,
	
	templateString:"<div></div>",

	rowAmt:0,

	postCreate: function(){
		this.setUploader();
		//this.hideProgress();
	},
	
	getData: function(){
		// summary:
		//		返回上传成功的文件标识，这里不存储上传失败的文件标识。
		
		return fileId;
	},

	reset: function(){
		// summary:
		//		清除domNode节点下的所有内容

		console.log("reset");
		
		this.fileId = "";
	},

	setUploader: function(){
		// summary:
		//		Connects to the Uploader based on the uploader or the uploaderId properties.

		if(!this.uploaderId && !this.uploader){
			console.warn("uploaderId not passed to UploaderFileList");
		}else if(this.uploaderId && !this.uploader){
			this.uploader = manager.byId(this.uploaderId);
		}else if(this._upCheckCnt>4){
			console.warn("uploader not found for ID ", this.uploaderId);
			return;
		}
		if(this.uploader){
			this.connect(this.uploader, "onChange", "_onUploaderChange");
			this.connect(this.uploader, "reset", "reset");
			this.connect(this.uploader, "onBegin", function(){
				console.log("upload begin");
				this.showProgressBar();
				this.showProgress(true);
			});
			this.connect(this.uploader, "onProgress", "_progress");
			this.connect(this.uploader, "onComplete", function(customEvent){
				console.log("onComplete", customEvent);
				var fileInfo = this.fileInfo = customEvent[0];
				this.fileId = fileInfo.fileId;
				this.thumbImageNode.src = fileInfo.url;
				domProp.set(this.thumbImageNode.parentNode,{href:fileInfo.url,target:"_blank"});
				
				this._addSuccessBar();
			});
			
			this._fileSizeAvail = {'html5':1,'flash':1}[this.uploader.uploadType];
		}else{
			this._upCheckCnt++;
			setTimeout(lang.hitch(this, "setUploader"), 250);
		}
	},
	
	showProgressBar: function(){
		
	},
	
	hideProgress: function(/*Boolean*/ animate){
		var o = animate ? {
			ani:true,
			endDisp:"none",
			beg:15,
			end:0
		} : {
			endDisp:"none",
			ani:false
		};
		this._hideShowProgress(o);
	},

	showProgress: function(/*Boolean*/ animate){
		var o = animate ? {
			ani:true,
			endDisp:"inline",
			beg:0,
			end:15
		} : {
			endDisp:"inline",
			ani:false
		};
		this._hideShowProgress(o);
	},

	_progress: function(/*Object*/ customEvent){
		console.log("onProgress",customEvent);
		// 只支持一次上传一个文件，因为不能为每个不同的文件显示进度条
		domStyle.set(this.percentBarNode, "width", customEvent.percent);
	},

	_hideShowProgress: function(o){
//		var node = this.progressNode;
//		var onEnd = function(){
//			//debugger;
//			//domStyle.set(node, "display", o.endDisp);
//		};
//		if(o.ani){
//			domStyle.set(node, "display", "inline");
//			fx.animateProperty({
//				node: node,
//				properties:{
//					height:{
//						start:o.beg,
//						end:o.end,
//						units:"px"
//					}
//				},
//				onEnd:onEnd
//			}).play();
//		}else{
//			onEnd();
//		}
	},

	_onUploaderChange: function(fileArray){
		// summary:
		//		因为目前只支持一次上传一个文件，所以下一次上传的文件，将覆盖上一次上传的文件。
		//		每次执行上传时，先清除之前的进度信息
		
		console.log("upload onUploadChange");
		
		domConstruct.empty(this.domNode);
		this.rowAmt = 0;
		
		// 显示开始上传的进度条, 也等于this.fileInfo
		var f = fileArray[0];
		this._addRow(1, this.getFileType(f.name), f.name, f.size);
	},
	
	_addSuccessBar: function(){
		var fileInfo = this.fileInfo;
		
		var containerNode = this.uploadItemNode;
		domConstruct.empty(containerNode);
		var _href = fileInfo.url;
		var labelContainer = domConstruct.create("a",{"class":"drip_upload_label_success",target:"_blank",href:_href}, containerNode);
		this._addImageLabel(labelContainer,fileInfo.name,fileInfo.size);
		this._addDeleteNode(containerNode);
	},
	
	_addFailureBar: function(){
		var fileInfo = this.fileInfo;
		var containerNode = this.uploadItemNode;
		// FIXME:是不是应该先删除绑定在删除节点上的事件呢？
		domConstruct.empty(containerNode);
		var labelContainer = domConstruct.create("span",{"class":"drip_upload_label_fail"},containerNode);
		this._addImageLabel(labelContainer,fileInfo.name,fileInfo.size);
		var failInfoNode = domConstruct.create("span",{style:"float:right"},containerNode);
		domConstruct.create("span",{innerHTML:"附件上传失败",style:"color:#C00, font-weight:bold"},failInfoNode);
		domConstruct.create("span",{innerHTML:"重试", style:"margin-left: 5px;color: #222;text-decoration: underline;cursor: pointer;"},failInfoNode);
		this._addDeleteNode(failInfoNode);
	},
	
	_addRow: function(index, type, name, size){
		var uploadItemContainer = domConstruct.place("<div></div>", this.domNode);
		
		var uploadItem = this.uploadItemNode = domConstruct.place("<div class='drip_upload_item'></div>", uploadItemContainer);
		var a = domConstruct.create("a",null,uploadItemContainer);
		var thumbNode = this.thumbImageNode = domConstruct.place("<img class='drip_upload_thumb_image'/>", a);
		
		
		
		var table = domConstruct.place("<table></table>", uploadItem);
		var tr = table.insertRow();
		var td1 = tr.insertCell(0);
		domStyle.set(td1,"padding","0px");
		var labelNode = domConstruct.place("<div></div>", td1);
		this._addImageLabel(labelNode,name,size);
		
		var td2 = tr.insertCell(1);
		var div1 = domConstruct.place("<div></div>",td2);
		var div2 = domConstruct.place("<div></div>", div1);
		var div3 = domConstruct.place("<div class='drip_upload_progress'></div>", div2);
		var percentBarNode = this.percentBarNode = domConstruct.place("<div class='drip_upload_percent_bar'></div>", div3);
		
		var td3 = tr.insertCell(2);
		this._addDeleteNode(td3);
		
		this.rowAmt++;
	},
	
	_addImageLabel: function(parentNode,name,size){
		var imageNameNode = domConstruct.place("<div class='drip_upload_image_name'></div>", parentNode);
		imageNameNode.innerHTML = name;
		if(this._fileSizeAvail){
			var imageSizeNode = domConstruct.place("<div class='drip_upload_image_size'></div>", parentNode);
			imageSizeNode.innerHTML = "("+this.convertBytes(size).value+")";
		}
	},
	
	_addDeleteNode: function(parentNode){
		var deleteNode = domConstruct.place("<div class='drip_upload_delete_icon'></div>", parentNode);
		on.once(deleteNode,"click", lang.hitch(this,function(e){
			domConstruct.empty(this.domNode);
			this.fileInfo = null;
			this.fileId = null;
		}));
	}
	
});
});
