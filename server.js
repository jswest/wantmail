var express = require( 'express' );
var path 		= require( 'path' );
var http		= require( 'http' );
var app			= express();


var MongoClient = require('mongodb').MongoClient;
var ObjectID = require( 'mongodb' ).ObjectID;
MongoClient.connect(
	"mongodb://localhost/wantmail",
	function( err, db ) {
		if ( err ) {
			console.log( err );
		} else {
			console.log( 'spooling up wantmail...' );


app.configure( function() {
	app.set( 'port', process.env.PORT || 5000 );
	app.use( express.logger() );
	app.use( express.favicon() );
  app.use( express.cookieParser( 'super-secret' ) );
  app.use( express.session() );
  app.use( express.bodyParser() );
  app.use( express.static( path.join( __dirname, 'public' ) ) );
  app.use( app.router );
});

app.configure( 'development', function() {
	app.use( express.errorHandler() );
});

app.get( '/search/tags', function( req, res ) {
	var tagSnippet = req.query.q;
	var tags = db.collection( 'tags' );
	tags.find( { 'name': new RegExp( '.*' + tagSnippet + '.*') }, function( error, cursor ) {
		cursor.toArray( function( error, docs ) {
			res.send( docs );
		});
	});
});

app.get( '/entries', function( req, res ) {
	var entries = db.collection( 'entries' );
	entries.find( {}, function( error, cursor ) {
		cursor.toArray( function( error, docs ) {
			res.send( docs );
		});
	});
});
app.post( '/entry', function( req, res ) {
	var body = req.body.body || "";
	var tags = req.body.tags || [];
	var entries = db.collection( 'entries' );
	entries.insert( 
		{
			'body': body,
			'tags': tags
		},
		{
			w: 1,
			safe: true
		},
		function( error, object ) {
			if ( error ) {
				console.log( error );
			} else {
				res.send( object );
			}
		}
	);
});
app.get( '/entry/:id', function( req, res ) {
	var id = req.params.id;
	if ( id ) {
		var entries = db.collection( 'entries' );
		entries.findOne( { '_id': new ObjectID( id ) }, function ( error, doc ) {
			res.send( doc );
		});
	} else {
		res.send( 500, 'ruh roh!' );
	}
});
app.put( '/entry/:id', function( req, res ) {
	var id = req.params.id;
	var body = req.body.body || "";
	var tags = req.body.tags || [];
	if ( id ) {
		var entries = db.collection( 'entries' );
		entries.update(
			{ '_id': new ObjectID( id ) },
			{ 'body': body, 'tags': tags },
			{ w: 1 },
			function( error, numberOfChangedObjects ) {
				if ( error ) {
					console.log( error );
					res.send( 500, 'ruh roh!' );
				} else {
					res.send( 200, {} );
				}
			}
		);
	}
});
app.del( '/entry/:id', function( req, res ) {
	var id = req.params.id;
	if ( id ) {
		var entries = db.collection( 'entries' );
		entries.remove(
			{ '_id': new ObjectID( id ) },
			{ w: 1 },
			function( error, numberOfRemovedObjects ) {
				if ( error ) {
					console.log( error );
					res.send( 500, 'ruh roh!' );
				} else {
					res.send( 200, {} );
				}
			}
		);
	} else {
		res.send( 500, 'ruh roh!' );
	}
});

http.createServer( app ).listen( app.get( 'port' ), function() {
  console.log( "Express server listening on port " + app.get( 'port' ) );
});

		}
	}
);

