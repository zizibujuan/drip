//>>built
define("dijit/form/HorizontalRule",["dojo/_base/declare","../_Widget","../_TemplatedMixin"],function(d,e,f){return d("dijit.form.HorizontalRule",[e,f],{templateString:'<div class="dijitRuleContainer dijitRuleContainerH"></div>',count:3,container:"containerNode",ruleStyle:"",_positionPrefix:'<div class="dijitRuleMark dijitRuleMarkH" style="left:',_positionSuffix:"%;",_suffix:'"></div>',_genHTML:function(a){return this._positionPrefix+a+this._positionSuffix+this.ruleStyle+this._suffix},_isHorizontal:!0,
buildRendering:function(){this.inherited(arguments);var a;if(1==this.count)a=this._genHTML(50,0);else{var b,c=100/(this.count-1);if(!this._isHorizontal||this.isLeftToRight()){a=this._genHTML(0,0);for(b=1;b<this.count-1;b++)a+=this._genHTML(c*b,b);a+=this._genHTML(100,this.count-1)}else{a=this._genHTML(100,0);for(b=1;b<this.count-1;b++)a+=this._genHTML(100-c*b,b);a+=this._genHTML(0,this.count-1)}}this.domNode.innerHTML=a}})});