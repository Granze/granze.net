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
  var getTweets = Rx.Observable.fromNodeCallback(T.get);

  var ottoa$ = parseURL(ottoaURL, options)
    .pluck('items');

  var medium$ = parseURL('https://medium.com/feed/@granze')
    .pluck('items');

  var github$ = parseURL('https://github.com/Granze.atom')
    .pluck('items');

   //var twitter$ = getTweets('statuses/user_timeline', {count: 10});
     //.map(function(tweet) {
     //  console.log(tweet);
     //  return {
     //    date: relativeDate(new Date(tweet.created_at)),
     //    text: tweet.text,
     //    id: tweet.id_str
     //  };
     //});

  Rx.Observable.combineLatest(
    ottoa$,
    medium$,
    github$,
    //twitter$,
    function(ottoaItems, mediumItems, githubItems, twitterItems) {
      var slittedItems = ottoaItems.map(function(item) {
        var ascent = item.summary.replace('<br>', '').split(',');

        return {
          route: ascent[0],
          crag: ascent[1],
          date: item.time_ago
        };
      });

      return {ottoa: slittedItems, medium: mediumItems, github: githubItems, twitter: twitterItems}
    }
  ).subscribe(
    function(results){
      return res.render('index', results);
    }
  );

};
