//>>built
define("drip/tip",["dojo/_base/window","dojo/fx","dojo/dom-construct"],function(g,f,a){return{ok:function(b,c,d){var e=a.create("span",{style:{color:"green"}},c,d);e.innerHTML="\x3ci class\x3d'icon-ok'\x3e\x3c/i\x3e "+b;f.wipeOut({node:e,duration:1500,onEnd:function(){a.destroy(e)}}).play()},error:function(b,c,d){email.nextSibling&&a.destroy(email.nextSibling);a.create("span",{style:{color:"red"}},c,d).innerHTML="\x3ci class\x3d'icon-remove-sign'\x3e\x3c/i\x3e "+b}}});
//@ sourceMappingURL=tip.js.map