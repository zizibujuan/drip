//>>built
define("dojox/lang/functional/multirec",["dijit","dojo","dojox","dojo/require!dojox/lang/functional/lambda,dojox/lang/functional/util"],function(p,h,o){h.provide("dojox.lang.functional.multirec");h.require("dojox.lang.functional.lambda");h.require("dojox.lang.functional.util");(function(){var b=o.lang.functional,i=b.inlineLambda,h=["_y.r","_y.o"];b.multirec=function(a,e,f,g){var k,j,l,m,n={},c={},d=function(a){n[a]=1};"string"==typeof a?a=i(a,"_x",d):(k=b.lambda(a),a="_c.apply(this, _x)",c["_c=_t.c"]=
1);"string"==typeof e?e=i(e,"_x",d):(j=b.lambda(e),e="_t.apply(this, _x)");"string"==typeof f?f=i(f,"_x",d):(l=b.lambda(f),f="_b.apply(this, _x)",c["_b=_t.b"]=1);"string"==typeof g?g=i(g,h,d):(m=b.lambda(g),g="_a.call(this, _y.r, _y.o)",c["_a=_t.a"]=1);d=b.keys(n);c=b.keys(c);a=new Function([],"var _y={a:arguments},_x,_r,_z,_i".concat(d.length?","+d.join(","):"",c.length?",_t=arguments.callee,"+c.join(","):"",j?c.length?",_t=_t.t":"_t=arguments.callee.t":"",";for(;;){for(;;){if(_y.o){_r=",g,";break}_x=_y.a;if(",
a,"){_r=",e,";break}_y.o=_x;_x=",f,";_y.r=[];_z=_y;for(_i=_x.length-1;_i>=0;--_i){_y={p:_y,a:_x[_i],z:_z}}}if(!(_z=_y.z)){return _r}_z.r.push(_r);_y=_y.p}"));if(k)a.c=k;if(j)a.t=j;if(l)a.b=l;if(m)a.a=m;return a}})()});