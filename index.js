'use strict';
/*jslint node: true*/
var fs = require('fs'),
    crypto = require('crypto');

/* ed2k hasher in JS */

var ED2K_CHUNK_SIZE = 9728000;

/* stream - the stream we're reading from.
 * hash - created and destroyed for each 9500KB chunk.
 * metahash - 9500KB chunks' binary md4 hashes are inserted until we expend
 * the stream.
 * hash_current_pos - used to measure the amount of data we've pumped into
 * the current hash.
 */
var ed2k_hash_stream = function(stream, callback) {
    var hash = crypto.createHash('md4');
    var metahash = crypto.createHash('md4');
    var hash_current_pos = 0;

    stream.on('data', function (chunk) {
        var hash_offset = 0;
        // If the chunk is going to exceed the ed2k chunk size, it should be
        // split across two hashes, calculate the offset required to keep
        // within the constraints.
        if (hash_current_pos + chunk.length > ED2K_CHUNK_SIZE) {
            hash_offset = chunk.length - (ED2K_CHUNK_SIZE - hash_current_pos);
        }
        // Write the calculated amount of chunk into the hash
        hash.update(chunk.slice(0, chunk.length - hash_offset));
        // Update the current position in the hash wrt. any appropriate offset
        hash_current_pos = hash_current_pos + chunk.length - hash_offset;
        if (hash_current_pos === ED2K_CHUNK_SIZE) {
            // ed2k chunk complete, update the metahash and create a fresh hash
            // append any remaining data in the current stream chunk and update
            // the current position to be the length of the new data entered.
            metahash.update(hash.digest('binary'));
            hash = crypto.createHash('md4');
            hash.update(chunk.slice((chunk.length - hash_offset)));
            hash_current_pos = hash_offset;
        }
    });

    stream.on('end', function () {
        // Stream's over, insert the final hash, cb with the completed ed2k
        metahash.update(hash.digest('binary'));
        callback(null, metahash.digest('hex'));
    });
};

/* Turn the ed2k hash, filename and size into an ed2k uri
 */
var ed2k_uri_for_hash = function(hash, filename, size) {
    return('ed2k://|file|' + filename + '|' + size + '|' + hash);
};

/* Callback with an ed2k URI for a filepath (absolute or relative)
 * path - Path to file. Type: String.
 * callback - function(err, ed2k_uri)
 *     ed2k_uri - an ed2k uri for the file at path. Type: String.
 */
var ed2k_uri_for_filepath = function(in_path, callback) {
    var ehandle = function (err) {
        if (err !== null && err !== undefined) {
            callback(err);
            return true;
        }
    };
    fs.realpath(in_path, function (err, path) {
        if (ehandle(err)) { return; }
        fs.stat(path, function (err, stat) {
            if (ehandle(err)) { return; }
            ed2k_hash_stream(fs.createReadStream(path), function (err, hash) {
                if (ehandle(err)) { return; }
                callback(null, ed2k_uri_for_hash(hash, path.split('/').pop(), stat.size));
            });
        });
    });
};

/* Callback with ed2k hash for provided filepath
 * in_path - File to hash. Type: String
 * callback - function(err, hash)
 *      hash - ed2k has for the stream. Type: String
 */
var ed2k_hash_for_filepath = function(in_path, callback) {
    fs.realpath(in_path, function (err, path) {
        if (err !== null && err !== undefined) {
            callback(err);
        } else {
            ed2k_hash_stream(fs.createReadStream(path), callback);
        }
    });
};


module.exports.ed2k_uri_for_filepath    = ed2k_uri_for_filepath;
module.exports.ed2k_uri_for_hash        = ed2k_uri_for_hash;
module.exports.ed2k_hash_for_filepath   = ed2k_hash_for_filepath;
module.exports.ed2k_hash_for_stream     = ed2k_hash_stream;

