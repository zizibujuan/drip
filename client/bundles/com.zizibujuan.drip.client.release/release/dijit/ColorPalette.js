//>>built
require({cache:{"url:dijit/templates/ColorPalette.html":'<div class="dijitInline dijitColorPalette" role="grid">\n\t<table dojoAttachPoint="paletteTableNode" class="dijitPaletteTable" cellSpacing="0" cellPadding="0" role="presentation">\n\t\t<tbody data-dojo-attach-point="gridNode"></tbody>\n\t</table>\n</div>\n'}});
define("dijit/ColorPalette","require,dojo/text!./templates/ColorPalette.html,./_Widget,./_TemplatedMixin,./_PaletteMixin,./hccss,dojo/i18n,dojo/_base/Color,dojo/_base/declare,dojo/dom-construct,dojo/string,dojo/i18n!dojo/nls/colors,dojo/colors".split(","),function(e,g,h,i,j,k,l,f,a,m,n){var b=a("dijit.ColorPalette",[h,i,j],{palette:"7x10",_palettes:{"7x10":["white,seashell,cornsilk,lemonchiffon,lightyellow,palegreen,paleturquoise,lightcyan,lavender,plum".split(","),"lightgray,pink,bisque,moccasin,khaki,lightgreen,lightseagreen,lightskyblue,cornflowerblue,violet".split(","),
"silver,lightcoral,sandybrown,orange,palegoldenrod,chartreuse,mediumturquoise,skyblue,mediumslateblue,orchid".split(","),"gray,red,orangered,darkorange,yellow,limegreen,darkseagreen,royalblue,slateblue,mediumorchid".split(","),"dimgray,crimson,chocolate,coral,gold,forestgreen,seagreen,blue,blueviolet,darkorchid".split(","),"darkslategray,firebrick,saddlebrown,sienna,olive,green,darkcyan,mediumblue,darkslateblue,darkmagenta".split(","),"black,darkred,maroon,brown,darkolivegreen,darkgreen,midnightblue,navy,indigo,purple".split(",")],
"3x4":[["white","lime","green","blue"],["silver","yellow","fuchsia","navy"],["gray","red","purple","black"]]},templateString:g,baseClass:"dijitColorPalette",_dyeFactory:function(o,d,c,a){return new this._dyeClass(o,d,c,a)},buildRendering:function(){this.inherited(arguments);this._dyeClass=a(b._Color,{palette:this.palette});this._preparePalette(this._palettes[this.palette],l.getLocalization("dojo","colors",this.lang))}});b._Color=a("dijit._Color",f,{template:"<span class='dijitInline dijitPaletteImg'><img src='${blankGif}' alt='${alt}' title='${title}' class='dijitColorPaletteSwatch' style='background-color: ${color}'/></span>",
hcTemplate:"<span class='dijitInline dijitPaletteImg' style='position: relative; overflow: hidden; height: 12px; width: 14px;'><img src='${image}' alt='${alt}' title='${title}' style='position: absolute; left: ${left}px; top: ${top}px; ${size}'/></span>",_imagePaths:{"7x10":e.toUrl("./themes/a11y/colors7x10.png"),"3x4":e.toUrl("./themes/a11y/colors3x4.png")},constructor:function(a,d,c,b){this._title=b;this._row=d;this._col=c;this.setColor(f.named[a])},getValue:function(){return this.toHex()},fillCell:function(a,
b){var c=n.substitute(k("highcontrast")?this.hcTemplate:this.template,{color:this.toHex(),blankGif:b,alt:this._title,title:this._title,image:this._imagePaths[this.palette].toString(),left:-20*this._col-5,top:-20*this._row-5,size:"7x10"==this.palette?"height: 145px; width: 206px":"height: 64px; width: 86px"});m.place(c,a)}});return b});