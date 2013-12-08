/**
 * Created by stevebering on 12/7/13.
 */

/* serve json to our AngularJs Client */

var data = {
    "sessions": [
        {
            "id": 1,
            "name": "Session 1",
            "startDate": new Date('1/1/2013'),
            "endDate": new Date('5/30/2013')
        },
        {
            "id": 2,
            "name": "Session 2",
            "startDate": new Date('6/1/2013')
        }
    ],
    "users": [
        {
            "id": 1,
            "firstName": "Steve",
            "lastName": "Bering",
            "emailAddress": "stevebering@gmail.com"
        },
        {
            "id": 2,
            "firstName": "Katie",
            "lastName": "Bering",
            "emailAddress": "katiebering@gmail.com"
        }
    ]
};

// get

exports.sessions = function(req, res) {
    var sessions = [];

    data.sessions.forEach(function(session, i) {
        sessions.push({
            id: session.id,
            name: session.name,
            startDate: session.startDate,
            endDate: session.endDate,
        });
    });

    res.json({
        sessions: sessions
    });
};

exports.users = function(req, res) {
    var users = [];

    data.users.forEach(function(user, i) {
        users.push({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            emailAddress: user.emailAddress
        });
    });

    res.json({
        users: users
    });
};

exports.addUser = function(req, res) {
    var user = req.body;
    console.log('Adding user: ' + JSON.stringify(user));

    data.users.push(user);

    res.writeHead(201);
    res.end();
}

exports.addSession = function(req, res) {
    var session = req.body;
    console.log('Adding session: ' + JSON.stringify(session));

    data.sessions.push(session);

    res.writeHead(201);
    res.end();
}