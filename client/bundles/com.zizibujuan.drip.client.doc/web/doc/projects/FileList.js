define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/date/locale",
        "dojo/date/stamp",
        "dojo/dom-construct",
        "dijit/_WidgetBase",
        "drip/_StoreMixin",
        "drip/prettyDate"], function(
		declare,
		lang,
		array,
		locale,
		stamp,
		domConstruct,
		_WidgetBase,
		_StoreMixin,
		prettyDate){
	
	return declare("projects.FileList", [_WidgetBase, _StoreMixin], {
		
		postCreate: function(){
			this.inherited(arguments);
			this.refresh();
		},
		
		refresh: function(){
			this.domNode.innerHTML = this.loadingMessage;
			 if(this.store){
				 this.store.query(this.query).then(lang.hitch(this, this._load));
			 }
		},
		
		_load: function(items){
			 if(items.length == 0){
				 this.domNode.innerHTML = this.noDataMessage;
			 }else{
				 console.log("项目根目录下的文件：",items);
				 this.domNode.innerHTML = "";
				 
				 // 创建一个三列的table
				 var table = domConstruct.create("table",{"class": "files"}, this.domNode);
				 var tbody = domConstruct.create("tbody");
				 table.appendChild(tbody);
				 
				 array.forEach(items, lang.hitch(this,function(item, index){
					 var fileInfo = item.fileInfo;
					 var commitInfo = item.commitInfo;
					 
					 var row = domConstruct.create("tr", {}, tbody);
					 
					 var iconCell = domConstruct.create("td", {"class":"icon"}, row);
					 var iconHtml = "";
					 if(fileInfo.directory){
						 iconHtml = "<i class=\"icon-folder-close-alt\"></i>";
					 }else{
						 iconHtml = "<i class=\"icon-file-text-alt\"></i>";
					 }
					 var iconContent = domConstruct.place(iconHtml, iconCell);
					 
					 var contentCell = domConstruct.create("td", {"class": "content"}, row);
					 var contentSpan = domConstruct.create("span", {"class": ""}, contentCell);
					 var contentLink = domConstruct.create("a", {"href": "#", "innerHTML": fileInfo.name}, contentSpan);
					 
					 var messageCell = domConstruct.create("td", {"class": "message"}, row);
					 var messageSpan = domConstruct.create("span", {"class": ""}, messageCell);
					 var messageLink = domConstruct.create("a", {"href": "#", "innerHTML": commitInfo.summary}, messageSpan);
					 debugger;
					 var date = stamp.toISOString(new Date(commitInfo.commitTime));
					 var ageCell = domConstruct.create("td", {"class": "age"}, row);
					 var ageSpan = domConstruct.create("span", {"class": ""}, ageCell);
					 var ageTime = domConstruct.create("time", {
						 "datetime":date, 
						 "innerHTML": prettyDate.pretty(date),
						 "title": date.replace("T", " ")
					}, ageSpan);
				 }));
			 }
		}
	
	});
});
// 启动时间计时器