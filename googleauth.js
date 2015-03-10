var qs = require('querystring');
var unirest = require('unirest');

function exchangeCodeForToken(code, opts, next) {
    var params = {
        'code': code,
        'client_id': opts.clientId,
        'client_secret': opts.clientSecret,
        'redirect_uri': opts.callbackUrl,
        'grant_type': 'authorization_code'
    };

    unirest.post(opts.tokenUrl)
        .header('Accept', 'application/json')
        .type('application/x-www-form-urlencoded')
        .send(qs.stringify(params))
        .as.json(function(res) {
            console.log('  - recieved auth token (' + res.status + '): ' + JSON.stringify(res.body));
            if (res.statusType == 2) {
                next.send(JSON.stringify(res.body));
            }
            else {
                next.send(response.raw_body);
            }
        });
}


function GoogleAuth(opts) {
    opts = opts || {};
    this._options = {
        authorizationUrl: opts.authorizationUrl || 'https://accounts.google.com/o/oauth2/auth',
        tokenUrl: opts.tokenUrl || 'https://accounts.google.com/o/oauth2/token',
        refreshUrl: opts.refreshUrl || 'https://www.googleapis.com/oauth2/v3/token',
        callbackUrl: opts.callbackUrl || 'http://trello-cal.herokuapp.com/api/auth/google/callback',
        clientId: opts.clientId,
        clientSecret: opts.clientSecret,
        scope: opts.scope || []
    };
}

module.exports = GoogleAuth;

GoogleAuth.prototype.authenticate = function(req, res, next) {
    var opts = this._options;

    var params = {
      'redirect_uri': opts.callbackUrl,
      'response_type': 'code',
      'client_id': opts.clientId,
      'scope': opts.scope.join(' '),
      'access_type': 'offline',
      'include_granted_scopes': true
    };
    var authUrl = opts.authorizationUrl + '?' + qs.stringify(params);
    authUrl = authUrl.replace('%20', '+');
    res.redirect(authUrl);
    console.log('  - redirecting to: ' + authUrl);
};


GoogleAuth.prototype.extractToken = function(req, res, next) {
    var opts = this._options;

    if (req.query.error) {
        console.log('  - recieved auth code error: ' + req.query.code);
        next(req.query.error);
    }
    else if (req.query.code) {
        console.log('  - recieved auth code: ' + req.query.code);
        exchangeCodeForToken(req.query.code, opts, res);
    }
    else {
        console.log('  - recieved unknown auth code: ' + req);
    }
};

GoogleAuth.prototype.getAccessToken = function(refreshToken, callback) {
    var opts = this._options;

    var params = {
        'refresh_token': refreshToken,
        'client_id': opts.clientId,
        'client_secret': opts.clientSecret,
        'grant_type': 'refresh_token'
    };

    unirest.post(opts.refreshUrl)
        .header('Accept', 'application/json')
        .type('application/x-www-form-urlencoded')
        .send(qs.stringify(params))
        .as.json(function(res) {
            console.log('  - recieved auth token (' + res.status + '): ' + JSON.stringify(res.body));
            if (res.ok) {
                callback(null, res.body);
            }
            else {
                callback(res.body);
            }
        });
}
