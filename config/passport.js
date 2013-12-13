/**
 * Created by sbering on 12/12/13.
 */

var LocalStrategy = require('passport-local').Strategy,
    GoogleStrategy = require('passport-google').Strategy,
    hash = require('../utils/hash');

module.exports = function(app, passport, config) {

    // setup how we serialize to cookie
    passport.serializeUser(function(user, done) {
       done(null, user.id);
    });

    // setup how we load a user from the cookie id
    passport.deserializeUser(function(id, done) {
       var User = app.get('models').User;

       User.findOne({ id: id }, function(err, user) {
          done(err, user);
       });
    });

    // set up our local authentication strategy
    passport.use(new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password'
        },
        function(username, password, done) {
            var UserCredential = app.get('models').UserCredential;
            UserCredential.findOne({ username: username, include: [ User ]}, function(err, credential) {
                if (err) {
                    return done(err);
                }

                if (!credential) {
                    console.log('unable to locate userCredential by username');
                    return done(null, false, { message: "Incorrect username" });
                }

                console.log(credential);

                // hash the provided password and see if it matches the one on file
                hash(password, credential.passwordsalt, function(err, hash) {
                    if (err) {
                        console.log('password does not match password on file.');
                        return done(err);
                    }
                    if (hash == credential.passwordhash) {
                        console.log('password matches password on file for user');
                        return done(null, credential.User);
                    }

                    // password does not match
                    console.log('password does not match password on file.');
                    return done(null, false, { message: "Incorrect password." });
                })
            });
        }
    ));


    // set up google authentication strategy
    passport.use(new GoogleStrategy(
        {
            returnURL: 'http://localhost:3000/auth/google/return',
            realm: 'http://localhost:3000'
        },
        function(identifier, profile, done) {
            var User = $app.get('models').User;
            User.findOrCreate({ provider: 'google', provider_id: identifier }, {
                displayName: profile.displayName,
                givenName: profile.name.givenName,
                middleName: profile.name.middleName,
                familyName: profile.name.familyName
            })
                .success(function(user, created) {
                    console.log(user);
                    console.log('New user? ' + created);
                });
        }
    ));
};