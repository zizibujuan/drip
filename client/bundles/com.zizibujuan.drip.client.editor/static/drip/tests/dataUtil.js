define([ "doh","dojox/xml/parser","drip/dataUtil" ], function(doh,domParser,dataUtil) {
	doh.register("dataUtil",[
		function testXmlStringToHtml(t){
			var xmlString = "<root><line><text>a</text><math><mn>1</mn></math></line></root>";
			var expectHtml = "<div><span>a</span><math><mn>1</mn></math></div>";
			t.is(expectHtml, dataUtil.xmlStringToHtml(xmlString));
		}
	]);
});