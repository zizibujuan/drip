//>>built
define("dojox/string/sprintf",["dojo/_base/kernel","dojo/_base/lang","dojo/_base/sniff","./tokenize"],function(dojo,lang,has,tokenize){var strLib=lang.getObject("string",!0,dojox);return strLib.sprintf=function(format,filler){for(var args=[],i=1;i<arguments.length;i++)args.push(arguments[i]);var formatter=new strLib.sprintf.Formatter(format);return formatter.format.apply(formatter,args)},strLib.sprintf.Formatter=function(format){var tokens=[];this._mapped=!1,this._format=format,this._tokens=tokenize(format,this._re,this._parseDelim,this)},lang.extend(strLib.sprintf.Formatter,{_re:/\%(?:\(([\w_]+)\)|([1-9]\d*)\$)?([0 +\-\#]*)(\*|\d+)?(\.)?(\*|\d+)?[hlL]?([\%scdeEfFgGiouxX])/g,_parseDelim:function(mapping,intmapping,flags,minWidth,period,precision,specifier){return mapping&&(this._mapped=!0),{mapping:mapping,intmapping:intmapping,flags:flags,_minWidth:minWidth,period:period,_precision:precision,specifier:specifier}},_specifiers:{b:{base:2,isInt:!0},o:{base:8,isInt:!0},x:{base:16,isInt:!0},X:{extend:["x"],toUpper:!0},d:{base:10,isInt:!0},i:{extend:["d"]},u:{extend:["d"],isUnsigned:!0},c:{setArg:function(token){if(!isNaN(token.arg)){var num=parseInt(token.arg);if(num<0||num>127)throw new Error("invalid character code passed to %c in sprintf");token.arg=isNaN(num)?""+num:String.fromCharCode(num)}}},s:{setMaxWidth:function(token){token.maxWidth=token.period=="."?token.precision:-1}},e:{isDouble:!0,doubleNotation:"e"},E:{extend:["e"],toUpper:!0},f:{isDouble:!0,doubleNotation:"f"},F:{extend:["f"]},g:{isDouble:!0,doubleNotation:"g"},G:{extend:["g"],toUpper:!0}},format:function(filler){if(this._mapped&&typeof filler!="object")throw new Error("format requires a mapping");var str="",position=0;for(var i=0,token;i<this._tokens.length;i++){token=this._tokens[i];if(typeof token=="string")str+=token;else{if(this._mapped){if(typeof filler[token.mapping]=="undefined")throw new Error("missing key "+token.mapping);token.arg=filler[token.mapping]}else{if(token.intmapping)var position=parseInt(token.intmapping)-1;if(position>=arguments.length)throw new Error("got "+arguments.length+" printf arguments, insufficient for '"+this._format+"'");token.arg=arguments[position++]}if(!token.compiled){token.compiled=!0,token.sign="",token.zeroPad=!1,token.rightJustify=!1,token.alternative=!1;var flags={};for(var fi=token.flags.length;fi--;){var flag=token.flags.charAt(fi);flags[flag]=!0;switch(flag){case" ":token.sign=" ";break;case"+":token.sign="+";break;case"0":token.zeroPad=flags["-"]?!1:!0;break;case"-":token.rightJustify=!0,token.zeroPad=!1;break;case"#":token.alternative=!0;break;default:throw Error("bad formatting flag '"+token.flags.charAt(fi)+"'")}}token.minWidth=token._minWidth?parseInt(token._minWidth):0,token.maxWidth=-1,token.toUpper=!1,token.isUnsigned=!1,token.isInt=!1,token.isDouble=!1,token.precision=1,token.period=="."&&(token._precision?token.precision=parseInt(token._precision):token.precision=0);var mixins=this._specifiers[token.specifier];if(typeof mixins=="undefined")throw new Error("unexpected specifier '"+token.specifier+"'");mixins.extend&&(lang.mixin(mixins,this._specifiers[mixins.extend]),delete mixins.extend),lang.mixin(token,mixins)}typeof token.setArg=="function"&&token.setArg(token),typeof token.setMaxWidth=="function"&&token.setMaxWidth(token);if(token._minWidth=="*"){if(this._mapped)throw new Error("* width not supported in mapped formats");token.minWidth=parseInt(arguments[position++]);if(isNaN(token.minWidth))throw new Error("the argument for * width at position "+position+" is not a number in "+this._format);token.minWidth<0&&(token.rightJustify=!0,token.minWidth=-token.minWidth)}if(token._precision=="*"&&token.period=="."){if(this._mapped)throw new Error("* precision not supported in mapped formats");token.precision=parseInt(arguments[position++]);if(isNaN(token.precision))throw Error("the argument for * precision at position "+position+" is not a number in "+this._format);token.precision<0&&(token.precision=1,token.period="")}token.isInt?(token.period=="."&&(token.zeroPad=!1),this.formatInt(token)):token.isDouble&&(token.period!="."&&(token.precision=6),this.formatDouble(token)),this.fitField(token),str+=""+token.arg}}return str},_zeros10:"0000000000",_spaces10:"          ",formatInt:function(token){var i=parseInt(token.arg);if(!isFinite(i)){if(typeof token.arg!="number")throw new Error("format argument '"+token.arg+"' not an integer; parseInt returned "+i);i=0}i<0&&(token.isUnsigned||token.base!=10)&&(i=4294967295+i+1),i<0?(token.arg=(-i).toString(token.base),this.zeroPad(token),token.arg="-"+token.arg):(token.arg=i.toString(token.base),!i&&!token.precision?token.arg="":this.zeroPad(token),token.sign&&(token.arg=token.sign+token.arg)),token.base==16&&(token.alternative&&(token.arg="0x"+token.arg),token.arg=token.toUpper?token.arg.toUpperCase():token.arg.toLowerCase()),token.base==8&&token.alternative&&token.arg.charAt(0)!="0"&&(token.arg="0"+token.arg)},formatDouble:function(token){var f=parseFloat(token.arg);if(!isFinite(f)){if(typeof token.arg!="number")throw new Error("format argument '"+token.arg+"' not a float; parseFloat returned "+f);f=0}switch(token.doubleNotation){case"e":token.arg=f.toExponential(token.precision);break;case"f":token.arg=f.toFixed(token.precision);break;case"g":Math.abs(f)<1e-4?token.arg=f.toExponential(token.precision>0?token.precision-1:token.precision):token.arg=f.toPrecision(token.precision),token.alternative||(token.arg=token.arg.replace(/(\..*[^0])0*/,"$1"),token.arg=token.arg.replace(/\.0*e/,"e").replace(/\.0$/,""));break;default:throw new Error("unexpected double notation '"+token.doubleNotation+"'")}token.arg=token.arg.replace(/e\+(\d)$/,"e+0$1").replace(/e\-(\d)$/,"e-0$1"),has("opera")&&(token.arg=token.arg.replace(/^\./,"0.")),token.alternative&&(token.arg=token.arg.replace(/^(\d+)$/,"$1."),token.arg=token.arg.replace(/^(\d+)e/,"$1.e")),f>=0&&token.sign&&(token.arg=token.sign+token.arg),token.arg=token.toUpper?token.arg.toUpperCase():token.arg.toLowerCase()},zeroPad:function(token,length){length=arguments.length==2?length:token.precision,typeof token.arg!="string"&&(token.arg=""+token.arg);var tenless=length-10;while(token.arg.length<tenless)token.arg=token.rightJustify?token.arg+this._zeros10:this._zeros10+token.arg;var pad=length-token.arg.length;token.arg=token.rightJustify?token.arg+this._zeros10.substring(0,pad):this._zeros10.substring(0,pad)+token.arg},fitField:function(token){if(token.maxWidth>=0&&token.arg.length>token.maxWidth)return token.arg.substring(0,token.maxWidth);if(token.zeroPad){this.zeroPad(token,token.minWidth);return}this.spacePad(token)},spacePad:function(token,length){length=arguments.length==2?length:token.minWidth,typeof token.arg!="string"&&(token.arg=""+token.arg);var tenless=length-10;while(token.arg.length<tenless)token.arg=token.rightJustify?token.arg+this._spaces10:this._spaces10+token.arg;var pad=length-token.arg.length;token.arg=token.rightJustify?token.arg+this._spaces10.substring(0,pad):this._spaces10.substring(0,pad)+token.arg}}),strLib.sprintf})