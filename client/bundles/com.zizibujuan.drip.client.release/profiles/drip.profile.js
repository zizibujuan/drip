/**
 * 这是一个应用程序级别的profile
 */

var profile = {
	
	// 相对于包含该profile文件的目录。
	// 将根目录定位在client/bundles/下
	basePath: '../../',
	
	releaseDir: './com.zizibujuan.drip.client.release/release',
	
	// 构建一个发布版本
	action: 'release',
	
	// 将css文件中的所有注释和空格取消，并内联@imports指定的文件
	cssOptimize: 'comments',
	
	// 排除tests, demos和template文件
	mini: true,
	
	// 使用Closure Compiler作为javascript的压缩器，最新版本也支持uglify,closure压缩
	optimize: 'uglify',
	
	// 设置压缩layers的工具，如果没有设置，默认为"shrinksafe"。最新版本也支持uglify,closure
	layerOptimize: 'uglify',
	
	// 将代码中的所有console语句删掉。也可以设置为“warn”，删除除了console.error之外的所有console语句
	stripConsole: 'all',
	
	selectorEngine: "lite",
	/* 
    defaultConfig: {
        hasCache:{
            "dojo-built": 1,
            "dojo-loader": 1,
            "dom": 1,
            "host-browser": 1,
            "config-selectorEngine": "lite"
        },
        async: 1
    },*/
	
	staticHasFeatures: {
		"config-deferredInstrumentation": 0,
		"config-dojo-loader-catches": 0,
		"config-tlmSiblingOfDojo": 0,
		"dojo-amd-factory-scan": 0,
		"dojo-combo-api": 0,
		"dojo-config-api": 1,
		"dojo-config-require": 0,
		"dojo-debug-messages": 0,
		"dojo-dom-ready-api": 1,
		"dojo-firebug": 0,
		"dojo-guarantee-console": 1,
		"dojo-has-api": 1,
		"dojo-inject-api": 1,
		"dojo-loader": 1,
		"dojo-log-api": 0,
		"dojo-modulePaths": 0,
		"dojo-moduleUrl": 0,
		"dojo-publish-privates": 0,
		"dojo-requirejs-api": 0,
		"dojo-sniff": 0,
		"dojo-sync-loader": 0,
		"dojo-test-sniff": 0,
		"dojo-timeout-api": 0,
		"dojo-trace-api": 0,
		"dojo-undef-api": 0,
		"dojo-v1x-i18n-Api": 1,
		"dom": 1,
		"host-browser": 1,
		"extend-dojo": 1,
		
	

		// `dojo-xhr-factory` relies on `dojo-sync-loader`, which we have removed.
		'dojo-xhr-factory': 0
	},
	
	packages:[{
		name:"dojo",
		location:"./com.zizibujuan.drip.client.dojo/static/dojo"
	},{
		name:"dijit",
		location:"./com.zizibujuan.drip.client.dojo/static/dijit"
	},{
		name:"dojox",
		location:"./com.zizibujuan.drip.client.dojo/static/dojox"
	},{
		name:"mathEditor",
		location:"./com.zizibujuan.drip.client.editor/static/mathEditor"
	},{
		name:"drip",
		location:"./com.zizibujuan.drip.client.core/web/drip"
	}/*,{
		name:"mathjax",
		location:"./com.zizibujuan.drip.client.mathjax/static/"
	}*/],
	
	layers:{
		'dojo/dojo':{
			include:[// dojo
			         'dojo/i18n',
			         'dojo/domReady',
			         "dojo/parser",
			         "dojo/store/JsonRest",
			         "dojo/selector/acme",
			         "dojo/html",
			         "dojo/date",
			         "dojo/_base/unload",
			         "dojo/text",
			         "dojo/dom-class",
			         "dojo/Stateful",
			         "dojo/cache",
			         "dojo/string",
			         "dojo/touch",
			         "dojo/window",
			         "dojo/uacss",
			         "dojo/hccss",
			         // dijit
			         "dijit/TooltipDialog",
			         "dijit/popup",
			         "dijit/layout/ContentPane",
			         "dijit/Viewport",
			         "dijit/layout/utils"
			         ],
			boot: true,
			customBase: true
		},
		
		'mathEditor/Editor': {
			include:['mathEditor/Editor',
			         'mathEditor/ContentAssist',
			         'mathEditor/dataUtil',
			         'mathEditor/lang',
			         'mathEditor/mathContentAssist',
			         'mathEditor/Model',
			         'mathEditor/string',
			         'mathEditor/View',
			         'mathEditor/xmlUtil',
			         'mathEditor/layer/Cursor']
		}
	}
};
