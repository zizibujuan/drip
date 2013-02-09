//>>built
define("dojo/request/registry",["require","../_base/array","./default!platform","./util"],function(require,array,fallbackProvider,util){function request(url,options){var matchers=providers.slice(0),i=0,matcher;while(matcher=matchers[i++])if(matcher(url,options))return matcher.request.call(null,url,options);return fallbackProvider.apply(null,arguments)}function createMatcher(match,provider){var matcher;return provider?(match.test?matcher=function(url){return match.test(url)}:match.apply&&match.call?matcher=function(){return match.apply(null,arguments)}:matcher=function(url){return url===match},matcher.request=provider):(matcher=function(){return!0},matcher.request=match),matcher}var providers=[];return request.register=function(url,provider,first){var matcher=createMatcher(url,provider);return providers[first?"unshift":"push"](matcher),{remove:function(){var idx;~(idx=array.indexOf(providers,matcher))&&providers.splice(idx,1)}}},request.load=function(id,parentRequire,loaded,config){id?require([id],function(fallback){fallbackProvider=fallback,loaded(request)}):loaded(request)},util.addCommonMethods(request),request})