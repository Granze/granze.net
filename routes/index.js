exports.index = function(req, res){

  var twitter = require('simple-twitter');
  twitter = new twitter(consumerKey, //consumer key from twitter api
                        consumerSecret, //consumer secret key from twitter api
                        accessToken, //acces token from twitter api
                        accessSecret, //acces token secret from twitter api
                        3600  //(optional) time in seconds in which file should be cached (only for get requests), put false for no caching
                        );

  var parser = require('rssparser'),
      async = require('async'),
      options = {headers:{'user-agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1468.0 Safari/537.36'}};

  async.parallel({
    ottoa: function(callback){
      parser.parseURL('http://www.8a.nu/rss/Main.aspx?UserId=19212&AscentType=0&ObjectClass=2&GID=3974d72911c05719152f0953e88cc2df', options, function(err, out){
        var ascentData = [],
            items = out.items.slice(0,10);

        for (var i = 0; i < items.length; i++) {
          var ascent = out.items[i].summary.split('<br>'),
              route = ascent[0].split(','),
              grade = route[0].slice(-3).trim(),
              name = route[0].slice(0, -3).trim(),
              crag = route[1];

              ascentData.push({route: name, grade: grade, crag: crag});
        }
        callback(null, ascentData);
      });
    },
    lastfm: function(callback){
      parser.parseURL('http://ws.audioscrobbler.com/1.0/user/granzebru/recenttracks.rss', options, function(err, out){
        callback(null, out.items);
      });
    },
    github: function(callback){
      parser.parseURL('https://github.com/Granze.atom', options, function(err, out){
        if(err) {
          callback(null, err);
        } else {
          callback(null, out.items.slice(0,10));
        }
      });
    },
    twitter: function(callback){
      twitter.get('statuses/user_timeline', function(error, out) {
        var tweets = JSON.parse(out).slice(0,10),
            tweetsData = [];
        for (var i = 0; i < tweets.length; i++) {
          var text = tweets[i].text;

          tweetsData.push({text: text});
        }
        callback(null, tweetsData);
      });
    }
  },
  function(err, results) {
    res.render('index', results);
  });

};