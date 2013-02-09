//>>built
define("dojox/sketch/UndoStack",["dojo/_base/kernel","dojo/_base/lang","dojo/_base/declare","../xml/DomParser"],function(dojo){dojo.getObject("sketch",!0,dojox);var ta=dojox.sketch;return ta.CommandTypes={Create:"Create",Move:"Move",Modify:"Modify",Delete:"Delete",Convert:"Convert"},dojo.declare("dojox.sketch.UndoStack",null,{constructor:function(figure){this.figure=figure,this._steps=[],this._undoedSteps=[]},apply:function(state,from,to){if(!from&&!to&&state.fullText){this.figure.setValue(state.fullText);return}var fromText=from.shapeText,toText=to.shapeText;if(fromText.length==0&&toText.length==0)return;if(fromText.length==0){var o=dojox.xml.DomParser.parse(toText).documentElement,a=this.figure._loadAnnotation(o);a&&this.figure._add(a);return}if(toText.length==0){var ann=this.figure.getAnnotator(from.shapeId);this.figure._delete([ann],!0);return}var nann=this.figure.getAnnotator(to.shapeId),no=dojox.xml.DomParser.parse(toText).documentElement;nann.draw(no),this.figure.select(nann);return},add:function(cmd,ann,before){var id=ann?ann.id:"",after=ann?ann.serialize():"";cmd==ta.CommandTypes.Delete&&(after="");var state={cmdname:cmd,before:{shapeId:id,shapeText:before||""},after:{shapeId:id,shapeText:after}};this._steps.push(state),this._undoedSteps=[]},destroy:function(){},undo:function(){var state=this._steps.pop();state&&(this._undoedSteps.push(state),this.apply(state,state.after,state.before))},redo:function(){var state=this._undoedSteps.pop();state&&(this._steps.push(state),this.apply(state,state.before,state.after))}}),dojox.sketch.UndoStack})