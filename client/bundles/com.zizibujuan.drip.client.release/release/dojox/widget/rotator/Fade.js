//>>built
define("dojox/widget/rotator/Fade",["dojo/_base/lang","dojo/_base/fx","dojo/dom-style","dojo/fx"],function(d,e,f,g){function c(a,c){var b=a.next.node;f.set(b,{display:"",opacity:0});a.node=a.current.node;return g[c]([e.fadeOut(a),e.fadeIn(d.mixin(a,{node:b}))])}var b={fade:function(a){return c(a,"chain")},crossFade:function(a){return c(a,"combine")}};d.mixin(d.getObject("dojox.widget.rotator"),b);return b});
//@ sourceMappingURL=Fade.js.map