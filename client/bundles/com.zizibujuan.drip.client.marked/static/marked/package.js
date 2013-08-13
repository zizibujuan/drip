var profile = (function(){
	
	var testResourceRe = /^marked\/tests\//;
	
	var copyOnly = function(fileName, mid){
		var list = {
			"marked/package":1,
			"marked/package.json":1
		};
		
		return (mid in list) || 
			(/^marked\/resources\//.test(mid) && !/\.css$/.test(fileName)) ||
			/(png|jpg|jpeg|gif|tiff)$/.test(fileName);
		
	}
	
	return {
		resourceTags:{
			test: function(fileName, mid){
				return testResourceRe.test(mid);
			},
			
			copyOnly: function(fileName, mid){
				return copyOnly(fileName, mid);
			},
			
			amd: function(fileName, mid){
				return !testResourceRe.test(mid) && !copyOnly(fileName, mid) && /\.js$/.test(fileName);
			}
		}
	};
	
	
})();