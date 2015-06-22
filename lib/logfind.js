'use strict';
( function () {

	var fs = require( 'fs' );
	var glob = require( 'glob' );
	var _ = require( 'lodash' );

	// Constructor/Initializer
	var LogFind = function () {};

	LogFind.prototype = {

		find: function ( options, search ) {

			// -o flag enables 'OR' mode, where we find any of the words.
			var patternString = options.o ? search.split( ' ' )
				.join( '|' ) : search;


			// Create regex object. Could make this conditional.
			var pattern = new RegExp( patternString, 'gm' );

			// Fire at will!
			return this.findFilesWithPattern( pattern, this.getFileMatches() );
		},

		getFileMatches: function () {
			var files = [];

			var filePatterns = fs
				.readFileSync( process.cwd() + '\\.logfind' )
				.toString()
				.split( '\n' )
				.filter( function ( line ) {
					return line !== '';
				} );

			// Perhaps use a simple `for` loop for performance? Refer to JSPerf.
			filePatterns.forEach( function ( filePattern ) {
				var matchedFiles = glob.sync( filePattern, {} );
				files = _.union( files, matchedFiles );
			} );

			return files;
		},


		findInFile: function ( pattern, file ) {
			return fs
				.readFileSync( file )
				.toString()
				.search( pattern ) > -1;
		},

		findFilesWithPattern: function ( pattern, files ) {
			var self = this;
			return files
				.filter( function ( file ) {
					return self.findInFile( pattern, file );
				} );
		},

	};

	module.exports = LogFind;


}() );
