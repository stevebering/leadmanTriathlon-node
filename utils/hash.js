/**
 * Created by sbering on 12/12/13.
 */

var crypto = require('crypto');

var byteSize = 33,
    iterations = 12000;

/**
 * Hashes a password with optional `salt`, otherwise
 * generate a salt for `pass` and invoke `fn(err, salt, hash)`.
 *
 * @param {String} pwd
 * @param {String} salt optional
 * @param {Function} fn callback
 * @api public
 */
module.exports = function(pwd, salt, fn) {
    if (3 == arguments.length) {
        if (!pwd) return fn(new Error('Password missing'));
        if (!salt) return fn(new Error('Salt missing'));
        crypto.pbkdf2(pwd, salt, iterations, byteSize, function(err, hash) {
            if (err) return fn(err);
            fn(null, hash.toString('base64'));
        });
    }
    else {
        fn = salt;
        if (!pwd) return fn(new Error('Password missing'));
        crypto.randomBytes(byteSize, function(err, salt) {
            if (err) return fn(err);
            salt = salt.toString('base64');
            crypto.pbkdf2(pwd, salt, iterations, byteSize, function(err, hash) {
                if (err) return fn(err);
                fn(null, salt, hash.toString('base64'));
            })
        })
    }
};