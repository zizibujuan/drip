//>>built
define("dojox/lang/aspect/timer",["dojo","dijit","dojox"],function(dojo,dijit,dojox){dojo.provide("dojox.lang.aspect.timer"),function(){var aop=dojox.lang.aspect,uniqueNumber=0,Timer=function(name){this.name=name||"DojoAopTimer #"+ ++uniqueNumber,this.inCall=0};dojo.extend(Timer,{before:function(){this.inCall++||0},after:function(){--this.inCall||0}}),aop.timer=function(name){return new Timer(name)}}()})