'use strict';
/*jslint node: true*/
var fs = require('fs'),
    crypto = require('crypto');

/* ed2k hasher in JS */

var ED2K_CHUNK_SIZE = 9728000;

/* stream - the file we're reading from.
 * hash - created and destroyed for each 9500KB chunk.
 * metahash - 9500KB chunks' binary md4 hashes are inserted until we expend
 * the stream.
 * hash_current_pos - used to measure the amount of data we've pumped into
 * the current hash.
 */
var ed2k_hash_file = function(path, callback) {
    var stream = fs.createReadStream(path);
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
        callback(metahash.digest('hex'));
    });
};

/* Turn the ed2k hash into an ed2k uri
 */
var ed2k_hash_to_uri = function(path, hash, cb) {
    fs.stat(path, function (err, stat) {
        if (err) {
            cb(err);
        } else {
            cb('ed2k://|file|' + path.split('/').pop() + '|' + stat.size + '|' + hash);
        }
    });
};

/* The exposed function, takes an absolute filesystem path and a callback.
 * path - Absolute path to file. Type: String.
 * callback - function(ed2k_uri)
 *     ed2k_uri - an ed2k uri for the file at path. Type: String.
 */
var ed2k_for_filepath = function(path, callback) {
    if (typeof path === 'string') {
        ed2k_hash_file(path, function (hash) {
            ed2k_hash_to_uri(path, hash, callback);
        });
    }
};

module.exports.ed2k_for_filepath = ed2k_for_filepath;

