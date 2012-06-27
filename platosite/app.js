var fbId= "448791841807277";
var fbSecret= "a2bfeea5d12788420dc3333e51374595";
//var fbCallbackAddress= "http://coursedex.com/fblogin";
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
    auth.Facebook({appId : fbId, appSecret: fbSecret, scope: "email"})
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

// Routes
app.get('*', function(req, res, next){
  console.log(req.url);
  next();
});
app.get('/', routes.index);
app.get('/project/:pid/*', routes.projectfile);
app.get('/project/:pid', routes.project);
app.get('/script/:pid/*', routes.script);

app.get('/tags', routes.tags);
app.get('/tags/:tag', routes.tag);
app.get('/projects', routes.projects);
app.get('/projects/:project', routes.project);
app.get('/projects/:project/*', routes.projectfile);
app.get('/collections', routes.collections);

app.get('/login', routes.login);
app.get('/fblogin', routes.fblogin);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
