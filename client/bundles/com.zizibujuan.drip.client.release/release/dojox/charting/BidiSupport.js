//>>built
define("dojox/charting/BidiSupport","../main,dojo/_base/lang,dojo/dom-style,dojo/_base/array,dojo/sniff,dojo/dom,dojo/dom-construct,dojox/gfx,dojox/gfx/_gfxBidiSupport,./Chart,./axis2d/common,dojox/string/BidiEngine,dojox/lang/functional,dojo/dom-attr,./_bidiutils".split(","),function(d,e,i,f,m,p,q,j,k,n,l,r,s,o,t){var u=new r,d=e.getObject("charting",!0,d);e.extend(n,{textDir:"",dir:"",getTextDir:function(b){(b="auto"==this.textDir?u.checkContextual(b):this.textDir)||(b=i.get(this.node,"direction"));
return b},postscript:function(b,a){var c=a?a.textDir?/^(ltr|rtl|auto)$/.test(a.textDir)?a.textDir:null:"":"";this.textDir=c=c?c:i.get(this.node,"direction");this.surface.textDir=c;this.htmlElementsRegistry=[];this.truncatedLabelsRegistry=[];c="ltr";o.has(b,"direction")&&(c=o.get(b,"direction"));this.dir=a?a.dir?a.dir:c:c},setTextDir:function(b){if(b==this.textDir)return this;if(null!=(/^(ltr|rtl|auto)$/.test(b)?b:null)){this.textDir=b;this.surface.setTextDir(b);this.truncatedLabelsRegistry&&"auto"==
b&&f.forEach(this.truncatedLabelsRegistry,function(b){var a=this.getTextDir(b.label);b.element.textDir!=a&&b.element.setShape({textDir:a})},this);var a=s.keys(this.axes);if(0<a.length){if(f.forEach(a,function(b){b=this.axes[b];if(b.htmlElements[0])b.dirty=!0,b.render(this.dim,this.offsets)},this),this.title){var a="canvas"==j.renderer||!m("ie")&&!m("opera")?"html":"gfx",c=j.normalizedLength(j.splitFontString(this.titleFont).size);q.destroy(this.chartTitle);this.chartTitle=null;this.chartTitle=l.createText[a](this,
this.surface,this.dim.width/2,"top"==this.titlePos?c+this.margins.t:this.dim.height-this.margins.b,"middle",this.title,this.titleFont,this.titleFontColor)}}else f.forEach(this.htmlElementsRegistry,function(a){var c="auto"==b?this.getTextDir(a[4]):b;a[0].children[0]&&a[0].children[0].dir!=c&&(p.destroy(a[0].children[0]),a[0].children[0]=l.createText.html(this,this.surface,a[1],a[2],a[3],a[4],a[5],a[6]).children[0])},this)}},setDir:function(b){if("rtl"==b||"ltr"==b)this.dir=b;return this},isRightToLeft:function(){return"rtl"==
this.dir},applyMirroring:function(b,a,c){this.isRightToLeft()&&t.reverseMatrix(b,a,c);i.set(this.node,"direction","ltr");return this},truncateBidi:function(b,a,c){"gfx"==c&&(this.truncatedLabelsRegistry.push({element:b,label:a}),"auto"==this.textDir&&b.setShape({textDir:this.getTextDir(a)}));if("html"==c&&"auto"==this.textDir)b.children[0].dir=this.getTextDir(a)}});k=function(b,a,c,d,g){var h;c?(h=b.prototype[a],b.prototype[a]=function(){var a;d&&(a=d.apply(this,arguments));a=h.apply(this,a);g&&(a=
g.call(this,a,arguments));return a}):(h=e.clone(b[a]),b[a]=function(){d&&d.apply(this,arguments);var a=h.apply(this,arguments);g&&g(a,arguments);return a})};d.axis2d&&d.axis2d.Default&&k(d.axis2d.Default,"labelTooltip",!0,function(b,a,c,d,g,h){var e="rtl"==i.get(a.node,"direction"),f="rtl"==a.getTextDir(c);f&&!e&&(c="<span dir='rtl'>"+c+"</span>");!f&&e&&(c="<span dir='ltr'>"+c+"</span>");return arguments},null);k(l.createText,"html",!1,null,function(b,a){a[0].htmlElementsRegistry.push([b,a[2],a[3],
a[4],a[5],a[6],a[7]])});return n});