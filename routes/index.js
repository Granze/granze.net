exports.index = function(req, res) {

  'use strict';

  var Twit = require('twit'),
      config = require('../config.js'),
      parser = require('rssparser2'),
      async = require('async'),
      relativeDate = require('relative-date'),
      options = {headers: {'user-agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1468.0 Safari/537.36'}};

  var T = new Twit({consumer_key: config.consumerKey, consumer_secret: config.consumerSecret, access_token: config.accessToken, access_token_secret: config.accessSecret});

  async.parallel({
        ottoa: function(callback) {
          parser.parseURL('http://www.8a.nu/rss/Main.aspx?UserId=19212&AscentType=0&ObjectClass=2&GID=3974d72911c05719152f0953e88cc2df', options, function(err, out) {
            if(err) {
              callback(null, err);
            } else {
              var items = out.items.slice(0, 10);

              var ascentData = items.map(function(item) {
                var ascent = item.summary.split('<br>'),
                    route = ascent[0].split(',');

                return {
                  route: route,
                  grade: route[0].slice(-3).trim(),
                  crag: route[1],
                  date: item.time_ago
                };
              });
              callback(null, ascentData);
            }
          });
        },
        medium: function(callback) {
          parser.parseURL('https://medium.com/feed/@granze', function(err, out) {
            if(err) {
              callback(null, err);
            } else {
              callback(null, out.items.slice(0, 10));
            }
          });
        },
        github: function(callback) {
          parser.parseURL('https://github.com/Granze.atom', function(err, out) {
            if(err) {
              callback(null, err);
            } else {
              callback(null, out.items.slice(0, 10));
            }
          });
        },
        twitter: function(callback) {
          T.get('statuses/user_timeline', {count: 10}, function(err, data) {

            var tweetsData = data.map(function(tweet) {
              return {date: relativeDate(new Date(tweet.created_at)), text: tweet.text, id: tweet.id_str};
            });

            callback(null, tweetsData);
          });
        }
      },
      function(err, results) {
        res.render('index', results);
      });
};
