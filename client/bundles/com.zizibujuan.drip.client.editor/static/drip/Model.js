define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/_base/array",
         "dojo/dom-construct",
         "dojox/xml/parser",
         "drip/string",
         "drip/dataUtil"], function(
        		 declare,
        		 lang,
        		 array,
        		 domConstruct,
        		 xmlParser,
        		 dripString,
        		 dataUtil) {

	return declare("drip.Model",null,{
	
		doc : null,
		
		// 当前节点所在的位置
		position : {node:null, offset : -1},
		
		// 调用顺序
		//		如果是新建，则直接new即可
		//		如果已存在内容，则先新建，然后通过loadData，加载内容
		constructor: function(options){
			lang.mixin(this, options);
			this.doc = xmlParser.parse("<root><line></line></root>");
			this.position.node = this.doc.documentElement.firstChild;
			this.position.offset = 0;
		},
		
		// 如果没有内容，则创建一个新行
		// 如果存在内容，则加载内容，并将光标移到最后
		loadData : function(xmlString){
			
		},
		
		
		
		setData : function(data){
			var node = this.position.node;
			var offset = this.position.offset;
			
			var oldText = this.position.node.textContent;
			var newText = dripString.insertAtOffset(oldText, offset, data);
			
			this.position.offset += data.length;
			node.textContent = newText;
			
			this.onChange(data);
		},
		
		// 获取xml文件的字符串值
		getData : function(){
			return xmlParser.innerXML(this.doc);
		},
		
		// 习题 line 获取html格式的数据
		//		展示页面时使用
		getHTML : function(){
			return dataUtil.xmlDocToHtml(this.doc);
		},
		
		
		
		onChange : function(data){
			// 什么也不做，View在该方法执行完毕后，执行刷新操作
		}
	
	});
	
});