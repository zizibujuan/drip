define(["dojo/_base/window",
        "dojo/has",
        "dojo/sniff",
        "dojo/dom-construct"], function(
        		win,
        		has,
        		sniff,
        		domConstruct){
	
	// 判断如果是ie6，7，8则提示用户，使用最新版的浏览器
	if(has("ie") <= 8){
		var box = domConstruct.create("div", {"class": "unsupported-browser"}, win.body(), "first");
		var container = domConstruct.create("div", {"class": "container clearfix"}, box);
		var h5 = domConstruct.create("h5", {}, container);
		h5.innerHTML = "<i class='icon-info-sign'></i> 孜孜不倦不再支持IE7或IE8。";
		var p = domConstruct.create("p", {}, container);
		p.innerHTML = "我们建议您使用最新版的<a href='https://chrome.google.com'>Google Chrome</a>、<a href='https://mozilla.org/firefox/'>Firefox</a>或<a href='https://ie.microsoft.com/'>Internet Explorer 9+</a>,";
	}
});