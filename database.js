
var pg = require('pg');


function getClient(connString) {
    return new pg.Client(connString + '?ssl=true');
}

function select(connString, query, callback) {
    var client = getClient(connString);

    client.connect(function(err) {
        if(err) {
            console.log(err);
            callback(err);
            return;
        }

        client.query(query, function(err, result) {
            callback(err, result);
            client.end();
        });
    });
}

function Database(opts) {
    opts = opts || {};
    this._options = {
        'connString': opts.connString
    };
}


module.exports = Database;

Database.prototype.getAccounts = function(callback) {
    select (this._options.connString, 'select * from account', function(err, result) {
        var accts = [];

        if (err) {
            console.log(err);
            callback(err, accts);
            return;
        }

        for (var i = 0; i < result.rows.length; i++) {
            var row = result.rows[i];
            accts.push({
                'id': row.id,
                'email': row.email,
                'google': row.google,
                'trello': row.trello
            });
        }
        callback(null, accts);
    });
}
