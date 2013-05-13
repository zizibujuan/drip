define([ "doh","mathEditor/Model" ], function(doh,Model) {

	// summary:
	//		model.setData({data:"^"});与model.setData({data:"", nodeName:"msup"});的效果是一样的。
	//		在操作符后输入上标，不将操作符号作为base。如果要输入有上下标的符号，通过符号名称输入。
	//		1.在mi和mn节点后输入^，将mi和mn作为base
	//		2.在mo节点后输入^,则创建一个base为空的上下标
	//		3.在layout节点后输入^,将layout作为base
	//		4.在token/layout节点前输入^，则寻找前一个节点，然后按照1-3进行处理；如果没有前一个节点，则输入base为空的上标。
	//		调整base的内容（约定只取最近的一个节点作为base）是否适合做base，需要做一个判断。
	//		
	doh.register("Model.setData.sup 上标",[
	    {
			name: "mathml模式下，在空的数学编辑器上直接输入上标",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				/*
				 * <msup> base superscript </msup>
				 * msup中的内容都使用mrow封装
				 * 如果直接输入上标，并且适配不到base，则添加一个空的base和superscript，让superscript获取焦点
				 */
				var model = this.model;
				model.toMathMLMode();
				model.setData({data:"", nodeName:"msup"});
				t.is("/root/line[1]/math[1]/msup[1]/mrow[2]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is("drip_placeholder_box", node.getAttribute("class"));
				t.is(0, model.getOffset());
				
				var superscriptNode = node;
				t.is("msup", superscriptNode.parentNode.parentNode.nodeName);
				
				var baseNode = superscriptNode.parentNode.previousSibling.firstChild;
				t.is("mn", baseNode.nodeName);
				t.is("drip_placeholder_box", baseNode.getAttribute("class"));
			},
			tearDown: function(){
				
			}
		},{
			name: "mathml模式下，在空的数学编辑器上输入数字和上标",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				/*
				 * <msup> base superscript </msup>
				 * msup中的内容都使用mrow封装
				 */
				var model = this.model;
				model.toMathMLMode();
				model.setData({data:"1"});
				model.setData({data:"", nodeName:"msup"});
				t.is("/root/line[1]/math[1]/msup[1]/mrow[2]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is("drip_placeholder_box", node.getAttribute("class"));
				t.is(0, model.getOffset());
				
				var superscriptNode = node;
				t.is("msup", superscriptNode.parentNode.parentNode.nodeName);
				
				var baseNode = superscriptNode.parentNode.previousSibling.firstChild;
				t.is("mn", baseNode.nodeName);
				t.is("1", baseNode.textContent);
			},
			tearDown: function(){
				
			}
		},{
			name: "mathml模式下，在空的数学编辑器上输入变量和上标",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				/*
				 * <msup> base superscript </msup>
				 * msup中的内容都使用mrow封装
				 */
				var model = this.model;
				model.toMathMLMode();
				model.setData({data:"x"});
				model.setData({data:"", nodeName:"msup"});
				t.is("/root/line[1]/math[1]/msup[1]/mrow[2]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is("drip_placeholder_box", node.getAttribute("class"));
				t.is(0, model.getOffset());
				
				var superscriptNode = node;
				t.is("msup", superscriptNode.parentNode.parentNode.nodeName);
				
				var baseNode = superscriptNode.parentNode.previousSibling.firstChild;
				t.is("mi", baseNode.nodeName);
				t.is("x", baseNode.textContent);
			},
			tearDown: function(){
				
			}
		},{
			name: "mathml模式下，在空的数学编辑器上输入不带上标的操作符和上标",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				/*
				 * <msup> base superscript </msup>
				 * msup中的内容都使用mrow封装
				 */
				var model = this.model;
				model.toMathMLMode();
				model.setData({data:"+"});
				model.setData({data:"", nodeName:"msup"});
				t.is("/root/line[1]/math[1]/msup[2]/mrow[2]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is("drip_placeholder_box", node.getAttribute("class"));
				t.is(0, model.getOffset());
				
				var superscriptNode = node;
				t.is("msup", superscriptNode.parentNode.parentNode.nodeName);
				
				var baseNode = superscriptNode.parentNode.previousSibling.firstChild;
				t.is("mn", baseNode.nodeName);
				t.is("drip_placeholder_box", baseNode.getAttribute("class"));
				
				var line = model.getLineAt(0);
				t.is("+", line.firstChild.firstChild.textContent);
				t.is(2, line.firstChild.childElementCount);
			},
			tearDown: function(){
				
			}
		},{
			name: "mathml模式下，输入数字，输入^",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				/*
				 * <msup> base superscript </msup>
				 * msup中的内容都使用mrow封装
				 */
				var model = this.model;
				model.toMathMLMode();
				model.setData({data:"1"});
				model.setData({data:"^"});
				t.is("/root/line[1]/math[1]/msup[1]/mrow[2]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is("drip_placeholder_box", node.getAttribute("class"));
				t.is(0, model.getOffset());
				
				var superscriptNode = node;
				t.is("msup", superscriptNode.parentNode.parentNode.nodeName);
				
				var baseNode = superscriptNode.parentNode.previousSibling.firstChild;
				t.is("mn", baseNode.nodeName);
				t.is("1", baseNode.textContent);
			},
			tearDown: function(){
				
			}
		},{
			name: "光标停留在一个节点之前，而这个节点前面没有兄弟节点",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				/*
				 * <msup> base superscript </msup>
				 * msup中的内容都使用mrow封装
				 */
				var model = this.model;
				model.loadData("<root><line><math><mn>12</mn></math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild;
				model.anchor.offset = 0;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset: 1});
				model.path.push({nodeName:"math", offset: 1});
				model.path.push({nodeName:"mn", offset: 1});
				model.setData({data:"", nodeName:"msup"});
				t.is("/root/line[1]/math[1]/msup[1]/mrow[2]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is("drip_placeholder_box", node.getAttribute("class"));
				t.is(0, model.getOffset());
				
				var superscriptNode = node;
				t.is("msup", superscriptNode.parentNode.parentNode.nodeName);
				
				var baseNode = superscriptNode.parentNode.previousSibling.firstChild;
				t.is("mn", baseNode.nodeName);
				t.is("drip_placeholder_box", baseNode.getAttribute("class"));
				
				t.is(2, line.firstChild.childElementCount);
			},
			tearDown: function(){
				
			}
		},{
			name: "光标停留在一个节点之前，而这个节点前面有一个mn节点",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				/*
				 * <msup> base superscript </msup>
				 * msup中的内容都使用mrow封装
				 */
				var model = this.model;
				model.loadData("<root><line><math><mn>12</mn><mn>34</mn></math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.lastChild;
				model.anchor.offset = 0;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset: 1});
				model.path.push({nodeName:"math", offset: 1});
				model.path.push({nodeName:"mn", offset: 2});
				model.setData({data:"", nodeName:"msup"});
				t.is("/root/line[1]/math[1]/msup[1]/mrow[2]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is("drip_placeholder_box", node.getAttribute("class"));
				t.is(0, model.getOffset());
				
				var superscriptNode = node;
				t.is("msup", superscriptNode.parentNode.parentNode.nodeName);
				
				var baseNode = superscriptNode.parentNode.previousSibling.firstChild;
				t.is("mn", baseNode.nodeName);
				t.is("12", baseNode.textContent);
				
				t.is(2, line.firstChild.childElementCount);
			},
			tearDown: function(){
				
			}
		},{
			name: "base中有一个mn节点，在base起始部分输入一个mo节点",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				/*
				 * <msup> base superscript </msup>
				 * msup中的内容都使用mrow封装
				 */
				var model = this.model;
				model.loadData("<root><line><math>" +
							"<msup>" +
								"<mrow><mn>12</mn></mrow>" +
								"<mrow><mn>2</mn></mrow>" +
							"</msup>" +
						"</math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
				model.anchor.offset = 0;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset: 1});
				model.path.push({nodeName:"math", offset: 1});
				model.path.push({nodeName:"msup", offset: 1});
				model.path.push({nodeName:"mrow", offset: 1});
				model.path.push({nodeName:"mn", offset: 1});
				model.setData({data:"+"});
				// 输入完成后，就将光标从msup的base中移出来
				t.is("/root/line[1]/math[1]/msup[2]", model.getPath());
				
				// 输入完成后，光标还是停留在msup前
				var node = model.getFocusNode();
				t.is("msup", node.nodeName);
				t.is(0, model.getOffset());
				t.is(2, line.firstChild.childElementCount);
				t.is(node.previousSibling, line.firstChild.firstChild);
			},
			tearDown: function(){
				
			}
		},{
			name: "base中有一个mn节点，在base起始部分输入一个mn节点，则将数字合并在一起",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.loadData("<root><line><math>" +
							"<msup>" +
								"<mrow><mn>23</mn></mrow>" +
								"<mrow><mn>2</mn></mrow>" +
							"</msup>" +
						"</math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
				model.anchor.offset = 0;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset: 1});
				model.path.push({nodeName:"math", offset: 1});
				model.path.push({nodeName:"msup", offset: 1});
				model.path.push({nodeName:"mrow", offset: 1});
				model.path.push({nodeName:"mn", offset: 1});
				model.setData({data:"1"});
				// 输入完成后，就将光标从msup的base中移出来
				t.is("/root/line[1]/math[1]/msup[1]/mrow[1]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is(1, model.getOffset());
				t.is(1, line.firstChild.childElementCount);
				t.is("123", node.textContent);
			},
			tearDown: function(){
				
			}
		},{
			name: "base中有一个mn节点，在base起始部分输入一个layout节点",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.loadData("<root><line><math>" +
							"<msup>" +
								"<mrow><mn>23</mn></mrow>" +
								"<mrow><mn>2</mn></mrow>" +
							"</msup>" +
						"</math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
				model.anchor.offset = 0;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset: 1});
				model.path.push({nodeName:"math", offset: 1});
				model.path.push({nodeName:"msup", offset: 1});
				model.path.push({nodeName:"mrow", offset: 1});
				model.path.push({nodeName:"mn", offset: 1});
				model.setData({data:"", nodeName:"msqrt"});
				// 输入完成后，就将光标从msup的base中移出来
				t.is("/root/line[1]/math[1]/msqrt[1]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is(0, model.getOffset());
				t.is(2, line.firstChild.childElementCount);
				t.is("msqrt", line.firstChild.firstChild.nodeName);
			},
			tearDown: function(){
				
			}
		},{
			name: "base中有一个mn节点，在base结尾部分输入一个mn节点，则将数字合并在一起",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				var model = this.model;
				model.loadData("<root><line><math>" +
							"<msup>" +
								"<mrow><mn>12</mn></mrow>" +
								"<mrow><mn>2</mn></mrow>" +
							"</msup>" +
						"</math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
				model.anchor.offset = 2;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset: 1});
				model.path.push({nodeName:"math", offset: 1});
				model.path.push({nodeName:"msup", offset: 1});
				model.path.push({nodeName:"mrow", offset: 1});
				model.path.push({nodeName:"mn", offset: 1});
				model.setData({data:"3"});
				// 输入完成后，就将光标从msup的base中移出来
				t.is("/root/line[1]/math[1]/msup[1]/mrow[1]/mn[1]", model.getPath());
				
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is(3, model.getOffset());
				t.is(1, line.firstChild.childElementCount);
				t.is("123", node.textContent);
			},
			tearDown: function(){
				
			}
		},{
			name: "base中有一个mn节点，在base结尾部分输入一个mi节点",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				/*
				 * <msup> base superscript </msup>
				 * msup中的内容都使用mrow封装
				 */
				var model = this.model;
				model.loadData("<root><line><math>" +
							"<msup>" +
								"<mrow><mn>12</mn></mrow>" +
								"<mrow><mn>2</mn></mrow>" +
							"</msup>" +
						"</math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
				model.anchor.offset = 2;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset: 1});
				model.path.push({nodeName:"math", offset: 1});
				model.path.push({nodeName:"msup", offset: 1});
				model.path.push({nodeName:"mrow", offset: 1});
				model.path.push({nodeName:"mn", offset: 1});
				model.setData({data:"x"});
				// 输入完成后，就将光标从msup的base中移出来
				t.is("/root/line[1]/math[1]/msup[2]/mrow[1]/mi[1]", model.getPath());
				
				// 输入完成后，光标还是停留在msup前
				var node = model.getFocusNode();
				t.is("mi", node.nodeName);
				t.is(1, model.getOffset());
				t.is(2, line.firstChild.childElementCount);
				t.is("mn", line.firstChild.firstChild.nodeName);
			},
			tearDown: function(){
				
			}
		},{
			name: "base中有一个mn节点，在base结尾部分输入一个mo节点,将mo和之前的节点都移到base外面，让空的base获取焦点",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				/*
				 * <msup> base superscript </msup>
				 * msup中的内容都使用mrow封装
				 */
				var model = this.model;
				model.loadData("<root><line><math>" +
							"<msup>" +
								"<mrow><mn>12</mn></mrow>" +
								"<mrow><mn>2</mn></mrow>" +
							"</msup>" +
						"</math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
				model.anchor.offset = 2;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset: 1});
				model.path.push({nodeName:"math", offset: 1});
				model.path.push({nodeName:"msup", offset: 1});
				model.path.push({nodeName:"mrow", offset: 1});
				model.path.push({nodeName:"mn", offset: 1});
				model.setData({data:"+"});
				// 输入完成后，就将光标从msup的base中移出来
				t.is("/root/line[1]/math[1]/msup[3]/mrow[1]/mn[1]", model.getPath());
				
				// 输入完成后，光标还是停留在msup前
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is(0, model.getOffset());
				
				t.is(3, line.firstChild.childElementCount);
				t.is("mn", line.firstChild.firstChild.nodeName);
				t.is("mo", line.firstChild.firstChild.nextSibling.nodeName);
			},
			tearDown: function(){
				
			}
		},{
			name: "base中有一个mn节点，在base结尾部分输入layout节点",
			setUp: function(){
				this.model = new Model({});
			},
			runTest: function(t){
				/*
				 * <msup> base superscript </msup>
				 * msup中的内容都使用mrow封装
				 */
				var model = this.model;
				model.loadData("<root><line><math>" +
							"<msup>" +
								"<mrow><mn>12</mn></mrow>" +
								"<mrow><mn>2</mn></mrow>" +
							"</msup>" +
						"</math></line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
				model.anchor.offset = 2;
				model.path = [];
				model.path.push({nodeName:"root"});
				model.path.push({nodeName:"line", offset: 1});
				model.path.push({nodeName:"math", offset: 1});
				model.path.push({nodeName:"msup", offset: 1});
				model.path.push({nodeName:"mrow", offset: 1});
				model.path.push({nodeName:"mn", offset: 1});
				model.setData({data:"", nodeName:"msqrt"});
				t.is("/root/line[1]/math[1]/msup[2]/mrow[1]/msqrt[1]/mn[1]", model.getPath());
				
				// 输入完成后，光标还是停留在msup前
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is(0, model.getOffset());
				
				t.is(2, line.firstChild.childElementCount);
				t.is("mn", line.firstChild.firstChild.nodeName);
				t.is("msup", line.firstChild.firstChild.nextSibling.nodeName);
			},
			tearDown: function(){
				
			}
		}
	                             
	]);
});