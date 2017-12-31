var x = require('./CalendarAuth.js');

x.getNewToken(function(auth) {
    console.log("Stored token!");
});
