
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    passport = require('passport'),
    config = require('config'),
    app = express(),
    auth = require('./middleware/auth');

require('./config/passport')(app, passport, config);

// all environments
app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    // use the models throughout the application
    app.set('models', require('./models'));

    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.session({ secret: '4F7DC2D4FDUIFDJCDFD' }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/components', express.static(path.join(__dirname, '/bower_components')));
    // router needs to go after statics or wildcard will handle statics as well
    app.use(app.router);
});

// development only
app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// production only
app.configure('production', function() {
    app.use(express.errorHandler());
});

// configure routes
app.get('/', routes.index);
app.get('/anon/:name', routes.anon);
app.get('/partials/:name', auth, routes.partials);

// authentication routes
var authentication = require('./routes/auth');
app.get('/loggedIn', authentication.loggedIn);
app.post('/login', passport.authenticate('local'), authentication.login);
app.post('/logout', authentication.logout);

// json api
var api = require('./routes/api')(app);

app.get('/api/sessions', api.sessions);
app.get('/api/users', api.users);
app.get('/api/users/:userId', api.getSingleUser);
app.get('/api/sessions/current', api.getActiveSession);
app.get('/api/splits/:session/:user', api.getUserSessionSplits);

app.post('/api/users', api.addUser);
app.post('/api/registerUser', api.registerUser);
app.post('/api/sessions', api.addSession);

// redirect all others to the index (html5 history) - catchall
app.get("*", routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
