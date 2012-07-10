var fbId= "448791841807277";
var fbSecret= "a2bfeea5d12788420dc3333e51374595";
var fbCallbackAddress= "http://coursedex.com/login";
var cookieSecret = "scsd";
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var _ = require('underscore');
var auth= require('connect-auth');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({secret: cookieSecret}));
  app.use(auth( [
    auth.Facebook({appId : fbId, appSecret: fbSecret, scope: "email", callback: fbCallbackAddress})
  ]));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.all('/*', function(req, res, next) {
    //console.log('CORS', req.headers);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Request-Method", "GET,POST");
    next();
});

// Routes

app.get('/', routes.index);
app.get('/project/:pid/', routes.project);
app.get('/project/:pid', routes.project);

app.get('/project/:pid/*', routes.projectfile);
app.get('/script/:pid/*', routes.script);

app.get('/tags', routes.tags);
app.get('/tags/:tag', routes.tag);
app.get('/projects', routes.projects);
app.get('/projects/:project', routes.project);
app.get('/projects/:project/*', routes.projectfile);
app.get('/collections', routes.collections);

app.get('/login', routes.login);
app.get('/new/project', routes.isLoggedIn, routes.newProject);
app.post('/new/project', routes.isLoggedIn, routes.createNewProject);
app.get('/new/tag', routes.isLoggedIn, routes.newTag);
app.post('/new/tag', routes.isLoggedIn, routes.createNewTag);
app.get('/update/:pid', routes.updateProject);
app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
