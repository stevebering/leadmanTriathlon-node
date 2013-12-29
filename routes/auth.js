/**
 * Created by stevebering on 12/28/13.
 */
exports.loggedIn = function(req, res) {
    console.log('checking to see if the user is authenticated.');
    console.log('isAuthenticated: ' + req.isAuthenticated());
    console.log('user is...');
    console.log(req.user);
    res.send(req.isAuthenticated() ? req.user : '0');
}

exports.login = function(req, res) {
    console.log('logged in as ' + req.user.givenName);
    res.send(req.user);
}

exports.logout = function(req, res) {
    req.logOut();
    res.send(200);
}