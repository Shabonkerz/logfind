'use strict';
(function () {

	var fs = require('fs-extra');
	var glob = require('glob');
	var lodash = require('lodash');

	// Constructor/Initializer
	var LogFind = function () {
		this.logfindFileName = '.logfind';
	};

	LogFind.prototype = {

		init: function () {

			// Only create if it doesn't exist.
			fs.ensureFileSync(this.logfindFileName);

		},

		add: function (filePatterns) {

			if ( filePatterns.length === 0 )
			{
				throw new Error('Must specify something to add.');
			}

			// Create file if not there.
			this.init();

			// We need to know if there are duplicates, so let's get what we
			// have already.
			var currentFiles = this.getPatterns();

			// Weed out duplicates via union. Also, organize it.
			var uniqueFiles = lodash.union(filePatterns, currentFiles)
				.sort();

			// Rewrite file with new and old filenames/globs, but without
			// duplicates. Created if doesn't exist.
			fs.writeFileSync(this.logfindFileName, uniqueFiles.join('\n'));

			return { 'filesAdded': lodash.difference(filePatterns, currentFiles) };

		},

		find: function (search, options) {

			// Empty search?
			if ( search.length === 0 )
			{
				throw new Error('Must specify something to find.');
			}

			// -o flag enables 'OR' mode, where we find any of the words.
			var patternString = options.o ? search.split(' ')
				.join('|') : search;

			// Create regex object. Could make this conditional.
			var pattern = new RegExp(patternString, 'gm');

			// Fire at will!
			return this.findFilesWithPattern(pattern, this.getFileMatches());
		},

		getPatterns: function () {

			return fs
				.readFileSync(this.logfindFileName)
				.toString()
				.split('\n')
				.filter(function (line) {
					return line !== '';
				});
		},

		/**
		 * Retrieves all the files that match the patterns within .logfind.
		 * @method getFileMatches
		 * @return {array}       Array of all the files that match the patterns
		 * within .logfind.
		 */
		getFileMatches: function () {
			var files = [];


			// Perhaps use a simple `for` loop for performance? Refer to JSPerf.
			this.getPatterns().forEach(function (filePattern) {
				var matchedFiles = glob.sync(filePattern, {});
				files = lodash.union(files, matchedFiles);
			});

			return files;
		},

		findInFile: function (pattern, file) {
			return fs
				.readFileSync(file)
				.toString()
				.search(pattern) > -1;
		},

		findFilesWithPattern: function (pattern, files) {
			var self = this;
			return files
				.filter(function (file) {
					return self.findInFile(pattern, file);
				});
		},

	};

	module.exports = LogFind;

}());
