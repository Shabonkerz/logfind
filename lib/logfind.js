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

		/**
		 * Creates a .logfind file if it doesn't exist.
		 * @method init
		 */
		init: function () {

			// Only create if it doesn't exist.
			fs.ensureFileSync(this.logfindFileName);

		},

		/**
		 * Adds multiple file patterns to the .logfind file, if they don't
		 * already exist.
		 * @method add
		 * @param  {object} filePatterns Object containing a filesAdded property
		 * which is a list of the files that were added.
		 */
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

		/**
		 * Searches for a particular regex pattern within the files listed in
		 * .logfind.
		 * @method find
		 * @param  {string} search  A string representing a regex pattern.
		 * @param  {object} options Object containing the flags that are enabled.
		 * Currently only `o` is support, for OR mode, which Searches each word
		 * seperately.
		 * @return {Array}			Array of files that had a match.
		 */
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

		/**
		 * Returns the list of patterns/files within .logfind.
		 * @method getPatterns
		 * @return {Array}    Array of patterns/files within .logfind.
		 */
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

		/**
		 * Determines if the needle is within the haystack, where haystack is a
		 * file.
		 * @method findInFile
		 * @param  {RegExp}   pattern A RegExp object for which to search.
		 * @param  {string}   file    The file to search.
		 * @return {boolean}          Indicates whether the pattern exists.
		 */
		findInFile: function (pattern, file) {
			return fs
				.readFileSync(file)
				.toString()
				.search(pattern) > -1;
		},

		/**
		 * Determines which files a pattern exists within.
		 * @method findFilesWithPattern
		 * @param  {RegExp}             pattern The pattern for which to search.
		 * @param  {Array}             	files   The files to search.
		 * @return {Array}                     	Files containing the pattern.
		 */
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
