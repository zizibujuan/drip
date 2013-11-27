define(["dojo/_base/array",
        "dojo/_base/lang",
        "dojo/dom-prop",
        "dojo/dom-construct",
        "mathEditor/dataUtil",
        "drip/classCode"], function(
		array,
		lang,
		domProp,
    	domConstruct,
		dataUtil,
		classCode){
	
	var exerciseHelper = {};
	
	// TODO:重复存在，重构
	var optionLabel = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	
	function _createOption(parentNode,inputType, widgetId,  data, index){
		console.log(parentNode, data, index);
		// 因为选项的name必须要与其他习题的区分开，所以应该使用部件id
		var inputId = widgetId + "_" + data.id;
		var inputGroupName = "opt_" + widgetId;
		
		var tr = domConstruct.place('<tr></tr>', parentNode);
		var td1 = domConstruct.place('<td></td>', tr);
		var input = domConstruct.create("input",{type: inputType, name: inputGroupName, id: inputId}, td1);
		domProp.set(input,{"disabled": true, optionId: data.id});
		
		var td2 = domConstruct.place('<td></td>', tr);
		var label = domConstruct.place('<label style="padding-right:5px">' + optionLabel.charAt(index) + '</label>',td2);
		domProp.set(label,"for",inputId);
		
		// 不再选项内容上添加for属性，因为用户阅读内容时，用鼠标选中内容可能只是为了帮助理解，而不是选择答案
		var td3 = domConstruct.place('<td></td>', tr);
		var html = dataUtil.xmlStringToHtml(data.content);
		td3.innerHTML = html;
	}
	
	exerciseHelper.create = function(widgetId, exerciseInfo, container){
		// TODO:需要将mathEditor中model的格式转换为html格式
		var html = dataUtil.xmlStringToHtml(exerciseInfo.content);
		var _contentDiv = domConstruct.create("div", {innerHTML: html, "class": "content"}, container);
		if(exerciseInfo.imageName){
			// 这个图，放在创建人的用户名下，作为修改人，用户下是没有这个图的 FIXME
			var _imageDiv = domConstruct.create("img", {src: "/userImages/" + exerciseInfo.createUserId + "/" + exerciseInfo.imageName}, container);
		}
		var options = exerciseInfo.options;
		if(options && options.length > 0){
			var inputType = "radio";
			if(exerciseInfo.exerType == classCode.ExerciseType.SINGLE_OPTION){
				inputType = "radio";
			}else if(exerciseInfo.exerType == classCode.ExerciseType.MULTI_OPTION){
				inputType = "checkbox";
			}
				
			var _optionsDiv = domConstruct.create("div",{"class":"option"}, container);
			var table = this.table = domConstruct.create("table", null, _optionsDiv);
			// 循环填写options节点
			array.forEach(options,function(option, index){
				_createOption(table, inputType, widgetId, option, index)
			});
		}
	};
	
	return exerciseHelper;
});