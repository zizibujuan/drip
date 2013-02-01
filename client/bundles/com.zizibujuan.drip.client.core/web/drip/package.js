var profile = (function(){
	
	var testResourceRe = /^drip\/tests\//;
	
	var copyOnly = function(fileName, mid){
		var list = {
			"drip/package":1,
			"drip/renren":1,
			"drip/package.json":1
		};
		
		return (mid in list) || 
			(/^drip\/resources\//.test(mid) && !/\.css$/.test(fileName)) ||
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