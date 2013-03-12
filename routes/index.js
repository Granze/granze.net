exports.index = function(req, res){
  var feedparser = require('feedparser');

  var parsedRss = function (article) {
    console.log(JSON.stringify(article));
    return JSON.stringify(article);
  };

  feedparser.parseUrl('http://ws.audioscrobbler.com/1.0/user/granzebru/recenttracks.rss').on('article', parsedRss);

  res.render('index', {lastfm: parsedRss});
};