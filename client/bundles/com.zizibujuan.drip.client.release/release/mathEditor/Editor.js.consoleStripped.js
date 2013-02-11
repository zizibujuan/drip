require({cache:{
'mathEditor/Model':function(){
define("mathEditor/Model", [ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/_base/array",
         "dojo/dom-construct",
         "dojox/xml/parser",
         "mathEditor/string",
         "mathEditor/dataUtil",
         "mathEditor/lang",
         "mathEditor/xmlUtil"], function(
        		 declare,
        		 lang,
        		 array,
        		 domConstruct,
        		 xmlParser,
        		 dripString,
        		 dataUtil,
        		 dripLang,
        		 xmlUtil) {
	var EMPTY_XML = "<root><line></line></root>";
	return declare(null,{
		// summary:
		//		存储当前聚焦点的完整路径
		// nodeName:
		//		节点名称
		// offset:
		//		节点在父节点中的位置，从1开始计数。
		path: null,
		xmlString: null,
		doc: null,
		
		
		// summary:
		//		当前光标所在的位置。
		//		lineIndex和nodeIndex只定位到text和math节点。FIXME：math中的内容不再跟踪？
		//		还是使用xPath Axes(轴)来定位好一些。
		//		在一个数组中pop或push每个节点的名称，然后形成一个xpath，然后根据xpath定位到该节点。
		//		又能如何呢？还是无法将model与view中的位置相对应。
		// node:
		//		光标所在的节点
		// offset：
		//		光标在node节点中的偏移量，主要是node的子节点或者文本节点内容的偏移量
		// lineIndex：
		//		附加信息，主要用于定位node。
		//		node节点在doc中行数
		// nodeIndex：
		//		附加信息，主要用于定位node。
		//		node在lineIndex指定的行中的索引
		//node:null, offset : -1, lineIndex:0, nodeIndex:0
		cursorPosition: null,
		
		// 当前节点在xml文件中的具体路径
		
		
		// 调用顺序
		//		如果是新建，则直接new即可
		//		如果已存在内容，则先新建，然后通过loadData，加载内容
		//		因为包含普通文本和math文本，使用span包含普通文本
		//		<root><line><text></text><math></math></line></root>
		//		在构造函数中初始化到位，如果有传入xml文本，则读取文本进行初始化；
		//		如果什么也没有传，则初始化为默认值。
		constructor: function(options){
			this._init();
			lang.mixin(this, options);
		},
		
		_init: function(){
			// 注意：在类中列出的属性，都必须在这里进行初始化。
			this.doc = xmlParser.parse(EMPTY_XML);
			this.path = [];
			this.cursorPosition = {};
			// FIXME:如何存储呢？
			
			this.cursorPosition.node = this.doc.documentElement.firstChild;
			this.cursorPosition.offset = 0;
			
			this.path.push({nodeName:"root"});
			// offset 偏移量，从1开始
			this.path.push({nodeName:"line", offset:1});
		},
		
		clear: function(){
			this._init();
			this.onChange();
		},
		
		// 如果没有内容，则创建一个新行
		// 如果存在内容，则加载内容，并将光标移到最后
		loadData: function(xmlString){
			
		},
		
		
		
		// TODO：需要加入位置参数，指明在什么地方插入
		// TODO: 该方法需要重构，因为太多的针对不同类型的节点名称进行编程，而不是
		//		 经过抽象后的逻辑。
		setData: function(insertInfo){
			// summary:
			//		往model中插入数据。
			// insertInfo: JSON Object
			//		插入数据的详情。
			//		data: String || Array
			//			要插入的内容	
			// 		nodeName：String
			//			将data作为什么节点插入，这个通常由人工选择，如果没有值，则系统自动判断。
			//		removeCount: Int
			//			要移除的字符的数量，从当前聚焦位置往前删除removeCount个字符。
			
			var data = insertInfo.data;
			var nodeName = insertInfo.nodeName;
			var removeCount = insertInfo.removeCount;
			
			if(removeCount && removeCount > 0){
				for(var i = 0; i < removeCount; i++){
					this.removeLeft();
				}
			}
			
			var xmlDoc = this.doc;
			
			if(nodeName != ""){
				if(nodeName == "mfrac"){
					this._splitNodeIfNeed();
					var node = this.cursorPosition.node;
					var offset = this.cursorPosition.offset;
					var newOffset = 1;
					var position = "last";
					if(this._isLineNode(node)){
						
					}else if(this._isTextNode(node)){
						var _offset = this.path.pop().offset;
						newOffset = _offset + 1;
						position = "after";
					}
					
					
					this.path.push({nodeName:"math", offset:newOffset});
					this.path.push({nodeName:"mfrac", offset:1});
					this.path.push({nodeName:"mrow", offset:1});
					this.path.push({nodeName:"mn", offset:1});
					
					var math = xmlDoc.createElement("math");
					var fracData = xmlUtil.createEmptyFrac(xmlDoc);
					math.appendChild(fracData.rootNode);
					domConstruct.place(math, node, position);
					
					this.cursorPosition.node = fracData.focusNode;
					this.cursorPosition.offset = 0;
					
					this.onChange();
					return;
				}
				
			}
			
			// 这里需要对data做一个加工，&#xD7;只能看作一个字符。
			// 走到这一步，dataArray的每个元素都只能看作一个字符
			var dataArray = [];
			if(lang.isString(data)){
				dataArray = dripString.splitData(data);
			}else if(lang.isArray(data)){
				dataArray = data;
			}
				
			
			
			
			// 注意：把对数据类型的判断放在判断节点类型的外面。除非有充分的理由不要修改这个逻辑
			// 先循环字符，再判断当前要插入字符的环境。
			// data中可能包含多个字符，通过循环，单独处理每个字符
			array.forEach(dataArray,lang.hitch(this,function(eachData, index){
				var c = eachData;
				var node = this.cursorPosition.node;
				
				if(dripLang.isNumber(c)){
					
					// 按照以下思路重构。
					// 添加一个数据，分以下几步：
					//		如果指定了nodeName，则直接使用；如果没有指定，则先推导
					//		比较要输入的值和当前输入的环境
					//		确定可以执行哪些动作
					//		新建节点
					//		设置当前节点，将cursorPosition改为context
					//		在新节点中插入内容
					//		修正当前的path值
					nodeName = "mn";
					
					function isLineOrText(node){
						var nodeName = node.nodeName;
						return nodeName == "line" || nodeName == "text";
					}
					
					if(isLineOrText(node)){
						var offset = this.cursorPosition.offset;
						// 这两个默认的值，是根据lineNode的值设置的，所以可以删除对lineNode的判断。
						var position = "last";
						var pathOffset = 1;
						if(this._isLineNode(node)){
							position = "last";
							pathOffset = 1;
						}else if(this._isTextNode(node)){
							// 如果光标在文本中间，则先拆分文本节点
							this._splitNodeIfNeed();
							
							var pos = this.path.pop();
							
							if(offset > 0){
								position = "after";
								pathOffset = pos.offset+1;
							}else{
								position = "before";
							}
						}
						
						var mathNode = xmlDoc.createElement("math");
						var mnNode = xmlDoc.createElement(nodeName);
						mathNode.appendChild(mnNode);
						domConstruct.place(mathNode, node, position);
						
						
						this.cursorPosition.node = mnNode;
						this.cursorPosition.offset = 0;
						
						this._insertChar(c);
						
						this.path.push({nodeName:"math", offset:pathOffset});
						this.path.push({nodeName:nodeName, offset:1});
					}else if(dripLang.isMathTokenNode(node)){
						// FIXME：重构，可抽象出一个逻辑，期望新建的节点与当前节点的类型不同。
						//如果当前节点不是操作符节点，则新建一个操作符节点
						var node = this.cursorPosition.node;
						if(node.nodeName != nodeName){
							var mnNode = xmlDoc.createElement(nodeName);
							
							// 需要判断是否需要拆分节点。
							dripLang.insertNodeAfter(mnNode,node);
							
							this.cursorPosition.node = mnNode;
							this.cursorPosition.offset = 0;
							
							
							
							var pos = this.path.pop();
							this.path.push({nodeName:nodeName, offset:pos.offset+1});
						}else{
							
						}
						
						this._insertChar(c);
					}
				}else if(dripLang.isOperator(c)){
					if(this._isLineNode(node)){
						var mathNode = xmlDoc.createElement("math");
						node.appendChild(mathNode);
						var mnNode = xmlDoc.createElement("mo");
						mathNode.appendChild(mnNode);
						this.cursorPosition.node = mnNode;
						this.cursorPosition.offset = 0;
						
						this._insertChar(c);
						
						this.path.push({nodeName:"math", offset:1});
						this.path.push({nodeName:"mo", offset:1});
					}else if(dripLang.isMathTokenNode(node)){
						//如果当前节点不是操作符节点，则新建一个操作符节点
						var node = this.cursorPosition.node;
						// 不论是不是mo节点，都单独新建，因此处理逻辑一样，就不再分开。
						var moNode = xmlDoc.createElement("mo");
						dripLang.insertNodeAfter(moNode,node);
						
						this.cursorPosition.node = moNode;
						this.cursorPosition.offset = 0;
						
						this._insertChar(c);
						
						var pos = this.path.pop();
						this.path.push({nodeName:"mo", offset:pos.offset+1});
					}else if(this._isTextNode(node)){
						// FIXME：重构出一个方法
						var mathNode = xmlDoc.createElement("math");
						// math应该放在textNode之后
						dripLang.insertNodeAfter(mathNode, node);
						var mnNode = xmlDoc.createElement("mo");
						mathNode.appendChild(mnNode);
						this.cursorPosition.node = mnNode;
						this.cursorPosition.offset = 0;
						
						this._insertChar(c);
						
						var pos = this.path.pop();
						this.path.push({nodeName:"math", offset:pos.offset+1});
						this.path.push({nodeName:"mo", offset:1});
					}
				}else if(dripLang.isNewLine(c)){
					// TODO:在指定位置新增一行
					// 暂时只实现了在最后一行新增
					var focusedLine = this._getFocusLine();
					// 新建一个空的line节点
					var newLineNode = this.doc.createElement("line");
					dripLang.insertNodeAfter(newLineNode, focusedLine);
					
					this.cursorPosition.node = newLineNode;
					this.cursorPosition.offset = 0;
					
					// 将之前缓存的上一行的信息都清除
					var pos = this.path.pop();
					while(pos.nodeName != "line"){
						pos = this.path.pop();
					}
					// 然后加入新行
					// FIXME：这里需要重构
					this.path.push({nodeName:"line", offset:pos.offset+1});
					
				}else{
					if(this._isLineNode(node)){
						var textSpanNode = xmlDoc.createElement("text");
						node.appendChild(textSpanNode);
						
						this.cursorPosition.node = textSpanNode;
						this.cursorPosition.offset = 0;
						
						this._insertChar(c);
						
						// 这里的offset是nodeName为text的节点在父节点中位置。
						this.path.push({nodeName:"text",offset:1});
					}else if(this._isTextNode(node)){
						this._insertChar(c);
					}else if(dripLang.isMathTokenNode(node)){
						// 要往上移到math节点之外
						var pos = null;
						
						do{
							pos = this.path.pop();
						}while(pos && pos.nodeName != "math");
						
						var textSpanNode = xmlDoc.createElement("text");
						// 获取math节点，然后将新节点插入到math节点之后
						var mathNode = node;
						while(mathNode.nodeName != "math"){
							mathNode = mathNode.parentNode;
						}
						dripLang.insertNodeAfter(textSpanNode, mathNode);
						
						this.cursorPosition.node = textSpanNode;
						this.cursorPosition.offset = 0;
						
						this._insertChar(c);
						
						this.path.push({nodeName:"text", offset:pos.offset+1});
					}
				}
				// TODO:重构 moveNext
			}));
			
			this.onChange(data);
		},
		
		doDelete: function(){
			// 暂时让do系列方法作为共有接口暴露，当_removeLeft调通之后，使用removeLeft作为公用接口
			var removed = this.removeLeft();
			if(removed != ""){
				this.onChange();
			}
		},
		
		removeLeft: function(){
			// summary:
			//		删除当前聚焦点的前一个字符
			// return:String
			//		删除的字符
			
			var offset = this.cursorPosition.offset;
			var node = this.cursorPosition.node;
			var oldText = node.textContent;
			
			0 && console.log("removeLeft", node, offset);
			
			// TODO:如果是text节点（dom的），则把值先split为数组，然后再删除
			// 或者删除前，先判断当前要删除的内容是否为unicode，注意在&和;中间不能包含这两个字符。
			
			if(offset == 0){
				var _node = node;
				if(node.nodeName != "text" && node.nodeName != "line"){
					// FIXME:这里需要重构，使用与下面相同的逻辑
					while(_node.nodeName != "math"){
						_node = _node.parentNode;
					}
					var previousNode = _node.previousSibling;
					if(previousNode){
						var textContent = previousNode.textContent;
						var oldLength = textContent.length;
						var newText = dripString.insertAtOffset(textContent, oldLength, "", 1);
						var newLength = oldLength - 1; //newText.length; 
						if(newText == ""){
							// 如果节点中没有内容，则删除节点
							previousNode.parentNode.removeChild(previousNode);
							this.path.pop();
						}else{
							previousNode.textContent = newText;
							this.cursorPosition.node = previousNode;
							this.cursorPosition.offset = newLength;
						}
						var removed = textContent.charAt(newLength);
						// 注意这里不设置cursorPosition，因为要与之前的值保持一致。
						return removed;
					}
				}else if(node.nodeName == "line"){
					// FIXME:在后面的重构中需要认识到，也许遇到line时，offset都等于0。还需进一步验证。
					if(this.getLineCount() > 1){
						// 删除一个空行
						var previousNode = node.previousSibling;
						var childCount = previousNode.childNodes.length;
						//如果前一行也是空行
						if(childCount == 0){
							this.cursorPosition.node = previousNode;
							this.cursorPosition.offset = 0;
							var lastPath = this.path.pop();
							lastPath.offset--;
							this.path.push(lastPath);
							node.parentNode.removeChild(node);
						}else{
							// FIXME：提取一个方法，获取一行最后一个有效的节点，将div等的逻辑都封装进去
							// 需要支持将math看作一个整体，这样可以删除整个math节点
							previousNode = previousNode.lastChild;
							
							if(previousNode.nodeName == "text"){
								this.cursorPosition.node = previousNode;
								this.cursorPosition.offset = previousNode.textContent.length;
								
								var lastPath = this.path.pop();
								lastPath.offset--;
								this.path.push(lastPath);
								this.path.push({nodeName:previousNode.nodeName, offset: childCount});
								node.parentNode.removeChild(node);
							}else if(previousNode.nodeName == "math"){
								// FIXME：math节点中的移动逻辑，因为这里涉及到了层次之间的移动。寻找最佳实践。
								var mathChildCount = previousNode.childNodes.length;
								previousNode = previousNode.lastChild;
								
								this.cursorPosition.node = previousNode;
								this.cursorPosition.offset = previousNode.textContent.length;
								
								var lastPath = this.path.pop();
								lastPath.offset--;
								this.path.push(lastPath);
								this.path.push({nodeName:"math", offset:childCount});
								this.path.push({nodeName:previousNode.nodeName, offset: mathChildCount});
								node.parentNode.removeChild(node);
							}
							
						}
						
						return "\n";
					}else{
						return "";// 只剩下一行时，什么也不做。
					}
					
				}
				return "";
			}else{
				var removed = "";
				var newText = "";
				
				if(node.nodeName == "mo"){
					// 因为现在只有操作符使用unicode表示，所以不需要专门处理unicode，遇到mo直接整个删除就可以。
					removed = node.textContent;
					newText = "";
				}else{
					removed = oldText.charAt(offset - 1);
					newText = dripString.insertAtOffset(oldText, offset, "", 1);
				}
				
				if(newText == ""){
					var previousNode = node.previousSibling;
					var _offset = 0;
					if(previousNode){
						if(previousNode.nodeName == "math"){
							var mathChildCount = previousNode.childNodes.length;
							previousNode = previousNode.lastChild;
							
							this.cursorPosition.node = previousNode;
							this.cursorPosition.offset = previousNode.textContent.length;
							
							var lastPath = this.path.pop();
							var lastOffset = lastPath.offset - 1;
							this.path.push({nodeName:"math", offset:lastOffset});
							this.path.push({nodeName:previousNode.nodeName, offset: mathChildCount});
							node.parentNode.removeChild(node);
						}else{
							this.cursorPosition.node = previousNode;
							this.cursorPosition.offset = previousNode.textContent.length;
							node.parentNode.removeChild(node);
							var old = this.path.pop();
							this.path.push({nodeName:this.cursorPosition.node.nodeName, offset:old.offset-1});
						}
						
					}else{
						var p = node;
						var c = node;
						// 如果是mathml节点，则追溯到math节点
						if(node.nodeName != "text" && node.nodeName != "line"){
							while(c.nodeName != "math"){
								p = c.parentNode;
								p.removeChild(c);
								c = p;
								this.path.pop();
							}
						}
						
						previousNode = c.previousSibling;
						p = c.parentNode;
						p.removeChild(c);
						var oldOffset = this.path.pop().offset;
						
						if(previousNode){
							this.cursorPosition.node = previousNode;
							this.cursorPosition.offset = previousNode.textContent.length;
							this.path.push({nodeName:this.cursorPosition.node.nodeName, offset:oldOffset-1});
						}else{
							this.cursorPosition.node = p;
							this.cursorPosition.offset = p.childElementCount;
						}
					}
				}else{
					this.cursorPosition.node.textContent = newText;
					this.cursorPosition.offset -= 1;
				}
				
				return removed;
			}
		},
		
		moveLeft: function(){
			var node = this.cursorPosition.node;
			var offset = this.cursorPosition.offset;
			
			var nodeName = node.nodeName;
			if(nodeName == "line"){
				var previousNode = node.previousSibling;
				if(!previousNode){
					return;
				}
				
				previousNode = previousNode.lastChild;
				if(previousNode.nodeName == "math"){
					previousNode = previousNode.lastChild;
				}
				var textContent = previousNode.textContent;
				
				this.cursorPosition.node = previousNode;
				this.cursorPosition.offset = textContent.length;
				return;
			}
			
			if(offset > 0){
				this.cursorPosition.offset--;
				return;
			}
			
			if(offset == 0){
				// 先往前寻找兄弟节点
				var previousNode = node.previousSibling;
				if(previousNode){
					if(previousNode.nodeName == "math"){
						previousNode = previousNode.lastChild;
					}
					var textContent = previousNode.textContent;
					
					this.cursorPosition.node = previousNode;
					this.cursorPosition.offset = textContent.length - 1;
					return;
				}
				// 如果找不到兄弟节点，则寻找父节点
				var parentNode = node.parentNode;
				var previousNode = parentNode.previousSibling;
				if(previousNode){
					if(previousNode.nodeName == "line"){
						previousNode = previousNode.lastChild;
						if(previousNode.nodeName == "math"){
							previousNode = previousNode.lastChild;
						}
						var textContent = previousNode.textContent;
						
						this.cursorPosition.node = previousNode;
						this.cursorPosition.offset = textContent.length;
					}else{
						var textContent = previousNode.textContent;
						
						this.cursorPosition.node = previousNode;
						this.cursorPosition.offset = textContent.length - 1;
					}
					
				}
			}
			
		},
		
		moveRight: function(){
			
		},
		
		moveUp: function(){
			
		},
		
		moveDown: function(){
			
		},
		
		getLineCount: function(){
			return this.doc.documentElement.childNodes.length;
		},
		
		_splitNodeIfNeed: function(){
			// summary:
			//		如果节点满足被拆分的条件，则将节点拆分为两个。
			//		只能用在放置文本节点的节点中，如text节点和mathml的token节点。
			var offset = this.cursorPosition.offset;
			var node = this.cursorPosition.node;
			var textContent = node.textContent;
			var textLength = textContent.length;
			if(0< offset && offset < textLength){
				// 拆分
				var part1 = textContent.substring(0, offset);
				var part2 = textContent.substring(offset);
				
				var node2 = this.doc.createElement(node.nodeName);//因为是拆分
				
				node.textContent = part1;
				node2.textContent = part2;
				
				dripLang.insertNodeAfter(node2, node);
			}
		},
		
		_getFocusLine: function(){
			// summary:
			//		当前节点往上追溯，获取nodeName为line的行
			
			var focusNode = this.getFocusNode();
			var lineNode = focusNode;
			while(lineNode && lineNode.nodeName != "line"){
				lineNode = lineNode.parentNode;
			}
			
			return lineNode;
		}, 
		
		_isNotSameNode: function(newNodeName, node){
			var nodeName = node.nodeName;
			return newNodeName == nodeName;
		},
		
		_isLineNode: function(node){
			return node.nodeName == "line";
		},
		
		// TODO：起更好的名字，因为textNode容易与document中定义的Text类型的Node混淆
		_isTextNode: function(node){
			return node.nodeName == "text";
		},
		
		_insertChar: function(charData){
			// summary:
			//		在聚焦的节点中，当前光标新的字符，并移动当前光标的位置。
			
			var offset = this.cursorPosition.offset;
			var oldText = this.cursorPosition.node.textContent;
			var newText = dripString.insertAtOffset(oldText, offset, charData);
			this.cursorPosition.node.textContent = newText;
			// 这里输入的char，不管几个字符都当作一个长度处理。
			this.cursorPosition.offset += 1; // char.length
		},
		
		// 获取xml文件的字符串值。没有没有输入任何内容则返回空字符串。
		getXML: function(){
			var doc = this.doc;
			if(doc.firstChild.firstChild.childNodes.length == 0){
				return "";
			}
			
			return xmlParser.innerXML(this.doc);
		},
		
		// summary:
		//		获取当前获取焦点的节点相对于根节点的path值.
		//		注意，获取的值与xpath并不一致，这里只是将nodeName和offset用字符串形式表示出来。
		getPath: function(){
			var xpath = "";
			array.forEach(this.path, function(path, index){
				xpath += "/";
				xpath += path.nodeName;
				
				if(path.offset){
					xpath += "[" + path.offset + "]";
				}
			});
			return xpath;
		},
		
		getFocusNode: function(){
			return this.cursorPosition.node;
		},
		
		getOffset: function(){
			return this.cursorPosition.offset;
		},
		
		getLineAt: function(lineIndex){
			// summary: 
			//		获取行节点。
			// lineIndex: Number
			//		行节点的索引，从0开始
			
			return this.doc.documentElement.childNodes[lineIndex];
		},
		
		// 习题 line 获取html格式的数据
		//		展示页面时使用
		getHTML: function(){
			return dataUtil.xmlDocToHtml(this.doc);
		},
		
		
		
		onChange: function(data){
			// 什么也不做，View在该方法执行完毕后，执行刷新操作
		}
	
	});
	
});
},
'dojox/xml/parser':function(){
define("dojox/xml/parser", ['dojo/_base/kernel', 'dojo/_base/lang', 'dojo/_base/array', 'dojo/_base/window', 'dojo/_base/sniff'], function(dojo){

dojo.getObject("xml.parser", true, dojox);

//DOM type to int value for reference.
//Ints make for more compact code than full constant names.
//ELEMENT_NODE                  = 1;
//ATTRIBUTE_NODE                = 2;
//TEXT_NODE                     = 3;
//CDATA_SECTION_NODE            = 4;
//ENTITY_REFERENCE_NODE         = 5;
//ENTITY_NODE                   = 6;
//PROCESSING_INSTRUCTION_NODE   = 7;
//COMMENT_NODE                  = 8;
//DOCUMENT_NODE                 = 9;
//DOCUMENT_TYPE_NODE            = 10;
//DOCUMENT_FRAGMENT_NODE        = 11;
//NOTATION_NODE                 = 12;

dojox.xml.parser.parse = function(/*String?*/ str, /*String?*/ mimetype){
	// summary:
	//		cross-browser implementation of creating an XML document object from null, empty string, and XML text..
	//
	// str:
	//		Optional text to create the document from.  If not provided, an empty XML document will be created.
	//		If str is empty string "", then a new empty document will be created.
	// mimetype:
	//		Optional mimetype of the text.  Typically, this is text/xml.  Will be defaulted to text/xml if not provided.
	var _document = dojo.doc;
	var doc;

	mimetype = mimetype || "text/xml";
	if(str && dojo.trim(str) && "DOMParser" in dojo.global){
		//Handle parsing the text on Mozilla based browsers etc..
		var parser = new DOMParser();
		doc = parser.parseFromString(str, mimetype);
		var de = doc.documentElement;
		var errorNS = "http://www.mozilla.org/newlayout/xml/parsererror.xml";
		if(de.nodeName == "parsererror" && de.namespaceURI == errorNS){
			var sourceText = de.getElementsByTagNameNS(errorNS, 'sourcetext')[0];
			if(sourceText){
				sourceText = sourceText.firstChild.data;
			}
        	throw new Error("Error parsing text " + de.firstChild.data + " \n" + sourceText);
		}
		return doc;

	}else if("ActiveXObject" in dojo.global){
		//Handle IE.
		var ms = function(n){ return "MSXML" + n + ".DOMDocument"; };
		var dp = ["Microsoft.XMLDOM", ms(6), ms(4), ms(3), ms(2)];
		dojo.some(dp, function(p){
			try{
				doc = new ActiveXObject(p);
			}catch(e){ return false; }
			return true;
		});
		if(str && doc){
			doc.async = false;
			doc.loadXML(str);
			var pe = doc.parseError;
			if(pe.errorCode !== 0){
				throw new Error("Line: " + pe.line + "\n" +
					"Col: " + pe.linepos + "\n" +
					"Reason: " + pe.reason + "\n" +
					"Error Code: " + pe.errorCode + "\n" +
					"Source: " + pe.srcText);
			}
		}
		if(doc){
			return doc; //DOMDocument
		}
	}else if(_document.implementation && _document.implementation.createDocument){
		if(str && dojo.trim(str) && _document.createElement){
			//Everyone else that we couldn't get to work.  Fallback case.
			// FIXME: this may change all tags to uppercase!
			var tmp = _document.createElement("xml");
			tmp.innerHTML = str;
			var xmlDoc = _document.implementation.createDocument("foo", "", null);
			dojo.forEach(tmp.childNodes, function(child){
				xmlDoc.importNode(child, true);
			});
			return xmlDoc;	//	DOMDocument
		}else{
			return _document.implementation.createDocument("", "", null); // DOMDocument
		}
	}
	return null;	//	null
};

dojox.xml.parser.textContent = function(/*Node*/node, /*String?*/text){
	// summary:
	//		Implementation of the DOM Level 3 attribute; scan node for text
	// description:
	//		Implementation of the DOM Level 3 attribute; scan node for text
	//		This function can also update the text of a node by replacing all child
	//		content of the node.
	// node:
	//		The node to get the text off of or set the text on.
	// text:
	//		Optional argument of the text to apply to the node.
	if(arguments.length>1){
		var _document = node.ownerDocument || dojo.doc;  //Preference is to get the node owning doc first or it may fail
		dojox.xml.parser.replaceChildren(node, _document.createTextNode(text));
		return text;	//	String
	}else{
		if(node.textContent !== undefined){ //FF 1.5 -- remove?
			return node.textContent;	//	String
		}
		var _result = "";
		if(node){
			dojo.forEach(node.childNodes, function(child){
				switch(child.nodeType){
					case 1: // ELEMENT_NODE
					case 5: // ENTITY_REFERENCE_NODE
						_result += dojox.xml.parser.textContent(child);
						break;
					case 3: // TEXT_NODE
					case 2: // ATTRIBUTE_NODE
					case 4: // CDATA_SECTION_NODE
						_result += child.nodeValue;
				}
			});
		}
		return _result;	//	String
	}
};

dojox.xml.parser.replaceChildren = function(/*Element*/node, /*Node|Array*/ newChildren){
	// summary:
	//		Removes all children of node and appends newChild. All the existing
	//		children will be destroyed.
	// description:
	//		Removes all children of node and appends newChild. All the existing
	//		children will be destroyed.
	// node:
	//		The node to modify the children on
	// newChildren:
	//		The children to add to the node.  It can either be a single Node or an
	//		array of Nodes.
	var nodes = [];

	if(dojo.isIE){
		dojo.forEach(node.childNodes, function(child){
			nodes.push(child);
		});
	}

	dojox.xml.parser.removeChildren(node);
	dojo.forEach(nodes, dojo.destroy);

	if(!dojo.isArray(newChildren)){
		node.appendChild(newChildren);
	}else{
		dojo.forEach(newChildren, function(child){
			node.appendChild(child);
		});
	}
};

dojox.xml.parser.removeChildren = function(/*Element*/node){
	// summary:
	//		removes all children from node and returns the count of children removed.
	//		The children nodes are not destroyed. Be sure to call dojo.destroy on them
	//		after they are not used anymore.
	// node:
	//		The node to remove all the children from.
	var count = node.childNodes.length;
	while(node.hasChildNodes()){
		node.removeChild(node.firstChild);
	}
	return count; // int
};


dojox.xml.parser.innerXML = function(/*Node*/node){
	// summary:
	//		Implementation of MS's innerXML function.
	// node:
	//		The node from which to generate the XML text representation.
	if(node.innerXML){
		return node.innerXML;	//	String
	}else if(node.xml){
		return node.xml;		//	String
	}else if(typeof XMLSerializer != "undefined"){
		return (new XMLSerializer()).serializeToString(node);	//	String
	}
	return null;
};

return dojox.xml.parser;

});

},
'mathEditor/string':function(){
define([],function(){
	var string = {};
	string.splitData = function(data){
		// summary:
		//		将传入的数据拆分为最小单元的html符号。
		//		dataArray的每个元素都只能看作一个字符。
		
		var len = data.length;
		var result = [];
		var index = 0;
		var append = false;
		var cache = "";
		var span = 0; //&和;中字符的个数
		for(var i = 0; i < len; i++){
			var c = data.charAt(i);
			if(c == "&"){
				span = 0;
				append = true;
				cache = c;
			}else if(append && c == ";"){
				if(span == 0){
					result[index] = cache;
					index++;
					result[index] = c;
					index++;
				}else{
					cache += c;
					result[index] = cache;
					index++;
				}
				append = false;
				cache = "";
			}else{
				if(append){
					cache += c;
					span++;
				}else{
					result[index] = data.charAt(i);
					index++;
				}
			}
		}
		return result;
	},
	
	string.insertAtOffset = function(target, offset, source, removeCount){
		// summary:
		//		在给定字符串的指定偏移量处插入字符串。注意：在文本中直接使用\t表示一个制表符。
		// target: String
		//		目标字符串，会修改该字符串。
		// offset:
		//		偏移量，从0开始
		// source:
		//		需要插入到指定位置的字符串
		// removeCount:
		//		在offset指定的位置往前删除的字符个数
		// returns: String
		//		返回新的字符串
		
		var removeCount = removeCount || 0;
		
		var len = target.length;
		if(offset < 0 || len < offset) return target;
		var part1 = target.substring(0,offset-removeCount);
		var part2 = target.substring(offset)
		return part1 + source + part2;
	}
	
	return string;
});

},
'mathEditor/dataUtil':function(){
define(["dojox/xml/parser",
        "dojo/_base/array"], function(
        		xmlParser,
        		array){
	// summary:
	//		数据处理工具类，将xml字符串转换为html等。
	var dataUtil = {};
	
	// summary:
	//		xml的格式为：
	//		<root><line><text></text><math></math></line></root>
	dataUtil.xmlDocToHtml = function(xmlDoc){
		var xmlString = "";
		var root = xmlDoc.documentElement;
		var lines = root.childNodes;
		array.forEach(lines, function(line, index){
			var lineString = "<div class='drip_line'>";
			var spans = line.childNodes;
			array.forEach(spans, function(span, index){
				if(span.nodeName == "text"){
					lineString += "<span>"+span.textContent+"</span>";
				}else if(span.nodeName == "math"){
					var tmp = xmlParser.innerXML(span);
					lineString += tmp.replace(/&amp;/g, "&");
				}
			});
			lineString += "</div>";
			
			xmlString += lineString;
		});
		return xmlString;
	},
	
	dataUtil.xmlStringToHtml = function(xmlString){
		var doc = xmlParser.parse(xmlString);
		return this.xmlDocToHtml(doc);
	}
	
	return dataUtil;
	
});
},
'mathEditor/lang':function(){
define("mathEditor/lang", ["dojo/_base/array"],function(array){

	var lang = {};
	
	lang.isNumber = function(obj) {
		return !isNaN(parseFloat(obj)) && isFinite(obj);
	},
	
	lang.isOperator = function(obj){
		if(obj == "+" || obj == "=" || obj == "-" || obj == "&#xD7;"/*乘*/ || obj == "&#xF7;"/*除*/){
			return true;
		}
		return false;
	},
	
	lang.isNewLine = function(obj){
		return obj === "\n";
	},
	
	lang.isTab = function(obj){
		return obj === "\t";
	},
	
	lang.insertNodeAfter = function(newNode, existingNode){
		var parentNode = existingNode.parentNode;
		if(parentNode.lastChild == existingNode){
			parentNode.appendChild(newNode)
		}else{
			parentNode.insertBefore(newNode, existingNode.nextSibling);
		}
	},
	
	lang._fontStyles = {
			fontFamily : 1,
			fontSize : 1,
			fontWeight : 1,
			fontStyle : 1,
			lineHeight : 1
	},
	
	lang.isMathTokenNode = function(node){
		var nodeName = node.nodeName;
		return this.isMathTokenName(nodeName);
	},
	
	lang.isMathTokenName = function(nodeName){
		var isTokenNode = false;
		
		var tokenNames = ["mi","mn","mo","mtext","mspace","ms"];
		array.forEach(tokenNames, function(name,index){
			if(nodeName == name){
				isTokenNode = true;
				return;
			}
		});
		return isTokenNode;
	},
		
	lang.measureTextSize = function(elem ,text) {
		if (!this.measureNode) {
			var _measureNode = document.createElement("div");
			var style = _measureNode.style;
			style.width = style.height = "auto";
			style.left = style.top = "-1000px";

			style.visibility = "hidden";
			style.position = "absolute";
			style.overflow = "visible";
			style.whiteSpace = "nowrap";
			document.body.appendChild(_measureNode);
			this.measureNode = _measureNode;
		}
		var measureNode = this.measureNode;
		
		measureNode.innerHTML = text;
		var style = measureNode.style;
		var computedStyle = window.getComputedStyle(elem, null);
		for ( var prop in this._fontStyles) {
			style[prop] = computedStyle[prop];
		}

		var size = {
			height : measureNode.offsetHeight,
			width : measureNode.offsetWidth
		};
		return size;
	}

	return lang;
});
},
'mathEditor/xmlUtil':function(){
define("mathEditor/xmlUtil", {
	createEmptyFrac: function(xmlDoc){
		//<mstyle displaystyle="true">
		var mstyle = xmlDoc.createElement("mstyle");
		mstyle.setAttribute("displaystyle","true");
		var mfrac = xmlDoc.createElement("mfrac");
		
		// 因为mathjax中的mfrac没有自动添加mrow，所以在这里显式添加。
		// 而mrow正是获取正确光标位置的关键。
		var mrow1 = xmlDoc.createElement("mrow");
		var mrow2 = xmlDoc.createElement("mrow");
		var mn1 = this._getPlaceHolder(xmlDoc);
		var mn2 = this._getPlaceHolder(xmlDoc);
		
		mstyle.appendChild(mfrac);
		mfrac.appendChild(mrow1);
		mfrac.appendChild(mrow2);
		mrow1.appendChild(mn1);
		mrow2.appendChild(mn2);
		return {rootNode:mstyle,focusNode:mn1};
	},
	
	_getPlaceHolder: function(xmlDoc){
		// summary:
		//		在节点上加上占位框的样式，本想直接添加一个className，但是会被mathjax的样式覆盖，
		//		所以在节点上添加一个className,但是真正的效果是通过style中属性实现的。
		
		var node = xmlDoc.createElement("mn");
		node.setAttribute("class", "drip_placeholder_box");
		node.setAttribute("style", "border:1px dotted black; padding:1px;background-color: #cccccc;color: #cccccc;");
		node.textContent = "8";
		return node;
	}
	
});
},
'mathEditor/View':function(){
define("mathEditor/View", ["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/_base/event",
        "dojo/dom",
        "dojo/dom-style",
        "dojo/dom-class",
        "dojo/dom-construct",
        "dojo/dom-geometry",
        "dojo/on",
        "dojo/aspect",
        "mathEditor/Model",
        "mathEditor/layer/Cursor",
        "mathEditor/lang"],function(
		declare,
		lang,
		array,
		event,
		dom,
		domStyle,
		domClass,
		domConstruct,
		domGeom,
		on,
		aspect,
		Model,
		Cursor,
		dripLang){
	
	// TODO:为view添加一个row属性。每行有个默认的高度，但是高度可以根据内容调整
	
	var ELEMENT = 1, TEXT = 3;
	
	return declare("mathEditor.View",null,{
		model : null,
		editorDiv : null,
		parentNode : null,
		textarea : null,
		
		readOnly: false, // 有时，编辑状态和只读状态显示的样式，是不一样的。暂时还没有区分对待。
		
		// focused: Boolean
		//		判断当前视图是否已获取焦点
		focused: false,
		
		constructor: function(options){
			lang.mixin(this, options);
			// 创建一个div容器，然后其中按照垂直层次，罗列各div
			// 不能将style移到class中，因为移到class中让一些样式无效了，FIXME：什么原因呢？
			var style={
				"border-radius":"3px",
				height:"100%",
				width:"100%",
				border:"solid 1px #CCC",
				position:"absolute",
				cursor:"text"
			};
			var editorDiv = this.editorDiv = domConstruct.create("div",{"style":style}, this.parentNode);
			
			// 内容层
			var textLayer = this.textLayer = domConstruct.create("div",{"class":"drip_layer drip_text"}, editorDiv);
			
			// 光标层， 看是否需要把光标放到光标层中
			var cursor = this.cursor = new Cursor({parentEl:editorDiv});
			
			on(editorDiv, "mousedown",lang.hitch(this, this._onMouseDownHandler));
			
			// 初始化视图
			textLayer.innerHTML = this.model.getHTML();
			aspect.after(this.model, "onChange", lang.hitch(this,this._onChange));
		},
		
		_onMouseDownHandler: function(e){
			0 && console.log("编辑器获取焦点");
			this._focus();
			event.stop(e);
		},
		
		_focus: function(){
			if(this.focused==false){
				this.focused = true;
				var textarea = this.textarea;
				var cursor = this.cursor;
				//textLayer
				domClass.add(this.editorDiv,"drip_editor_focus");
				
				setTimeout(function() {
					 textarea.focus();
					 cursor.show();
			    });
			}
		},
		
		_onChange : function(){
			this.textLayer.innerHTML = this.model.getHTML();
			MathJax.Hub.Queue(["Typeset",MathJax.Hub, this.textLayer]);
			// 因为是异步操作，需要把显示光标的方法放在MathJax的异步函数中。
			MathJax.Hub.Queue(lang.hitch(this,this.showCursor));
		},
		
		// summary
		//		编辑器失去焦点之后调用该方法
		blur: function(){
			if(this.focused == true){
				this.focused = false;
				domClass.remove(this.editorDiv,"drip_editor_focus");
				this.cursor.hide();
			}
		},
		
		showCursor: function(){
			0 && console.log("Typeset完成后执行此方法");
			0 && console.log(this.editorDiv);
			var cursorConfig = this._getCursorConfig();
			this.cursor.move(cursorConfig);
			
			// 每一次移动光标，都移动textarea
			// TODO：一种优化方案是，只有切换到IME输入法时，才移动textarea
			if(this.textarea){
				domStyle.set(this.textarea, {"top":cursorConfig.top+"px","left":cursorConfig.left+"px"});
			}else{
				0 && console.warn(this.declaredClass,"this.textarea为null");
			}
			
		},
		
		moveLeft: function(){
			this.model.moveLeft();
			this.showCursor();
		},
		
		_getFocusInfo: function(){
			// summary:
			//		使用节点和节点中的值的偏移量来表示光标位置
			
			var pathes = this.model.path;// TODO:重构，想个更好的方法名，getPath已经被使用。
			
			var focusDomNode = this.textLayer;
			var elementJax = null;
			var mrowNode = null;
			// 如果是math节点，则需要先
			array.forEach(pathes, function(path, index){
				// 移除root
				if(path.nodeName == 'root')return;
				if(path.nodeName == "line"){
					focusDomNode = focusDomNode.childNodes[path.offset - 1];
				}else if(path.nodeName == "text" || path.nodeName == "math"){
					var childNodes = focusDomNode.childNodes;
					var filtered = array.filter(childNodes, function(node, i){
						return node.nodeName.toLowerCase() == 'span';
					});
					focusDomNode = filtered[path.offset - 1];
					// 如果是math，还需要继续往下找节点
					// 或者根据这个div找到script中的数据，来进行循环
					// 如果已经定位到设置的层级，但是发现是mrow，则需要继续往下走一步。
					if(path.nodeName == "math"){
						var scriptNode = focusDomNode.nextSibling;
						elementJax = scriptNode.MathJax.elementJax.root;
					}
				}else{
					if(elementJax){
						if(dripLang.isMathTokenName(path.nodeName)){
							elementJax = elementJax.data[0];
						}else{
							elementJax = elementJax.data[path.offset - 1];
						}
						focusDomNode = dom.byId("MathJax-Span-"+elementJax.spanID);
						
						if(domClass.contains(focusDomNode, "mstyle")){
							if(path != "mstyle"){
								elementJax = elementJax.data[path.offset - 1];
								focusDomNode = dom.byId("MathJax-Span-"+elementJax.spanID);
							}
						}else if(domClass.contains(focusDomNode, "mrow")){
							mrowNode = focusDomNode;
							if(path != "mrow"){
								elementJax = elementJax.data[path.offset - 1];
								focusDomNode = dom.byId("MathJax-Span-"+elementJax.spanID);
							}
						}
					}
				}
			});
			
			return {node:focusDomNode, offset:this.model.getOffset(), mrowNode:mrowNode};
		},
		
		_getCursorConfig: function(){
			// summary:
			//		使用坐标值表示光标的位置。
			//		使用_getCursorPosition获取的信息进行计算。
			
			var top = 0, left = 0, height = 0, width = 0;
			var focusInfo = this._getFocusInfo();
			var node = focusInfo.node;
			var offset = focusInfo.offset;
			
			var textLayerPosition = this.getTextLayerPosition();
			var mrowNode = focusInfo.mrowNode;
			if(mrowNode){
				var mrowPosition = domGeom.position(mrowNode);
				top = mrowPosition.y - textLayerPosition.y;
				height = mrowPosition.h;
				
				var position = domGeom.position(node);
				left = position.x - textLayerPosition.x;
			}else{
				var position = domGeom.position(node);
				top = position.y - textLayerPosition.y;
				height = position.h;
				left = position.x - textLayerPosition.x;
			}
			
			//left += 字节点的宽度
			if(node.nodeType == ELEMENT){
				var childNodes = node.childNodes;
				if(childNodes.length == 1 && childNodes[0].nodeType == TEXT){
					// 如果childNodes的长度不是1，则offset对应的必是这些字节点的偏移量，而不是文本的
					if(node.textContent.length == offset){
						left += node.offsetWidth;
					}else{
						// 测宽度
						var text = node.textContent.substring(0, offset);
						var width = dripLang.measureTextSize(node, text).width;
						left += width;
					}
				}else{
					
				}
			}
			return {top:top,left:left,height:height, width:width};
		},
		
		getCursorPosition: function(){
			// summary:
			//		相对浏览器视窗的左上角位置
			//		注意这里定位的是提示框弹出前的位置。用在更普遍的场合，是在执行其他操作前的光标位置。
			var textLayerPosition = this.getTextLayerPosition();
			var x = textLayerPosition.x;
			var y = textLayerPosition.y;
			var cursorConfig = this.cursor.getCursorConfig();
			x += cursorConfig.left;
			y += cursorConfig.top + cursorConfig.height;
			return {x:x, y:y};
		},
		
		getTextLayerPosition: function(){
			// summary:
			//		获取文本层相对于视窗左上角的left,top,height,width等信息。
			
			if(!this.textLayerPosition)
				this.textLayerPosition = domGeom.position(this.textLayer);
					
			return this.textLayerPosition;
		}
		
	});
	
});
},
'mathEditor/layer/Cursor':function(){
/**
 * 光标
 */
define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/dom-construct",
        "dojo/dom-class",
        "dojo/dom-style",
        "dojo/dom-geometry"],function(
        		declare,
        		lang,
        		domConstruct,
        		domClass,
        		domStyle,
        		domGeom){
	
	return declare("mathEditor.layer.Cursor",null,{
		
		// parentEl: domNode
		//		放置光标的容器节点
		parentEl: null,
		
		caret: null,
		
		isVisible: false,
		
		cursorConfig: {top:0, left:0},
		
		constructor: function(kwArgs){
			lang.mixin(this, kwArgs);
			var caret = this.caret = domConstruct.create("div",{"class":"drip_cursor"},this.parentEl);
			caret.style.visibility = "hidden";
			
			this.defaultHeight = caret.clientHeight;
			this.cursorConfig.height = this.defaultHeight;
		},
		
		show: function(){
			// summary:
			//		显示光标
			
			this.isVisible = true;
			this.caret.style.visibility = "";
			
			this._restartTimer();
		},
		
		move: function(cursorConfig){
			if(this.isVisible == false)return;
			this.cursorConfig = cursorConfig;
			var top = cursorConfig.top;
			var left = cursorConfig.left;
			var height = cursorConfig.height;
			var style = this.caret.style;
			style.top = top+"px";
			style.left = left+"px";
			if(height && height > 0){
				style.height = height+"px";
			}
			
			this.caret.style.visibility = "";
			this._restartTimer();
		},
		
		getCursorConfig: function(){
			return this.cursorConfig;
		},
		
		hide: function(){
			// summary:
			//		隐藏光标
			
			this.caret.style.visibility = "hidden";
			this.isVisible = false;
			clearInterval(this.intervalId);
			this.intervalId = null;
			
			// 当失去光标的时候，确保不要随机的显示出光标，因为关闭了interval,
			// 但是timeout方法还会再执行一次，所以需要显式关闭。
			clearTimeout(this.timeoutId);
			this.timeoutId = null;
		},
		
		_restartTimer: function(){
			if(this.intervalId != null){
				clearInterval(this.intervalId);
				this.intervalId = null;
			}
			
			var caret = this.caret;
			var self = this;
			this.intervalId = setInterval(function(){
				caret.style.visibility = "hidden";
	            self.timeoutId = setTimeout(function() {
	            	caret.style.visibility = "";
	            	0 && console.log(self.timeoutId);
	            }, 400);
			},1000);
		},
		
		destroy: function(){
			if(this.intervalId != null){
				clearInterval(this.intervalId);
			}
			// 删除光标
			domConstruct.destroy(this.caret);
		}
	
	});
});
},
'mathEditor/ContentAssist':function(){
define(["dojo/_base/declare",
        "dojo/_base/array",
        "dojo/_base/lang",
        "dojo/on",
        "dojo/dom-construct",
        "dojo/dom-class",
        "dojo/dom-style",
        "dijit/popup",
        "dijit/DropDownMenu",
        "dijit/MenuItem",
        "mathEditor/mathContentAssist"], function(
		declare,
		array,
		lang,
		on,
		domConstruct,
		domClass,
		domStyle,
		popup,
		DropDownMenu,
		MenuItem,
		mathContentAssist) {

	return declare("mathEditor.ContentAssist",DropDownMenu,{
		// summary:
		//		弹出的建议输入列表提示框
		// 提示框关闭的时机：
		//		1.按下ESC
		//		2.鼠标点击弹出框之外的区域
		//		3.用户用鼠标点击一个建议的值
		//		4.用户选择一个建议值，并按下回车键
		//		5.用户忽略弹出的提示框，新输入的值与前面的缓存值找不出建议项，
		//		  则保留用户的输入，并关闭提示框（这个可提高用户的输入效率）。
		
		proposals : null,
		view: null,
		
		// summary:
		//		缓存的字符串，因为这个字符串中约定不包含unicode字符，所以直接使用字符串存储。
		cacheString: "",
		opened: false,
		
		
		postCreate: function(){
			this.inherited(arguments);
			on(this.view.editorDiv, "mousedown", lang.hitch(this,function(e){
				if(this.opened){
					popup.close(this);
				}
			}));
		},
		
		startup: function(){
			this.inherited(arguments);
		},
		
		// 来自dijit/Menu
		_scheduleOpen: function(/*DomNode?*/ target, x, y){
			// summary:
			//		Set timer to display myself.  Using a timer rather than displaying immediately solves
			//		two problems:
			//
			//		1. IE: without the delay, focus work in "open" causes the system
			//		context menu to appear in spite of stopEvent.
			//
			//		2. Avoid double-shows on linux, where shift-F10 generates an oncontextmenu event
			//		even after a event.stop(e).  (Shift-F10 on windows doesn't generate the
			//		oncontextmenu event.)

			view = this.view;
			var self = this;
			if(!this._openTimer){
				this._openTimer = this.defer(function(){
					delete this._openTimer;
					popup.open({
						popup : target,
						x : x,
						y : y,
						onExecute : function() {
							popup.close(target);
							// 编辑器获取焦点
							view.focus();
							self.opened = false;
						},
						onCancel : function() {
							popup.close(target);
							self.opened = false;
							// 编辑器获取焦点
							view.focus();
						},
						onClose : function() {
							// 编辑器获取焦点
							view.focus();
							self.opened = false;
						}
					});
					this.opened = true;
					//target.focus();
					// focus是选中加上获取焦点；而select只选中，但不获取焦点。
					target.select();
				}, 0);
			}
		},
		
		_open: function(){
			var cursorPosition = this.view.getCursorPosition();
			var x = cursorPosition.x;
			var y = cursorPosition.y;
			this._scheduleOpen(this, x, y);
		},
		
		_clear: function(){
			var children = this.getChildren();
			array.forEach(children, lang.hitch(this,function(child, index){
				this.removeChild(child);
			}));
		},
		
		_setProposals: function(proposals){
			// summary:
			//		往弹出面板中添加数据。
			// data: Array
			
			this._clear();
			
			this.proposals = proposals;
			array.forEach(proposals,lang.hitch(this,function(jsonObject,index){
				var menuItem = new MenuItem({label:jsonObject.label, iconClass:jsonObject.iconClass});
				// jsonObject
				menuItem.on("click", lang.hitch(this,this._onApplyProposal,jsonObject.map, jsonObject.nodeName));
				this.addChild(menuItem);
			}));
		},

		// TODO:需要弹出框与编辑器之间切换焦点
		// 当弹出框时，弹出框获取焦点；当关闭弹出狂框，编辑器获取焦点。
		show: function(data){
			// summary:
			//		判断输入的内容是否可以获取到建议的映射值
			// data: String
			//		输入的字符
			// return:String
			//		推荐的值，如果没有则返回null。
			
			//1. 新输入的data，如何追加。
			//2. 如果用户已经默认某些值，在这里调用应用方法，并关闭打开的提示框。
			
			if(this.opened==false){
				this.cacheString = data;
			}else{
				this.cacheString+=data;
			}
			
			var proposals = mathContentAssist.getProposals(this.cacheString);
			this._setProposals(proposals);
			if(proposals.length > 0){
				this._open();
				var result = proposals[0].map;
				return result;
			}else{
				this.cacheString = "";
				if(this.opened){
					popup.close(this);
					this.opened = false;
				}
				return null;
			}
		},
		
		_onApplyProposal: function(data,nodeName, evt){
			// 因为cacheString的值是实时变化的，所以需要在外面加一层方法调用。
			this.apply(data, nodeName, this.cacheString.length,evt);
		},
		
		apply: function(data, nodeName, cacheCount,evt){
			// summary:
			//		应用某个建议的值，将其最终存入到model中。
			// data：
			//		当前item对应的数据
			// nodeName:
			//		用那个mathml标签封装data
			// cacheCount:
			//		缓存的字符的个数，这些字符已经在view中显示，需要根据这个数字删除
			// evt：
			//		事件对象
			
			0 && console.log(data, cacheCount, evt);
		},
		
		enter: function(evt){
			this.onItemClick(this.selectedChild, evt);
		},
		
		
		/*************************下面是select相关的代码****************************/
		select: function(){
			this.selectFirstChild();
		},
		
		selectFirstChild: function(){
			this.selectChild(this._getFirstSelectableChild());
		},
		
		selectPrev: function(){
			this.selectChild(this._getNextSelectableChild(this.selectedChild, -1), true);
		},
		
		selectNext: function(){
			this.selectChild(this._getNextSelectableChild(this.selectedChild, 1));
		},
		
		_getFirstSelectableChild: function(){
			// summary:
			//		Returns first child that can be focused
			return this._getNextSelectableChild(null, 1);	// dijit/_WidgetBase
		},

		_getLastFocusableChild: function(){
			// summary:
			//		Returns last child that can be focused
			return this._getNextSelectableChild(null, -1);	// dijit/_WidgetBase
		},

		_getNextSelectableChild: function(child, dir){
			// summary:
			//		Returns the next or previous selected child, compared
			//		to "child"
			// child: Widget
			//		The current widget
			// dir: Integer
			//		- 1 = after
			//		- -1 = before
			
			if(child){
				child = this._getSiblingOfChild(child, dir);
			}
			var children = this.getChildren();
			for(var i=0; i < children.length; i++){
				if(!child){
					child = children[(dir>0) ? 0 : (children.length-1)];
				}
				if(child.isFocusable()){
					return child;	// dijit/_WidgetBase
				}
				child = this._getSiblingOfChild(child, dir);
			}
			// no focusable child found
			return null;	// dijit/_WidgetBase
		},
		
		selectChild: function(/*dijit/_WidgetBase*/ widget, /*Boolean*/ last){
			// summary:
			//		选中指定的子部件
			// widget:
			//		子部件
			// last:
			//		If true and if widget has multiple focusable nodes, focus the
			//		last one instead of the first one
			// tags:
			//		protected

			if(!widget){ return; }

			if(this.selectedChild && widget !== this.selectedChild){
				this.selectedChild._setSelected(false);
			}
			
			this.selectedChild = widget;
			widget._setSelected(true);
		}
		
		
	});
	
});
},
'dijit/DropDownMenu':function(){
require({cache:{
'url:dijit/templates/Menu.html':"<table class=\"dijit dijitMenu dijitMenuPassive dijitReset dijitMenuTable\" role=\"menu\" tabIndex=\"${tabIndex}\"\n\t   data-dojo-attach-event=\"onkeydown:_onKeyDown\" cellspacing=\"0\">\n\t<tbody class=\"dijitReset\" data-dojo-attach-point=\"containerNode\"></tbody>\n</table>\n"}});
define("dijit/DropDownMenu", [
	"dojo/_base/declare", // declare
	"dojo/keys", // keys
	"dojo/text!./templates/Menu.html",
	"./_OnDijitClickMixin",
	"./_MenuBase"
], function(declare, keys, template, _OnDijitClickMixin, _MenuBase){

	// module:
	//		dijit/DropDownMenu

	return declare("dijit.DropDownMenu", [_MenuBase, _OnDijitClickMixin], {
		// summary:
		//		A menu, without features for context menu (Meaning, drop down menu)

		templateString: template,

		baseClass: "dijitMenu",

		postCreate: function(){
			this.inherited(arguments);
			var l = this.isLeftToRight();
			this._openSubMenuKey = l ? keys.RIGHT_ARROW : keys.LEFT_ARROW;
			this._closeSubMenuKey = l ? keys.LEFT_ARROW : keys.RIGHT_ARROW;
			this.connectKeyNavHandlers([keys.UP_ARROW], [keys.DOWN_ARROW]);
		},

		_onKeyDown: function(/*Event*/ evt){
			// summary:
			//		Handle keyboard based menu navigation.
			// tags:
			//		protected

			if(evt.ctrlKey || evt.altKey){
				return;
			}

			switch(evt.keyCode){
				case this._openSubMenuKey:
					this._moveToPopup(evt);
					evt.stopPropagation();
					evt.preventDefault();
					break;
				case this._closeSubMenuKey:
					if(this.parentMenu){
						if(this.parentMenu._isMenuBar){
							this.parentMenu.focusPrev();
						}else{
							this.onCancel(false);
						}
					}else{
						evt.stopPropagation();
						evt.preventDefault();
					}
					break;
			}
		}
	});
});

},
'url:dijit/templates/Menu.html':"<table class=\"dijit dijitMenu dijitMenuPassive dijitReset dijitMenuTable\" role=\"menu\" tabIndex=\"${tabIndex}\"\n\t   data-dojo-attach-event=\"onkeydown:_onKeyDown\" cellspacing=\"0\">\n\t<tbody class=\"dijitReset\" data-dojo-attach-point=\"containerNode\"></tbody>\n</table>\n",
'dijit/_MenuBase':function(){
define("dijit/_MenuBase", [
	"dojo/_base/array", // array.indexOf
	"dojo/_base/declare", // declare
	"dojo/dom", // dom.isDescendant domClass.replace
	"dojo/dom-attr",
	"dojo/dom-class", // domClass.replace
	"dojo/_base/lang", // lang.hitch
	"dojo/mouse", // mouse.enter, mouse.leave
	"dojo/on",
	"dojo/window",
	"./a11yclick",
	"./popup",
	"./registry",
	"./_Widget",
	"./_CssStateMixin",
	"./_KeyNavContainer",
	"./_TemplatedMixin"
], function(array, declare, dom, domAttr, domClass, lang, mouse, on, winUtils, a11yclick, pm, registry, _Widget, _CssStateMixin, _KeyNavContainer, _TemplatedMixin){


// module:
//		dijit/_MenuBase

	return declare("dijit._MenuBase", [_Widget, _TemplatedMixin, _KeyNavContainer, _CssStateMixin], {
		// summary:
		//		Base class for Menu and MenuBar

		// parentMenu: [readonly] Widget
		//		pointer to menu that displayed me
		parentMenu: null,

		// popupDelay: Integer
		//		number of milliseconds before hovering (without clicking) causes the popup to automatically open.
		popupDelay: 500,

		// autoFocus: Boolean
		//		A toggle to control whether or not a Menu gets focused when opened as a drop down from a MenuBar
		//		or DropDownButton/ComboButton.   Note though that it always get focused when opened via the keyboard.
		autoFocus: false,

		childSelector: function(/*DOMNode*/ node){
			// summary:
			//		Selector (passed to on.selector()) used to identify MenuItem child widgets, but exclude inert children
			//		like MenuSeparator.  If subclass overrides to a string (ex: "> *"), the subclass must require dojo/query.
			// tags:
			//		protected

			var widget = registry.byNode(node);
			return node.parentNode == this.containerNode && widget && widget.focus;
		},

		postCreate: function(){
			var self = this,
				matches = typeof this.childSelector == "string" ? this.childSelector : lang.hitch(this, "childSelector");
			this.own(
				on(this.containerNode, on.selector(matches, mouse.enter), function(){
					self.onItemHover(registry.byNode(this));
				}),
				on(this.containerNode, on.selector(matches, mouse.leave), function(){
					self.onItemUnhover(registry.byNode(this));
				}),
				on(this.containerNode, on.selector(matches, a11yclick), function(evt){
					self.onItemClick(registry.byNode(this), evt);
					evt.stopPropagation();
					evt.preventDefault();
				})
			);
			this.inherited(arguments);
		},

		onKeyboardSearch: function(/*MenuItem*/ item, /*Event*/ evt, /*String*/ searchString, /*Number*/ numMatches){
			// summary:
			//		Attach point for notification about when a menu item has been searched for
			//		via the keyboard search mechanism.
			// tags:
			//		protected
			this.inherited(arguments);
			if(!!item && (numMatches == -1 || (!!item.popup && numMatches == 1))){
				this.onItemClick(item, evt);
			}
		},

		_keyboardSearchCompare: function(/*dijit/_WidgetBase*/ item, /*String*/ searchString){
			// summary:
			//		Compares the searchString to the widget's text label, returning:
			//		-1: a high priority match and stop searching
			//		 0: no match
			//		 1: a match but keep looking for a higher priority match
			// tags:
			//		private
			if(!!item.shortcutKey){
				// accessKey matches have priority
				return searchString == item.shortcutKey.toLowerCase() ? -1 : 0;
			}
			return this.inherited(arguments) ? 1 : 0; // change return value of -1 to 1 so that searching continues
		},

		onExecute: function(){
			// summary:
			//		Attach point for notification about when a menu item has been executed.
			//		This is an internal mechanism used for Menus to signal to their parent to
			//		close them, because they are about to execute the onClick handler.  In
			//		general developers should not attach to or override this method.
			// tags:
			//		protected
		},

		onCancel: function(/*Boolean*/ /*===== closeAll =====*/){
			// summary:
			//		Attach point for notification about when the user cancels the current menu
			//		This is an internal mechanism used for Menus to signal to their parent to
			//		close them.  In general developers should not attach to or override this method.
			// tags:
			//		protected
		},

		_moveToPopup: function(/*Event*/ evt){
			// summary:
			//		This handles the right arrow key (left arrow key on RTL systems),
			//		which will either open a submenu, or move to the next item in the
			//		ancestor MenuBar
			// tags:
			//		private

			if(this.focusedChild && this.focusedChild.popup && !this.focusedChild.disabled){
				this.onItemClick(this.focusedChild, evt);
			}else{
				var topMenu = this._getTopMenu();
				if(topMenu && topMenu._isMenuBar){
					topMenu.focusNext();
				}
			}
		},

		_onPopupHover: function(/*Event*/ /*===== evt =====*/){
			// summary:
			//		This handler is called when the mouse moves over the popup.
			// tags:
			//		private

			// if the mouse hovers over a menu popup that is in pending-close state,
			// then stop the close operation.
			// This can't be done in onItemHover since some popup targets don't have MenuItems (e.g. ColorPicker)
			if(this.currentPopup && this.currentPopup._pendingClose_timer){
				var parentMenu = this.currentPopup.parentMenu;
				// highlight the parent menu item pointing to this popup
				if(parentMenu.focusedChild){
					parentMenu.focusedChild._setSelected(false);
				}
				parentMenu.focusedChild = this.currentPopup.from_item;
				parentMenu.focusedChild._setSelected(true);
				// cancel the pending close
				this._stopPendingCloseTimer(this.currentPopup);
			}
		},

		onItemHover: function(/*MenuItem*/ item){
			// summary:
			//		Called when cursor is over a MenuItem.
			// tags:
			//		protected

			// Don't do anything unless user has "activated" the menu by:
			//		1) clicking it
			//		2) opening it from a parent menu (which automatically focuses it)
			if(this.isActive){
				this.focusChild(item);
				if(item.popup && !item.disabled && !this.hover_timer){
					this.hover_timer = this.defer(lang.hitch(this, "_openPopup", item), this.popupDelay);
				}
			}
			// if the user is mixing mouse and keyboard navigation,
			// then the menu may not be active but a menu item has focus,
			// but it's not the item that the mouse just hovered over.
			// To avoid both keyboard and mouse selections, use the latest.
			if(this.focusedChild){
				this.focusChild(item);
			}
			this._hoveredChild = item;

			item._set("hovering", true);
		},

		_onChildBlur: function(item){
			// summary:
			//		Called when a child MenuItem becomes inactive because focus
			//		has been removed from the MenuItem *and* it's descendant menus.
			// tags:
			//		private
			this._stopPopupTimer();
			item._setSelected(false);
			// Close all popups that are open and descendants of this menu
			var itemPopup = item.popup;
			if(itemPopup){
				this._stopPendingCloseTimer(itemPopup);
				itemPopup._pendingClose_timer = this.defer(function(){
					itemPopup._pendingClose_timer = null;
					if(itemPopup.parentMenu){
						itemPopup.parentMenu.currentPopup = null;
					}
					pm.close(itemPopup); // this calls onClose
				}, this.popupDelay);
			}
		},

		onItemUnhover: function(/*MenuItem*/ item){
			// summary:
			//		Callback fires when mouse exits a MenuItem
			// tags:
			//		protected

			if(this.isActive){
				this._stopPopupTimer();
			}
			if(this._hoveredChild == item){
				this._hoveredChild = null;
			}

			item._set("hovering", false);
		},

		_stopPopupTimer: function(){
			// summary:
			//		Cancels the popup timer because the user has stop hovering
			//		on the MenuItem, etc.
			// tags:
			//		private
			if(this.hover_timer){
				this.hover_timer = this.hover_timer.remove();
			}
		},

		_stopPendingCloseTimer: function(/*dijit/_WidgetBase*/ popup){
			// summary:
			//		Cancels the pending-close timer because the close has been preempted
			// tags:
			//		private
			if(popup._pendingClose_timer){
				popup._pendingClose_timer = popup._pendingClose_timer.remove();
			}
		},

		_stopFocusTimer: function(){
			// summary:
			//		Cancels the pending-focus timer because the menu was closed before focus occured
			// tags:
			//		private
			if(this._focus_timer){
				this._focus_timer = this._focus_timer.remove();
			}
		},

		_getTopMenu: function(){
			// summary:
			//		Returns the top menu in this chain of Menus
			// tags:
			//		private
			for(var top = this; top.parentMenu; top = top.parentMenu){
				;
			}
			return top;
		},

		onItemClick: function(/*dijit/_WidgetBase*/ item, /*Event*/ evt){
			// summary:
			//		Handle clicks on an item.
			// tags:
			//		private

			// this can't be done in _onFocus since the _onFocus events occurs asynchronously
			if(typeof this.isShowingNow == 'undefined'){ // non-popup menu
				this._markActive();
			}

			this.focusChild(item);

			if(item.disabled){
				return false;
			}

			if(item.popup){
				this._openPopup(item, /^key/.test(evt.type));
			}else{
				// before calling user defined handler, close hierarchy of menus
				// and restore focus to place it was when menu was opened
				this.onExecute();

				// user defined handler for click
				item._onClick ? item._onClick(evt) : item.onClick(evt);
			}
		},

		_openPopup: function(/*dijit/MenuItem*/ from_item, /*Boolean*/ focus){
			// summary:
			//		Open the popup to the side of/underneath the current menu item, and optionally focus first item
			// tags:
			//		protected

			this._stopPopupTimer();
			var popup = from_item.popup;
			if(!popup.isShowingNow){
				if(this.currentPopup){
					this._stopPendingCloseTimer(this.currentPopup);
					pm.close(this.currentPopup);
				}
				popup.parentMenu = this;
				popup.from_item = from_item; // helps finding the parent item that should be focused for this popup
				var self = this;
				pm.open({
					parent: this,
					popup: popup,
					around: from_item.domNode,
					orient: this._orient || ["after", "before"],
					onCancel: function(){ // called when the child menu is canceled
						// set isActive=false (_closeChild vs _cleanUp) so that subsequent hovering will NOT open child menus
						// which seems aligned with the UX of most applications (e.g. notepad, wordpad, paint shop pro)
						self.focusChild(from_item);	// put focus back on my node
						self._cleanUp();			// close the submenu (be sure this is done _after_ focus is moved)
						from_item._setSelected(true); // oops, _cleanUp() deselected the item
						self.focusedChild = from_item;	// and unset focusedChild
					},
					onExecute: lang.hitch(this, "_cleanUp")
				});

				this.currentPopup = popup;
				// detect mouseovers to handle lazy mouse movements that temporarily focus other menu items
				popup.connect(popup.domNode, "onmouseenter", lang.hitch(self, "_onPopupHover")); // cleaned up when the popped-up widget is destroyed on close
			}

			if(focus && popup.focus){
				// If user is opening the popup via keyboard (right arrow, or down arrow for MenuBar), then focus the popup.
				// If the cursor happens to collide with the popup, it will generate an onmouseover event
				// even though the mouse wasn't moved.  Use defer() to call popup.focus so that
				// our focus() call overrides the onmouseover event, rather than vice-versa.  (#8742)
				popup._focus_timer = this.defer(lang.hitch(popup, function(){
					this._focus_timer = null;
					this.focus();
				}));
			}
		},

		_markActive: function(){
			// summary:
			//		Mark this menu's state as active.
			//		Called when this Menu gets focus from:
			//
			//		1. clicking it (mouse or via space/arrow key)
			//		2. being opened by a parent menu.
			//
			//		This is not called just from mouse hover.
			//		Focusing a menu via TAB does NOT automatically set isActive
			//		since TAB is a navigation operation and not a selection one.
			//		For Windows apps, pressing the ALT key focuses the menubar
			//		menus (similar to TAB navigation) but the menu is not active
			//		(ie no dropdown) until an item is clicked.
			this.isActive = true;
			domClass.replace(this.domNode, "dijitMenuActive", "dijitMenuPassive");
		},

		onOpen: function(/*Event*/ /*===== e =====*/){
			// summary:
			//		Callback when this menu is opened.
			//		This is called by the popup manager as notification that the menu
			//		was opened.
			// tags:
			//		private

			this.isShowingNow = true;
			this._markActive();
		},

		_markInactive: function(){
			// summary:
			//		Mark this menu's state as inactive.
			this.isActive = false; // don't do this in _onBlur since the state is pending-close until we get here
			domClass.replace(this.domNode, "dijitMenuPassive", "dijitMenuActive");
		},

		onClose: function(){
			// summary:
			//		Callback when this menu is closed.
			//		This is called by the popup manager as notification that the menu
			//		was closed.
			// tags:
			//		private

			this._stopFocusTimer();
			this._markInactive();
			this.isShowingNow = false;
			this.parentMenu = null;
		},

		_closeChild: function(){
			// summary:
			//		Called when submenu is clicked or focus is lost.  Close hierarchy of menus.
			// tags:
			//		private
			this._stopPopupTimer();

			if(this.currentPopup){
				// If focus is on a descendant MenuItem then move focus to me,
				// because IE doesn't like it when you display:none a node with focus,
				// and also so keyboard users don't lose control.
				// Likely, immediately after a user defined onClick handler will move focus somewhere
				// else, like a Dialog.
				if(array.indexOf(this._focusManager.activeStack, this.id) >= 0){
					domAttr.set(this.focusedChild.focusNode, "tabIndex", this.tabIndex);
					this.focusedChild.focusNode.focus();
				}
				// Close all popups that are open and descendants of this menu
				pm.close(this.currentPopup);
				this.currentPopup = null;
			}

			if(this.focusedChild){ // unhighlight the focused item
				this.focusedChild._setSelected(false);
				this.onItemUnhover(this.focusedChild);
			}

			// Repeat what _KeyNavContainer.onBlur() does, so that the MenuBar gets treated as blurred even though the user
			// hasn't clicked or focused anywhere outside of the MenuBar yet.  Otherwise, the Menu code gets confused since
			// the menu is in a passive state but this.focusedChild is still set.
			domAttr.set(this.domNode, "tabIndex", this.tabIndex);
			if(this.focusedChild){
				this.focusedChild.set("tabIndex", "-1");
				this._set("focusedChild", null);
			}
		},

		_onItemFocus: function(/*MenuItem*/ item){
			// summary:
			//		Called when child of this Menu gets focus from:
			//
			//		1. clicking it
			//		2. tabbing into it
			//		3. being opened by a parent menu.
			//
			//		This is not called just from mouse hover.
			if(this._hoveredChild && this._hoveredChild != item){
				this.onItemUnhover(this._hoveredChild);	// any previous mouse movement is trumped by focus selection
			}
		},

		_onBlur: function(){
			// summary:
			//		Called when focus is moved away from this Menu and it's submenus.
			// tags:
			//		protected
			this._cleanUp();
			this.inherited(arguments);
		},

		_cleanUp: function(){
			// summary:
			//		Called when the user is done with this menu.  Closes hierarchy of menus.
			// tags:
			//		private

			this._closeChild(); // don't call this.onClose since that's incorrect for MenuBar's that never close
			if(typeof this.isShowingNow == 'undefined'){ // non-popup menu doesn't call onClose
				this._markInactive();
			}
		}
	});

});

},
'dijit/_KeyNavContainer':function(){
define("dijit/_KeyNavContainer", [
	"dojo/_base/array", // array.forEach
	"dojo/_base/declare", // declare
	"dojo/dom-attr", // domAttr.set
	"dojo/_base/kernel", // kernel.deprecated
	"dojo/keys", // keys.END keys.HOME
	"dojo/_base/lang", // lang.hitch
	"./registry",
	"./_Container",
	"./_FocusMixin",
	"./_KeyNavMixin"
], function(array, declare, domAttr, kernel, keys, lang, registry, _Container, _FocusMixin, _KeyNavMixin){


	// module:
	//		dijit/_KeyNavContainer

	return declare("dijit._KeyNavContainer", [_FocusMixin, _Container, _KeyNavMixin], {
		// summary:
		//		A _Container with keyboard navigation of its children.
		// description:
		//		Provides normalized keyboard and focusing code for Container widgets.
		//		To use this mixin, call connectKeyNavHandlers() in postCreate().
		//		Also, child widgets must implement a focus() method.

		connectKeyNavHandlers: function(/*keys[]*/ prevKeyCodes, /*keys[]*/ nextKeyCodes){
			// summary:
			//		Call in postCreate() to attach the keyboard handlers to the container.
			// prevKeyCodes: keys[]
			//		Key codes for navigating to the previous child.
			// nextKeyCodes: keys[]
			//		Key codes for navigating to the next child.
			// tags:
			//		protected

			// TODO: remove for 2.0, and make subclasses override _onLeftArrow, _onRightArrow etc. instead.

			var keyCodes = (this._keyNavCodes = {});
			var prev = lang.hitch(this, "focusPrev");
			var next = lang.hitch(this, "focusNext");
			array.forEach(prevKeyCodes, function(code){
				keyCodes[code] = prev;
			});
			array.forEach(nextKeyCodes, function(code){
				keyCodes[code] = next;
			});
			keyCodes[keys.HOME] = lang.hitch(this, "focusFirstChild");
			keyCodes[keys.END] = lang.hitch(this, "focusLastChild");
		},

		startupKeyNavChildren: function(){
			kernel.deprecated("startupKeyNavChildren() call no longer needed", "", "2.0");
		},

		startup: function(){
			this.inherited(arguments);
			array.forEach(this.getChildren(), lang.hitch(this, "_startupChild"));
		},

		addChild: function(/*dijit/_WidgetBase*/ widget, /*int?*/ insertIndex){
			this.inherited(arguments);
			this._startupChild(widget);
		},

		_startupChild: function(/*dijit/_WidgetBase*/ widget){
			// summary:
			//		Setup for each child widget.
			// description:
			//		Sets tabIndex=-1 on each child, so that the tab key will
			//		leave the container rather than visiting each child.
			//
			//		Note: if you add children by a different method than addChild(), then need to call this manually
			//		or at least make sure the child's tabIndex is -1.
			//
			//		Note: see also _LayoutWidget.setupChild(), which is also called for each child widget.
			// tags:
			//		private

			widget.set("tabIndex", "-1");
		},

		_getFirstFocusableChild: function(){
			// summary:
			//		Returns first child that can be focused.

			// Leverage _getNextFocusableChild() to skip disabled children
			return this._getNextFocusableChild(null, 1);	// dijit/_WidgetBase
		},

		_getLastFocusableChild: function(){
			// summary:
			//		Returns last child that can be focused.

			// Leverage _getNextFocusableChild() to skip disabled children
			return this._getNextFocusableChild(null, -1);	// dijit/_WidgetBase
		},

		focusFirstChild: function(){
			// summary:
			//		Focus the first focusable child in the container.
			// tags:
			//		protected

			this.focusChild(this._getFirstFocusableChild());
		},

		focusLastChild: function(){
			// summary:
			//		Focus the last focusable child in the container.
			// tags:
			//		protected

			this.focusChild(this._getLastFocusableChild());
		},

		focusNext: function(){
			// summary:
			//		Focus the next widget
			// tags:
			//		protected
			this.focusChild(this._getNextFocusableChild(this.focusedChild, 1));
		},

		focusPrev: function(){
			// summary:
			//		Focus the last focusable node in the previous widget
			//		(ex: go to the ComboButton icon section rather than button section)
			// tags:
			//		protected
			this.focusChild(this._getNextFocusableChild(this.focusedChild, -1), true);
		},

		_getNextFocusableChild: function(child, dir){
			// summary:
			//		Returns the next or previous focusable child, compared to "child".
			//		Implements and extends _KeyNavMixin._getNextFocusableChild() for a _Container.
			// child: Widget
			//		The current widget
			// dir: Integer
			//		- 1 = after
			//		- -1 = before
			// tags:
			//		abstract extension

			if(child){
				child = this._getSiblingOfChild(child, dir);
			}
			var children = this.getChildren();
			for(var i = 0; i < children.length; i++){
				if(!child){
					child = children[(dir > 0) ? 0 : (children.length - 1)];
				}
				if(child.isFocusable()){
					return child;	// dijit/_WidgetBase
				}
				child = this._getSiblingOfChild(child, dir);
			}
			// no focusable child found
			return null;	// dijit/_WidgetBase
		},

		childSelector: function(/*DOMNode*/ node){
			// Implement _KeyNavMixin.childSelector, to identify focusable child nodes.
			// If we allowed a dojo/query dependency from this module this could more simply be a string "> *"
			// instead of this function.

			var node = registry.byNode(node);
			return node && node.getParent() == this;
		}
	});
});

},
'dijit/_KeyNavMixin':function(){
define("dijit/_KeyNavMixin", [
	"dojo/_base/array", // array.forEach
	"dojo/_base/declare", // declare
	"dojo/dom-attr", // domAttr.set
	"dojo/keys", // keys.END keys.HOME, keys.LEFT_ARROW etc.
	"dojo/_base/lang", // lang.hitch
	"dojo/on",
	"dijit/registry",
	"dijit/_FocusMixin"        // to make _onBlur() work
], function(array, declare, domAttr, keys, lang, on, registry, _FocusMixin){

	// module:
	//		dijit/_KeyNavMixin

	return declare("dijit._KeyNavMixin", _FocusMixin, {
		// summary:
		//		A mixin to allow arrow key and letter key navigation of child or descendant widgets.
		//		It can be used by dijit/_Container based widgets with a flat list of children,
		//		or more complex widgets like dijit/Tree.
		//
		//		To use this mixin, the subclass must:
		//
		//			- Implement  focusFirstChild(), focusLastChild(), _onLeftArrow(), _onRightArrow()
		//			  _onDownArrow(), _onUpArrow() methods to handle home/end/left/right/up/down keystrokes.
		//			- Implement _getNextFocusableChild() to find the next or previous child relative to a current child.
		//			  Next and previous in this context refer to a linear ordering of the children or descendants used
		//			  by letter key search.
		//			- Set all descendants' initial tabIndex to "-1"; both initial descendants and any
		//			  descendants added later, by for example addChild()
		//			- Define childSelector to a function or string that identifies focusable child widgets
		//
		//		Also, child widgets must implement a focus() method.

		/*=====
		 // focusedChild: [protected readonly] Widget
		 //		The currently focused child widget, or null if there isn't one
		 focusedChild: null,

		 // _keyNavCodes: Object
		 //		Hash mapping key code (arrow keys and home/end key) to functions to handle those keys.
		 //		Usually not used directly, as subclasses can instead override _onLeftArrow() etc.
		 _keyNavCodes: {},
		 =====*/

		// tabIndex: String
		//		Tab index of the container; same as HTML tabIndex attribute.
		//		Note then when user tabs into the container, focus is immediately
		//		moved to the first item in the container.
		tabIndex: "0",

		// childSelector: [protected abstract] Function||String
		//		Selector (passed to on.selector()) used to identify what to treat as a child widget.   Used to monitor
		//		focus events and set this.focusedChild.   Must be set by implementing class.   If this is a string
		//		(ex: "> *") then the implementing class must require dojo/query.
		childSelector: null,

		postCreate: function(){
			this.inherited(arguments);

			// Set tabIndex on this.domNode.  Will be automatic after #7381 is fixed.
			domAttr.set(this.domNode, "tabIndex", this.tabIndex);

			if(!this._keyNavCodes){
				var keyCodes = this._keyNavCodes = {};
				keyCodes[keys.HOME] = lang.hitch(this, "focusFirstChild");
				keyCodes[keys.END] = lang.hitch(this, "focusLastChild");
				keyCodes[this.isLeftToRight() ? keys.LEFT_ARROW : keys.RIGHT_ARROW] = lang.hitch(this, "_onLeftArrow");
				keyCodes[this.isLeftToRight() ? keys.RIGHT_ARROW : keys.LEFT_ARROW] = lang.hitch(this, "_onRightArrow");
				keyCodes[keys.UP_ARROW] = lang.hitch(this, "_onUpArrow");
				keyCodes[keys.DOWN_ARROW] = lang.hitch(this, "_onDownArrow");
			}

			var self = this,
				childSelector = typeof this.childSelector == "string" ? this.childSelector :
					lang.hitch(this, "childSelector");
			this.own(
				on(this.domNode, "keypress", lang.hitch(this, "_onContainerKeypress")),
				on(this.domNode, "keydown", lang.hitch(this, "_onContainerKeydown")),
				on(this.domNode, "focus", lang.hitch(this, "_onContainerFocus")),
				on(this.containerNode, on.selector(childSelector, "focusin"), function(evt){
					self._onChildFocus(registry.getEnclosingWidget(this), evt);
				})
			);
		},

		_onLeftArrow: function(){
			// summary:
			//		Called on left arrow key, or right arrow key if widget is in RTL mode.
			//		Should go back to the previous child in horizontal container widgets like Toolbar.
			// tags:
			//		extension
		},

		_onRightArrow: function(){
			// summary:
			//		Called on right arrow key, or left arrow key if widget is in RTL mode.
			//		Should go to the next child in horizontal container widgets like Toolbar.
			// tags:
			//		extension
		},

		_onUpArrow: function(){
			// summary:
			//		Called on up arrow key. Should go to the previous child in vertical container widgets like Menu.
			// tags:
			//		extension
		},

		_onDownArrow: function(){
			// summary:
			//		Called on down arrow key. Should go to the next child in vertical container widgets like Menu.
			// tags:
			//		extension
		},

		focus: function(){
			// summary:
			//		Default focus() implementation: focus the first child.
			this.focusFirstChild();
		},

		focusFirstChild: function(){
			// summary:
			//		Focus the first focusable child in the container.
			// tags:
			//		abstract extension
		},

		focusLastChild: function(){
			// summary:
			//		Focus the last focusable child in the container.
			// tags:
			//		abstract extension
		},

		focusChild: function(/*dijit/_WidgetBase*/ widget, /*Boolean*/ last){
			// summary:
			//		Focus specified child widget.
			// widget:
			//		Reference to container's child widget
			// last:
			//		If true and if widget has multiple focusable nodes, focus the
			//		last one instead of the first one
			// tags:
			//		protected

			if(!widget){
				return;
			}

			if(this.focusedChild && widget !== this.focusedChild){
				this._onChildBlur(this.focusedChild);	// used by _MenuBase
			}
			widget.set("tabIndex", this.tabIndex);	// for IE focus outline to appear, must set tabIndex before focus
			widget.focus(last ? "end" : "start");

			// Don't set focusedChild here, because the focus event should trigger a call to _onChildFocus(), which will
			// set it.   More importantly, _onChildFocus(), which may be executed asynchronously (after this function
			//  returns) needs to know the old focusedChild to set its tabIndex to -1.
		},

		_onContainerFocus: function(evt){
			// summary:
			//		Handler for when the container itself gets focus.
			// description:
			//		Initially the container itself has a tabIndex, but when it gets
			//		focus, switch focus to first child...
			// tags:
			//		private

			// Note that we can't use _onFocus() because switching focus from the
			// _onFocus() handler confuses the focus.js code
			// (because it causes _onFocusNode() to be called recursively).
			// Also, _onFocus() would fire when focus went directly to a child widget due to mouse click.

			// Ignore spurious focus events:
			//	1. focus on a child widget bubbles on FF
			//	2. on IE, clicking the scrollbar of a select dropdown moves focus from the focused child item to me
			if(evt.target !== this.domNode || this.focusedChild){
				return;
			}

			this.focusFirstChild();
		},

		_onFocus: function(){
			// When the container gets focus by being tabbed into, or a descendant gets focus by being clicked,
			// set the container's tabIndex to -1 (don't remove as that breaks Safari 4) so that tab or shift-tab
			// will go to the fields after/before the container, rather than the container itself
			domAttr.set(this.domNode, "tabIndex", "-1");

			this.inherited(arguments);
		},

		_onBlur: function(evt){
			// When focus is moved away the container, and its descendant (popup) widgets,
			// then restore the container's tabIndex so that user can tab to it again.
			// Note that using _onBlur() so that this doesn't happen when focus is shifted
			// to one of my child widgets (typically a popup)

			domAttr.set(this.domNode, "tabIndex", this.tabIndex);
			if(this.focusedChild){
				this.focusedChild.set("tabIndex", "-1");
				this._set("focusedChild", null);
			}
			this.inherited(arguments);
		},

		_onChildFocus: function(/*dijit/_WidgetBase*/ child){
			// summary:
			//		Called when a child widget gets focus, either by user clicking
			//		it, or programatically by arrow key handling code.
			// description:
			//		It marks that the current node is the selected one, and the previously
			//		selected node no longer is.

			if(child && child != this.focusedChild){
				if(this.focusedChild && !this.focusedChild._destroyed){
					// mark that the previously focusable node is no longer focusable
					this.focusedChild.set("tabIndex", "-1");
				}

				// mark that the new node is the currently selected one
				child.set("tabIndex", this.tabIndex);
				this.lastFocused = child;		// back-compat for Tree, remove for 2.0
				this._set("focusedChild", child);
			}
		},

		_searchString: "",
		// multiCharSearchDuration: Number
		//		If multiple characters are typed where each keystroke happens within
		//		multiCharSearchDuration of the previous keystroke,
		//		search for nodes matching all the keystrokes.
		//
		//		For example, typing "ab" will search for entries starting with
		//		"ab" unless the delay between "a" and "b" is greater than multiCharSearchDuration.
		multiCharSearchDuration: 1000,

		onKeyboardSearch: function(/*dijit/_WidgetBase*/ item, /*Event*/ evt, /*String*/ searchString, /*Number*/ numMatches){
			// summary:
			//		When a key is pressed that matches a child item,
			//		this method is called so that a widget can take appropriate action is necessary.
			// tags:
			//		protected
			if(item){
				this.focusChild(item);
			}
		},

		_keyboardSearchCompare: function(/*dijit/_WidgetBase*/ item, /*String*/ searchString){
			// summary:
			//		Compares the searchString to the widget's text label, returning:
			//
			//			* -1: a high priority match  and stop searching
			//		 	* 0: not a match
			//		 	* 1: a match but keep looking for a higher priority match
			// tags:
			//		private

			var element = item.domNode,
				text = item.label || (element.focusNode ? element.focusNode.label : '') || element.innerText || element.textContent || "",
				currentString = text.replace(/^\s+/, '').substr(0, searchString.length).toLowerCase();

			return (!!searchString.length && currentString == searchString) ? -1 : 0; // stop searching after first match by default
		},

		_onContainerKeydown: function(evt){
			// summary:
			//		When a key is pressed, if it's an arrow key etc. then it's handled here.
			// tags:
			//		private

			var func = this._keyNavCodes[evt.keyCode];
			if(func){
				func(evt, this.focusedChild);
				evt.stopPropagation();
				evt.preventDefault();
				this._searchString = ''; // so a DOWN_ARROW b doesn't search for ab
			}
		},

		_onContainerKeypress: function(evt){
			// summary:
			//		When a printable key is pressed, it's handled here, searching by letter.
			// tags:
			//		private

			if(evt.charCode <= 32){
				// Avoid duplicate events on firefox (this is an arrow key that will be handled by keydown handler)
				return;
			}

			if(evt.ctrlKey || evt.altKey){
				return;
			}

			var
				matchedItem = null,
				searchString,
				numMatches = 0,
				search = lang.hitch(this, function(){
					if(this._searchTimer){
						this._searchTimer.remove();
					}
					this._searchString += keyChar;
					var allSameLetter = /^(.)\1*$/.test(this._searchString);
					var searchLen = allSameLetter ? 1 : this._searchString.length;
					searchString = this._searchString.substr(0, searchLen);
					// commented out code block to search again if the multichar search fails after a smaller timeout
					//this._searchTimer = this.defer(function(){ // this is the "failure" timeout
					//	this._typingSlowly = true; // if the search fails, then treat as a full timeout
					//	this._searchTimer = this.defer(function(){ // this is the "success" timeout
					//		this._searchTimer = null;
					//		this._searchString = '';
					//	}, this.multiCharSearchDuration >> 1);
					//}, this.multiCharSearchDuration >> 1);
					this._searchTimer = this.defer(function(){ // this is the "success" timeout
						this._searchTimer = null;
						this._searchString = '';
					}, this.multiCharSearchDuration);
					var currentItem = this.focusedChild || null;
					if(searchLen == 1 || !currentItem){
						currentItem = this._getNextFocusableChild(currentItem, 1); // skip current
						if(!currentItem){
							return;
						} // no items
					}
					var stop = currentItem;
					do{
						var rc = this._keyboardSearchCompare(currentItem, searchString);
						if(!!rc && numMatches++ == 0){
							matchedItem = currentItem;
						}
						if(rc == -1){ // priority match
							numMatches = -1;
							break;
						}
						currentItem = this._getNextFocusableChild(currentItem, 1);
					}while(currentItem != stop);
					// commented out code block to search again if the multichar search fails after a smaller timeout
					//if(!numMatches && (this._typingSlowly || searchLen == 1)){
					//	this._searchString = '';
					//	if(searchLen > 1){
					//		// if no matches and they're typing slowly, then go back to first letter searching
					//		search();
					//	}
					//}
				}),
				keyChar = String.fromCharCode(evt.charCode).toLowerCase();

			search();
			// commented out code block to search again if the multichar search fails after a smaller timeout
			//this._typingSlowly = false;
			this.onKeyboardSearch(matchedItem, evt, searchString, numMatches);
		},

		_onChildBlur: function(/*dijit/_WidgetBase*/ /*===== widget =====*/){
			// summary:
			//		Called when focus leaves a child widget to go
			//		to a sibling widget.
			//		Used by MenuBase.js (TODO: move code there)
			// tags:
			//		protected
		},

		_getNextFocusableChild: function(child){
			// summary:
			//		Returns the next focusable child, compared to "child".
			// child: Widget
			//		The current widget
			// tags:
			//		abstract extension

			return null;	// dijit/_WidgetBase
		}
	});
});

},
'dijit/MenuItem':function(){
require({cache:{
'url:dijit/templates/MenuItem.html':"<tr class=\"dijitReset dijitMenuItem\" data-dojo-attach-point=\"focusNode\" role=\"menuitem\" tabIndex=\"-1\">\n\t<td class=\"dijitReset dijitMenuItemIconCell\" role=\"presentation\">\n\t\t<img src=\"${_blankGif}\" alt=\"\" class=\"dijitIcon dijitMenuItemIcon\" data-dojo-attach-point=\"iconNode\"/>\n\t</td>\n\t<td class=\"dijitReset dijitMenuItemLabel\" colspan=\"2\" data-dojo-attach-point=\"containerNode,textDirNode\"></td>\n\t<td class=\"dijitReset dijitMenuItemAccelKey\" style=\"display: none\" data-dojo-attach-point=\"accelKeyNode\"></td>\n\t<td class=\"dijitReset dijitMenuArrowCell\" role=\"presentation\">\n\t\t<div data-dojo-attach-point=\"arrowWrapper\" style=\"visibility: hidden\">\n\t\t\t<img src=\"${_blankGif}\" alt=\"\" class=\"dijitMenuExpand\"/>\n\t\t\t<span class=\"dijitMenuExpandA11y\">+</span>\n\t\t</div>\n\t</td>\n</tr>\n"}});
define("dijit/MenuItem", [
	"dojo/_base/declare", // declare
	"dojo/dom", // dom.setSelectable
	"dojo/dom-attr", // domAttr.set
	"dojo/dom-class", // domClass.toggle
	"dojo/_base/kernel", // kernel.deprecated
	"dojo/sniff", // has("ie")
	"dojo/_base/lang", // lang.hitch
	"./_Widget",
	"./_TemplatedMixin",
	"./_Contained",
	"./_CssStateMixin",
	"dojo/text!./templates/MenuItem.html"
], function(declare, dom, domAttr, domClass, kernel, has, lang,
			_Widget, _TemplatedMixin, _Contained, _CssStateMixin, template){

	// module:
	//		dijit/MenuItem

	var MenuItem = declare("dijit.MenuItem" + (has("dojo-bidi") ? "_NoBidi" : ""),
		[_Widget, _TemplatedMixin, _Contained, _CssStateMixin],
		{
		// summary:
		//		A line item in a Menu Widget

		// Make 3 columns
		// icon, label, and expand arrow (BiDi-dependent) indicating sub-menu
		templateString: template,

		baseClass: "dijitMenuItem",

		// label: String
		//		Menu text
		label: "",
		_setLabelAttr: function(val){
			this._set("label", val);
			var shortcutKey = "";
			var text;
			var ndx = val.search(/{\S}/);
			if(ndx >= 0){
				shortcutKey = val.charAt(ndx+1);
				var prefix = val.substr(0, ndx);
				var suffix = val.substr(ndx+3);
				text = prefix + shortcutKey + suffix;
				val = prefix + '<span class="dijitMenuItemShortcutKey">' + shortcutKey + '</span>' + suffix;
			}else{
				text = val;
			}
			this.domNode.setAttribute("aria-label", text + " " + this.accelKey);
			this.containerNode.innerHTML = val;
			this._set('shortcutKey', shortcutKey);
		},

/*=====
		// shortcutKey: [readonly] String
		//		Single character (underlined when the parent Menu is focused) used to navigate directly to this widget,
		//		also known as [a mnemonic](http://en.wikipedia.org/wiki/Mnemonics_(keyboard%29).
		//		This is denoted in the label by surrounding the single character with {}.
		//		For example, if label="{F}ile", then shortcutKey="F".
		shortcutKey: "",
=====*/

		// iconClass: String
		//		Class to apply to DOMNode to make it display an icon.
		iconClass: "dijitNoIcon",
		_setIconClassAttr: { node: "iconNode", type: "class" },

		// accelKey: String
		//		Text for the accelerator (shortcut) key combination, a control, alt, etc. modified keystroke meant to
		//		execute the menu item regardless of where the focus is on the page.
		//
		//		Note that although Menu can display accelerator keys, there is no infrastructure to actually catch and
		//		execute those accelerators.
		accelKey: "",

		// disabled: Boolean
		//		If true, the menu item is disabled.
		//		If false, the menu item is enabled.
		disabled: false,

		_fillContent: function(/*DomNode*/ source){
			// If button label is specified as srcNodeRef.innerHTML rather than
			// this.params.label, handle it here.
			if(source && !("label" in this.params)){
				this._set('label', source.innerHTML);
			}
		},

		buildRendering: function(){
			this.inherited(arguments);
			var label = this.id+"_text";
			domAttr.set(this.containerNode, "id", label); // only needed for backward compat
			if(this.accelKeyNode){
				domAttr.set(this.accelKeyNode, "id", this.id + "_accel"); // only needed for backward compat
			}
			dom.setSelectable(this.domNode, false);
		},

		onClick: function(/*Event*/){
			// summary:
			//		User defined function to handle clicks
			// tags:
			//		callback
		},

		focus: function(){
			// summary:
			//		Focus on this MenuItem
			try{
				if(has("ie") == 8){
					// needed for IE8 which won't scroll TR tags into view on focus yet calling scrollIntoView creates flicker (#10275)
					this.containerNode.focus();
				}
				this.focusNode.focus();
			}catch(e){
				// this throws on IE (at least) in some scenarios
			}
		},

		_onFocus: function(){
			// summary:
			//		This is called by the focus manager when focus
			//		goes to this MenuItem or a child menu.
			// tags:
			//		protected
			this._setSelected(true);
			this.getParent()._onItemFocus(this);

			this.inherited(arguments);
		},

		_setSelected: function(selected){
			// summary:
			//		Indicate that this node is the currently selected one
			// tags:
			//		private

			/***
			 * TODO: remove this method and calls to it, when _onBlur() is working for MenuItem.
			 * Currently _onBlur() gets called when focus is moved from the MenuItem to a child menu.
			 * That's not supposed to happen, but the problem is:
			 * In order to allow dijit.popup's getTopPopup() to work,a sub menu's popupParent
			 * points to the parent Menu, bypassing the parent MenuItem... thus the
			 * MenuItem is not in the chain of active widgets and gets a premature call to
			 * _onBlur()
			 */

			domClass.toggle(this.domNode, "dijitMenuItemSelected", selected);
		},

		setLabel: function(/*String*/ content){
			// summary:
			//		Deprecated.   Use set('label', ...) instead.
			// tags:
			//		deprecated
			kernel.deprecated("dijit.MenuItem.setLabel() is deprecated.  Use set('label', ...) instead.", "", "2.0");
			this.set("label", content);
		},

		setDisabled: function(/*Boolean*/ disabled){
			// summary:
			//		Deprecated.   Use set('disabled', bool) instead.
			// tags:
			//		deprecated
			kernel.deprecated("dijit.Menu.setDisabled() is deprecated.  Use set('disabled', bool) instead.", "", "2.0");
			this.set('disabled', disabled);
		},

		_setDisabledAttr: function(/*Boolean*/ value){
			// summary:
			//		Hook for attr('disabled', ...) to work.
			//		Enable or disable this menu item.

			this.focusNode.setAttribute('aria-disabled', value ? 'true' : 'false');
			this._set("disabled", value);
		},

		_setAccelKeyAttr: function(/*String*/ value){
			// summary:
			//		Hook for attr('accelKey', ...) to work.
			//		Set accelKey on this menu item.

			if(this.accelKeyNode){
				this.accelKeyNode.style.display=value?"":"none";
				this.accelKeyNode.innerHTML=value;
				//have to use colSpan to make it work in IE
				domAttr.set(this.containerNode,'colSpan',value?"1":"2");
			}
			this._set("accelKey", value);
		}
	});

	if(has("dojo-bidi")){
		MenuItem = declare("dijit.MenuItem", MenuItem, {
			_setLabelAttr: function(val){
				this.inherited(arguments);
				if(this.textDir === "auto"){
					this.applyTextDir(this.textDirNode);
				}
			}
		});
	}

	return MenuItem;
});

},
'dijit/_Contained':function(){
define("dijit/_Contained", [
	"dojo/_base/declare", // declare
	"./registry"	// registry.getEnclosingWidget(), registry.byNode()
], function(declare, registry){

	// module:
	//		dijit/_Contained

	return declare("dijit._Contained", null, {
		// summary:
		//		Mixin for widgets that are children of a container widget
		//
		// example:
		//	|	// make a basic custom widget that knows about it's parents
		//	|	declare("my.customClass",[dijit._Widget,dijit._Contained],{});

		_getSibling: function(/*String*/ which){
			// summary:
			//		Returns next or previous sibling
			// which:
			//		Either "next" or "previous"
			// tags:
			//		private
			var node = this.domNode;
			do{
				node = node[which+"Sibling"];
			}while(node && node.nodeType != 1);
			return node && registry.byNode(node);	// dijit/_WidgetBase
		},

		getPreviousSibling: function(){
			// summary:
			//		Returns null if this is the first child of the parent,
			//		otherwise returns the next element sibling to the "left".

			return this._getSibling("previous"); // dijit/_WidgetBase
		},

		getNextSibling: function(){
			// summary:
			//		Returns null if this is the last child of the parent,
			//		otherwise returns the next element sibling to the "right".

			return this._getSibling("next"); // dijit/_WidgetBase
		},

		getIndexInParent: function(){
			// summary:
			//		Returns the index of this widget within its container parent.
			//		It returns -1 if the parent does not exist, or if the parent
			//		is not a dijit._Container

			var p = this.getParent();
			if(!p || !p.getIndexOfChild){
				return -1; // int
			}
			return p.getIndexOfChild(this); // int
		}
	});
});

},
'url:dijit/templates/MenuItem.html':"<tr class=\"dijitReset dijitMenuItem\" data-dojo-attach-point=\"focusNode\" role=\"menuitem\" tabIndex=\"-1\">\n\t<td class=\"dijitReset dijitMenuItemIconCell\" role=\"presentation\">\n\t\t<img src=\"${_blankGif}\" alt=\"\" class=\"dijitIcon dijitMenuItemIcon\" data-dojo-attach-point=\"iconNode\"/>\n\t</td>\n\t<td class=\"dijitReset dijitMenuItemLabel\" colspan=\"2\" data-dojo-attach-point=\"containerNode,textDirNode\"></td>\n\t<td class=\"dijitReset dijitMenuItemAccelKey\" style=\"display: none\" data-dojo-attach-point=\"accelKeyNode\"></td>\n\t<td class=\"dijitReset dijitMenuArrowCell\" role=\"presentation\">\n\t\t<div data-dojo-attach-point=\"arrowWrapper\" style=\"visibility: hidden\">\n\t\t\t<img src=\"${_blankGif}\" alt=\"\" class=\"dijitMenuExpand\"/>\n\t\t\t<span class=\"dijitMenuExpandA11y\">+</span>\n\t\t</div>\n\t</td>\n</tr>\n",
'mathEditor/mathContentAssist':function(){
define([ "dojo/_base/array" ], function(array) {

	return {
		keywords : [ {
			input: "/", // 用户输入的值
			map: "&#xF7;",  // 在编辑器中实际输入的值
			nodeName: "mo", // 使用那个标签封装
			freq: 0, // 用户选择的频率
			label: "除号", // 在提示菜单中显示的值
			iconClass: "drip_equation_icon drip_division" // 在提示菜单中显示的图标
		},{
			input: "/",
			map: "/",
			nodeName: "text",
			freq: 0,
			label: "/",
			iconClass: ""
		},{
			// <mfrac> numerator(分子) denominator(分母) </mfrac>
			input: "/",
			map: "",
			nodeName: "mfrac",
			freq: 0,
			label: "分数",
			iconClass: "drip_equation_icon drip_frac"
		},{
			input: "*",
			map: "&#xD7;",
			nodeName: "mo",
			freq: 0,
			label: "乘号",
			iconClass: "drip_equation_icon drip_multiplication"
		},{
			input: "*",
			map: "*",
			nodeName: "text",
			freq: 0,
			label: "*",
			iconClass: ""
		} ],

		getProposals : function(prefix) {
			// summary:
			//		根据前缀获取推荐值列表，推荐值按照推荐度倒序排列。
			//		“推荐度”，是整数，值越大推荐度越高。
			
			return array.filter(this.keywords, function(data, index, array) {
				return data.input.indexOf(prefix) == 0;
			});
		}
	};
	
});

}}});
define("mathEditor/Editor", ["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/event",
        "dijit/_WidgetBase",
        "dojo/on",
        "dojo/sniff",
        "dojo/keys",
        "dojo/aspect",
        "dojo/dom-construct",
        "dojo/dom-style",
        "dojo/dom-class",
        "mathEditor/Model",
        "mathEditor/View",
        "mathEditor/ContentAssist"],function(
        		 declare,
        		 lang,
        		 event,
        		 _WidgetBase,
        		 on,
        		 sniff,
        		 keys,
        		 aspect,
        		 domConstruct,
        		 domStyle,
        		 domClass,
        		 Model,
        		 View,
        		 ContentAssist){

	return declare("mathEditor.Editor",[_WidgetBase],{
		model : null,
		view : null,
		textarea : null,
		
		// value: String
		//		编辑器的值
		value : "",
		
		_getValueAttr: function(){
			return this.model.getXML();
	    },
		
	    _setValueAttr: function(value){
	    	this.model.clear();
	    	if(value && value != ""){
	    		this.model.setData({data:value});
	    	}
	    },
	    
		postCreate : function(){
			this.inherited(arguments);
			
			domStyle.set(this.domNode, {position: "relative"});
			var textarea = this.textarea = domConstruct.create("textarea",{style:{position:"absolute"/*,top:"-10000px",left:'-10000px'*/}}, this.domNode);
			// 测试时的样式
			/*
			domStyle.set(textarea,{opacity:1,
				background:"rgba(0, 250, 0, 0.3)",
				outline:"rgba(0, 250, 0, 0.8) solid 1px",
				"outline-offset":"3px",
				width:"5em",
				"z-index":500});
			*/
			
			// 正式发布时的样式
			domClass.add(textarea, "drip_text_input");
			
			textarea.wrap = "off";
			textarea.autocorrect = "off";
			textarea.autocapitalize = "off";
			textarea.spellcheck = false;
			
			var model = this.model = new Model();
			this.view = new View({
				model:this.model, 
				parentNode : this.domNode,
				textarea : this.textarea
			});
			
			var contentAssist = this.contentAssist = new ContentAssist({view:this.view});
			aspect.after(contentAssist,"apply", function(input, nodeName, cacheCount, event){
				// FIXME:这里直接获取map值的逻辑不正确，如果处于cache状态，则不应该往model中
				// 输入值。
				// FIXME:1为硬编码值，需要替换。
				model.setData({data:input,nodeName:nodeName, removeCount:cacheCount});
				setTimeout(function() {
					textarea.value = "";
			    });
			},true);
			
			
			if(sniff("chrome")){
				// chrome
				0 && console.log("chrome");
				on(textarea, "textInput", lang.hitch(this,function(e){
					var inputData = e.data;
					this._onTextInput(inputData);
				}));
			}else{
				0 && console.log("other browser");
				var inCompostion = false;
				// firefox
				on(textarea, "input", lang.hitch(this,function(e){
					if(inCompostion)return;
					
					inputData = textarea.value;
					if(inputData == "")return;
					
					this._onTextInput(inputData);
				}));
				on(textarea, "compositionstart", lang.hitch(this,function(e){
					inCompostion = true;
				}));
				on(textarea, "compositionend", lang.hitch(this,function(e){
					inCompostion = false;
				}));
			}
			
			on(textarea, "blur", lang.hitch(this,function(e){
				this.view.blur();
			}));
			
			// FIXME:一种重构思路是将key与方法绑定，然后根据key自动调用方法，即把if改为json对象
			on(textarea, "keydown", lang.hitch(this,function(e){
				0 && console.log(e, e.keyCode);
				if(e.keyCode === keys.LEFT_ARROW){
					this.model.moveLeft();// 注意在move系列方法中不调用model.onChange方法
					this.view.showCursor();
				}else if(e.keyCode === keys.RIGHT_ARROW){
					this.model.moveRight();
				}else if(e.keyCode === keys.UP_ARROW){
					if(this.contentAssist.opened){
						this.contentAssist.selectPrev();
					}else{
						this.model.moveUp();
					}
				}else if(e.keyCode === keys.DOWN_ARROW){
					if(this.contentAssist.opened){
						this.contentAssist.selectNext();
					}else{
						this.model.moveDown();
					}
				}else if(e.keyCode === keys.BACKSPACE){
					//this.model.removeLeft();
					this.model.doDelete(); // TODO:使用removeLeft代替doDelete
				}else if(e.altKey && e.keyCode === 191){
					// ALT+/ 弹出提示信息
					this.contentAssist.open();
					event.stop(e);
				}else if(e.keyCode === keys.ENTER){
					if(this.contentAssist.opened){
						this.contentAssist.enter(e);
					}else{
						this.model.setData({data:"\n"});
					}
					
					// 回车换行。
					event.stop(e);
				}
				
			}));
		},
		
		_onTextInput: function(inputData){
			// TODO：如果用户新输入的值，不在推荐之中，则先执行一个应用操作。
			
			
			var adviceData = this.contentAssist.show(inputData);
			if(adviceData != null){
				// 优先显示提示框中级别最高的数据。而不是直接输入的内容。
				inputData = adviceData;
				//removeCount = 
			}
			// 对输入的内容进行拦截，判断是否有推荐的可选项。
			
			// 当model的内容发生变化时，View自动更新,所以这里不写View相关的代码
			var model = this.model;
			// removeCount
			model.setData({data:inputData});
			
			var textarea = this.textarea;
			setTimeout(function() {
				textarea.value = "";
		    });
		}
	});
	
});