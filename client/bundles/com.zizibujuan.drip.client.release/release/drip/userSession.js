//>>built
define("drip/userSession",["dojo/dom","dojo/dom-construct","dojo/request/xhr"],function(g,c,f){var b={},e=null;b.getLoggedUserInfo=function(){return null!=e?e:e=f("/login/",{method:"POST",handleAs:"json"}).then(function(a){return a},function(){window.location.href="/"})};b.showProfile=function(){this.getLoggedUserInfo().then(function(a){var d=g.byId("userProfile"),b=c.create("a",{href:"#"},d);if(!a.headUrl)a.headUrl="";c.create("img",{alt:a.nickName,src:a.headUrl,width:"80px",height:"80px"},b);c.create("a",
{href:"#",alt:a.nickName,innerHTML:a.nickName},d);b=c.create("a",{href:"#"},d);c.create("span",{innerHTML:"\u7c89\u4e1d"+a.fanCount},b);d=c.create("a",{href:"#"},d);c.create("span",{innerHTML:"\u5173\u6ce8"+a.followCount},d)})};b.logout=function(){f("/logout/",{method:"POST",handleAs:"json"}).then(function(){},function(){window.location="/"})};return b});