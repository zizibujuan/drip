//>>built
define("dijit/_TemplatedMixin","dojo/cache,dojo/_base/declare,dojo/dom-construct,dojo/_base/lang,dojo/on,dojo/sniff,dojo/string,./_AttachMixin".split(","),function(k,l,g,h,m,n,j,o){var e=l("dijit._TemplatedMixin",o,{templateString:null,templatePath:null,_skipNodeCache:!1,searchContainerNode:!0,_stringRepl:function(a){var b=this.declaredClass,d=this;return j.substitute(a,this,function(a,c){"!"==c.charAt(0)&&(a=h.getObject(c.substr(1),!1,d));if("undefined"==typeof a)throw Error(b+" template:"+c);return null==
a?"":"!"==c.charAt(0)?a:a.toString().replace(/"/g,"&quot;")},this)},buildRendering:function(){if(!this._rendered){if(!this.templateString)this.templateString=k(this.templatePath,{sanitize:!0});var a=e.getCachedTemplate(this.templateString,this._skipNodeCache,this.ownerDocument),b;if(h.isString(a)){if(b=g.toDom(this._stringRepl(a),this.ownerDocument),1!=b.nodeType)throw Error("Invalid template: "+a);}else b=a.cloneNode(!0);this.domNode=b}this.inherited(arguments);this._rendered||this._fillContent(this.srcNodeRef);
this._rendered=!0},_fillContent:function(a){var b=this.containerNode;if(a&&b)for(;a.hasChildNodes();)b.appendChild(a.firstChild)}});e._templateCache={};e.getCachedTemplate=function(a,b,d){var i=e._templateCache,c=a,f=i[c];if(f){try{if(!f.ownerDocument||f.ownerDocument==(d||document))return f}catch(h){}g.destroy(f)}a=j.trim(a);if(b||a.match(/\$\{([^\}]+)\}/g))return i[c]=a;b=g.toDom(a,d);if(1!=b.nodeType)throw Error("Invalid template: "+a);return i[c]=b};n("ie")&&m(window,"unload",function(){var a=
e._templateCache,b;for(b in a){var d=a[b];"object"==typeof d&&g.destroy(d);delete a[b]}});return e});