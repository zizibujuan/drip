//>>built
define("mathEditor/mathContentAssist",["dojo/_base/array"],function(a){return{keywords:[{input:"/",map:"&#xF7;",nodeName:"mo",freq:0,label:"\u9664\u53f7",iconClass:"drip_equation_icon drip_division"},{input:"/",map:"/",nodeName:"text",freq:0,label:"/",iconClass:""},{input:"/",map:"",nodeName:"mfrac",freq:0,label:"\u5206\u6570",iconClass:"drip_equation_icon drip_frac"},{input:"*",map:"&#xD7;",nodeName:"mo",freq:0,label:"\u4e58\u53f7",iconClass:"drip_equation_icon drip_multiplication"},{input:"*",map:"*",
nodeName:"text",freq:0,label:"*",iconClass:""},{input:"^",map:"^",nodeName:"text",freq:0,label:"^",iconClass:""},{input:"^",map:"",nodeName:"msup",freq:0,label:"\u4e0a\u6807",iconClass:"drip_equation_icon drip_sup"},{input:"_",map:"_",nodeName:"text",freq:0,label:"_",iconClass:""},{input:"_",map:"",nodeName:"msub",freq:0,label:"\u4e0b\u6807",iconClass:"drip_equation_icon drip_sub"},{input:"sqrt",map:"",nodeName:"msqrt",freq:0,label:"\u5e73\u65b9\u6839",iconClass:"drip_equation_icon drip_sqrt"},{input:"sqrt",
map:"",nodeName:"mroot",freq:0,label:"\u5f00\u6839\u53f7",iconClass:"drip_equation_icon drip_root"},{input:"sin",map:"sin",nodeName:"mi",freq:0,label:"sin",iconClass:""},{input:"cos",map:"cos",nodeName:"mi",freq:0,label:"cos",iconClass:""},{input:"tan",map:"tan",nodeName:"mi",freq:0,label:"tan",iconClass:""},{input:"cot",map:"cot",nodeName:"mi",freq:0,label:"cot",iconClass:""}],getProposals:function(b){return a.filter(this.keywords,function(a){return 0==a.input.indexOf(b)})}}});