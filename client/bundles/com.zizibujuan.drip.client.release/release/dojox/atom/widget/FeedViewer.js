//>>built
require({cache:{"url:dojox/atom/widget/templates/FeedViewer.html":'<div class="feedViewerContainer" dojoAttachPoint="feedViewerContainerNode">\n	<table cellspacing="0" cellpadding="0" class="feedViewerTable">\n		<tbody dojoAttachPoint="feedViewerTableBody" class="feedViewerTableBody">\n		</tbody>\n	</table>\n</div>\n',"url:dojox/atom/widget/templates/FeedViewerEntry.html":'<tr class="feedViewerEntry" dojoAttachPoint="entryNode" dojoAttachEvent="onclick:onClick">\n    <td class="feedViewerEntryUpdated" dojoAttachPoint="timeNode">\n    </td>\n    <td>\n        <table border="0" width="100%" dojoAttachPoint="titleRow">\n            <tr padding="0" border="0">\n                <td class="feedViewerEntryTitle" dojoAttachPoint="titleNode">\n                </td>\n                <td class="feedViewerEntryDelete" align="right">\n                    <span dojoAttachPoint="deleteButton" dojoAttachEvent="onclick:deleteEntry" class="feedViewerDeleteButton" style="display:none;">[delete]</span>\n                </td>\n            <tr>\n        </table>\n    </td>\n</tr>',"url:dojox/atom/widget/templates/FeedViewerGrouping.html":'<tr dojoAttachPoint="groupingNode" class="feedViewerGrouping">\n	<td colspan="2" dojoAttachPoint="titleNode" class="feedViewerGroupingTitle">\n	</td>\n</tr>'}}),define("dojox/atom/widget/FeedViewer",["dojo/_base/kernel","dojo/_base/lang","dojo/_base/array","dojo/_base/connect","dojo/_base/declare","dojo/dom-class","dijit/_Widget","dijit/_Templated","dijit/_Container","../io/Connection","dojo/text!./templates/FeedViewer.html","dojo/text!./templates/FeedViewerEntry.html","dojo/text!./templates/FeedViewerGrouping.html","dojo/i18n!./nls/FeedViewerEntry"],function(dojo,lang,arrayUtil,connect,declare,domClass,_Widget,_Templated,_Container,Connection,template,entryTemplate,groupingTemplate,i18nViewer){dojo.experimental("dojox.atom.widget.FeedViewer");var FeedViewer=declare("dojox.atom.widget.FeedViewer",[_Widget,_Templated,_Container],{feedViewerTableBody:null,feedViewerTable:null,entrySelectionTopic:"",url:"",xmethod:!1,localSaveOnly:!1,templateString:template,_feed:null,_currentSelection:null,_includeFilters:null,alertsEnabled:!1,postCreate:function(){this._includeFilters=[],this.entrySelectionTopic!==""&&(this._subscriptions=[dojo.subscribe(this.entrySelectionTopic,this,"_handleEvent")]),this.atomIO=new Connection,this.childWidgets=[]},startup:function(){this.containerNode=this.feedViewerTableBody;var children=this.getDescendants();for(var i in children){var child=children[i];child&&child.isFilter&&(this._includeFilters.push(new FeedViewer.CategoryIncludeFilter(child.scheme,child.term,child.label)),child.destroy())}this.url!==""&&this.setFeedFromUrl(this.url)},clear:function(){this.destroyDescendants()},setFeedFromUrl:function(url){if(url!==""){if(this._isRelativeURL(url)){var baseUrl="";url.charAt(0)!=="/"?baseUrl=this._calculateBaseURL(window.location.href,!0):baseUrl=this._calculateBaseURL(window.location.href,!1),this.url=baseUrl+url}this.atomIO.getFeed(url,lang.hitch(this,this.setFeed))}},setFeed:function(feed){this._feed=feed,this.clear();var entrySorter=function(a,b){var dispA=this._displayDateForEntry(a),dispB=this._displayDateForEntry(b);return dispA>dispB?-1:dispA<dispB?1:0},groupingStr=function(dateStr){var dpts=dateStr.split(",");return dpts.pop(),dpts.join(",")},sortedEntries=feed.entries.sort(lang.hitch(this,entrySorter));if(feed){var lastSectionTitle=null;for(var i=0;i<sortedEntries.length;i++){var entry=sortedEntries[i];if(this._isFilterAccepted(entry)){var time=this._displayDateForEntry(entry),sectionTitle="";time!==null&&(sectionTitle=groupingStr(time.toLocaleString()),sectionTitle===""&&(sectionTitle=""+(time.getMonth()+1)+"/"+time.getDate()+"/"+time.getFullYear()));if(lastSectionTitle===null||lastSectionTitle!=sectionTitle)this.appendGrouping(sectionTitle),lastSectionTitle=sectionTitle;this.appendEntry(entry)}}}},_displayDateForEntry:function(entry){return entry.updated?entry.updated:entry.modified?entry.modified:entry.issued?entry.issued:new Date},appendGrouping:function(titleText){var entryWidget=new FeedViewerGrouping({});entryWidget.setText(titleText),this.addChild(entryWidget),this.childWidgets.push(entryWidget)},appendEntry:function(entry){var entryWidget=new FeedViewerEntry({xmethod:this.xmethod});entryWidget.setTitle(entry.title.value),entryWidget.setTime(this._displayDateForEntry(entry).toLocaleTimeString()),entryWidget.entrySelectionTopic=this.entrySelectionTopic,entryWidget.feed=this,this.addChild(entryWidget),this.childWidgets.push(entryWidget),this.connect(entryWidget,"onClick","_rowSelected"),entry.domNode=entryWidget.entryNode,entry._entryWidget=entryWidget,entryWidget.entry=entry},deleteEntry:function(entryRow){this.localSaveOnly?this._removeEntry(entryRow,!0):this.atomIO.deleteEntry(entryRow.entry,lang.hitch(this,this._removeEntry,entryRow),null,this.xmethod),dojo.publish(this.entrySelectionTopic,[{action:"delete",source:this,entry:entryRow.entry}])},_removeEntry:function(entry,success){if(success){var idx=arrayUtil.indexOf(this.childWidgets,entry),before=this.childWidgets[idx-1],after=this.childWidgets[idx+1];before.isInstanceOf(widget.FeedViewerGrouping)&&(after===undefined||after.isInstanceOf(widget.FeedViewerGrouping))&&before.destroy(),entry.destroy()}},_rowSelected:function(evt){var selectedNode=evt.target;while(selectedNode){if(domClass.contains(selectedNode,"feedViewerEntry"))break;selectedNode=selectedNode.parentNode}for(var i=0;i<this._feed.entries.length;i++){var entry=this._feed.entries[i];if(selectedNode===entry.domNode&&this._currentSelection!==entry){domClass.add(entry.domNode,"feedViewerEntrySelected"),domClass.remove(entry._entryWidget.timeNode,"feedViewerEntryUpdated"),domClass.add(entry._entryWidget.timeNode,"feedViewerEntryUpdatedSelected"),this.onEntrySelected(entry),this.entrySelectionTopic!==""&&dojo.publish(this.entrySelectionTopic,[{action:"set",source:this,feed:this._feed,entry:entry}]),this._isEditable(entry)&&entry._entryWidget.enableDelete(),this._deselectCurrentSelection(),this._currentSelection=entry;break}if(selectedNode===entry.domNode&&this._currentSelection===entry){dojo.publish(this.entrySelectionTopic,[{action:"delete",source:this,entry:entry}]),this._deselectCurrentSelection();break}}},_deselectCurrentSelection:function(){this._currentSelection&&(domClass.add(this._currentSelection._entryWidget.timeNode,"feedViewerEntryUpdated"),domClass.remove(this._currentSelection.domNode,"feedViewerEntrySelected"),domClass.remove(this._currentSelection._entryWidget.timeNode,"feedViewerEntryUpdatedSelected"),this._currentSelection._entryWidget.disableDelete(),this._currentSelection=null)},_isEditable:function(entry){var retVal=!1;if(entry&&entry!==null&&entry.links&&entry.links!==null)for(var x in entry.links)if(entry.links[x].rel&&entry.links[x].rel=="edit"){retVal=!0;break}return retVal},onEntrySelected:function(entry){},_isRelativeURL:function(url){var isFileURL=function(url){var retVal=!1;return url.indexOf("file://")===0&&(retVal=!0),retVal},isHttpURL=function(url){var retVal=!1;return url.indexOf("http://")===0&&(retVal=!0),retVal},retVal=!1;return url!==null&&!isFileURL(url)&&!isHttpURL(url)&&(retVal=!0),retVal},_calculateBaseURL:function(fullURL,currentPageRelative){var baseURL=null;if(fullURL!==null){var index=fullURL.indexOf("?");index!=-1&&(fullURL=fullURL.substring(0,index));if(currentPageRelative)index=fullURL.lastIndexOf("/"),index>0&&index<fullURL.length&&index!==fullURL.length-1?baseURL=fullURL.substring(0,index+1):baseURL=fullURL;else{index=fullURL.indexOf("://");if(index>0){index+=3;var protocol=fullURL.substring(0,index),fragmentURL=fullURL.substring(index,fullURL.length);index=fragmentURL.indexOf("/"),index<fragmentURL.length&&index>0?baseURL=protocol+fragmentURL.substring(0,index):baseURL=protocol+fragmentURL}}}return baseURL},_isFilterAccepted:function(entry){var accepted=!1;if(this._includeFilters&&this._includeFilters.length>0)for(var i=0;i<this._includeFilters.length;i++){var filter=this._includeFilters[i];if(filter.match(entry)){accepted=!0;break}}else accepted=!0;return accepted},addCategoryIncludeFilter:function(filter){if(filter){var scheme=filter.scheme,term=filter.term,label=filter.label,addIt=!0;scheme||(scheme=null),term||(scheme=null),label||(scheme=null);if(this._includeFilters&&this._includeFilters.length>0)for(var i=0;i<this._includeFilters.length;i++){var eFilter=this._includeFilters[i];if(eFilter.term===term&&eFilter.scheme===scheme&&eFilter.label===label){addIt=!1;break}}addIt&&this._includeFilters.push(widget.FeedViewer.CategoryIncludeFilter(scheme,term,label))}},removeCategoryIncludeFilter:function(filter){if(filter){var scheme=filter.scheme,term=filter.term,label=filter.label;scheme||(scheme=null),term||(scheme=null),label||(scheme=null);var newFilters=[];if(this._includeFilters&&this._includeFilters.length>0){for(var i=0;i<this._includeFilters.length;i++){var eFilter=this._includeFilters[i];(eFilter.term!==term||eFilter.scheme!==scheme||eFilter.label!==label)&&newFilters.push(eFilter)}this._includeFilters=newFilters}}},_handleEvent:function(entrySelectionEvent){if(entrySelectionEvent.source!=this)if(entrySelectionEvent.action=="update"&&entrySelectionEvent.entry){var evt=entrySelectionEvent;this.localSaveOnly||this.atomIO.updateEntry(evt.entry,lang.hitch(evt.source,evt.callback),null,!0),this._currentSelection._entryWidget.setTime(this._displayDateForEntry(evt.entry).toLocaleTimeString()),this._currentSelection._entryWidget.setTitle(evt.entry.title.value)}else entrySelectionEvent.action=="post"&&entrySelectionEvent.entry&&(this.localSaveOnly?this._addEntry(entrySelectionEvent.entry):this.atomIO.addEntry(entrySelectionEvent.entry,this.url,lang.hitch(this,this._addEntry)))},_addEntry:function(entry){this._feed.addEntry(entry),this.setFeed(this._feed),dojo.publish(this.entrySelectionTopic,[{action:"set",source:this,feed:this._feed,entry:entry}])},destroy:function(){this.clear(),arrayUtil.forEach(this._subscriptions,dojo.unsubscribe)}}),FeedViewerEntry=FeedViewer.FeedViewerEntry=declare("dojox.atom.widget.FeedViewerEntry",[_Widget,_Templated],{templateString:entryTemplate,entryNode:null,timeNode:null,deleteButton:null,entry:null,feed:null,postCreate:function(){var _nlsResources=i18nViewer;this.deleteButton.innerHTML=_nlsResources.deleteButton},setTitle:function(text){this.titleNode.lastChild&&this.titleNode.removeChild(this.titleNode.lastChild);var titleTextNode=document.createElement("div");titleTextNode.innerHTML=text,this.titleNode.appendChild(titleTextNode)},setTime:function(timeText){this.timeNode.lastChild&&this.timeNode.removeChild(this.timeNode.lastChild);var timeTextNode=document.createTextNode(timeText);this.timeNode.appendChild(timeTextNode)},enableDelete:function(){this.deleteButton!==null&&(this.deleteButton.style.display="inline")},disableDelete:function(){this.deleteButton!==null&&(this.deleteButton.style.display="none")},deleteEntry:function(event){event.preventDefault(),event.stopPropagation(),this.feed.deleteEntry(this)},onClick:function(e){}}),FeedViewerGrouping=FeedViewer.FeedViewerGrouping=declare("dojox.atom.widget.FeedViewerGrouping",[_Widget,_Templated],{templateString:groupingTemplate,groupingNode:null,titleNode:null,setText:function(text){this.titleNode.lastChild&&this.titleNode.removeChild(this.titleNode.lastChild);var textNode=document.createTextNode(text);this.titleNode.appendChild(textNode)}});return FeedViewer.AtomEntryCategoryFilter=declare("dojox.atom.widget.AtomEntryCategoryFilter",null,{scheme:"",term:"",label:"",isFilter:!0}),FeedViewer.CategoryIncludeFilter=declare("dojox.atom.widget.FeedViewer.CategoryIncludeFilter",null,{constructor:function(scheme,term,label){this.scheme=scheme,this.term=term,this.label=label},match:function(entry){var matched=!1;if(entry!==null){var categories=entry.categories;if(categories!==null)for(var i=0;i<categories.length;i++){var category=categories[i];if(this.scheme!==""&&this.scheme!==category.scheme)break;if(this.term!==""&&this.term!==category.term)break;if(this.label!==""&&this.label!==category.label)break;matched=!0}}return matched}}),FeedViewer})