define([ "doh","mathEditor/Model" ], function(doh,Model) {

	// summary:
	//		在括号上左移光标（目前只支持一个mrow子节点）
	//		左移进括号
	//		1. 括号后没有任何节点，括号内最后一个节点是token节点
	//		2. 括号后没有任何节点，括号内最后一个节点是layout节点
	//		3. 括号后有一个token节点，从token后左移进括号内的最后一个节点，最后一个节点是token节点
	//		4. 括号后有一个token节点，从token后左移进括号内的最后一个节点，最后一个节点是layout节点
	//		5. 括号后有一个layout节点，从layout后左移进括号内的最后一个节点，最后一个节点是token节点
	//		6. 括号后有一个layout节点，从layout后左移进括号内的最后一个节点，最后一个节点是layout节点
	//		左移出括号
	//		1. 括号内第一个节点是token节点
	//		2. 括号内第一个节点是layout节点
	doh.register("Model.moveLeft.fence",[
	    {
	    	name: "左移进括号，括号后没有任何节点，括号内最后一个节点是token节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mfenced>" +
		  						"<mrow><mn>123</mn></mrow>" +
	  						"</mfenced>" +
  						"</math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfenced", offset: 1});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/mfenced[1]/mrow[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is(3, model.getOffset());
				t.is("123", node.textContent);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "左移进括号，括号后没有任何节点，括号内最后一个节点是layout节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mfenced>" +
		  						"<mrow><mfenced><mrow><mn>12</mn></mrow></mfenced></mrow>" +
	  						"</mfenced>" +
  						"</math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfenced", offset: 1});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/mfenced[1]/mrow[1]/mfenced[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("mfenced", node.nodeName);
				t.is(1, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "左移进括号，括号后有一个token节点，从token后左移进括号内的最后一个节点，最后一个节点是token节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mfenced>" +
		  						"<mrow><mn>12</mn></mrow>" +
	  						"</mfenced>" +
	  						"<mn>123</mn>" +
  						"</math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.lastChild;
  				model.anchor.offset = 0;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mn", offset: 2});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/mfenced[1]/mrow[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is(2, model.getOffset());
				t.is("12", node.textContent);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "左移进括号，括号后有一个token节点，从token后左移进括号内的最后一个节点，最后一个节点是layout节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mfenced>" +
		  						"<mrow><mfenced><mrow><mn>12</mn></mrow></mfenced></mrow>" +
	  						"</mfenced>" +
	  						"<mn>123</mn>" +
  						"</math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.lastChild;
  				model.anchor.offset = 0;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mn", offset: 2});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/mfenced[1]/mrow[1]/mfenced[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("mfenced", node.nodeName);
				t.is(1, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "左移进括号，括号后有一个layout节点，从layout后左移进括号内的最后一个节点，最后一个节点是token节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mfenced>" +
		  						"<mrow><mn>123</mn></mrow>" +
	  						"</mfenced>" +
	  						"<mfenced><mrow><mn>12</mn></mrow></mfenced>" +
  						"</math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.lastChild;
  				model.anchor.offset = 0;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfenced", offset: 2});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/mfenced[1]/mrow[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is(3, model.getOffset());
				t.is("123", node.textContent);
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "左移进括号，括号后有一个layout节点，从layout后左移进括号内的最后一个节点，最后一个节点是layout节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mfenced>" +
		  						"<mrow><mfenced><mrow><mn>12</mn></mrow></mfenced></mrow>" +
	  						"</mfenced>" +
	  						"<mfenced><mrow><mn>12</mn></mrow></mfenced>" +
  						"</math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.lastChild;
  				model.anchor.offset = 0;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfenced", offset: 2});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/mfenced[1]/mrow[1]/mfenced[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("mfenced", node.nodeName);
				t.is(1, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "左移出括号，括号内第一个节点是token节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mfenced>" +
		  						"<mrow><mn>12</mn></mrow>" +
	  						"</mfenced>" +
  						"</math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfenced", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/mfenced[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("mfenced", node.nodeName);
				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "左移出括号，括号内第一个节点是layout节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mfenced>" +
		  						"<mrow><mfenced><mrow><mn>12</mn></mrow></mfenced></mrow>" +
	  						"</mfenced>" +
  						"</math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfenced", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 1});
  				model.path.push({nodeName: "mfenced", offset: 1});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/mfenced[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("mfenced", node.nodeName);
				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "左移出括号，括号内是一个占位符",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				
  				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mfenced>" +
		  						"<mrow><mn class=\"drip_placeholder_box\"></mn></mrow>" +
	  						"</mfenced>" +
  						"</math>" +
  				"</line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild.firstChild.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];
  				model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.path.push({nodeName: "mfenced", offset: 1});
  				model.path.push({nodeName: "mrow", offset: 1});
  				model.path.push({nodeName: "mn", offset: 1});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/mfenced[1]", model.getPath());
				var node = model.getFocusNode();
				t.is("mfenced", node.nodeName);
				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    }
	                             
	]);
});