define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/request/xhr",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/TooltipDialog",
        "dijit/popup",
        "dojo/text!/templates/MiniCard.html"], function(
        		declare,
        		lang,
        		xhr,
        		_WidgetBase,
        		_TemplatedMixin,
        		TooltipDialog,
        		popup,
        		miniCardTemplate){
	
	var MiniCardBody = declare("MiniCardBody",[_WidgetBase,_TemplatedMixin],{
		templateString:miniCardTemplate,
		postCreate: function(){
			this.inherited(arguments);
		},
		
		update: function(localUserId, mapUserId){
			// summary:
			//		更新用户信息
			// userId:[String]
			//		用户标识
			
			// 注意返回deferred对象
			debugger;
			return xhr("/users/"+localUserId,{handleAs:"json",query:{mapUserId:mapUserId}}).then(function(response){
				
			});
		}
	})
	
	return declare("MiniCard", null, {
		
		constructor: function(args){
			lang.mixin(this, args);
			
			var self = this;
			var dialog = this.dialog = new TooltipDialog({
				onMouseLeave: function(){
		            popup.close(dialog);
		        },
		        
		        onMouseEnter: function(){
		        	if(self._closePopup){
		        		clearTimeout(self._closePopup);
		        	}
		        }
			});
			
			this.miniCardBody = new MiniCardBody();
		},
		
		
		
		show: function(target, localUserId, mapUserId){
			// summary:
			//		显示迷你名片
			var dialog = this.dialog;
			popup.open({
				popup: dialog,
				around:target
			});
			this._show = true;
			
			var miniCardBody = this.miniCardBody;
			
			dialog.containerNode.innerHTML = "";
			miniCardBody.update(localUserId,mapUserId).then(function(){
				dialog.containerNode.appendChild(miniCardBody.domNode);
			});
			
		},
		
		hide: function(){
			// summary:
			//		隐藏迷你名片
			
			if(this._show){
				var dialog = this.dialog;
				this._closePopup = setTimeout(function(){
					debugger;
					popup.close(dialog);
					self._show = false;
				},300);
			}
				
		}
	
	});
	
});