exports.index = function(req, res) {

  'use strict';

  var Twit = require('twit'),
      config = require('../config.js'),
      parser = require('rssparser2'),
      async = require('async'),
      relativeDate = require('relative-date');

  var T = new Twit({consumer_key: config.consumerKey, consumer_secret: config.consumerSecret, access_token: config.accessToken, access_token_secret: config.accessSecret});

  async.parallel({
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
