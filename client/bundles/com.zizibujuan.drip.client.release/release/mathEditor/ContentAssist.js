//>>built
define("mathEditor/ContentAssist","dojo/_base/declare dojo/_base/array dojo/_base/lang dojo/on dojo/aspect dojo/dom-construct dojo/dom-class dojo/dom-style dijit/popup dijit/DropDownMenu dijit/MenuItem mathEditor/mathContentAssist".split(" "),function(k,g,e,l,m,q,r,s,f,n,p,h){return k("mathEditor.ContentAssist",n,{proposals:null,view:null,cacheString:"",opened:!1,postCreate:function(){this.inherited(arguments);this.state=2;l(this.view.contentDiv,"mousedown",e.hitch(this,function(a){this.opened&&f.close(this)}));
m.after(this.view.model,"onChanging",e.hitch(this,this._onModelChanging),!0)},_onModelChanging:function(a){var b=a.data;if(!(null==b||""==b)&&1!==this.state)b=this.show(b),a.newData=b},startup:function(){this.inherited(arguments)},_scheduleOpen:function(a,b,c){view=this.view;var d=this;this._openTimer||(this._openTimer=this.defer(function(){this._openTimer.remove();delete this._openTimer;f.open({popup:a,x:b,y:c,onExecute:function(){f.close(a);view.focus();d.opened=!1},onCancel:function(){f.close(a);
d.opened=!1;view.focus()},onClose:function(){view.focus();d.opened=!1}});this.opened=!0;a.select()},0))},_open:function(){var a=this.view.getCursorPosition();this._scheduleOpen(this,a.x,a.y);this.opened=!0},_clear:function(){var a=this.getChildren();g.forEach(a,e.hitch(this,function(a,c){this.removeChild(a)}))},_setProposals:function(a){this._clear();this.proposals=a;g.forEach(a,e.hitch(this,function(a,c){var d=new p({label:a.label+" ( \\"+a.input+" )",iconClass:a.iconClass});d.on("click",e.hitch(this,
this._onApplyProposal,a.map,a.nodeName));this.addChild(d)}))},show:function(a){if(!1==this.opened)this.cacheString=a;else{var b=h.getProposals(this.cacheString+a);this.cacheString=0==b.length?a:this.cacheString+a}b=h.getProposals(this.cacheString);this._setProposals(b);if(0<b.length){this._open();var c=b[0].map,d=b[0].single;if(!c||""===c||!d)c=a;return{data:c,nodeName:b[0].nodeName}}this.cacheString="";this.opened&&(f.close(this),this.opened=!1);return null},_onApplyProposal:function(a,b,c){this.apply(a,
b,this.cacheString.length,c)},apply:function(a,b,c,d){this.state=1;this.view.model.setData({data:a,nodeName:b,removeCount:c});this.state=2},enter:function(a){this.onItemClick(this.selectedChild,a)},select:function(){this.selectFirstChild()},selectFirstChild:function(){this.selectChild(this._getFirstSelectableChild())},selectPrev:function(){this.selectChild(this._getNextSelectableChild(this.selectedChild,-1),!0)},selectNext:function(){this.selectChild(this._getNextSelectableChild(this.selectedChild,
1))},_getFirstSelectableChild:function(){return this._getNextSelectableChild(null,1)},_getLastFocusableChild:function(){return this._getNextSelectableChild(null,-1)},_getNextSelectableChild:function(a,b){a&&(a=this._getSiblingOfChild(a,b));for(var c=this.getChildren(),d=0;d<c.length;d++){a||(a=c[0<b?0:c.length-1]);if(a.isFocusable())return a;a=this._getSiblingOfChild(a,b)}return null},selectChild:function(a,b){a&&(this.selectedChild&&a!==this.selectedChild&&this.selectedChild._setSelected(!1),this.selectedChild=
a,a._setSelected(!0))}})});
//@ sourceMappingURL=ContentAssist.js.map