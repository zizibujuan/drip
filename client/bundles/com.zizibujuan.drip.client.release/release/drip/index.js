//>>built
define("drip/index","dojo/parser dojo/_base/window dojo/cookie dojo/dom dojo/dom-style dojo/on drip/mixLogin/Register drip/mixLogin/Login dojo/domReady!".split(" "),function(d,g,e,h,k,l,m,n){function f(a){b&&b.destroyRecursive();a?(b=new m,c.innerHTML="\u6211\u8981\u767b\u5f55"):(b=new n,c.innerHTML="\u6211\u8981\u6ce8\u518c\u4e00\u4e2a\u65b0\u5e10\u53f7");b.placeAt("authContainer")}d=e("zzbj_user");e("loggedIn");var c=h.byId("link"),b=null,a=!1,a=null==d?!0:!1;f(a);k.set(g.body(),"visibility","visible");
l(c,"click",function(b){a=!a;f(a)})});
//@ sourceMappingURL=index.js.map