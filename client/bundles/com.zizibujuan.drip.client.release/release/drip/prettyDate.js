//>>built
define("drip/prettyDate","dojo/_base/lang dojo/query dojo/string dojo/dom-prop dojo/date dojo/date/stamp dojo/i18n!./nls/prettyDate".split(" "),function(e,f,d,g,k,h,c){return{prettyForNumber:function(b){b=((new Date).getTime()-b)/1E3;var a=Math.floor(b/86400);if(isNaN(a)||0>a)return"";if(0===a){if(60>b)return c.now;if(120>b)return c.minute;if(3600>b)return d.substitute(c.minutes,{num:Math.floor(b/60)});if(7200>b)return c.hour;if(86400>b)return d.substitute(c.hours,{num:Math.floor(b/3600)})}if(1===
a)return c.yesterday;if(7>a)return d.substitute(c.days,{num:a});if(8>a)return c.week;if(14>a)return d.substitute(c.days,{num:a});if(30>a)return d.substitute(c.weeks,{num:Math.ceil(a/7)});if(32>a)return c.month;if(363>a)return d.substitute(c.months,{num:Math.ceil(a/31)});if(380>=a)return c.year;if(380<a)return d.substitute(c.years,{num:Math.ceil(a/365)})},pretty:function(b){b=h.fromISOString(b);return prettyForNumber(b)},setInterval:function(b,a){this.parent=b;a&&setInterval(e.hitch(this,this._format),
a)},_format:function(){f("time",this.parent).forEach(e.hitch(this,function(b,a){var c=g.get(b,"datetime"),c=this.pretty(c);b.innerHTML=c}))}}});
//@ sourceMappingURL=prettyDate.js.map