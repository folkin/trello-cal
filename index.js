var express = require('express');
var app = express();
var GoogleAuth = require('./googleauth');
var jwt = require('jwt-simple');

process.env.PWD = process.cwd();
var port = (process.env.PORT || 5000);

var googleAuth = new GoogleAuth({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/calendar.readonly'
    ]
});

var router = express.Router();

router.get('/env', function(req, res) {
  res.json({ env: process.env });
});

router.get('/auth/google', function(req, res, next) { googleAuth.authenticate(req, res, next); });
router.get('/auth/google/callback', function(req, res, next) { googleAuth.extractToken(req, res, next); });

router.get('/token/decode', function(req, res, next) {
    console.log('> decode token: ' + req.query.token + '  secret: ' + process.env.GOOGLE_CLIENT_SECRET);
    var token = jwt.decode(req.query.token, process.env.GOOGLE_CLIENT_SECRET, true);
    res.send(token);
});

app.use('/api', router);
app.use(express.static(process.env.PWD + '/public'));


app.listen(port);
console.log("Server running at localhost:" + port);
