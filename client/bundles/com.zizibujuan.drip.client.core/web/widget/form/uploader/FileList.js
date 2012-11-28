define([
	"dojo/_base/fx",
	"dojo/dom-style",
	"dojo/dom-class",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/on",
	"dijit/_base/manager",
	"dojox/form/uploader/Base",
	"dojo/text!templates/FileList.html"
],function(
		fx, 
		domStyle, 
		domClass, 
		declare, 
		lang, 
		array,
		on,
		manager, 
		formUploaderBase,
		template){

	
return declare("dojox.form.uploader.FileList", [formUploaderBase], {
	// summary:
	//		A simple widget that provides a list of the files currently selected by
	//		dojox.form.Uploader
	// description:
	//		There is a required CSS file: resources/UploaderFileList.css.
	//		This is a very simple widget, and not beautifully styled. It is here mainly for test
	//		cases, but could very easily be used, extended, modified, or copied.
	// Version: 1.6

	// uploaderId: String
	//		The id of the dojox.form.Uploader to connect to.
	uploaderId:"",

	// uploader: dojox.form.Uploader
	//		The dojox.form.Uploader to connect to. Use either this property of unploaderId. This
	//		property is populated if uploaderId is used.
	uploader:null,

	// headerIndex: String
	//		The label for the index column.
	headerIndex:"#",

	// headerType: String
	//		The label for the file type column.
	headerType:"Type",

	// headerFilename: String
	//		The label for the file name column.
	headerFilename:"File Name",

	// headerFilesize: String
	//		The label for the file size column.
	headerFilesize:"Size",

	_upCheckCnt:0,
	rowAmt:0,

	templateString:	template,

	postCreate: function(){
		this.setUploader();
		//this.hideProgress();
	},

	reset: function(){
		// summary:
		//		Clears all rows of items. Happens automatically if Uploader is reset, but you
		//		could call this directly.

		for(var i=0;i<this.rowAmt;i++){
			this.listNode.deleteRow(0);
		}
		this.rowAmt = 0;
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
				domStyle.set(this.domNode,"display","");
				this.showProgress(true);
			});
			this.connect(this.uploader, "onProgress", "_progress");
			this.connect(this.uploader, "onComplete", function(customEvent){
				console.log(customEvent);
				this.imageNode.src = customEvent[0].url;
				setTimeout(lang.hitch(this, function(){
					this.hideProgress(true);
				}), 1250);
			});
			if(!(this._fileSizeAvail = {'html5':1,'flash':1}[this.uploader.uploadType])){
				//if uploadType is neither html5 nor flash, file size is not available
				//hide the size header
				this.sizeHeader.style.display="none";
			}
			
			on(this.deleteNode,"click", lang.hitch(this,function(e){
				alert("delete");
				// 并不删除后台上传的图片，而是在界面清空并隐藏上传文件列表，重要的是清除当前文件名称。
				//domStyle.set(this.domNode, "display", "none");
				// TODO:删除img节点
				
				// 在新增时插入img节点。
				
			}));
		}else{
			this._upCheckCnt++;
			setTimeout(lang.hitch(this, "setUploader"), 250);
		}
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
		this.percentTextNode.innerHTML = customEvent.percent;
		domStyle.set(this.percentBarNode, "width", customEvent.percent);
	},

	_hideShowProgress: function(o){
		var node = this.progressNode;
		var onEnd = function(){
			//debugger;
			//domStyle.set(node, "display", o.endDisp);
		};
		if(o.ani){
			domStyle.set(node, "display", "inline");
			fx.animateProperty({
				node: node,
				properties:{
					height:{
						start:o.beg,
						end:o.end,
						units:"px"
					}
				},
				onEnd:onEnd
			}).play();
		}else{
			onEnd();
		}
	},

	_onUploaderChange: function(fileArray){
		this.reset();
//		array.forEach(fileArray, function(f, i){
//			this._addRow(i+1, this.getFileType(f.name), f.name, f.size);
//		}, this)
	}
});
});
