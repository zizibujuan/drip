//>>built
define("mathEditor/string",[],function(){var a={};a.splitData=function(c){for(var i=c.length,e=[],b=0,f=!1,d="",a=0,h=0;h<i;h++){var g=c.charAt(h);"&"==g?(a=0,f=!0,d=g):f&&";"==g?(0==a?(e[b]=d,b++,e[b]=g):(d+=g,e[b]=d),b++,f=!1,d=""):f?(d+=g,a++):(e[b]=c.charAt(h),b++)}return e};a.insertAtOffset=function(c,a,e,b){var f=c.length;if(0>a||f<a)return c;b=c.substring(0,a-(b||0));c=c.substring(a);return b+e+c};return a});