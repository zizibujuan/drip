//>>built
define("mathEditor/xmlUtil",{createEmptyFrac:function(a){var d=a.createElement("mstyle");d.setAttribute("displaystyle","true");var b=a.createElement("mfrac"),c=a.createElement("mrow"),e=a.createElement("mrow"),f=this._getPlaceHolder(a),a=this._getPlaceHolder(a);d.appendChild(b);b.appendChild(c);b.appendChild(e);c.appendChild(f);e.appendChild(a);return{rootNode:d,focusNode:f}},createFracWithNumerator:function(a,d){var b=a.createElement("mstyle");b.setAttribute("displaystyle","true");var c=a.createElement("mfrac"),
e=a.createElement("mrow"),f=a.createElement("mrow"),g=this._getPlaceHolder(a);b.appendChild(c);c.appendChild(e);c.appendChild(f);e.appendChild(d);f.appendChild(g);return{rootNode:b,focusNode:g}},createEmptyMsup:function(a){var d=a.createElement("msup"),b=a.createElement("mrow"),c=a.createElement("mrow"),e=this._getPlaceHolder(a),a=this._getPlaceHolder(a);d.appendChild(b);d.appendChild(c);b.appendChild(e);c.appendChild(a);return{rootNode:d,focusNode:a}},createMsupWithBase:function(a,d){var b=a.createElement("msup"),
c=a.createElement("mrow"),e=a.createElement("mrow"),f=this._getPlaceHolder(a);b.appendChild(c);b.appendChild(e);c.appendChild(d);e.appendChild(f);return{rootNode:b,focusNode:f}},isPlaceHolder:function(a){return"drip_placeholder_box"===a.getAttribute("class")},removePlaceHolder:function(a){a.removeAttribute("class");a.removeAttribute("style");a.textContent=""},_getPlaceHolder:function(a){a=a.createElement("mn");a.setAttribute("class","drip_placeholder_box");a.setAttribute("style","border:1px dotted black; padding:1px;background-color: #cccccc;color: #cccccc;");
a.textContent="8";return a}});