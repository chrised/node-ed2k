'use strict';
/*jslint node: true*/

var testdata = require('./hashdata.json');
var vows = require('vows'),
    assert = require('assert'),
    fs = require('fs');

var ed2k = require('../');

//module.exports = {
//    ed2k_hash_for_stream: ed2k_hash_stream,
//    ed2k_hash_for_filepath: ed2k_hash_for_filepath,
//    ed2k_uri_for_hash: ed2k_uri_for_hash,
//    ed2k_uri_for_filepath: ed2k_uri_for_filepath
//};
var largefile = testdata.li_large,
    mediumfile = testdata.li_med,
    smallfile = testdata.li_small;
vows.describe('Given a large file').addBatch({
    'we can calculate a hash from the path': {
        topic: function() {
            ed2k.ed2k_hash_for_filepath(largefile.path, this.callback);
        },
        'which matches the expected value': function(err, hash) {
            assert.isNull(err);
            assert.equal(hash, largefile.hash);
        }
    },
    'we can calculate a uri from the path': {
        topic: function() {
            ed2k.ed2k_uri_for_filepath(largefile.path, this.callback);
        },
        'which matches the expected value': function(err, uri) {
            assert.isNull(err);
            assert.equal(uri, largefile.uri);
        }
    },
    'we can create a stream from the path': {
        topic: function () { return fs.createReadStream(largefile.path); },
        'and calculate a hash for the stream': {
            topic: function (stream) {
                ed2k.ed2k_hash_for_stream(stream, this.callback);
            },
            'which matches the expected value': function(err, hash) {
                assert.isNull(err);
                assert.equal(hash, largefile.hash);
            }
        }
    }
}).run();
vows.describe('Given a medium file').addBatch({
    'we can calculate a hash from the path': {
        topic: function() {
            ed2k.ed2k_hash_for_filepath(mediumfile.path, this.callback);
        },
        'which matches the expected value': function(err, hash) {
            assert.isNull(err);
            assert.equal(hash, mediumfile.hash);
        }
    },
    'we can calculate a uri from the path': {
        topic: function() {
            ed2k.ed2k_uri_for_filepath(mediumfile.path, this.callback);
        },
        'which matches the expected value': function(err, uri) {
            assert.isNull(err);
            assert.equal(uri, mediumfile.uri);
        }
    },
    'we can create a stream from the path': {
        topic: function () { return fs.createReadStream(mediumfile.path); },
        'and calculate a hash for the stream': {
            topic: function (stream) {
                ed2k.ed2k_hash_for_stream(stream, this.callback);
            },
            'which matches the expected value': function(err, hash) {
                assert.isNull(err);
                assert.equal(hash, mediumfile.hash);
            }
        }
    }
}).run();

vows.describe('Given a small file').addBatch({
    'we can calculate a hash from the path': {
        topic: function() {
            ed2k.ed2k_hash_for_filepath(smallfile.path, this.callback);
        },
        'which matches the expected value': function(err, hash) {
            assert.isNull(err);
            assert.equal(hash, smallfile.hash);
        }
    },
    'we can calculate a uri from the path': {
        topic: function() {
            ed2k.ed2k_uri_for_filepath(smallfile.path, this.callback);
        },
        'which matches the expected value': function(err, uri) {
            assert.isNull(err);
            assert.equal(uri, smallfile.uri);
        }
    },
    'we can create a stream from the path': {
        topic: function () { return fs.createReadStream(smallfile.path); },
        'and calculate a hash for the stream': {
            topic: function (stream) {
                ed2k.ed2k_hash_for_stream(stream, this.callback);
            },
            'which matches the expected value': function(err, hash) {
                assert.isNull(err);
                assert.equal(hash, smallfile.hash);
            }
        }
    }
}).run();   //'we can hash it': {
        //topic: ed2k.ed2k_hash_stream(fs.createStream(testdata.li_large.path)
