//>>built
define("dojox/date/umalqura/locale","../..,dojo/_base/lang,dojo/_base/array,dojo/date,dojo/i18n,dojo/regexp,dojo/string,./Date,dojo/i18n!dojo/cldr/nls/islamic".split(","),function(q,l,m,r,i,s,n,t){function u(d,e,a,g,h){return h.replace(/([a-z])\1*/ig,function(b){var c,a,j=b.charAt(0),b=b.length,g=["abbr","wide","narrow"];switch(j){case "G":c=e.eraAbbr[0];break;case "y":c=""+d.getFullYear();break;case "M":c=d.getMonth();3>b?(c+=1,a=!0):(j=["months-format",g[b-3]].join("-"),c=e[j][c]);break;case "d":c=
d.getDate(!0);a=!0;break;case "E":c=d.getDay();3>b?(c+=1,a=!0):(j=["days-format",g[b-3]].join("-"),c=e[j][c]);break;case "a":c=12>d.getHours()?"am":"pm";c=e["dayPeriods-format-wide-"+c];break;case "h":case "H":case "K":case "k":a=d.getHours();switch(j){case "h":c=a%12||12;break;case "H":c=a;break;case "K":c=a%12;break;case "k":c=a||24}a=!0;break;case "m":c=d.getMinutes();a=!0;break;case "s":c=d.getSeconds();a=!0;break;case "S":c=Math.round(d.getMilliseconds()*Math.pow(10,b-3));a=!0;break;case "z":if(c=
r.getTimezoneName(d.toGregorian()))break;b=4;case "Z":c=d.toGregorian().getTimezoneOffset();c=[0>=c?"+":"-",n.pad(Math.floor(Math.abs(c)/60),2),n.pad(Math.abs(c)%60,2)];4==b&&(c.splice(0,0,"GMT"),c.splice(3,0,":"));c=c.join("");break;default:throw Error("dojox.date.umalqura.locale.formatPattern: invalid pattern char: "+h);}a&&(c=n.pad(c,b));return c})}function o(d,e,a,g){var h=function(a){return a},e=e||h,a=a||h,g=g||h,b=d.match(/(''|[^'])+/g),c="'"==d.charAt(0);m.forEach(b,function(d,j){d?(b[j]=
(c?a:e)(d),c=!c):b[j]=""});return g(b.join(""))}function v(d,e,a,g){g=s.escapeString(g);i.normalizeLocale(a.locale);return g.replace(/([a-z])\1*/ig,function(g){var b;b=g.charAt(0);var c=g.length,f="";a.strict?1<c&&(f="0{"+(c-1)+"}"):f="0?";switch(b){case "y":b="\\d+";break;case "M":b=2<c?"\\S+ ?\\S+":f+"[1-9]|1[0-2]";break;case "d":b="[12]\\d|"+f+"[1-9]|3[01]";break;case "E":b="\\S+";break;case "h":b=f+"[1-9]|1[0-2]";break;case "k":b=f+"\\d|1[01]";break;case "H":b=f+"\\d|1\\d|2[0-3]";break;case "K":b=
f+"[1-9]|1\\d|2[0-4]";break;case "m":case "s":b=f+"\\d|[0-5]\\d";break;case "S":b="\\d{"+c+"}";break;case "a":c=a.am||e["dayPeriods-format-wide-am"];f=a.pm||e["dayPeriods-format-wide-pm"];a.strict?b=c+"|"+f:(b=c+"|"+f,c!=c.toLowerCase()&&(b+="|"+c.toLowerCase()),f!=f.toLowerCase()&&(b+="|"+f.toLowerCase()));break;default:b=".*"}d&&d.push(g);return"("+b+")"}).replace(/[\xa0 ]/g,"[\\s\\xa0]")}var f=l.getObject("date.umalqura.locale",!0,q);f.format=function(d,e){var e=e||{},a=i.normalizeLocale(e.locale),
g=e.formatLength||"short",h=f._getIslamicBundle(a),b=[],a=l.hitch(this,u,d,h,a,e.fullYear);if("year"==e.selector)return d.getFullYear();if("time"!=e.selector){var c=e.datePattern||h["dateFormat-"+g];c&&b.push(o(c,a))}"date"!=e.selector&&(g=e.timePattern||h["timeFormat-"+g])&&b.push(o(g,a));return b.join(" ")};f.regexp=function(d){return f._parseInfo(d).regexp};f._parseInfo=function(d){var d=d||{},e=i.normalizeLocale(d.locale),e=f._getIslamicBundle(e),a=d.formatLength||"short",g=d.datePattern||e["dateFormat-"+
a],a=d.timePattern||e["timeFormat-"+a],h=[];return{regexp:o("date"==d.selector?g:"time"==d.selector?a:"undefined"==typeof a?g:g+" "+a,l.hitch(this,v,h,e,d)),tokens:h,bundle:e}};f.parse=function(d,e){d=d.replace(/[\u200E\u200F\u202A\u202E]/g,"");e||(e={});var a=f._parseInfo(e),g=a.tokens,h=a.bundle,a=a.regexp.replace(/[\u200E\u200F\u202A\u202E]/g,""),a=RegExp("^"+a+"$").exec(d);i.normalizeLocale(e.locale);if(!a)return null;var b=[1389,0,1,0,0,0,0],c="",l=["abbr","wide","narrow"];m.every(a,function(a,
d){if(!d)return!0;var f=g[d-1],k=f.length;switch(f.charAt(0)){case "y":b[0]=Number(a);break;case "M":if(2<k){if(f=h["months-format-"+l[k-3]].concat(),e.strict||(a=a.replace(".","").toLowerCase(),f=m.map(f,function(a){return a?a.replace(".","").toLowerCase():a})),a=m.indexOf(f,a),-1==a)return!1}else a--;b[1]=Number(a);break;case "D":b[1]=0;case "d":b[2]=Number(a);break;case "a":f=e.am||h["dayPeriods-format-wide-am"];k=e.pm||h["dayPeriods-format-wide-pm"];if(!e.strict)var i=/\./g,a=a.replace(i,"").toLowerCase(),
f=f.replace(i,"").toLowerCase(),k=k.replace(i,"").toLowerCase();if(e.strict&&a!=f&&a!=k)return!1;c=a==k?"p":a==f?"a":"";break;case "K":24==a&&(a=0);case "h":case "H":case "k":b[3]=Number(a);break;case "m":b[4]=Number(a);break;case "s":b[5]=Number(a);break;case "S":b[6]=Number(a)}return!0});a=+b[3];"p"===c&&12>a?b[3]=a+12:"a"===c&&12==a&&(b[3]=0);return new t(b[0],b[1],b[2],b[3],b[4],b[5],b[6])};var p=[];f.addCustomFormats=function(d,e){p.push({pkg:d,name:e})};f._getIslamicBundle=function(d){var e=
{};m.forEach(p,function(a){a=i.getLocalization(a.pkg,a.name,d);e=l.mixin(e,a)},this);return e};f.addCustomFormats("dojo.cldr","islamic");f.getNames=function(d,e,a,g){var h,g=f._getIslamicBundle(g),d=[d,a,e];"standAlone"==a&&(a=d.join("-"),h=g[a],1==h[0]&&(h=void 0));d[1]="format";return(h||g[d.join("-")]).concat()};f.weekDays=f.getNames("days","wide","format");f.months=f.getNames("months","wide","format");return f});