/* VAR ********************************************************************************/

var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

// If modifying these scopes, delete your previously saved credentials
var SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
var TOKEN_DIR = "./_script/auth";
var TOKEN_PATH = "./access_token.json";
var SECRET_PATH = "./client_secret.json";

/* MODULE ********************************************************************************/

exports.authorize = function(callback) {
    var oauth2Client = setup();
    oauth2Client.credentials = require(TOKEN_PATH);
    callback(oauth2Client);
};


exports.getNewToken = function(callback) {
    var oauth2Client = setup();
    var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('Enter the code from that page here: ', function(code) {
        rl.close();
        oauth2Client.getToken(code, function(err, token) {
            if (err) {
                console.log('Error while trying to retrieve access token', err);
                return;
            }
            oauth2Client.credentials = token;
            storeToken(token);
        });
    });
};

/* FUNC ********************************************************************************/

function setup() {
    var credentials = require(SECRET_PATH);
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var auth = new googleAuth();
    return new auth.OAuth2(clientId, clientSecret, redirectUrl);
}

/**
* Store token to disk be used in later program executions.
*
* @param {Object} token The token to store to disk.
*/
function storeToken(token) {
    try {
        fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
        if (err.code != 'EEXIST') {
            throw err;
        }
    }
    fs.writeFile(TOKEN_DIR + "/access_token.json", JSON.stringify(token));
    console.log('Token stored to ' + TOKEN_DIR);
}
