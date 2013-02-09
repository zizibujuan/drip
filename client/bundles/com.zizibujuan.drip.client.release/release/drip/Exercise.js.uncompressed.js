require({cache:{
'url:drip/templates/ExerciseNode.html':"<div style=\"margin-bottom: 20px;\">\n\t<!-- TODO：将这些style提取到样式文件中 -->\n\t<div\n\t\tstyle=\"border-bottom: 1px solid #cacaca;padding-bottom:10px; background: #fbfbfb;\">\n\t\t<div style=\"padding-top: 5px; padding-bottom: 10px\" data-dojo-attach-point=\"divContent\"></div>\n\t\t<div style=\"margin-top: 5px\">\n\t\t\t<div style=\"text-align: right\">\n\t\t\t\t<!-- <input type=\"button\" data-dojo-attach-point=\"buttonAnswer\"></input> -->\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>",
'url:drip/templates/ExerciseList.html':"<div style=\"width:736px;\"></div>"}});
define("drip/Exercise", ["dojo/_base/declare", 
        "dojo/_base/array",
        "dojo/_base/lang",
        "dojo/on",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "dojo/store/JsonRest",
        "mathEditor/dataUtil",
        "dojo/text!./templates/ExerciseNode.html",
        "dojo/text!./templates/ExerciseList.html",
        "dojo/i18n!./nls/common"],function(
        		declare,
        		array,
        		lang,
        		on,
        		_WidgetBase,
        		_TemplatedMixin,
        		_WidgetsInTemplateMixin,
        		JsonRest,
        		dataUtil,
        		nodeTemplate,
        		listTemplate,
        		common){
	
	var ExerciseNode = declare("drip.ExerciseNode",[_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin],{
		 templateString: nodeTemplate,
		 
		 // content: String
		 //		使用html格式描述的习题
		 content:"",
		 
		 postCreate : function(){
			 // 将自定义的xml字符串转换为html格式的字符串。
			 this.divContent.innerHTML = dataUtil.xmlStringToHtml(this.content);
			 // TODO:取消注释
			 /*
			 this.buttonAnswer.value = common.buttonAnswer;
			 on(this.buttonAnswer,"click",lang.hitch(this, this._btnAnswerHandler));
			 */
		 },
		 
		 _btnAnswerHandler : function(e){
			 alert("TODO：添加处理函数");
		 }
	});
	
	var Exercise = declare("drip.Exercise",[_WidgetBase, _TemplatedMixin],{
		 templateString: listTemplate,
		 
		 // 因为该部件是习题专用的，所以将store硬编码在部件里
		 store:new JsonRest({
			 target:"/exercises/"
		 }),
		 
		 // 如果没有习题，则显示没有习题，
		 // 可扩展提示用户录入习题。
		 postCreate : function(){
			 this.inherited(arguments);
			 this.store.query(/*TODO:加入分页信息*/).then(lang.hitch(this, this._load));
		 },
		 
		 _load : function(items){
			 if(items.length == 0){
				 // TODO：定制样式
				 this.domNode.innerHTML = "没有习题做,yeah!";
			 }else{
				 array.forEach(items, lang.hitch(this,function(item, index){
					 var exerciseNode = new ExerciseNode({
						 content : item.CONTENT
					 });
					 this.domNode.appendChild(exerciseNode.domNode);
					 //this.domNode.innerHTML+=this.domNode.innerHTML+item.CONTENT;
				 }));
				 // 使用mathjax进行呈现
				 MathJax.Hub.Queue(["Typeset",MathJax.Hub, this.domNode]);
			 }
		 }
	
	});
	
	return Exercise;
});