//>>built
define("dojo/number",["./_base/lang","./i18n","./i18n!./cldr/nls/number","./string","./regexp"],function(lang,i18n,nlsNumber,dstring,dregexp){var number={};lang.setObject("dojo.number",number),number.format=function(value,options){options=lang.mixin({},options||{});var locale=i18n.normalizeLocale(options.locale),bundle=i18n.getLocalization("dojo.cldr","number",locale);options.customs=bundle;var pattern=options.pattern||bundle[(options.type||"decimal")+"Format"];return isNaN(value)||Math.abs(value)==Infinity?null:number._applyPattern(value,pattern,options)},number._numberPatternRE=/[#0,]*[#0](?:\.0*#*)?/,number._applyPattern=function(value,pattern,options){options=options||{};var group=options.customs.group,decimal=options.customs.decimal,patternList=pattern.split(";"),positivePattern=patternList[0];pattern=patternList[value<0?1:0]||"-"+positivePattern;if(pattern.indexOf("%")!=-1)value*=100;else if(pattern.indexOf("‰")!=-1)value*=1e3;else if(pattern.indexOf("¤")!=-1)group=options.customs.currencyGroup||group,decimal=options.customs.currencyDecimal||decimal,pattern=pattern.replace(/\u00a4{1,3}/,function(match){var prop=["symbol","currency","displayName"][match.length-1];return options[prop]||options.currency||""});else if(pattern.indexOf("E")!=-1)throw new Error("exponential notation not supported");var numberPatternRE=number._numberPatternRE,numberPattern=positivePattern.match(numberPatternRE);if(!numberPattern)throw new Error("unable to find a number expression in pattern: "+pattern);return options.fractional===!1&&(options.places=0),pattern.replace(numberPatternRE,number._formatAbsolute(value,numberPattern[0],{decimal:decimal,group:group,places:options.places,round:options.round}))},number.round=function(value,places,increment){var factor=10/(increment||10);return(factor*+value).toFixed(places)/factor};if(.9.toFixed()==0){var round=number.round;number.round=function(v,p,m){var d=Math.pow(10,-p||0),a=Math.abs(v);if(!v||a>=d)d=0;else{a/=d;if(a<.5||a>=.95)d=0}return round(v,p,m)+(v>0?d:-d)}}return number._formatAbsolute=function(value,pattern,options){options=options||{},options.places===!0&&(options.places=0),options.places===Infinity&&(options.places=6);var patternParts=pattern.split("."),comma=typeof options.places=="string"&&options.places.indexOf(","),maxPlaces=options.places;comma?maxPlaces=options.places.substring(comma+1):maxPlaces>=0||(maxPlaces=(patternParts[1]||[]).length),options.round<0||(value=number.round(value,maxPlaces,options.round));var valueParts=String(Math.abs(value)).split("."),fractional=valueParts[1]||"";if(patternParts[1]||options.places){comma&&(options.places=options.places.substring(0,comma));var pad=options.places!==undefined?options.places:patternParts[1]&&patternParts[1].lastIndexOf("0")+1;pad>fractional.length&&(valueParts[1]=dstring.pad(fractional,pad,"0",!0)),maxPlaces<fractional.length&&(valueParts[1]=fractional.substr(0,maxPlaces))}else valueParts[1]&&valueParts.pop();var patternDigits=patternParts[0].replace(",","");pad=patternDigits.indexOf("0"),pad!=-1&&(pad=patternDigits.length-pad,pad>valueParts[0].length&&(valueParts[0]=dstring.pad(valueParts[0],pad)),patternDigits.indexOf("#")==-1&&(valueParts[0]=valueParts[0].substr(valueParts[0].length-pad)));var index=patternParts[0].lastIndexOf(","),groupSize,groupSize2;if(index!=-1){groupSize=patternParts[0].length-index-1;var remainder=patternParts[0].substr(0,index);index=remainder.lastIndexOf(","),index!=-1&&(groupSize2=remainder.length-index-1)}var pieces=[];for(var whole=valueParts[0];whole;){var off=whole.length-groupSize;pieces.push(off>0?whole.substr(off):whole),whole=off>0?whole.slice(0,off):"",groupSize2&&(groupSize=groupSize2,delete groupSize2)}return valueParts[0]=pieces.reverse().join(options.group||","),valueParts.join(options.decimal||".")},number.regexp=function(options){return number._parseInfo(options).regexp},number._parseInfo=function(options){options=options||{};var locale=i18n.normalizeLocale(options.locale),bundle=i18n.getLocalization("dojo.cldr","number",locale),pattern=options.pattern||bundle[(options.type||"decimal")+"Format"],group=bundle.group,decimal=bundle.decimal,factor=1;if(pattern.indexOf("%")!=-1)factor/=100;else if(pattern.indexOf("‰")!=-1)factor/=1e3;else{var isCurrency=pattern.indexOf("¤")!=-1;isCurrency&&(group=bundle.currencyGroup||group,decimal=bundle.currencyDecimal||decimal)}var patternList=pattern.split(";");patternList.length==1&&patternList.push("-"+patternList[0]);var re=dregexp.buildGroupRE(patternList,function(pattern){return pattern="(?:"+dregexp.escapeString(pattern,".")+")",pattern.replace(number._numberPatternRE,function(format){var flags={signed:!1,separator:options.strict?group:[group,""],fractional:options.fractional,decimal:decimal,exponent:!1},parts=format.split("."),places=options.places;parts.length==1&&factor!=1&&(parts[1]="###"),parts.length==1||places===0?flags.fractional=!1:(places===undefined&&(places=options.pattern?parts[1].lastIndexOf("0")+1:Infinity),places&&options.fractional==undefined&&(flags.fractional=!0),!options.places&&places<parts[1].length&&(places+=","+parts[1].length),flags.places=places);var groups=parts[0].split(",");return groups.length>1&&(flags.groupSize=groups.pop().length,groups.length>1&&(flags.groupSize2=groups.pop().length)),"("+number._realNumberRegexp(flags)+")"})},!0);return isCurrency&&(re=re.replace(/([\s\xa0]*)(\u00a4{1,3})([\s\xa0]*)/g,function(match,before,target,after){var prop=["symbol","currency","displayName"][target.length-1],symbol=dregexp.escapeString(options[prop]||options.currency||"");return before=before?"[\\s\\xa0]":"",after=after?"[\\s\\xa0]":"",options.strict?before+symbol+after:(before&&(before+="*"),after&&(after+="*"),"(?:"+before+symbol+after+")?")})),{regexp:re.replace(/[\xa0 ]/g,"[\\s\\xa0]"),group:group,decimal:decimal,factor:factor}},number.parse=function(expression,options){var info=number._parseInfo(options),results=(new RegExp("^"+info.regexp+"$")).exec(expression);if(!results)return NaN;var absoluteMatch=results[1];if(!results[1]){if(!results[2])return NaN;absoluteMatch=results[2],info.factor*=-1}return absoluteMatch=absoluteMatch.replace(new RegExp("["+info.group+"\\s\\xa0"+"]","g"),"").replace(info.decimal,"."),absoluteMatch*info.factor},number._realNumberRegexp=function(flags){flags=flags||{},"places"in flags||(flags.places=Infinity),typeof flags.decimal!="string"&&(flags.decimal=".");if(!("fractional"in flags)||/^0/.test(flags.places))flags.fractional=[!0,!1];"exponent"in flags||(flags.exponent=[!0,!1]),"eSigned"in flags||(flags.eSigned=[!0,!1]);var integerRE=number._integerRegexp(flags),decimalRE=dregexp.buildGroupRE(flags.fractional,function(q){var re="";return q&&flags.places!==0&&(re="\\"+flags.decimal,flags.places==Infinity?re="(?:"+re+"\\d+)?":re+="\\d{"+flags.places+"}"),re},!0),exponentRE=dregexp.buildGroupRE(flags.exponent,function(q){return q?"([eE]"+number._integerRegexp({signed:flags.eSigned})+")":""}),realRE=integerRE+decimalRE;return decimalRE&&(realRE="(?:(?:"+realRE+")|(?:"+decimalRE+"))"),realRE+exponentRE},number._integerRegexp=function(flags){flags=flags||{},"signed"in flags||(flags.signed=[!0,!1]),"separator"in flags?"groupSize"in flags||(flags.groupSize=3):flags.separator="";var signRE=dregexp.buildGroupRE(flags.signed,function(q){return q?"[-+]":""},!0),numberRE=dregexp.buildGroupRE(flags.separator,function(sep){if(!sep)return"(?:\\d+)";sep=dregexp.escapeString(sep),sep==" "?sep="\\s":sep==" "&&(sep="\\s\\xa0");var grp=flags.groupSize,grp2=flags.groupSize2;if(grp2){var grp2RE="(?:0|[1-9]\\d{0,"+(grp2-1)+"}(?:["+sep+"]\\d{"+grp2+"})*["+sep+"]\\d{"+grp+"})";return grp-grp2>0?"(?:"+grp2RE+"|(?:0|[1-9]\\d{0,"+(grp-1)+"}))":grp2RE}return"(?:0|[1-9]\\d{0,"+(grp-1)+"}(?:["+sep+"]\\d{"+grp+"})*)"},!0);return signRE+numberRE},number})