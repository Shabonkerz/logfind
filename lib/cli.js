#!/usr/bin/env node
'use strict';

(function () {

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

	function LogFindCli () {
		this.logFinder = new LogFind();
	}

	LogFindCli.prototype = {

		/**
		 * Generates a .logfind file if it doesn't exist.
		 * @method init
		 * @param  {Array} args  Arguments corresponding to LogFind.init.
		 * @param  {Array} flags Flags corresponding to LogFind.init.
		 */
		init: function (args, flags) {
			this.logFinder.init(args, flags);
			console.log(this.logFinder.logfindFileName + ' created. Use `logfind add <file [file [file [...]]]>` to add files to it.');
		},

		/**
		 * Adds an array of files to .logfind.
		 * @method add
		 * @param  {Array} args  Arguments corresponding to LogFind.add.
		 * @param  {Array} flags Flags corresponding to LogFind.add.
		 */
		add: function (args, flags) {
			var result = this.logFinder.add(args, flags);
			if ( result.filesAdded.length > 0 )
			{
				console.log('Added ' + result.filesAdded.length + ' files.');
			} else {
				console.log('Pattern(s)', args.join(','),'already exist.');
			}
		},

		/**
		 * Finds matches in files that are specified by globs in .logfind.
		 * @method find
		 * @param  {Array} args  Arguments corresponding to LogFind.find.
		 * @param  {Array} flags Flags corresponding to LogFind.find.
		 */
		find: function (args, flags) {
			var foundFiles = this.logFinder.find( args, flags );

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
		}
	};

	var logFindCli = new LogFindCli();

	try {
		logFindCli[cli.input[0]](cli.input.slice(1), cli.flags)
	} catch (e) {
		console.log(e);
	}

	module.exports = LogFindCli;
}());
