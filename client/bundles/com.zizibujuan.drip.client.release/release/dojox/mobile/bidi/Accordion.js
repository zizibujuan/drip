//>>built
define("dojox/mobile/bidi/Accordion",["dojo/_base/declare","./common"],function(declare,common){return declare(null,{_setupChild:function(child){this.textDir&&(child.label=common.enforceTextDirWithUcc(child.label,this.textDir)),this.inherited(arguments)}})})