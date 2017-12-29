var x = require('./CalendarAuth.js');

x.authorize(function(auth) {
    console.log("Stored token!");
});
