//>>built
define("drip/tip",["dojo/_base/window","dojo/fx","dojo/dom-construct"],function(g,c,a){return{ok:function(d,e,f){var b=a.create("span",{style:{color:"green"}},e,f);b.innerHTML="\x3ci class\x3d'icon-ok'\x3e\x3c/i\x3e "+d;c.wipeOut({node:b,duration:1E3,onEnd:function(){a.destroy(b)}}).play()},error:function(a){}}});
//@ sourceMappingURL=tip.js.map