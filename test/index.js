'use strict';
var assert = require( 'assert' );
var LogFind = require( '../lib/logfind' );
var logFinder = new LogFind();

describe( 'LogFind unit tests.', function () {
    var pattern = new RegExp(/^rickshaw$/gm);

    it( 'LogFind.getFileMatches should return 2 files.', function () {
        var files = logFinder.getFileMatches();
        assert( files.length === 2, 'we expected 2 files.' );
    } );

    it( 'LogFind.findInFile should return true.', function () {
        var file = 'test.txt';
        var found = logFinder.findInFile(pattern, file);
        assert( found === true, 'we expected pattern to be found.' );
    } );

    it( 'LogFind.findInFile should return false.', function () {
        var file = 'test2.txt';
        var found = logFinder.findInFile(pattern, file);
        assert( found === false, 'we expected pattern to not be found.' );
    } );

    it( 'LogFind.findFilesWithPattern should return array of length 0.', function () {
        var files = ['test.txt', 'test2.txt'];
        var pattern = /^slkdjklsjd$/gm;
        var foundFiles = logFinder.findFilesWithPattern(pattern, files);
        assert( foundFiles.length === 0, 'we expected no files in result.' );
    } );

    it( 'LogFind.findFilesWithPattern should return array of length 1.', function () {
        var files = ['test.txt', 'test2.txt'];
        var foundFiles = logFinder.findFilesWithPattern(pattern, files);
        assert( foundFiles.length === 1, 'we expected only 1 file in result.' );
    } );

    it( 'LogFind.find should return array of length 0.', function () {
        var options = {o: false};
        var search = '^lkjsdflskjdf$';
        var foundFiles = logFinder.find(options, search);
        assert( foundFiles.length === 0, 'we expected no files in result.' );
    } );

    it( 'LogFind.find should return array of length 1 for `OR` mode.', function () {
        var options = {o: true};
        var search = 'something rickshaw';
        var foundFiles = logFinder.find(options, search);
        assert( foundFiles.length === 1, 'we expected only 1 file in result.' );
    } );

    it( 'LogFind.find should return array of length 1.', function () {
        var options = {o: false};
        var search = '^rickshaw$';
        var foundFiles = logFinder.find(options, search);
        assert( foundFiles.length === 1, 'we expected only 1 file in result.' );
    } );

} );
