//>>built
require({cache:{"url:dijit/templates/TreeNode.html":'<div class="dijitTreeNode" role="presentation"\n\t><div data-dojo-attach-point="rowNode" class="dijitTreeRow" role="presentation"\n\t\t><img src="${_blankGif}" alt="" data-dojo-attach-point="expandoNode" class="dijitTreeExpando" role="presentation"\n\t\t/><span data-dojo-attach-point="expandoNodeText" class="dijitExpandoText" role="presentation"\n\t\t></span\n\t\t><span data-dojo-attach-point="contentNode"\n\t\t\tclass="dijitTreeContent" role="presentation">\n\t\t\t<img src="${_blankGif}" alt="" data-dojo-attach-point="iconNode" class="dijitIcon dijitTreeIcon" role="presentation"\n\t\t\t/><span data-dojo-attach-point="labelNode,focusNode" class="dijitTreeLabel" role="treeitem" tabindex="-1" aria-selected="false"></span>\n\t\t</span\n\t></div>\n\t<div data-dojo-attach-point="containerNode" class="dijitTreeNodeContainer" role="presentation" style="display: none;"></div>\n</div>\n',
"url:dijit/templates/Tree.html":'<div role="tree">\n\t<div class="dijitInline dijitTreeIndent" style="position: absolute; top: -9999px" data-dojo-attach-point="indentDetector"></div>\n\t<div class="dijitTreeExpando dijitTreeExpandoLoading" data-dojo-attach-point="rootLoadingIndicator"></div>\n\t<div data-dojo-attach-point="containerNode" class="dijitTreeContainer" role="presentation">\n\t</div>\n</div>\n'}});
define("dijit/Tree","dojo/_base/array,dojo/aspect,dojo/_base/connect,dojo/cookie,dojo/_base/declare,dojo/Deferred,dojo/promise/all,dojo/dom,dojo/dom-class,dojo/dom-geometry,dojo/dom-style,dojo/errors/create,dojo/fx,dojo/has,dojo/_base/kernel,dojo/keys,dojo/_base/lang,dojo/on,dojo/topic,dojo/touch,dojo/when,./a11yclick,./focus,./registry,./_base/manager,./_Widget,./_TemplatedMixin,./_Container,./_Contained,./_CssStateMixin,./_KeyNavMixin,dojo/text!./templates/TreeNode.html,dojo/text!./templates/Tree.html,./tree/TreeStoreModel,./tree/ForestStoreModel,./tree/_dndSelector,dojo/query!css2".split(","),function(e,
l,P,s,t,m,n,u,i,v,q,E,w,x,r,Q,d,j,F,y,G,H,I,o,z,A,B,C,J,D,K,L,M,R,N,O){function f(a){return d.delegate(a.promise||a,{addCallback:function(a){this.then(a)},addErrback:function(a){this.otherwise(a)}})}var p=t("dijit._TreeNode",[A,B,C,J,D],{item:null,isTreeNode:!0,label:"",_setLabelAttr:{node:"labelNode",type:"innerText"},isExpandable:null,isExpanded:!1,state:"NotLoaded",templateString:L,baseClass:"dijitTreeNode",cssStateNodes:{rowNode:"dijitTreeRow"},_setTooltipAttr:{node:"rowNode",type:"attribute",
attribute:"title"},buildRendering:function(){this.inherited(arguments);this._setExpando();this._updateItemClasses(this.item);this.isExpandable&&this.labelNode.setAttribute("aria-expanded",this.isExpanded);this.setSelected(!1)},_setIndentAttr:function(a){var b=Math.max(a,0)*this.tree._nodePixelIndent+"px";q.set(this.domNode,"backgroundPosition",b+" 0px");q.set(this.rowNode,this.isLeftToRight()?"paddingLeft":"paddingRight",b);e.forEach(this.getChildren(),function(b){b.set("indent",a+1)});this._set("indent",
a)},markProcessing:function(){this.state="Loading";this._setExpando(!0)},unmarkProcessing:function(){this._setExpando(!1)},_updateItemClasses:function(a){var b=this.tree,c=b.model;b._v10Compat&&a===c.root&&(a=null);this._applyClassAndStyle(a,"icon","Icon");this._applyClassAndStyle(a,"label","Label");this._applyClassAndStyle(a,"row","Row");this.tree._startPaint(!0)},_applyClassAndStyle:function(a,b,c){var h="_"+b+"Class",b=b+"Node",g=this[h];this[h]=this.tree["get"+c+"Class"](a,this.isExpanded);i.replace(this[b],
this[h]||"",g||"");q.set(this[b],this.tree["get"+c+"Style"](a,this.isExpanded)||{})},_updateLayout:function(){var a=this.getParent();!a||!a.rowNode||"none"==a.rowNode.style.display?i.add(this.domNode,"dijitTreeIsRoot"):i.toggle(this.domNode,"dijitTreeIsLast",!this.getNextSibling())},_setExpando:function(a){var b=["dijitTreeExpandoLoading","dijitTreeExpandoOpened","dijitTreeExpandoClosed","dijitTreeExpandoLeaf"],a=a?0:this.isExpandable?this.isExpanded?1:2:3;i.replace(this.expandoNode,b[a],b);this.expandoNodeText.innerHTML=
["*","-","+","*"][a]},expand:function(){if(this._expandDeferred)return f(this._expandDeferred);this._collapseDeferred&&(this._collapseDeferred.cancel(),delete this._collapseDeferred);this.isExpanded=!0;this.labelNode.setAttribute("aria-expanded","true");(this.tree.showRoot||this!==this.tree.rootNode)&&this.containerNode.setAttribute("role","group");i.add(this.contentNode,"dijitTreeContentExpanded");this._setExpando();this._updateItemClasses(this.item);this==this.tree.rootNode&&this.tree.showRoot&&
this.tree.domNode.setAttribute("aria-expanded","true");var a=w.wipeIn({node:this.containerNode,duration:z.defaultDuration}),b=this._expandDeferred=new m(function(){a.stop()});l.after(a,"onEnd",function(){b.resolve(!0)},!0);a.play();return f(b)},collapse:function(){if(this._collapseDeferred)return f(this._collapseDeferred);this._expandDeferred&&(this._expandDeferred.cancel(),delete this._expandDeferred);this.isExpanded=!1;this.labelNode.setAttribute("aria-expanded","false");this==this.tree.rootNode&&
this.tree.showRoot&&this.tree.domNode.setAttribute("aria-expanded","false");i.remove(this.contentNode,"dijitTreeContentExpanded");this._setExpando();this._updateItemClasses(this.item);var a=w.wipeOut({node:this.containerNode,duration:z.defaultDuration}),b=this._collapseDeferred=new m(function(){a.stop()});l.after(a,"onEnd",function(){b.resolve(!0)},!0);a.play();return f(b)},indent:0,setChildItems:function(a){var b=this.tree,c=b.model,h=[],g=this.getChildren();e.forEach(g,function(a){C.prototype.removeChild.call(this,
a)},this);this.defer(function(){e.forEach(g,function(a){if(!a._destroyed&&!a.getParent()){b.dndController.removeTreeNode(a);var h=function(a){var g=c.getIdentity(a.item),d=b._itemNodesMap[g];1==d.length?delete b._itemNodesMap[g]:(g=e.indexOf(d,a),-1!=g&&d.splice(g,1));e.forEach(a.getChildren(),h)};h(a);if(b.persist){var g=e.map(a.getTreePath(),function(a){return b.model.getIdentity(a)}).join("/"),d;for(d in b._openedNodes)d.substr(0,g.length)==g&&delete b._openedNodes[d];b._saveExpandedNodes()}a.destroyRecursive()}})});
this.state="Loaded";a&&0<a.length?(this.isExpandable=!0,e.forEach(a,function(a){var g=c.getIdentity(a),d=b._itemNodesMap[g],e;if(d)for(var f=0;f<d.length;f++)if(d[f]&&!d[f].getParent()){e=d[f];e.set("indent",this.indent+1);break}e||(e=this.tree._createTreeNode({item:a,tree:b,isExpandable:c.mayHaveChildren(a),label:b.getLabel(a),tooltip:b.getTooltip(a),ownerDocument:b.ownerDocument,dir:b.dir,lang:b.lang,textDir:b.textDir,indent:this.indent+1}),d?d.push(e):b._itemNodesMap[g]=[e]);this.addChild(e);(this.tree.autoExpand||
this.tree._state(e))&&h.push(b._expandNode(e))},this),e.forEach(this.getChildren(),function(a){a._updateLayout()})):this.isExpandable=!1;this._setExpando&&this._setExpando(!1);this._updateItemClasses(this.item);a=n(h);this.tree._startPaint(a);return f(a)},getTreePath:function(){for(var a=this,b=[];a&&a!==this.tree.rootNode;)b.unshift(a.item),a=a.getParent();b.unshift(this.tree.rootNode.item);return b},getIdentity:function(){return this.tree.model.getIdentity(this.item)},removeChild:function(a){this.inherited(arguments);
var b=this.getChildren();if(0==b.length)this.isExpandable=!1,this.collapse();e.forEach(b,function(a){a._updateLayout()})},makeExpandable:function(){this.isExpandable=!0;this._setExpando(!1)},setSelected:function(a){this.labelNode.setAttribute("aria-selected",a?"true":"false");i.toggle(this.rowNode,"dijitTreeRowSelected",a)},focus:function(){I.focus(this.focusNode)}});x("dojo-bidi")&&p.extend({_setTextDirAttr:function(a){if(a&&(this.textDir!=a||!this._created))this._set("textDir",a),this.applyTextDir(this.labelNode),
e.forEach(this.getChildren(),function(b){b.set("textDir",a)},this)}});var k=t("dijit.Tree",[A,K,B,D],{baseClass:"dijitTree",store:null,model:null,query:null,label:"",showRoot:!0,childrenAttr:["children"],paths:[],path:[],selectedItems:null,selectedItem:null,openOnClick:!1,openOnDblClick:!1,templateString:M,persist:!0,autoExpand:!1,dndController:O,dndParams:"onDndDrop,itemCreator,onDndCancel,checkAcceptance,checkItemAcceptance,dragThreshold,betweenThreshold".split(","),onDndDrop:null,itemCreator:null,
onDndCancel:null,checkAcceptance:null,checkItemAcceptance:null,dragThreshold:5,betweenThreshold:0,_nodePixelIndent:19,_publish:function(a,b){F.publish(this.id,d.mixin({tree:this,event:a},b||{}))},postMixInProperties:function(){this.tree=this;if(this.autoExpand)this.persist=!1;this._itemNodesMap={};if(!this.cookieName&&this.id)this.cookieName=this.id+"SaveStateCookie";this.expandChildrenDeferred=new m;this.pendingCommandsPromise=this.expandChildrenDeferred.promise;this.inherited(arguments)},postCreate:function(){this._initState();
var a=this;this.own(j(this.containerNode,j.selector(".dijitTreeNode",y.enter),function(b){a._onNodeMouseEnter(o.byNode(this),b)}),j(this.containerNode,j.selector(".dijitTreeNode",y.leave),function(b){a._onNodeMouseLeave(o.byNode(this),b)}),j(this.containerNode,H,function(b){var c=o.getEnclosingWidget(b.target);c.isInstanceOf(p)&&a._onClick(c,b)}),j(this.containerNode,j.selector(".dijitTreeNode","dblclick"),function(b){a._onDblClick(o.byNode(this),b)}));this.model||this._store2model();this.own(l.after(this.model,
"onChange",d.hitch(this,"_onItemChange"),!0),l.after(this.model,"onChildrenChange",d.hitch(this,"_onItemChildrenChange"),!0),l.after(this.model,"onDelete",d.hitch(this,"_onItemDelete"),!0));this.inherited(arguments);if(this.dndController){if(d.isString(this.dndController))this.dndController=d.getObject(this.dndController);for(var b={},c=0;c<this.dndParams.length;c++)this[this.dndParams[c]]&&(b[this.dndParams[c]]=this[this.dndParams[c]]);this.dndController=new this.dndController(this,b)}this._load();
this.onLoadDeferred=f(this.pendingCommandsPromise);this.onLoadDeferred.then(d.hitch(this,"onLoad"))},_store2model:function(){this._v10Compat=!0;r.deprecated("Tree: from version 2.0, should specify a model object rather than a store/query");var a={id:this.id+"_ForestStoreModel",store:this.store,query:this.query,childrenAttrs:this.childrenAttr};if(this.params.mayHaveChildren)a.mayHaveChildren=d.hitch(this,"mayHaveChildren");if(this.params.getItemChildren)a.getChildren=d.hitch(this,function(a,c,h){this.getItemChildren(this._v10Compat&&
a===this.model.root?null:a,c,h)});this.model=new N(a);this.showRoot=Boolean(this.label)},onLoad:function(){},_load:function(){this.model.getRoot(d.hitch(this,function(a){var b=this.rootNode=this.tree._createTreeNode({item:a,tree:this,isExpandable:!0,label:this.label||this.getLabel(a),textDir:this.textDir,indent:this.showRoot?0:-1});this.showRoot?(this.domNode.setAttribute("aria-multiselectable",!this.dndController.singular),this.rootLoadingIndicator.style.display="none"):(b.rowNode.style.display=
"none",this.domNode.setAttribute("role","presentation"),this.domNode.removeAttribute("aria-expanded"),this.domNode.removeAttribute("aria-multiselectable"),this["aria-label"]?(b.containerNode.setAttribute("aria-label",this["aria-label"]),this.domNode.removeAttribute("aria-label")):this["aria-labelledby"]&&(b.containerNode.setAttribute("aria-labelledby",this["aria-labelledby"]),this.domNode.removeAttribute("aria-labelledby")),b.labelNode.setAttribute("role","presentation"),b.containerNode.setAttribute("role",
"tree"),b.containerNode.setAttribute("aria-expanded","true"),b.containerNode.setAttribute("aria-multiselectable",!this.dndController.singular));this.containerNode.appendChild(b.domNode);a=this.model.getIdentity(a);this._itemNodesMap[a]?this._itemNodesMap[a].push(b):this._itemNodesMap[a]=[b];b._updateLayout();this._expandNode(b).then(d.hitch(this,function(){this.rootLoadingIndicator.style.display="none";this.expandChildrenDeferred.resolve(!0)}))}),d.hitch(this,function(){}))},getNodesByItem:function(a){return!a?
[]:[].concat(this._itemNodesMap[d.isString(a)?a:this.model.getIdentity(a)])},_setSelectedItemAttr:function(a){this.set("selectedItems",[a])},_setSelectedItemsAttr:function(a){var b=this;return this.pendingCommandsPromise=this.pendingCommandsPromise.always(d.hitch(this,function(){var c=e.map(a,function(a){return!a||d.isString(a)?a:b.model.getIdentity(a)}),h=[];e.forEach(c,function(a){h=h.concat(b._itemNodesMap[a]||[])});this.set("selectedNodes",h)}))},_setPathAttr:function(a){return a.length?this.set("paths",
[a]):this.set("paths",[])},_setPathsAttr:function(a){function b(a,d){var f=a.shift(),i=e.filter(d,function(a){return a.getIdentity()==f})[0];if(i)return a.length?c._expandNode(i).then(function(){return b(a,i.getChildren())}):i;throw new k.PathError("Could not expand path at "+f);}var c=this;return f(this.pendingCommandsPromise=this.pendingCommandsPromise.always(function(){return n(e.map(a,function(a){a=e.map(a,function(a){return d.isString(a)?a:c.model.getIdentity(a)});if(a.length)return b(a,[c.rootNode]);
throw new k.PathError("Empty path");}))}).then(function(a){c.set("selectedNodes",a)}))},_setSelectedNodeAttr:function(a){this.set("selectedNodes",[a])},_setSelectedNodesAttr:function(a){this.dndController.setSelection(a)},expandAll:function(){function a(c){return b._expandNode(c).then(function(){var b=e.filter(c.getChildren()||[],function(a){return a.isExpandable});return n(e.map(b,a))})}var b=this;return f(a(this.rootNode))},collapseAll:function(){function a(c){var d=e.filter(c.getChildren()||[],
function(a){return a.isExpandable}),d=n(e.map(d,a));return!c.isExpanded||c==b.rootNode&&!b.showRoot?d:d.then(function(){return b._collapseNode(c)})}var b=this;return f(a(this.rootNode))},mayHaveChildren:function(){},getItemChildren:function(){},getLabel:function(a){return this.model.getLabel(a)},getIconClass:function(a,b){return!a||this.model.mayHaveChildren(a)?b?"dijitFolderOpened":"dijitFolderClosed":"dijitLeaf"},getLabelClass:function(){},getRowClass:function(){},getIconStyle:function(){},getLabelStyle:function(){},
getRowStyle:function(){},getTooltip:function(){return""},_onDownArrow:function(a,b){var c=this._getNext(b);c&&c.isTreeNode&&this.focusNode(c)},_onUpArrow:function(a,b){var c=b.getPreviousSibling();if(c)for(b=c;b.isExpandable&&b.isExpanded&&b.hasChildren();)c=b.getChildren(),b=c[c.length-1];else if(c=b.getParent(),this.showRoot||c!==this.rootNode)b=c;b&&b.isTreeNode&&this.focusNode(b)},_onRightArrow:function(a,b){b.isExpandable&&!b.isExpanded?this._expandNode(b):b.hasChildren()&&(b=b.getChildren()[0])&&
b.isTreeNode&&this.focusNode(b)},_onLeftArrow:function(a,b){if(b.isExpandable&&b.isExpanded)this._collapseNode(b);else{var c=b.getParent();c&&c.isTreeNode&&(this.showRoot||c!==this.rootNode)&&this.focusNode(c)}},focusLastChild:function(){var a=this._getLast();a&&a.isTreeNode&&this.focusNode(a)},_getFirst:function(){return this.showRoot?this.rootNode:this.rootNode.getChildren()[0]},_getLast:function(){for(var a=this.rootNode;a.isExpanded;){var b=a.getChildren();if(!b.length)break;a=b[b.length-1]}return a},
_getNext:function(a){if(a.isExpandable&&a.isExpanded&&a.hasChildren())return a.getChildren()[0];for(;a&&a.isTreeNode;){var b=a.getNextSibling();if(b)return b;a=a.getParent()}return null},childSelector:".dijitTreeRow",isExpandoNode:function(a,b){return u.isDescendant(a,b.expandoNode)||u.isDescendant(a,b.expandoNodeText)},_onClick:function(a,b){var c=this.isExpandoNode(b.target,a);this.openOnClick&&a.isExpandable||c?a.isExpandable&&this._onExpandoClick({node:a}):(this._publish("execute",{item:a.item,
node:a,evt:b}),this.onClick(a.item,a,b),this.focusNode(a));b.stopPropagation();b.preventDefault()},_onDblClick:function(a,b){var c=b.target,c=c==a.expandoNode||c==a.expandoNodeText;this.openOnDblClick&&a.isExpandable||c?a.isExpandable&&this._onExpandoClick({node:a}):(this._publish("execute",{item:a.item,node:a,evt:b}),this.onDblClick(a.item,a,b),this.focusNode(a));b.stopPropagation();b.preventDefault()},_onExpandoClick:function(a){a=a.node;this.focusNode(a);a.isExpanded?this._collapseNode(a):this._expandNode(a)},
onClick:function(){},onDblClick:function(){},onOpen:function(){},onClose:function(){},_getNextNode:function(a){r.deprecated(this.declaredClass+"::_getNextNode(node) is deprecated. Use _getNext(node) instead.","","2.0");return this._getNext(a)},_getRootOrFirstNode:function(){r.deprecated(this.declaredClass+"::_getRootOrFirstNode() is deprecated. Use _getFirst() instead.","","2.0");return this._getFirst()},_collapseNode:function(a){a._expandNodeDeferred&&delete a._expandNodeDeferred;if("Loading"!=a.state&&
a.isExpanded){var b=a.collapse();this.onClose(a.item,a);this._state(a,!1);this._startPaint(b);return b}},_expandNode:function(a){if(a._expandNodeDeferred)return a._expandNodeDeferred;var b=this.model,c=a.item;if(!a._loadDeferred)a.markProcessing(),a._loadDeferred=new m,b.getChildren(c,function(b){a.unmarkProcessing();a.setChildItems(b).then(function(){a._loadDeferred.resolve(b)})},function(b){a._loadDeferred.reject(b)});b=a._loadDeferred.then(d.hitch(this,function(){var b=a.expand();this.onOpen(a.item,
a);this._state(a,!0);return b}));this._startPaint(b);return b},focusNode:function(a){this.focusChild(a)},_onNodeMouseEnter:function(){},_onNodeMouseLeave:function(){},_onItemChange:function(a){var b=this._itemNodesMap[this.model.getIdentity(a)];if(b){var c=this.getLabel(a),d=this.getTooltip(a);e.forEach(b,function(b){b.set({item:a,label:c,tooltip:d});b._updateItemClasses(a)})}},_onItemChildrenChange:function(a,b){var c=this._itemNodesMap[this.model.getIdentity(a)];c&&e.forEach(c,function(a){a.setChildItems(b)})},
_onItemDelete:function(a){var a=this.model.getIdentity(a),b=this._itemNodesMap[a];b&&(e.forEach(b,function(a){this.dndController.removeTreeNode(a);var b=a.getParent();b&&b.removeChild(a);a.destroyRecursive()},this),delete this._itemNodesMap[a])},_initState:function(){this._openedNodes={};if(this.persist&&this.cookieName){var a=s(this.cookieName);a&&e.forEach(a.split(","),function(a){this._openedNodes[a]=!0},this)}},_state:function(a,b){if(!this.persist)return!1;var c=e.map(a.getTreePath(),function(a){return this.model.getIdentity(a)},
this).join("/");if(1===arguments.length)return this._openedNodes[c];b?this._openedNodes[c]=!0:delete this._openedNodes[c];this._saveExpandedNodes()},_saveExpandedNodes:function(){if(this.persist&&this.cookieName){var a=[],b;for(b in this._openedNodes)a.push(b);s(this.cookieName,a.join(","),{expires:365})}},destroy:function(){this._curSearch&&(this._curSearch.timer.remove(),delete this._curSearch);this.rootNode&&this.rootNode.destroyRecursive();this.dndController&&!d.isString(this.dndController)&&
this.dndController.destroy();this.rootNode=null;this.inherited(arguments)},destroyRecursive:function(){this.destroy()},resize:function(a){a&&v.setMarginBox(this.domNode,a);this._nodePixelIndent=v.position(this.tree.indentDetector).w||this._nodePixelIndent;this.expandChildrenDeferred.then(d.hitch(this,function(){this.rootNode.set("indent",this.showRoot?0:-1);this._adjustWidths()}))},_outstandingPaintOperations:0,_startPaint:function(a){this._outstandingPaintOperations++;this._adjustWidthsTimer&&(this._adjustWidthsTimer.remove(),
delete this._adjustWidthsTimer);var b=d.hitch(this,function(){this._outstandingPaintOperations--;if(0>=this._outstandingPaintOperations&&!this._adjustWidthsTimer&&this._started)this._adjustWidthsTimer=this.defer("_adjustWidths")});G(a,b,b)},_adjustWidths:function(){this._adjustWidthsTimer&&(this._adjustWidthsTimer.remove(),delete this._adjustWidthsTimer);this.containerNode.style.width="auto";this.containerNode.style.width=this.domNode.scrollWidth>this.domNode.offsetWidth?"auto":"100%"},_createTreeNode:function(a){return new p(a)},
focus:function(){this.lastFocusedChild?this.focusNode(this.lastFocusedChild):this.focusFirstChild()}});x("dojo-bidi")&&k.extend({_setTextDirAttr:function(a){a&&this.textDir!=a&&(this._set("textDir",a),this.rootNode.set("textDir",a))}});k.PathError=E("TreePathError");k._TreeNode=p;return k});