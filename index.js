var express = require('express');
var app = express();
var passport = require('passport');
var googleStrategy = require('passport-oauth2').Strategy;
var bodyParser = require('body-parser');

process.env.PWD = process.cwd();
var port = (process.env.PORT || 5000);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new googleStrategy({
    authorizationURL: 'https://accounts.google.com/o/oauth2/auth',
    tokenURL: 'https://accounts.google.com/o/oauth2/token',
    callbackURL: 'http://trello-cal.herokuapp.com/api/auth/google/callback',
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  },
  function(accessToken, refreshToken, profile, done) {
    console.log('AccessToken: ' + accessToken);
    console.log('RefreshToken: ' + refreshToken);
    console.log('Profile: ' + JSON.stringify(profile));
    return done(null, {
      'accessToken': accessToken,
      'refreshToken': refreshToken,
      'profile': profile });
  }
));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var router = express.Router();

router.get('/env', function(req, res) {
  res.json({ env: process.env });
});

router.get('/auth/google',
  passport.authenticate('oauth2', { scope: [
    'https://www.googleapis.com/auth/calendar.readonly'
  ] }),
  function(req, res){ }
);

router.get('/auth/google/callback',
  passport.authenticate('oauth2', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });

app.use('/api', router);
app.use(express.static(process.env.PWD + '/public'));
app.listen(port);
console.log("Server running at localhost:" + port);
