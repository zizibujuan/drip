//>>built
define("dojox/charting/bidi/Chart","dojox/main,dojo/_base/declare,dojo/_base/lang,dojo/dom-style,dojo/_base/array,dojo/sniff,dojo/dom,dojo/dom-construct,dojox/gfx,dojox/gfx/_gfxBidiSupport,../axis2d/common,dojox/string/BidiEngine,dojox/lang/functional,dojo/dom-attr,./_bidiutils".split(","),function(k,l,m,d,e,g,r,h,f,s,i,n,o,j,p){var q=new n;m.getObject("charting",!0,k);return l(null,{textDir:"",dir:"",isMirrored:!1,getTextDir:function(a){(a="auto"==this.textDir?q.checkContextual(a):this.textDir)||
(a=d.get(this.node,"direction"));return a},postscript:function(a,b){var c=b?b.textDir?/^(ltr|rtl|auto)$/.test(b.textDir)?b.textDir:null:"":"";this.textDir=c=c?c:d.get(this.node,"direction");this.surface.textDir=c;this.htmlElementsRegistry=[];this.truncatedLabelsRegistry=[];c="ltr";j.has(a,"direction")&&(c=j.get(a,"direction"));this.setDir(b?b.dir?b.dir:c:c)},setTextDir:function(a){if(a==this.textDir)return this;if(null!=(/^(ltr|rtl|auto)$/.test(a)?a:null)){this.textDir=a;this.surface.setTextDir(a);
this.truncatedLabelsRegistry&&"auto"==a&&e.forEach(this.truncatedLabelsRegistry,function(a){var b=this.getTextDir(a.label);a.element.textDir!=b&&a.element.setShape({textDir:b})},this);var b=o.keys(this.axes);if(0<b.length){if(e.forEach(b,function(a){a=this.axes[a];if(a.htmlElements[0])a.dirty=!0,a.render(this.dim,this.offsets)},this),this.title){var b="canvas"==f.renderer||!g("ie")&&!g("opera")?"html":"gfx",c=f.normalizedLength(f.splitFontString(this.titleFont).size);h.destroy(this.chartTitle);this.chartTitle=
null;this.chartTitle=i.createText[b](this,this.surface,this.dim.width/2,"top"==this.titlePos?c+this.margins.t:this.dim.height-this.margins.b,"middle",this.title,this.titleFont,this.titleFontColor)}}else e.forEach(this.htmlElementsRegistry,function(b){var c="auto"==a?this.getTextDir(b[4]):a;b[0].children[0]&&b[0].children[0].dir!=c&&(h.destroy(b[0].children[0]),b[0].children[0]=i.createText.html(this,this.surface,b[1],b[2],b[3],b[4],b[5],b[6]).children[0])},this)}return this},setDir:function(a){if("rtl"==
a||"ltr"==a){if(this.dir!=a)this.dirty=this.isMirrored=!0;this.dir=a}return this},isRightToLeft:function(){return"rtl"==this.dir},applyMirroring:function(a,b,c){p.reverseMatrix(a,b,c,"rtl"==this.dir);d.set(this.node,"direction","ltr");return this},formatTruncatedLabel:function(a,b,c){this.truncateBidi(a,b,c)},truncateBidi:function(a,b,c){"gfx"==c&&(this.truncatedLabelsRegistry.push({element:a,label:b}),"auto"==this.textDir&&a.setShape({textDir:this.getTextDir(b)}));if("html"==c&&"auto"==this.textDir)a.children[0].dir=
this.getTextDir(b)},render:function(){this.inherited(arguments);this.isMirrored=!1;return this},_resetLeftBottom:function(a){if(a.vertical&&this.isMirrored)a.opt.leftBottom=!a.opt.leftBottom}})});