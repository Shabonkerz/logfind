#!/usr/bin/env node

'use strict';

var fs = require( 'fs' );
var meow = require( 'meow' );
var pkg = require( '../package.json' );
var glob = require( 'glob' );
var _ = require( 'lodash' );


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

var opts = cli.flags;
var args = cli.input;
var patternString = args[ 0 ];
var pattern = new RegExp( args[ 0 ], 'gm' );

function init() {
	var files = [];

	var filePatterns = fs
		.readFileSync( process.cwd() + '\\.logfind' )
		.toString()
		.split( '\n' )
		.filter( function ( line ) {
			return line != '';
		} );

	filePatterns.forEach( function ( filePattern ) {
		var matchedFiles = glob.sync( filePattern, {} );
		files = _.union( files, matchedFiles );
	} );

	var foundFiles = findFilesWithPattern( pattern, files );

	if ( foundFiles.length > 0 ) {
		console.log( '\nFound \'' + patternString + '\' in: ' );
		console.log( '------------------------------------' );
		console.log( foundFiles.map( function ( file ) {
				return '  ' + file;
			} )
			.join( '\n' ) );
	} else {
		console.log( 'Unable to locate ' + patternString + ' in any file.' );
	}

}

function findInFile( pattern, file ) {
	return fs
		.readFileSync( file )
		.toString()
		.search( pattern ) > -1;
}

function findFilesWithPattern( pattern, files ) {
	return files
		.filter( function ( file ) {
			return findInFile( pattern, file );
		} )
}

init();
