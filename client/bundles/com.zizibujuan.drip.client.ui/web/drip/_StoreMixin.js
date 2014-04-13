define(["dojo/_base/declare"],function(declare){
	
	return declare("drip._StoreMixin", null, {
		store: null,
		query: null,
		queryOptions: null,
		noDataMessage: "",
		loadingMessage: "",
		
		constructor: function(){
			this.query = {};
			this.queryOptions = {};
			//this.dirty = {};
			//this._updating = {};
		},
		
		setStore: function(store, query, queryOptions){
			this.store = store;
			this.setQuery( query, queryOptions);
		},
		
		setQuery: function(query, queryOptions){
			this.query = query !== undefined ? query : this.query;
			this.queryOptions = queryOptions || this.queryOptions;
			this.refresh();
		}
	});
	
});