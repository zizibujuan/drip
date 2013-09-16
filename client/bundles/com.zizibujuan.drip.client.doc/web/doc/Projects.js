define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/request/xhr",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/ProjectDetail.html"],function(
        		declare,
        		lang,
        		array,
        		xhr,
        		_WidgetBase,
        		_TemplatedMixin,
        		projectDetailTemplate){
	
	var ProjectItem = declare("doc.ProjectItem", [_WidgetBase, _TemplatedMixin], {
		templateString: projectDetailTemplate,
		
		item: null,
		
		postCreate: function(){
			this.inherited(arguments);
			
			var item = this.item;
			var projectName = this.projectName;
			var projectPath = item.createUserName + "/" + item.name;
			projectName.innerHTML = projectPath;
			projectName.href = "/projects/" + projectPath;
			this.label.innerHTML = item.label;
			this.desc.innerHTML = item.description;
		}
	
	});
	
	return declare("doc.Projects", [_WidgetBase, _TemplatedMixin], {
		templateString: "<ul></ul>",
		
		url: null,
		
		query: {},
			
		postCreate: function(){
			this.inherited(arguments);
			xhr.get(this.url, {handleAs:"json", query: this.query}).then(lang.hitch(this, this._load), function(error){
				console.error("获取项目列表失败", error);
			});
		},
		
		_load: function(items){
			if(items.length == 0){
				this.domNode.innerHTML = "没有人<a href='#'>发起项目</a>";
				return;
			}
			
			array.forEach(items, lang.hitch(this, function(item, index){
				var projectItem = new ProjectItem({item: item});
				this.domNode.appendChild(projectItem.domNode);
			}));
			
		}
		
	});
});