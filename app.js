
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    api = require('./routes/api'),
    http = require('http'),
    path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/components', express.static(path.join(__dirname, '/bower_components')));
// router needs to go after statics or wildcard will handle statics as well
app.use(app.router);

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
app.get('/partials/:name', routes.partials);

// json api
app.get('/api/sessions', api.sessions);
app.get('/api/users', api.users);

app.post('/api/users', api.addUser);
app.post('/api/sessions', api.addSession);

// redirect all others to the index (html5 history) - catchall
app.get("*", routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
