//>>built
define("mathEditor/dom",{scrollbarWidth:function(){var c=document,a=c.createElement("div");a.style.width="100%";a.style.minWidth="0px";a.style.height="200px";a.style.display="block";var d=c.createElement("div"),b=d.style;b.position="absolute";b.left="-10000px";b.overflow="hidden";b.width="200px";b.minWidth="0px";b.height="150px";b.display="block";d.appendChild(a);c=c.documentElement;c.appendChild(d);var e=a.offsetWidth;b.overflow="scroll";a=a.offsetWidth;e==a&&(a=d.clientWidth);c.removeChild(d);return e-
a}});
//@ sourceMappingURL=dom.js.map