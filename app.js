'use strict';

var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    hbs = require('hbs'),
    path = require('path'),
    hookshot = require('hookshot'),
    app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hbs');
  app.use(express.logger('dev'));
  app.use(express.urlencoded());
  app.use(express.json());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  hbs.registerPartials(__dirname + '/views/partials');
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.use('/deploy', hookshot('refs/heads/master', 'cd ~/www/granze.net && git pull && pm2 restart all'));
app.get('/', routes.index);
app.get('/about', function(req, res){
  res.render('about');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
