( function() {
	
	var prefilltags = [
		'writing', 
		'relationships',
		'sex',
		'mundane',
		'body',
		'anxiety',
		'want/don’t want',
		'feelings',
		'school',
		'death',
		'memories',
		'solitude',
		'here/there',
		'friends',
		'family',
		'communication',
		'gender',
		'self',
		'(im)permanence',
		'art',
		'pleasure',
		'home',
		'dream',
		'god'
	];
	
var MongoClient = require( 'mongodb' ).MongoClient;
MongoClient.connect(
	"mongodb://localhost/wantmail",
	function( err, db ) {
		if ( err ) {
			console.log( err );
		} else {
			console.log( 'spooling up wantmail database...' );

			var tags = db.collection( 'tags' );
			var tagsArray = [];
			for ( var i = 0; i < prefilltags.length; i++ ) {
				tagsArray.push({
						'niceId': i,
						'name': prefilltags[i]
				});
			}
			tags.insert( tagsArray, { w: 1, safe: true }, function( error, object ) {
				if ( error ) {
					console.log( error );
				} else {
					console.log( object );
					db.close();
				}
			});
		}
	}
);

})();