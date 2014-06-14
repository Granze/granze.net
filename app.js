'use strict';

var express = require('express'),
    routes = require('./routes'),
    hbs = require('hbs'),
    path = require('path'),
    hookshot = require('hookshot'),
    morgan = require('morgan'),
    methodOverride = require('method-override'),
    bodyParser = require('body-parser'),
    app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
app.use(morgan());
app.use(bodyParser());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
hbs.registerPartials(__dirname + '/views/partials');

app.use('/deploy', hookshot('refs/heads/master', 'cd ~/www/granze.net && git pull && pm2 restart all'));
app.get('/', routes.index);
app.get('/about', function(req, res){
  res.render('about');
});

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
