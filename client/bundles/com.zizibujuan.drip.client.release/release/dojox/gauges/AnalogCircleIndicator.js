//>>built
define("dojox/gauges/AnalogCircleIndicator",["dojo/_base/declare","./AnalogIndicatorBase"],function(declare,AnalogIndicatorBase){return declare("dojox.gauges.AnalogCircleIndicator",[AnalogIndicatorBase],{_getShapes:function(group){var color=this.color?this.color:"black",strokeColor=this.strokeColor?this.strokeColor:color,stroke={color:strokeColor,width:1};return this.color.type&&!this.strokeColor&&(stroke.color=this.color.colors[0].color),[group.createCircle({cx:0,cy:-this.offset,r:this.length}).setFill(color).setStroke(stroke)]}})})