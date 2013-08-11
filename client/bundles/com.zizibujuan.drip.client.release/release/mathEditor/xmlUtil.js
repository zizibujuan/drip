//>>built
define("mathEditor/xmlUtil",["./lang"],function(h){return{createEmptyFrac:function(a){var c=a.createElement("mstyle");c.setAttribute("displaystyle","true");var b=a.createElement("mfrac"),d=a.createElement("mrow"),e=a.createElement("mrow"),f=this.getPlaceHolder(a);a=this.getPlaceHolder(a);c.appendChild(b);b.appendChild(d);b.appendChild(e);d.appendChild(f);e.appendChild(a);return{rootNode:c,focusNode:f}},createFracWithNumerator:function(a,c){var b=a.createElement("mstyle");b.setAttribute("displaystyle",
"true");var d=a.createElement("mfrac"),e=a.createElement("mrow"),f=a.createElement("mrow"),g=this.getPlaceHolder(a);b.appendChild(d);d.appendChild(e);d.appendChild(f);e.appendChild(c);f.appendChild(g);return{rootNode:b,focusNode:g}},createScriptingWithBase:function(a,c,b){b=a.createElement(b);var d=a.createElement("mrow"),e=a.createElement("mrow");a=this.getPlaceHolder(a);b.appendChild(d);b.appendChild(e);d.appendChild(c);e.appendChild(a);return{rootNode:b,focusNode:a}},createEmptyScripting:function(a,
c){var b=a.createElement(c),d=a.createElement("mrow"),e=a.createElement("mrow"),f=this.getPlaceHolder(a),g=this.getPlaceHolder(a);b.appendChild(d);b.appendChild(e);d.appendChild(f);e.appendChild(g);return{rootNode:b,focusNode:g}},createEmptyMsqrt:function(a){var c=a.createElement("msqrt");a=this.getPlaceHolder(a);c.appendChild(a);return{rootNode:c,focusNode:a}},createEmptyMroot:function(a){var c=a.createElement("mroot"),b=a.createElement("mrow"),d=a.createElement("mrow"),e=this.getPlaceHolder(a);
a=this.getPlaceHolder(a);c.appendChild(b);c.appendChild(d);b.appendChild(e);d.appendChild(a);return{rootNode:c,focusNode:a}},createEmptyMfenced:function(a,c){var b=a.createElement("mfenced"),d={"{":{left:"{",right:"}"},"[":{left:"[",right:"]"},"|":{left:"|",right:"|"}};"("!=c&&(b.setAttribute("open",d[c].left),b.setAttribute("close",d[c].right));var d=a.createElement("mrow"),e=this.getPlaceHolder(a);b.appendChild(d);d.appendChild(e);return{rootNode:b,focusNode:e}},createTrigonometric:function(a,c,
b){},isPlaceHolder:function(a){return"drip_placeholder_box"===a.getAttribute("class")},removePlaceHolder:function(a){a.parentNode&&a.parentNode.removeChild(a)},getPlaceHolder:function(a){a=a.createElement("mn");a.setAttribute("class","drip_placeholder_box");a.setAttribute("style","border:1px dotted black; padding:1px;background-color: #cccccc;color: #cccccc;");h.setText(a,8);return a}}});
//@ sourceMappingURL=xmlUtil.js.map