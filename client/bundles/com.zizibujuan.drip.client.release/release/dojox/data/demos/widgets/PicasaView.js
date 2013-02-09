//>>built
define("dojox/data/demos/widgets/PicasaView",["dojo","dijit","dojox","dojo/require!dijit/_Templated,dijit/_Widget"],function(dojo,dijit,dojox){dojo.provide("dojox.data.demos.widgets.PicasaView"),dojo.require("dijit._Templated"),dojo.require("dijit._Widget"),dojo.declare("dojox.data.demos.widgets.PicasaView",[dijit._Widget,dijit._Templated],{templateString:dojo.cache("dojox","data/demos/widgets/templates/PicasaView.html",'<table class="picasaView">\n	<tbody>\n		<tr class="picasaTitle">\n			<td>\n				<b>\n					Title:\n				</b>\n			</td>\n			<td dojoAttachPoint="titleNode">\n			</td>\n		</tr>\n		<tr>\n			<td>\n				<b>\n					Author:\n				</b>\n			</td>\n			<td dojoAttachPoint="authorNode">\n			</td>\n		</tr>\n		<tr>\n			<td colspan="2">\n				<b>\n					Summary:\n				</b>\n				<span class="picasaSummary" dojoAttachPoint="descriptionNode"></span>\n			</td>\n		</tr>\n		<tr>\n			<td dojoAttachPoint="imageNode" colspan="2">\n			</td>\n		</tr>\n	</tbody>\n</table>\n\n'),titleNode:null,descriptionNode:null,imageNode:null,authorNode:null,title:"",author:"",imageUrl:"",iconUrl:"",postCreate:function(){this.titleNode.appendChild(document.createTextNode(this.title)),this.authorNode.appendChild(document.createTextNode(this.author)),this.descriptionNode.appendChild(document.createTextNode(this.description));var href=document.createElement("a");href.setAttribute("href",this.imageUrl),href.setAttribute("target","_blank");var imageTag=document.createElement("img");imageTag.setAttribute("src",this.iconUrl),href.appendChild(imageTag),this.imageNode.appendChild(href)}})})