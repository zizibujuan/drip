//>>built
define("dojox/date/hebrew/numerals",["../..","dojo/_base/lang","dojo/_base/array"],function(dojox,lang,arr){var hnumerals=lang.getObject("date.hebrew.numerals",!0,dojox),DIG="אבגדהוזחט",TEN="יכלמנסעפצ",HUN="קרשת",transformChars=function(str,nogrsh){str=str.replace("יה","טו").replace("יו","טז");if(!nogrsh){var len=str.length;len>1?str=str.substr(0,len-1)+'"'+str.charAt(len-1):str+="׳"}return str},parseStrToNumber=function(str){var num=0;return arr.forEach(str,function(ch){var i;(i=DIG.indexOf(ch))!=-1?num+=++i:(i=TEN.indexOf(ch))!=-1?num+=10*++i:(i=HUN.indexOf(ch))!=-1&&(num+=100*++i)}),num},convertNumberToStr=function(num){var str="",n=4,j=9;while(num){if(num>=n*100){str+=HUN.charAt(n-1),num-=n*100;continue}if(n>1){n--;continue}if(num>=j*10)str+=TEN.charAt(j-1),num-=j*10;else{if(j>1){j--;continue}num>0&&(str+=DIG.charAt(num-1),num=0)}}return str};return hnumerals.getYearHebrewLetters=function(year){var rem=year%1e3;return transformChars(convertNumberToStr(rem))},hnumerals.parseYearHebrewLetters=function(year){return parseStrToNumber(year)+5e3},hnumerals.getDayHebrewLetters=function(day,nogrsh){return transformChars(convertNumberToStr(day),nogrsh)},hnumerals.parseDayHebrewLetters=function(day){return parseStrToNumber(day)},hnumerals.getMonthHebrewLetters=function(month){return transformChars(convertNumberToStr(month+1))},hnumerals.parseMonthHebrewLetters=function(monthStr){var monnum=hnumerals.parseDayHebrewLetters(monthStr)-1;if(monnum==-1||monnum>12)throw new Error("The month name is incorrect , month = "+monnum);return monnum},hnumerals})