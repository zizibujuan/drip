define(["dojo/_base/declare",
        "mathEditor/Editor"], function(
        		declare,
        		Editor){
	var editorHelper = {};
	
	editorHelper.createEditor = function(parentNode, rowCount, width){
		// summary:
		//		创建数学编辑器
		// parentNode: dom node
		// rowCount: int
		// width: int
		// FIXME: 提取到一个帮助方法中？因为习题和答案都需要这个方法
		
		var params = {};
		// TODO:在mathEditor中增加rows参数，但是不增加columns参数，而是依然使用width参数，
		// 因为输入数学公式之后，列数是无法确定的。
		params.rows = rowCount;
		if(width){
			params.width = width;
		}
		var editor = new Editor(params);
		editor.placeAt(parentNode);
		editor.startup(); // 
		return editor;
	};
	
	return editorHelper;
});
