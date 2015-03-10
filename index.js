var express = require('express');
var app = express();
var GoogleAuth = require('./googleauth');
var GoogleCal = require('./googlecal');
var Database = require('./database');
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

var googleCal = new GoogleCal({});

var db = new Database({
    'connString': process.env.DATABASE_URL
})

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

router.get('/calendar', function(req, res, next) {
    db.getAccounts(function(err, accts) {
        if (err) { next(err); return; }
        var refreshToken = accts[0].google.refresh_token;
        googleAuth.getAccessToken(refreshToken, function(err, token) {
            if (err) { next(err); return; }
            googleCal.getCalendars(token.access_token, function(err, cals) {
                if (err) { next(err); return; }
                res.send(JSON.stringify(cals));
            })
        })
    })
});

app.use('/api', router);
app.use(express.static(process.env.PWD + '/public'));


app.listen(port);
console.log("Server running at localhost:" + port);
