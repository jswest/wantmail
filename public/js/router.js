( function() {

createHeader = function() {
	if ( $('#primary-header').length === 0 ) {
		var primaryHeaderView = new WM.PrimaryHeaderView();
		primaryHeaderView.render();
	}
};


WM.Router = Backbone.Router.extend({
	
	routes: {
		'': 'home',
		'entry/all': 'entries',
		'entry/new': 'newEntry',
		'entry/update/:entryId': 'updateEntry',
		'tag/all': 'tags'
	},
	
	home: function() {
		createHeader();
		var homepageView = new WM.HomepageView();
		homepageView.render();
	},

	entries: function() {
		createHeader();
		var entriesView = new WM.EntriesView();
		entriesView.render();
	},

	newEntry: function() {
		createHeader();
		var entry = new WM.Entry();
		var newEntryView = new WM.NewEntryView( { model: entry } );
		newEntryView.render();
	},
	updateEntry: function( entryId ) {
		createHeader();
		var entry = new WM.Entry( { '_id': entryId } );
		entry.fetch({
			success: function() {
				var updateEntryView = new WM.UpdateEntryView( { model: entry } );
				updateEntryView.render();
			}
		});
	},
	tags: function() {
		createHeader();
		var tagsView = new WM.TagsView();
		tagsView.render();
	}





});

})();