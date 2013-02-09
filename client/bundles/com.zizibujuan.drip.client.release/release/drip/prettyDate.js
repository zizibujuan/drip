define("drip/prettyDate", ["dojo/_base/lang",
        "dojo/query",
        "dojo/string",
        "dojo/dom-prop",
        "dojo/date",
        "dojo/date/stamp",
        "dojo/i18n!./nls/prettyDate"], function(
        		lang,
        		query,
        		string,
        		domProp,
        		date,
        		stamp,
        		prettyDateMessages){
	'use strict';
	// summary:
	//		将日期格式化为更友好的展示格式。

	var prettyDate = {
		pretty: function(dateString){
			var date = stamp.fromISOString(dateString);
			var nowTime = new Date().getTime(),
			diff = (nowTime - date.getTime()) / 1000,
			dayDiff = Math.floor(diff / (60*60*24));

			if (isNaN(dayDiff) || dayDiff < 0) {
				return "";
			}
	
			var messages = prettyDateMessages;
			if(dayDiff === 0){
				if(diff < 60*1){
					return messages.now;
				}
				if(diff < 60*2){
					return messages.minute;
				}
				if(diff < 60 * 60){
					return string.substitute(messages.minutes,{num:Math.floor(diff/60)})
				}
				if(diff < 60 * 60 * 2){
					return messages.hour;
				}
				if(diff < 60 * 60 * 24){
					return string.substitute(messages.hours,{num:Math.floor(diff/(60*60))});
				}
			}
			
			if(dayDiff === 1){
				return messages.yesterday;
			}
			
			if(dayDiff < 7){
				return string.substitute(messages.days,{num:dayDiff});
			}
			
			if(dayDiff < 8){
				return messages.week;
			}
			
			if(dayDiff < 14){
				return string.substitute(messages.days,{num:dayDiff});
			}
			
			if(dayDiff < 30){
				return string.substitute(messages.weeks,{num:Math.ceil(dayDiff/7)});
			}
			
			if(dayDiff < 32){
				return messages.month;
			}
			
			if(dayDiff < 363){
				return string.substitute(messages.months,{num:Math.ceil(dayDiff/31)});
			}
			
			if(dayDiff <= 380){
				return messages.year;
			}
			
			if(dayDiff > 380){
				return string.substitute(messages.years,{num:Math.ceil(dayDiff/365)});
			}
		},
		
		setInterval: function(parent, interval){
			this.parent = parent;
			// 获取所有的time标签，然后更新时间
			if(interval){
				setInterval(lang.hitch(this,this._format), interval)
			}
		},
		
		_format: function(){
			query("time",this.parent).forEach(lang.hitch(this,function(el, index){
				var datetime = domProp.get(el, "datetime");
				var pretty = this.pretty(datetime);
				el.innerHTML = pretty;
			}));
		}
	};

	
	return prettyDate;
});