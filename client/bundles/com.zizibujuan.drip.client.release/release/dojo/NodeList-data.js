//>>built
define("dojo/NodeList-data",["./_base/kernel","./query","./_base/lang","./_base/array","./dom-attr"],function(g,i,j,l,k){var c=i.NodeList,d={},m=0,h=function(b){var a=k.get(b,"data-dojo-dataid");a||(a="pid"+m++,k.set(b,"data-dojo-dataid",a));return a},n=g._nodeData=function(b,a,c){var e=h(b),f;d[e]||(d[e]={});1==arguments.length&&(f=d[e]);"string"==typeof a?2<arguments.length?d[e][a]=c:f=d[e][a]:f=j.mixin(d[e],a);return f},o=g._removeNodeData=function(b,a){var c=h(b);d[c]&&(a?delete d[c][a]:delete d[c])};
c._gcNodeData=g._gcNodeData=function(){var b=i("[data-dojo-dataid]").map(h),a;for(a in d)0>l.indexOf(b,a)&&delete d[a]};j.extend(c,{data:c._adaptWithCondition(n,function(b){return 0===b.length||1==b.length&&"string"==typeof b[0]}),removeData:c._adaptAsForEach(o)});return c});