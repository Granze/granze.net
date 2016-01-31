exports.index = function(req, res) {
  'use strict';

  var Twit = require('twit');
  var config = require('../config.js');
  var parser = require('rssparser2');
  var Rx = require('rx');
  var relativeDate = require('relative-date');

  var options = {headers: {'user-agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1468.0 Safari/537.36'}};
  var ottoaURL = 'http://www.8a.nu/rss/Main.aspx?UserId=19212&AscentType=0&ObjectClass=2&GID=3974d72911c05719152f0953e88cc2df';
  var T = new Twit({consumer_key: config.consumerKey, consumer_secret: config.consumerSecret, access_token: config.accessToken, access_token_secret: config.accessSecret});
  var parseURL = Rx.Observable.fromNodeCallback(parser.parseURL);

  //var ottoa$ = parseURL(ottoaURL, options, function(err, res) {
  //  if(err) {
  //    console.log(err);
  //  } else {
  //    var items = res.items.slice(0, 10);
  //
  //    var ascentData = items.map(function(item) {
  //      var ascent = item.summary.split('<br>');
  //      var route = ascent[0].split(',');
  //
  //      return {
  //        route: route,
  //        grade: route[0].slice(-3).trim(),
  //        crag: route[1],
  //        date: item.time_ago
  //      };
  //    });
  //    return ascentData;
  //  }
  //});

  var medium$ = parseURL('https://medium.com/feed/@granze')
    .take(10)
    .flatMap(function(rss) { return rss.items });

  var github$ = parseURL('https://github.com/Granze.atom')
    .take(1)
    .flatMap(function(rss) { return rss.items });

  //var twitter = function() {
  //  T.get('statuses/user_timeline', {count: 10}, function(err, res) {
  //
  //    var tweetsData = res.map(function(tweet) {
  //      return {date: relativeDate(new Date(tweet.created_at)), text: tweet.text, id: tweet.id_str};
  //    });
  //
  //    callback(null, tweetsData);
  //  });
  //};

  Rx.Observable.zip(
    medium$,
    github$
  ).subscribe(
    function(results){
      return res.render('index', results);
    }
  );

};
