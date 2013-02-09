//>>built
define("dojo/dom-attr",["exports","./sniff","./_base/lang","./dom","./dom-style","./dom-prop"],function(exports,has,lang,dom,style,prop){function _hasAttr(node,name){var attr=node.getAttributeNode&&node.getAttributeNode(name);return attr&&attr.specified}var forcePropNames={innerHTML:1,className:1,htmlFor:has("ie"),value:1},attrNames={classname:"class",htmlfor:"for",tabindex:"tabIndex",readonly:"readOnly"};exports.has=function(node,name){var lc=name.toLowerCase();return forcePropNames[prop.names[lc]||name]||_hasAttr(dom.byId(node),attrNames[lc]||name)},exports.get=function(node,name){node=dom.byId(node);var lc=name.toLowerCase(),propName=prop.names[lc]||name,forceProp=forcePropNames[propName],value=node[propName];if(forceProp&&typeof value!="undefined")return value;if(propName=="href"||typeof value!="boolean"&&!lang.isFunction(value)){var attrName=attrNames[lc]||name;return _hasAttr(node,attrName)?node.getAttribute(attrName):null}return value},exports.set=function(node,name,value){node=dom.byId(node);if(arguments.length==2){for(var x in name)exports.set(node,x,name[x]);return node}var lc=name.toLowerCase(),propName=prop.names[lc]||name,forceProp=forcePropNames[propName];return propName=="style"&&typeof value!="string"?(style.set(node,value),node):forceProp||typeof value=="boolean"||lang.isFunction(value)?prop.set(node,name,value):(node.setAttribute(attrNames[lc]||name,value),node)},exports.remove=function(node,name){dom.byId(node).removeAttribute(attrNames[name.toLowerCase()]||name)},exports.getNodeProp=function(node,name){node=dom.byId(node);var lc=name.toLowerCase(),propName=prop.names[lc]||name;if(propName in node&&propName!="href")return node[propName];var attrName=attrNames[lc]||name;return _hasAttr(node,attrName)?node.getAttribute(attrName):null}})