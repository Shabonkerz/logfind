#!/usr/bin/env node

'use strict';


var LogFind = require( './logfind.js' );
var pkg = require( '../package.json' );
var meow = require( 'meow' );

// Configure CLI
var cli = meow( {
	help: [
		'Usage:',
		'  logfind <string|regex>'
	],
	flags: {
		'o': false,
	},
	pkg: pkg
} );

// Store CLI input
var opts = cli.flags;
var args = cli.input;

// Find the files.
var logFinder = new LogFind();
var foundFiles = logFinder.find( cli.flags, cli.input );

// Report results.
if ( foundFiles.length > 0 ) {
	console.log( '\nFound in: ' );
	console.log( '------------------------------------' );
	console.log( foundFiles.map( function ( file ) {
			return '  ' + file;
		} )
		.join( '\n' ) );
} else {
	console.log( 'No results.' );
}
