/**
 * Created by stevebering on 12/7/13.
 */

/* serve json to our AngularJs Client */
var hash = require('../utils/hash'),
    Sequelize = require('sequelize');

module.exports = function(app) {
    var User = app.get('models').User,
        UserCredential = app.get('models').UserCredential,
        Session = app.get('models').Session,
        Split = app.get('models').Split;

    return {
        // get all sessions
        sessions: function(req, res) {
            var sessions = [];

            Session.findAll().success(function(records) {
                records.forEach(function(record) {
                    var session = {
                        id: record.id,
                        name: record.name,
                        startDate: record.startDate,
                        endDate: record.endDate,
                        isActive: record.isActive
                    };
                    console.log(session);
                    sessions.push(session);
                });

                res.json({
                       sessions: sessions
                    });
            });
        },

        // get all users
        users: function(req, res) {
            var users = [];

            console.log('loading all users...');
            User.findAll().success(function(records) {
                records.forEach(function(record) {
                    var user = {
                        id: record.id,
                        firstName: record.givenName,
                        lastName: record.familyName,
                        emailAddress: record.provider_id
                    };
                    console.log(user);
                    users.push(user);
                });

                console.log('all users loaded. Found: ' + records.length);
                res.json({
                    users: users
                });
            });
        },

        // get specific user
        getUser: function(req, res) {
            var userId = req.params.userId;

            console.log("looking for user with id: " + userId);
            User.find({
                where: { id: userId }
            })
            .error(function(err) {
                console.log('Unable to locate user: ' + userId);
                res.status(404)
                    .send('Could not find user with id ' + userId);
            })
            .success(function(user) {
                if (user == null) {
                    res.status(404).send("Not found.");
                    return;
                }
                console.log('Found user %s with name %s', userId, user.displayName);
                var details = {
                    id: user.id,
                    firstName: user.givenName,
                    lastName: user.familyName
                };
                res.json({
                    user: details
                });
            });
        },

        // post new user
        addUser: function(req, res) {
            var user = req.body;
            console.log('Adding user: ' + JSON.stringify(user));

            User.create({
                provider: 'local',
                provider_id: '0',
                displayName: user.firstName + ' ' + user.lastName,
                givenName: user.firstName,
                familyName: user.lastName
            })
            .success(function(user, created) {
                console.log(user.values);
                res.send(201, "Created user " + user.displayName);
            });
        },

        // post new user
        registerUser: function(req, res) {
            var submission = req.body;
            console.log('Registering user: ' + JSON.stringify(submission));
            hash(submission.password, function(err, salt, hash) {
               if (err) {
                   console.log(err);
                   res.writeHead(400);
                   res.end(err);
                   return;
               }

                // set up all of the db interactions
                var chainer = new Sequelize.Utils.QueryChainer,
                    user = User.build({
                        provider: 'local',
                        provider_id: submission.emailAddress,
                        displayName: submission.firstName + ' ' + submission.lastName,
                        givenName: submission.firstName,
                        familyName: submission.lastName
                    }),
                    credential = UserCredential.build({
                        username: submission.emailAddress,
                        passwordsalt: salt,
                        passwordhash: hash
                    });

                // set up the synchronization
                chainer
                    .add(user.save())
                    .add(credential.save());

                chainer
                    .runSerially({ skipOnError: true })
                    .success(function() {
                        credential.setUser(user).on('success', function() {
                            credential.getUser().on('success', function(u) {
                                console.log('Credential user: ', u.displayName);
                                req.login(credential);
                                res.writeHead(201);
                                res.end();
                            })
                        })
                    })
                    .error(function(err) {
                        console.log(err);
                    });
            });
        },

        // post new session
        addSession: function(req, res) {
            var session = req.body;
            session.startDate = new Date(session.startDate);
            console.log('Adding session: ' + JSON.stringify(session));

            Session.create({
                name: session.name,
                startDate: session.startDate,
                endDate: session.endDate
            })
            .success(function(s, created) {
                console.log(s.values);
                res.writeHead(201);
                res.end();
            });
        }
}};