
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');
var _ = require('underscore');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
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

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
