//>>built
define("doc/files/Blob","dojo/_base/declare dijit/_WidgetBase dijit/_TemplatedMixin dojo/text!doc/templates/FileDetail.html dojo/request/xhr dojo/_base/lang".split(" "),function(b,c,d,e,f,g){return b("doc.files.Blob",[c,d],{pathName:null,templateString:e,postCreate:function(){this.inherited(arguments);f.get(this.pathName,{handleAs:"json"}).then(g.hitch(this,function(a){debugger;marked.setOptions({gfm:!0,highlight:function(a,b){debugger;return hljs.highlight(b,a).value},langPrefix:"lang-"});this.blob.innerHTML=
marked(a.content);this.icon.className="icon-file-text";this.mode.innerHTML="\u6587\u6863";this.size.innerHTML=a.size}))}})});require({cache:{"url:doc/templates/FileDetail.html":'\x3cdiv\x3e\n\t\x3cdiv class\x3d"meta"\x3e\n\t\t\x3cdiv class\x3d"info"\x3e\n\t\t\t\x3ci data-dojo-attach-point\x3d"icon"\x3e\x3c/i\x3e\n\t\t\t\x3cspan data-dojo-attach-point\x3d"mode"\x3e\x3c/span\x3e\n\t\t\t\x3cspan data-dojo-attach-point\x3d"lineCount"\x3e\x3c/span\x3e\n\t\t\t\x3cspan data-dojo-attach-point\x3d"size"\x3e\x3c/span\x3e\n\t\t\x3c/div\x3e\n\t\x3c/div\x3e\n\t\x3cdiv class\x3d"blob" data-dojo-attach-point\x3d"blob"\x3e\x3c/div\x3e\n\x3c/div\x3e'}});
//@ sourceMappingURL=Blob.js.map