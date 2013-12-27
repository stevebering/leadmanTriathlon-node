/**
 * Created by stevebering on 12/7/13.
 */

/* serve json to our AngularJs Client */
var hash = require('../utils/hash'),
    Sequelize = require('sequelize'),
    math = require('../utils/math');

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

        // get active session
        getActiveSession: function(req, res) {
            console.log("looking for active session...");
            Session.find({
                where: ["startDate <= ? AND (endDate IS NULL || endDate >= ?)", new Date(), new Date()]
            })
            .error(function(err) {
                console.log('Unable to locate any active sessions');
                res.status(404)
                    .send('Could not find any active sessions');
            })
            .success(function(session) {
                if (session == null || !session.isActive) {
                    res.status(404).send("Not found.");
                    return;
                }
                console.log('Found session %s with name %s', session.id, session.name);
                var details = {
                    id: session.id,
                    firstName: session.name,
                    startDate: session.startDate
                };
                res.json({
                    session: details
                });
            });
        },

        // get specific user
        getSingleUser: function(req, res) {
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

        // get specific user
        getUserSessionSplits: function(req, res) {
            var sessionId = req.params.session,
                userId = req.params.user,
                splits = [];

            console.log("looking for splits for user with id %s in session %s", userId, sessionId);
            Split.findAll({
                where: {
                    user_id: userId,
                    session_id: sessionId
                },
                order: 'startDate ASC'
            })
            .error(function(err) {
                res.status(404)
                    .send('Could not find splits for user %s in session %s.', userId, sessionId);
            })
            .success(function(records) {
                records.forEach(function(row) {
                    var split = {
                        id: row.id,
                        name: row.name,
                        startDate: row.startDate,
                        activeTime: row.activeTime,
                        distance: row.distanceTotal,
                        activityType: row.activityType
                    };
                    console.log(split);
                    splits.push(split);
                });

                var totalRuns = math.summarize(records, 'run'),
                    totalSwims = math.summarize(records, 'swim'),
                    totalRides = math.summarize(records, 'bike'),
                    runLength = 26.0,
                    swimLength = 2.4,
                    bikeLength = 112.0;

                console.log('all splits loaded. Found: ' + records.length);
                console.log('runs: %s of %d', totalRuns, runLength);
                console.log('bikes: %s of %d', totalRides, bikeLength);
                console.log('swims: %s of %d', totalSwims, swimLength);

                res.send({
                    runs: {
                        distance: totalRuns,
                        expectation: runLength,
                        remaining: runLength - totalRuns
                    },
                    rides: {
                        distance: totalRides,
                        expectation: bikeLength,
                        remaining: bikeLength - totalRides
                    },
                    swims: {
                        distance: totalSwims,
                        expectation: swimLength,
                        remaining: swimLength - totalSwims
                    },
                    splits: splits
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
            var submission = req.body
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
                        familyName: submission.lastName,
                        mapmyfitness_id: submission.mapmyfitnessid
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
                                //req.login(credential);
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