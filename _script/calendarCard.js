const Mustache = require("mustache");
const calendarAuth = require('./auth/CalendarAuth');
const google = require('googleapis');


const DOW = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const MONTHS = ["January", "February", "March", "April", "May", "June", "July",
                "August", "September", "October", "November", "December"];



function listEvents(auth, callback) {
    var eventData = {};
    var calendar = google.calendar('v3');
    var today = new Date();
    calendar.events.list({
        auth: auth,
        calendarId: 'primary',
        timeMin: (new Date(today.getYear(), today.getMonth()+1, 1)).toISOString(),
        maxResults: 2500,
        singleEvents: true,
        orderBy: 'startTime'
    }, function(err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
        var events = response.items;
        if (events.length == 0) {
            console.log('No upcoming events found.');
        } else {
            for (var i = 0; i < events.length; i++) {
                var event = events[i];
                var start = event.start.dateTime || event.start.date;

                console.log("%s - %s", start, event.summary);

                // remove time
                var timeIndex = start.indexOf("T");
                var startDate = start;
                if (timeIndex != -1) {
                     startDate = start.substring(0, timeIndex);
                 }
                startDate = startDate.replace("-0", "-"); //remove padding

                // Add to events data
                if (eventData[startDate] == null) {
                    eventData[startDate] = [];
                }
                eventData[startDate].push(event.summary);
            }
        }
        callback(eventData);
    });
}

function render(eventData) {
    data = {}

    // Current day
    var today = new Date();
    data.currentDay = DOW[today.getDay()]
                    + ", " + MONTHS[today.getMonth()]
                    + " " + ordinalSuffixOf(today.getDate());

    // Days of week
    data.dow = []
    for (var i = 0; i < 7; i++) {
        data.dow.push({"dowTitle": DOW[i].charAt(0)});
    }

    // Calculate start and end of the month
    var firstDOM = new Date(today.getYear(), today.getMonth()+1, 1).getDay()
    var numDaysInMonth = new Date(today.getYear(), today.getMonth()+1, 0).getDate();

    var currDay = 1;
    data.weeks = []
    for (var i = 1; i <= Math.ceil((numDaysInMonth+firstDOM)/7.0); i++) { // Only create necessary # rows in calendar

        data.weeks.push([{"weekNumber": i}]);

        // Days
        data.weeks[i-1].days = [];
        for (var j = 0; j < 7; j++) {

            // Make sure day number is in the current month
            var currDayLabel = " ";
            if (currDay <= numDaysInMonth && (j >= firstDOM || i > 1)) {
                currDayLabel = currDay;
                currDay++;
            }
            data.weeks[i-1].days.push({"dayNumber": currDayLabel});

            // Events
            var dateLabel = (today.getFullYear()) + "-" + (today.getMonth()+1) + "-" + (currDayLabel);
            data.weeks[i-1].days[j].events = []
            if (eventData[dateLabel] != null) {
                for (var k = 0; k < eventData[dateLabel].length; k++) {
                    data.weeks[i-1].days[j].events.push({
                        "eventTitle": eventData[dateLabel][k]
                    });
                }
            }
        }
    }

    // Render
    $.get('./_view/calendarCard.mst', function(template) {
       var rendered = Mustache.render(template, data);
       $('#calendar-card').html(rendered);
    });
}

function ordinalSuffixOf(i) {
    var j = i % 10, k = i % 100;
    if (j == 1 && k != 11) { return i + "st"; }
    if (j == 2 && k != 12) { return i + "nd"; }
    if (j == 3 && k != 13) { return i + "rd"; }
    return i + "th";
}

window.onload = function(){

    calendarAuth.authorize(function(auth) {

        listEvents(auth, function(eventData) {
            render(eventData);
        });

    });

};
