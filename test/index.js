'use strict';
var assert = require( 'assert' );
var LogFind = require( '../lib/logfind' );
var logFinder = new LogFind();

describe( 'LogFind unit tests.', function () {
    it( 'LogFind.getFileMatches should return 2 files.', function () {
        var files = logFinder.getFileMatches();
        assert( files.length == 2, 'we expected 2 files.' );
    } );
} );
