//>>built
define("dojo/cookie",["./_base/kernel","./regexp"],function(dojo,regexp){return dojo.cookie=function(name,value,props){var c=document.cookie,ret;if(arguments.length==1){var matches=c.match(new RegExp("(?:^|; )"+regexp.escapeString(name)+"=([^;]*)"));ret=matches?decodeURIComponent(matches[1]):undefined}else{props=props||{};var exp=props.expires;if(typeof exp=="number"){var d=new Date;d.setTime(d.getTime()+exp*24*60*60*1e3),exp=props.expires=d}exp&&exp.toUTCString&&(props.expires=exp.toUTCString()),value=encodeURIComponent(value);var updatedCookie=name+"="+value,propName;for(propName in props){updatedCookie+="; "+propName;var propValue=props[propName];propValue!==!0&&(updatedCookie+="="+propValue)}document.cookie=updatedCookie}return ret},dojo.cookie.isSupported=function(){return"cookieEnabled"in navigator||(this("__djCookieTest__","CookiesAllowed"),navigator.cookieEnabled=this("__djCookieTest__")=="CookiesAllowed",navigator.cookieEnabled&&this("__djCookieTest__","",{expires:-1})),navigator.cookieEnabled},dojo.cookie})