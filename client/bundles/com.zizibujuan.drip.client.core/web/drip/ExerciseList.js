define(["dojo/_base/declare", 
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
		 
		 exercise: null,
		 
		 postCreate : function(){
			 // 将自定义的xml字符串转换为html格式的字符串。
			 this.divContent.innerHTML = dataUtil.xmlStringToHtml(this.exercise.content);
			 // TODO:取消注释
			 /*
			 this.buttonAnswer.value = common.buttonAnswer;
			 on(this.buttonAnswer,"click",lang.hitch(this, this._btnAnswerHandler));
			 */
			 this.linkAnswer.href="/exercises/"+ this.exercise.id;
		 },
		 
		 _btnAnswerHandler : function(e){
			 alert("TODO：添加处理函数");
		 }
	});
	
	return declare("drip.ExerciseList",[_WidgetBase, _TemplatedMixin],{
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
						 exercise: item
					 });
					 this.domNode.appendChild(exerciseNode.domNode);
					 //this.domNode.innerHTML+=this.domNode.innerHTML+item.CONTENT;
				 }));
				 // 使用mathjax进行呈现
				 MathJax.Hub.Queue(["Typeset",MathJax.Hub, this.domNode]);
			 }
		 }
	
	});
	
});