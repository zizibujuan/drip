//>>built
define("doc/files/EditFileForm",["dojo/_base/declare","dojo/_base/lang","dojo/request/xhr","doc/files/FileForm"],function(b,c,d,e){return b("doc.files.EditFileForm",[e],{method:"PUT",errorMsg:"\u7f16\u8f91\u6587\u4ef6\u5931\u8d25",postCreate:function(){this.inherited(arguments);d.get(this.pathName).then(c.hitch(this,this._loadData),function(a){})},_loadData:function(a){this.editor.setValue(a.content)}})});
//@ sourceMappingURL=EditFileForm.js.map