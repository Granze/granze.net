exports.index = function(req, res){
  var feedparser = require('feedparser');

  feedparser.parseUrl('http://ws.audioscrobbler.com/1.0/user/granzebru/recenttracks.rss')
    .on('article', function(article){
      console.log(article);
      res.render('index', {lastfm: article});
    });

};