//>>built
define("dojox/data/StoreExplorer",["dojo","dijit","dojox","dojo/require!dojox/grid/DataGrid,dojox/data/ItemExplorer,dijit/layout/BorderContainer,dijit/layout/ContentPane"],function(dojo,dijit,dojox){dojo.provide("dojox.data.StoreExplorer"),dojo.require("dojox.grid.DataGrid"),dojo.require("dojox.data.ItemExplorer"),dojo.require("dijit.layout.BorderContainer"),dojo.require("dijit.layout.ContentPane"),dojo.declare("dojox.data.StoreExplorer",dijit.layout.BorderContainer,{constructor:function(options){dojo.mixin(this,options)},store:null,columnWidth:"",stringQueries:!1,showAllColumns:!1,postCreate:function(){function addButton(name,action){var button=new dijit.form.Button({label:name});return contentPane.containerNode.appendChild(button.domNode),button.onClick=action,button}var self=this;this.inherited(arguments);var contentPane=(new dijit.layout.ContentPane({region:"top"})).placeAt(this),queryText=contentPane.containerNode.appendChild(document.createElement("span"));queryText.innerHTML="Enter query: &nbsp;",queryText.id="queryText";var queryTextBox=contentPane.containerNode.appendChild(document.createElement("input"));queryTextBox.type="text",queryTextBox.id="queryTextBox",addButton("Query",function(){var query=queryTextBox.value;self.setQuery(self.stringQueries?query:dojo.fromJson(query))}),contentPane.containerNode.appendChild(document.createElement("span")).innerHTML="&nbsp;&nbsp;&nbsp;";var createNewButton=addButton("Create New",dojo.hitch(this,"createNew")),deleteButton=addButton("Delete",function(){var items=grid.selection.getSelected();for(var i=0;i<items.length;i++)self.store.deleteItem(items[i])});this.setItemName=function(name){createNewButton.attr("label","<img style='width:12px; height:12px' src='"+dojo.moduleUrl("dijit.themes.tundra.images","dndCopy.png")+"' /> Create New "+name),deleteButton.attr("label","Delete "+name)},addButton("Save",function(){self.store.save({onError:function(error){alert(error)}}),self.tree.refreshItem()}),addButton("Revert",function(){self.store.revert()}),addButton("Add Column",function(){var columnName=prompt("Enter column name:","property");columnName&&(self.gridLayout.push({field:columnName,name:columnName,formatter:dojo.hitch(self,"_formatCell"),editable:!0}),self.grid.attr("structure",self.gridLayout))});var centerCP=(new dijit.layout.ContentPane({region:"center"})).placeAt(this),grid=this.grid=new dojox.grid.DataGrid({store:this.store});centerCP.attr("content",grid),grid.canEdit=function(inCell,inRowIndex){var value=this._copyAttr(inRowIndex,inCell.field);return!value||typeof value!="object"||value instanceof Date};var trailingCP=(new dijit.layout.ContentPane({region:"trailing",splitter:!0,style:"width: 300px"})).placeAt(this),tree=this.tree=new dojox.data.ItemExplorer({store:this.store});trailingCP.attr("content",tree),dojo.connect(grid,"onCellClick",function(){var selected=grid.selection.getSelected()[0];tree.setItem(selected)}),this.gridOnFetchComplete=grid._onFetchComplete,this.setStore(this.store)},setQuery:function(query,options){this.grid.setQuery(query,options)},_formatCell:function(value){return this.store.isItem(value)?this.store.getLabel(value)||this.store.getIdentity(value):value},setStore:function(store){function formatCell(value){return self._formatCell(value)}this.store=store;var self=this,grid=this.grid;grid._pending_requests[0]=!1;var defaultOnComplete=this.gridOnFetchComplete;grid._onFetchComplete=function(items,req){var layout=self.gridLayout=[],column,key,item,i,j,k,idAttributes=store.getIdentityAttributes();for(i=0;i<idAttributes.length;i++)key=idAttributes[i],layout.push({field:key,name:key,_score:100,formatter:formatCell,editable:!1});for(i=0;item=items[i++];){var keys=store.getAttributes(item);for(k=0;key=keys[k++];){var found=!1;for(j=0;column=layout[j++];)if(column.field==key){column._score++,found=!0;break}found||layout.push({field:key,name:key,_score:1,formatter:formatCell,styles:"white-space:nowrap; ",editable:!0})}}layout=layout.sort(function(a,b){return b._score-a._score});if(!self.showAllColumns)for(j=0;column=layout[j];j++)if(column._score<items.length/40*j){layout.splice(j,layout.length-j);break}for(j=0;column=layout[j++];)column.width=self.columnWidth||Math.round(100/layout.length)+"%";grid._onFetchComplete=defaultOnComplete,grid.attr("structure",layout);var retValue=defaultOnComplete.apply(this,arguments)},grid.setStore(store),this.queryOptions={cache:!0},this.tree.setStore(store)},createNew:function(){var props=prompt("Enter any properties (in JSON literal form) to put in the new item (passed to the newItem constructor):","{ }");if(props)try{this.store.newItem(dojo.fromJson(props))}catch(e){alert(e)}}})})