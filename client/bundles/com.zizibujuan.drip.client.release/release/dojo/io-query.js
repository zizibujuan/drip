//>>built
define("dojo/io-query",["./_base/lang"],function(i){var j={};return{objectToQuery:function(d){var e=encodeURIComponent,c=[],b;for(b in d){var a=d[b];if(a!=j[b]){var f=e(b)+"=";if(i.isArray(a))for(var g=0,h=a.length;g<h;++g)c.push(f+e(a[g]));else c.push(f+e(a))}}return c.join("&")},queryToObject:function(d){for(var e=decodeURIComponent,d=d.split("&"),c={},b,a,f=0,g=d.length;f<g;++f)if(a=d[f],a.length){var h=a.indexOf("=");0>h?(b=e(a),a=""):(b=e(a.slice(0,h)),a=e(a.slice(h+1)));"string"==typeof c[b]&&
(c[b]=[c[b]]);i.isArray(c[b])?c[b].push(a):c[b]=a}return c}}});