//>>built
define("dojox/mobile/bidi/Tooltip",["dojo/_base/array","dojo/_base/declare","./common"],function(c,d,b){return d(null,{postCreate:function(){this.inherited(arguments);this.textDir&&this._applyTextDirToTextElements()},buildRendering:function(){this.inherited(arguments);if(!this.isLeftToRight())this.arrow.style.left="0px"},_setTextDirAttr:function(a){if(a&&this.textDir!==a)this.textDir=a,this._applyTextDirToTextElements()},_applyTextDirToTextElements:function(){c.forEach(this.domNode.childNodes,function(a){a=
1===a.nodeType&&1===a.childNodes.length?a.firstChild:a;if(3===a.nodeType&&a.nodeValue&&-1!=a.nodeValue.search(/[.\S]/))a.nodeValue=b.removeUCCFromText(a.nodeValue),a.nodeValue=b.enforceTextDirWithUcc(a.nodeValue,this.textDir)},this)}})});