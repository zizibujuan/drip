//>>built
define("dojox/grid/bidi/_BidiMixin","../../main,dojo/_base/lang,../_Builder,dijit/_BidiSupport,../_Grid,../cells/_base,../cells/dijit".split(","),function(h,d,i,g,l,j,k){d.extend(l,{setCellNodeTextDirection:function(a,b,c){this.getCell(a).getNode(b).style.direction=c||""},getCellNodeTextDirection:function(a,b){return this.getCell(a).getNode(b).style.direction},_setTextDirAttr:function(a){this.textDir=a;this.render()}});d.extend(i._ContentBuilder,{_getTextDirStyle:function(a,b,c){var d=this.grid.getItem(c),
e="";"auto"===a&&(b=b.get?b.get(c,d):b.value||b.defaultValue)&&(a=g.prototype._checkContextual(b));return" direction:"+a+";"}});d.extend(i._HeaderBuilder,{_getTextDirStyle:function(a,b,c){"auto"===a&&(b=c||b.name||b.grid.getCellName(b))&&(a=g.prototype._checkContextual(b));return" direction:"+a+"; "}});d.extend(j.Cell,{LRE:"\u202a",RLE:"\u202b",PDF:"\u202c",KEY_HANDLER:'onkeyup=\' javascript:(function(){var target; if (event.target) target = event.target; else if (event.srcElement) target = event.srcElement; if(!target) return;var regExMatch = /[A-Za-z\u05d0-\u065f\u066a-\u06ef\u06fa-\u07ff\ufb1d-\ufdff\ufe70-\ufefc]/.exec(target.value);target.dir = regExMatch ? ( regExMatch[0] <= "z" ? "ltr" : "rtl" ) : target.dir ? target.dir : "ltr"; })();\'',
_getTextDirMarkup:function(a){var b="",c=this.textDir||this.grid.textDir;if(c){if("auto"===c)b=this.KEY_HANDLER,c=g.prototype._checkContextual(a);b+=" dir='"+c+"'; "}return b},formatEditing:function(a,b){this.needFormatNode(a,b);return'<input class="dojoxGridInput" '+this._getTextDirMarkup(a)+' type="text" value="'+a+'">'},_enforceTextDirWithUcc:function(a,b){a="auto"===a?g.prototype._checkContextual(b):a;return("rtl"===a?this.RLE:this.LRE)+b+this.PDF}});d.extend(j.Select,{_getValueCallOrig:h.grid.cells.Select.prototype.getValue,
getValue:function(a){if((a=this._getValueCallOrig(a))&&(this.textDir||this.grid.textDir))a=a.replace(/\u202A|\u202B|\u202C/g,"");return a},formatEditing:function(a,b){this.needFormatNode(a,b);for(var c=['<select dir = "'+(this.grid.isLeftToRight()?"ltr":"rtl")+'" class="dojoxGridSelect">'],d=0,e,f;void 0!==(e=this.options[d])&&void 0!==(f=this.values[d]);d++){f=f.replace?f.replace(/&/g,"&amp;").replace(/</g,"&lt;"):f;e=e.replace?e.replace(/&/g,"&amp;").replace(/</g,"&lt;"):e;if(this.textDir||this.grid.textDir)e=
this._enforceTextDirWithUcc(this.textDir||this.grid.textDir,e);c.push("<option",a==f?" selected":"",' value = "'+f+'"',">",e,"</option>")}c.push("</select>");return c.join("")}});d.extend(k.ComboBox,{getWidgetPropsCallOrig:h.grid.cells.ComboBox.prototype.getWidgetProps,getWidgetProps:function(a){a=this.getWidgetPropsCallOrig(a);if(this.textDir||this.grid.textDir)a.textDir=this.textDir||this.grid.textDir;return a}});d.extend(k._Widget,{getWidgetPropsCallOrig:h.grid.cells._Widget.prototype.getWidgetProps,
getWidgetProps:function(a){a=this.getWidgetPropsCallOrig(a);if(this.textDir||this.grid.textDir)a.textDir=this.textDir||this.grid.textDir;return a}})});