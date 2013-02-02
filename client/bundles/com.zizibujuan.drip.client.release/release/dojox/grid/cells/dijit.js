//>>built
define("dojox/grid/cells/dijit","dojo/_base/kernel,../../main,dojo/_base/declare,dojo/_base/array,dojo/_base/lang,dojo/_base/json,dojo/_base/connect,dojo/_base/sniff,dojo/dom,dojo/dom-attr,dojo/dom-construct,dojo/dom-style,dojo/dom-geometry,dojo/data/ItemFileReadStore,dijit/form/DateTextBox,dijit/form/TimeTextBox,dijit/form/ComboBox,dijit/form/CheckBox,dijit/form/TextBox,dijit/form/NumberSpinner,dijit/form/NumberTextBox,dijit/form/CurrencyTextBox,dijit/form/HorizontalSlider,dijit/form/_TextBoxMixin,dijit/Editor,../util,./_base".split(","),
function(n,f,g,s,d,o,z,p,t,h,u,v,A,w,j,B,k,l,x,C,D,E,F,y,m,q,r){var f={},e=f._Widget=g("dojox.grid.cells._Widget",r,{widgetClass:x,constructor:function(){this.widget=null;if("string"==typeof this.widgetClass)n.deprecated("Passing a string to widgetClass is deprecated","pass the widget class object instead","2.0"),this.widgetClass=d.getObject(this.widgetClass)},formatEditing:function(a,b){this.needFormatNode(a,b);return"<div></div>"},getValue:function(){return this.widget.get("value")},_unescapeHTML:function(a){return a&&
a.replace&&this.grid.escapeHTMLInData?a.replace(/&lt;/g,"<").replace(/&amp;/g,"&"):a},setValue:function(a,b){if(this.widget&&this.widget.set)if(b=this._unescapeHTML(b),this.widget.onLoadDeferred){var c=this;this.widget.onLoadDeferred.addCallback(function(){c.widget.set("value",null===b?"":b)})}else this.widget.set("value",b);else this.inherited(arguments)},getWidgetProps:function(a){return d.mixin({dir:this.dir,lang:this.lang},this.widgetProps||{},{constraints:d.mixin({},this.constraint)||{},required:(this.constraint||
{}).required,value:this._unescapeHTML(a)})},createWidget:function(a,b){return new this.widgetClass(this.getWidgetProps(b),a)},attachWidget:function(a,b,c){a.appendChild(this.widget.domNode);this.setValue(c,b)},formatNode:function(a,b,c){if(!this.widgetClass)return b;this.widget?this.attachWidget.apply(this,arguments):this.widget=this.createWidget.apply(this,arguments);this.sizeWidget.apply(this,arguments);this.grid.views.renormalizeRow(c);this.grid.scroller.rowHeightChanged(c,!0);this.focus()},sizeWidget:function(a,
b,c){a=this.getNode(c);n.marginBox(this.widget.domNode,{w:v.get(a,"width")})},focus:function(){this.widget&&setTimeout(d.hitch(this.widget,function(){q.fire(this,"focus");this.focusNode&&"INPUT"===this.focusNode.tagName&&y.selectInputText(this.focusNode)}),0)},_finish:function(a){this.inherited(arguments);q.removeNode(this.widget.domNode);p("ie")&&t.setSelectable(this.widget.domNode,!0)}});e.markupFactory=function(a,b){r.markupFactory(a,b);var c=d.trim(h.get(a,"widgetProps")||""),i=d.trim(h.get(a,
"constraint")||""),e=d.trim(h.get(a,"widgetClass")||"");if(c)b.widgetProps=o.fromJson(c);if(i)b.constraint=o.fromJson(i);if(e)b.widgetClass=d.getObject(e)};k=f.ComboBox=g("dojox.grid.cells.ComboBox",e,{widgetClass:k,getWidgetProps:function(a){var b=[];s.forEach(this.options,function(a){b.push({name:a,value:a})});var c=new w({data:{identifier:"name",items:b}});return d.mixin({},this.widgetProps||{},{value:a,store:c})},getValue:function(){var a=this.widget;a.set("displayedValue",a.get("displayedValue"));
return a.get("value")}});k.markupFactory=function(a,b){e.markupFactory(a,b);var c=d.trim(h.get(a,"options")||"");if(c){var i=c.split(",");if(i[0]!=c)b.options=i}};j=f.DateTextBox=g("dojox.grid.cells.DateTextBox",e,{widgetClass:j,setValue:function(a,b){this.widget?this.widget.set("value",new Date(b)):this.inherited(arguments)},getWidgetProps:function(a){return d.mixin(this.inherited(arguments),{value:new Date(a)})}});j.markupFactory=function(a,b){e.markupFactory(a,b)};l=f.CheckBox=g("dojox.grid.cells.CheckBox",
e,{widgetClass:l,getValue:function(){return this.widget.checked},setValue:function(a,b){this.widget&&this.widget.attributeMap.checked?this.widget.set("checked",b):this.inherited(arguments)},sizeWidget:function(){}});l.markupFactory=function(a,b){e.markupFactory(a,b)};m=f.Editor=g("dojox.grid.cells.Editor",e,{widgetClass:m,getWidgetProps:function(){return d.mixin({},this.widgetProps||{},{height:this.widgetHeight||"100px"})},createWidget:function(a,b){var c=new this.widgetClass(this.getWidgetProps(b),
a);c.onLoadDeferred.then(d.hitch(this,"populateEditor"));return c},formatNode:function(a,b,c){this.content=b;this.inherited(arguments);if(p("mozilla")){var d=this.widget;d.open();this.widgetToolbar&&u.place(d.toolbar.domNode,d.editingArea,"before")}},populateEditor:function(){this.widget.set("value",this.content);this.widget.placeCursorAtEnd()}});m.markupFactory=function(a,b){e.markupFactory(a,b);var c=d.trim(h.get(a,"widgetHeight")||"");if(c)"auto"!=c&&"em"!=c.substr(-2)&&(c=parseInt(c,10)+"px"),
b.widgetHeight=c};return f});