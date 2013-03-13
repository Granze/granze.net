exports.index = function(req, res){

  // var parser = require('blindparser');

  // parser.parseURL('http://ws.audioscrobbler.com/1.0/user/granzebru/recenttracks.rss', function(err, out){
  //   console.log(out);
  //   console.log('=> errors: ' + err);
  //   res.render('index', {lastfm: out});
  // });


  //http://www.8a.nu/rss/Main.aspx?UserId=19212&AscentType=0&ObjectClass=2&GID=3974d72911c05719152f0953e88cc2df

  var feed = require("feed-read");
    feed("http://ws.audioscrobbler.com/1.0/user/granzebru/recenttracks.rss", function(err, articles) {
      console.log(err);
      console.log(articles);
      res.render('index', {lastfm: articles});
  });

};