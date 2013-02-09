//>>built
define("dojox/string/Builder",["dojo/_base/lang"],function(lang){return lang.getObject("string",!0,dojox).Builder=function(str){var b="";this.length=0,this.append=function(s){if(arguments.length>1){var tmp="",l=arguments.length;switch(l){case 9:tmp=""+arguments[8]+tmp;case 8:tmp=""+arguments[7]+tmp;case 7:tmp=""+arguments[6]+tmp;case 6:tmp=""+arguments[5]+tmp;case 5:tmp=""+arguments[4]+tmp;case 4:tmp=""+arguments[3]+tmp;case 3:tmp=""+arguments[2]+tmp;case 2:b+=""+arguments[0]+arguments[1]+tmp;break;default:var i=0;while(i<arguments.length)tmp+=arguments[i++];b+=tmp}}else b+=s;return this.length=b.length,this},this.concat=function(s){return this.append.apply(this,arguments)},this.appendArray=function(strings){return this.append.apply(this,strings)},this.clear=function(){return b="",this.length=0,this},this.replace=function(oldStr,newStr){return b=b.replace(oldStr,newStr),this.length=b.length,this},this.remove=function(start,len){return len===undefined&&(len=b.length),len==0?this:(b=b.substr(0,start)+b.substr(start+len),this.length=b.length,this)},this.insert=function(index,str){return index==0?b=str+b:b=b.slice(0,index)+str+b.slice(index),this.length=b.length,this},this.toString=function(){return b},str&&this.append(str)},dojox.string.Builder})