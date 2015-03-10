
var unirest = require('unirest');

function GoogleCalendar(opts) {
    opts = opts || {};
    this._options = {
        baseUrl: opts.baseUrl || 'https://www.googleapis.com/calendar/v3'
    };
}

module.exports = GoogleCalendar;

GoogleCalendar.prototype.getCalendars = function(accessToken, callback) {
    var opts = this._options;

    unirest.get(opts.baseUrl + '/users/me/calendarList')
        .header('Accept', 'application/json')
        .header('Authorization', 'Bearer ' + accessToken)
        .as.json(function(res) {
            console.log('  - recieved calendar list:' + JSON.stringify(res.body));
            if (res.statusType == 2) {
                callback(null, res.body);
            }
            else {
                callback(res.body);
            }
        });
}
