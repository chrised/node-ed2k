[![Build Status](https://travis-ci.org/chrised/node-ed2k.svg)](https://travis-ci.org/chrised/node-ed2k)[![Code Climate](https://codeclimate.com/github/chrised/node-ed2k/badges/gpa.svg)](https://codeclimate.com/github/chrised/node-ed2k)[![Test Coverage](https://codeclimate.com/github/chrised/node-ed2k/badges/coverage.svg)](https://codeclimate.com/github/chrised/node-ed2k/coverage)
# node-ed2k

## Introduction
A simple stream-oriented ed2k hasher for nodejs.

### Installation
    npm install node-ed2k

### Usage
Require the module:
    var ed2k = require('node-ed2k');

#### Provide a stream:
    var file_stream = fs.createReadStream('/path/to/file');
    ed2k.ed2k_hash_for_stream(file_stream, function(err, hash) {
        if (err !== null) {
            console.log(hash);
        }
    });

#### Provide a file:
    ed2k.ed2k_hash_for_filepath('/path/to/file', function(err, hash) {
        if (err !== null) {
            console.log(hash);
        }
    });

### Methods
#### ed2k_hash_for_stream(stream, callback)
`stream` - stream (http://nodejs.org/api/stream.html)

`callback` - function(err, ed2k_uri)

    `err` - `null` if success, !`null` if error, passed from `fs` modules

    `ed2k_uri` - String if success, undefined if err

#### ed2k_hash_for_filepath(path, callback)
`path` - String, relative or absolute path to a file

`callback` - function(err, ed2k_uri)

    `err` - `null` if success, !`null` if error, passed from `fs` modules

    `ed2k_uri` - String if success, undefined if err

#### ed2k_uri_for_hash(hash, filename, size)
`hash` - String, string hash of file

`filename` - String, name of file, path not required

`size` - String/Int, size of file

returns: String, ed2k uri

#### ed2k_uri_for_filepath(path, callback)
`path` - String, relative or absolute path to a file

`callback` - function(err, ed2k_uri)

    `err` - `null` if success, !`null` if error, passed from `fs` modules

    `ed2k_uri` - String if success, undefined if err

### Example
    var ed2k = require('node-ed2k');

    ed2k.ed2k_hash_for_filepath('/path/to/file', function(err, hash) {
        if (err !== null) {
            console.log(hash);
        }
    });

