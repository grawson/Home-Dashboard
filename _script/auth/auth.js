var x = require('./calendarAuth.js');

x.authorize(function(auth) {
    console.log("Stored token!");
});
