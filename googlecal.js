
var unirest = require('unirest');
var moment = require('moment');
var qs = require('querystring');

function GoogleCalendar(opts) {
    opts = opts || {};
    this._options = {
        accessToken: opts.accessToken,
        baseUrl: opts.baseUrl || 'https://www.googleapis.com/calendar/v3'
    };
}

module.exports = GoogleCalendar;

GoogleCalendar.prototype.getCalendars = function(callback) {
    var opts = this._options;

    unirest.get(opts.baseUrl + '/users/me/calendarList')
        .header('Accept', 'application/json')
        .header('Authorization', 'Bearer ' + ops.accessToken)
        .as.json(function(res) {
            console.log('  - recieved calendar list:' + JSON.stringify(res.body));
            if (res.ok) {
                callback(null, res.body);
            }
            else {
                callback(res.body);
            }
        });
}


GoogleCalendar.prototype.getEvents = function(calendarID, date, callback) {
      var opts = this._options;

      var dt = moment(date).format('YYYY-MM-DD');
      var params = {
          'timeMin' : dt,
          'timeMax' : dt
      };

      var url = opts.baseUrl + '/calendars/' + calendarID + '/events?' + qs.stringify(params);

      unirest.get(url)
          .header('Accept', 'application/json')
          .header('Authorization', 'Bearer ' + ops.accessToken)
          .as.json(function(res) {
              console.log('  - recieved calendar list:' + JSON.stringify(res.body));
              if (res.ok) {
                  callback(null, res.body);
              }
              else {
                  callback(res.body);
              }
          });
}
