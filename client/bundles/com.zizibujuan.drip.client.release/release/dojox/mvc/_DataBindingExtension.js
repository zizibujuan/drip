//>>built
define("dojox/mvc/_DataBindingExtension",["dojo/_base/array","dojo/aspect","dojo/_base/lang","dijit/_WidgetBase","./_DataBindingMixin"],function(array,aspect,lang,WidgetBase,DataBindingMixin){lang.extend(WidgetBase,new DataBindingMixin),aspect.before(WidgetBase.prototype,"startup",function(){this._dbstartup()}),aspect.before(WidgetBase.prototype,"destroy",function(){this._modelWatchHandles&&array.forEach(this._modelWatchHandles,function(h){h.unwatch()}),this._viewWatchHandles&&array.forEach(this._viewWatchHandles,function(h){h.unwatch()})})})