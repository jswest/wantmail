( function() {



WM.HomepageView = Backbone.View.extend({
	initialize: function() {
		_.bindAll( this, 'render' );
	},
	render: function() {
		var template = _.template( $('#homepage-template').html(), {} );
		$('#inner-content').html( template );
	}

});

WM.PrimaryHeaderView = Backbone.View.extend({
	tagName: 'header',
	id: 'primary-header',
	events: {
		'click nav': 'toggleNav'
	},
	initialize: function() {
		_.bindAll( this, 'render' );
	},
	render: function() {
		var template = _.template( $('#primary-header-template').html(), {} );
		$('#content').append( $(this.el).html( template ) );
	},
	toggleNav: function() {
		$(this.el).find( 'ul' ).toggle();
	}
});

WM.Entry = Backbone.Model.extend({
	idAttribute: "_id",
	url: function() {
		if ( this.get( '_id' ) ) {
			return '/entry/' + this.get( '_id' );
		} else {
			return false;
		}
	}
});
WM.EntryView = Backbone.View.extend({
	tagName: 'tr',
	events: {
		'click .entry-x': 'destroyIt',
		'click .entry': 'updateIt'
	},
	initialize: function() {
		_.bindAll( this, 'render', 'destroyIt', 'updateIt' );
	},
	render: function() {
		var template = _.template( $('#entry-template').html(), this.model.toJSON() );
		$('#entries').append( $(this.el).html( template ) );
	},
	destroyIt: function() {
		var that = this;
		this.model.destroy({
			success: function( model ) {
				console.log( model );
				$(that.el).remove();
			}
		});
	},
	updateIt: function() {
		WM.router.navigate( 'entry/update/' + this.model.get( '_id' ), { trigger: true } );
	}
});
WM.Entries = Backbone.Collection.extend({
	url: '/entries',
	model: WM.Entry
});
WM.EntriesView = Backbone.View.extend({
	className: 'page',
	initialize: function() {
		_.bindAll( this, 'render' );
	},
	render: function() {
		var template = _.template( $('#entries-template').html(), {} );
		$('#inner-content').html( $(this.el).html( template ) );
		var entries = new WM.Entries();
		entries.fetch({
			success: function() {
				entries.each( function( entry ) {
					var entryView = new WM.EntryView( { model: entry } );
					entryView.render();
				});
			}
		});
	}
});
WM.NewEntryView = Backbone.View.extend({
	events: {
		'submit form#new-entry-form': 'submitHandler'
	},
	initialize: function() {
		_.bindAll( this, 'render' );
	},
	render: function() {
		var template = _.template( $('#new-entry-template').html(), {} );
		$('#inner-content').html( $(this.el).html( template ) );
		$('#tags-input').tokenInput( '/search/tags' );
	},
	submitHandler: function( e ) {
		e.preventDefault();
		var tags = [];
		$('li.token-input-token').each( function() {
			tags.push( $(this).find( 'p' ).html() );
		});
		this.model.url = '/entry';
		this.model.save(
			{
				'tags': tags,
				'body': $('#entry-body').val()
			},
			{
				success: function( model ) {
					WM.router.navigate( 'entry/all', { trigger: true } );
				}
			}
		);
	}
});
WM.UpdateEntryView = Backbone.View.extend({
	events: {
		'submit form#update-entry-form': 'submitHandler'
	},
	initialize: function() {
		_.bindAll( this, 'render' );
	},
	render: function() {
		var tagArray = [];
		for ( var i = 0; i < this.model.get( 'tags' ).length; i++ ) {
			var tag = this.model.get( 'tags' )[i];
			tagArray.push( { 'name': tag } );
		}
		var template = _.template( $('#update-entry-template').html(), this.model.toJSON() );
		$('#inner-content').html( $(this.el).html( template ) );
		$('#tags-input').tokenInput( '/search/tags', {
			prePopulate: tagArray
		});
	},
	submitHandler: function( e ) {
		e.preventDefault();
		var tags = [];
		$('li.token-input-token').each( function() {
			tags.push( $(this).find( 'p' ).html() );
		});
		this.model.save(
			{
				'tags': tags,
				'body': $('#entry-body').val()
			},
			{
				success: function( model ) {
					WM.router.navigate( 'entry/all', { trigger: true } );
				}
			}
		);
	}
});


WM.Tag = Backbone.Model.extend({
	idAttribute: "_id",
	url: function() {
		if ( this.get( '_id' ) ) {
			return '/entry/' + this.get( '_id' );
		} else {
			return '/entry';
		}
	}
});
WM.TagView = Backbone.View.extend({
	tagName: 'tr',
	render: function() {
		var template = _.template( $('#tag-template').html(), this.model.toJSON() );
		$('table').append( $(this.el).html( template) );
	}
});
WM.Tags = Backbone.Collection.extend({
	url: '/tags',
	model: WM.Tag
});
WM.NewTagView = Backbone.View.extend({
	tagName: 'form',
	id: 'new-tag-form',
	events: {
		'submit form#create-tag-form': 'submitHandler'
	},
	render: function() {
		var template = _.template( $('#new-tag-template').html(), {} );
		$('#new-tag-form-wrapper').html( $(this.el).html( template ) );
	},
	submitHandler: function( e ) {
		e.preventDefault();
	}
});
WM.TagsView = Backbone.View.extend({
	className: 'page',
	render: function() {
		var template = _.template( $('#tags-template').html(), {} );
		$('#inner-content').html( $(this.el).html( template ) );
		var newTagView = new WM.NewTagView();
		newTagView.render();
		var tags = new WM.Tags();
		tags.fetch({
			success: function() {
				tags.each( function( tag ) {
					var tagView = new WM.TagView( { model: tag } );
					tagView.render();
				});
			}
		});
	}
});



})();