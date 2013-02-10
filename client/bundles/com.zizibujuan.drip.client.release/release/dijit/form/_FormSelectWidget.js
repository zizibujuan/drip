//>>built
define("dijit/form/_FormSelectWidget",["dojo/_base/array","dojo/_base/Deferred","dojo/aspect","dojo/data/util/sorter","dojo/_base/declare","dojo/dom","dojo/dom-class","dojo/_base/kernel","dojo/_base/lang","dojo/query","dojo/when","dojo/store/util/QueryResults","./_FormValueWidget"],function(array,Deferred,aspect,sorter,declare,dom,domClass,kernel,lang,query,when,QueryResults,_FormValueWidget){var _FormSelectWidget=declare("dijit.form._FormSelectWidget",_FormValueWidget,{multiple:!1,options:null,store:null,query:null,queryOptions:null,labelAttr:"",onFetch:null,sortByLabel:!0,loadChildrenOnOpen:!1,onLoadDeferred:null,getOptions:function(valueOrIdx){var opts=this.options||[];return valueOrIdx==null?opts:lang.isArray(valueOrIdx)?array.map(valueOrIdx,"return this.getOptions(item);",this):(lang.isString(valueOrIdx)&&(valueOrIdx={value:valueOrIdx}),lang.isObject(valueOrIdx)&&(array.some(opts,function(option,idx){for(var a in valueOrIdx)if(!(a in option)||option[a]!=valueOrIdx[a])return!1;return valueOrIdx=idx,!0})||(valueOrIdx=-1)),valueOrIdx>=0&&valueOrIdx<opts.length?opts[valueOrIdx]:null)},addOption:function(option){array.forEach([].concat(option),function(i){i&&lang.isObject(i)&&this.options.push(i)},this),this._loadChildren()},removeOption:function(valueOrIdx){var oldOpts=this.getOptions([].concat(valueOrIdx));array.forEach(oldOpts,function(option){option&&(this.options=array.filter(this.options,function(node){return node.value!==option.value||node.label!==option.label}),this._removeOptionItem(option))},this),this._loadChildren()},updateOption:function(newOption){array.forEach([].concat(newOption),function(i){var oldOpt=this.getOptions({value:i.value}),k;if(oldOpt)for(k in i)oldOpt[k]=i[k]},this),this._loadChildren()},setStore:function(store,selectedValue,fetchArgs){var oStore=this.store;fetchArgs=fetchArgs||{};if(oStore!==store){var h;while(h=this._notifyConnections.pop())h.remove();store.get||(lang.mixin(store,{_oldAPI:!0,get:function(id){var deferred=new Deferred;return this.fetchItemByIdentity({identity:id,onItem:function(object){deferred.resolve(object)},onError:function(error){deferred.reject(error)}}),deferred.promise},query:function(query,options){var deferred=new Deferred(function(){fetchHandle.abort&&fetchHandle.abort()});deferred.total=new Deferred;var fetchHandle=this.fetch(lang.mixin({query:query,onBegin:function(count){deferred.total.resolve(count)},onComplete:function(results){deferred.resolve(results)},onError:function(error){deferred.reject(error)}},options));return new QueryResults(deferred)}}),store.getFeatures()["dojo.data.api.Notification"]&&(this._notifyConnections=[aspect.after(store,"onNew",lang.hitch(this,"_onNewItem"),!0),aspect.after(store,"onDelete",lang.hitch(this,"_onDeleteItem"),!0),aspect.after(store,"onSet",lang.hitch(this,"_onSetItem"),!0)])),this._set("store",store)}return this.options&&this.options.length&&this.removeOption(this.options),this._queryRes&&this._queryRes.close&&this._queryRes.close(),fetchArgs.query&&(this._set("query",fetchArgs.query),this._set("queryOptions",fetchArgs.queryOptions)),store&&(this._loadingStore=!0,this.onLoadDeferred=new Deferred,this._queryRes=store.query(this.query,this.queryOptions),when(this._queryRes,lang.hitch(this,function(items){if(this.sortByLabel&&!fetchArgs.sort&&items.length)if(items[0].getValue)items.sort(sorter.createSortFunction([{attribute:store.getLabelAttributes(items[0])[0]}],store));else{var labelAttr=this.labelAttr;items.sort(function(a,b){return a[labelAttr]>b[labelAttr]?1:b[labelAttr]>a[labelAttr]?-1:0})}fetchArgs.onFetch&&(items=fetchArgs.onFetch.call(this,items,fetchArgs)),array.forEach(items,function(i){this._addOptionForItem(i)},this),this._queryRes.observe&&this._queryRes.observe(lang.hitch(this,function(object,deletedFrom,insertedInto){deletedFrom==insertedInto?this._onSetItem(object):(deletedFrom!=-1&&this._onDeleteItem(object),insertedInto!=-1&&this._onNewItem(object))}),!0),this._loadingStore=!1,this.set("value","_pendingValue"in this?this._pendingValue:selectedValue),delete this._pendingValue,this.loadChildrenOnOpen?this._pseudoLoadChildren(items):this._loadChildren(),this.onLoadDeferred.resolve(!0),this.onSetStore()}),function(err){0,this.onLoadDeferred.reject(err)})),oStore},_setValueAttr:function(newValue,priorityChange){this._onChangeActive||(priorityChange=null);if(this._loadingStore){this._pendingValue=newValue;return}if(newValue==null)return;lang.isArray(newValue)?newValue=array.map(newValue,function(value){return lang.isObject(value)?value:{value:value}}):lang.isObject(newValue)?newValue=[newValue]:newValue=[{value:newValue}],newValue=array.filter(this.getOptions(newValue),function(i){return i&&i.value});var opts=this.getOptions()||[];!this.multiple&&(!newValue[0]||!newValue[0].value)&&!!opts.length&&(newValue[0]=opts[0]),array.forEach(opts,function(opt){opt.selected=array.some(newValue,function(v){return v.value===opt.value})});var val=array.map(newValue,function(opt){return opt.value});if(typeof val=="undefined"||typeof val[0]=="undefined")return;var disp=array.map(newValue,function(opt){return opt.label});this._setDisplay(this.multiple?disp:disp[0]),this.inherited(arguments,[this.multiple?val:val[0],priorityChange]),this._updateSelection()},_getDisplayedValueAttr:function(){var ret=array.map([].concat(this.get("selectedOptions")),function(v){return v&&"label"in v?v.label:v?v.value:null},this);return this.multiple?ret:ret[0]},_setDisplayedValueAttr:function(label){this.set("value",this.getOptions(typeof label=="string"?{label:label}:label))},_loadChildren:function(){if(this._loadingStore)return;array.forEach(this._getChildren(),function(child){child.destroyRecursive()}),array.forEach(this.options,this._addOptionItem,this),this._updateSelection()},_updateSelection:function(){this._set("value",this._getValueFromOpts());var val=[].concat(this.value);val&&val[0]&&array.forEach(this._getChildren(),function(child){var isSelected=array.some(val,function(v){return child.option&&v===child.option.value});domClass.toggle(child.domNode,this.baseClass.replace(/\s+|$/g,"SelectedOption "),isSelected),child.domNode.setAttribute("aria-selected",isSelected?"true":"false")},this)},_getValueFromOpts:function(){var opts=this.getOptions()||[];if(!this.multiple&&opts.length){var opt=array.filter(opts,function(i){return i.selected})[0];return opt&&opt.value?opt.value:(opts[0].selected=!0,opts[0].value)}return this.multiple?array.map(array.filter(opts,function(i){return i.selected}),function(i){return i.value})||[]:""},_onNewItem:function(item,parentInfo){(!parentInfo||!parentInfo.parent)&&this._addOptionForItem(item)},_onDeleteItem:function(item){var store=this.store;this.removeOption({value:store.getIdentity(item)})},_onSetItem:function(item){this.updateOption(this._getOptionObjForItem(item))},_getOptionObjForItem:function(item){var store=this.store,label=this.labelAttr&&this.labelAttr in item?item[this.labelAttr]:store.getLabel(item),value=label?store.getIdentity(item):null;return{value:value,label:label,item:item}},_addOptionForItem:function(item){var store=this.store;if(store.isItemLoaded&&!store.isItemLoaded(item)){store.loadItem({item:item,onItem:function(i){this._addOptionForItem(i)},scope:this});return}var newOpt=this._getOptionObjForItem(item);this.addOption(newOpt)},constructor:function(params){this._oValue=(params||{}).value||null,this._notifyConnections=[]},buildRendering:function(){this.inherited(arguments),dom.setSelectable(this.focusNode,!1)},_fillContent:function(){this.options||(this.options=this.srcNodeRef?query("> *",this.srcNodeRef).map(function(node){return node.getAttribute("type")==="separator"?{value:"",label:"",selected:!1,disabled:!1}:{value:node.getAttribute("data-"+kernel._scopeName+"-value")||node.getAttribute("value"),label:String(node.innerHTML),selected:node.getAttribute("selected")||!1,disabled:node.getAttribute("disabled")||!1}},this):[]),this.value?this.multiple&&typeof this.value=="string"&&this._set("value",this.value.split(",")):this._set("value",this._getValueFromOpts())},postCreate:function(){this.inherited(arguments),aspect.after(this,"onChange",lang.hitch(this,"_updateSelection"));var store=this.store;store&&(store.getIdentity||store.getFeatures()["dojo.data.api.Identity"])&&(this.store=null,this.setStore(store,this._oValue))},startup:function(){this._loadChildren(),this.inherited(arguments)},destroy:function(){var h;while(h=this._notifyConnections.pop())h.remove();this._queryRes&&this._queryRes.close&&this._queryRes.close(),this.inherited(arguments)},_addOptionItem:function(){},_removeOptionItem:function(){},_setDisplay:function(){},_getChildren:function(){return[]},_getSelectedOptionsAttr:function(){return this.getOptions({selected:!0})},_pseudoLoadChildren:function(){},onSetStore:function(){}});return _FormSelectWidget})