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
                var end = event.end.dateTime || event.end.date;
                var startDate = new Date(start);
                var endDate = new Date(end);

                // console.log("%s - %s", startDate, event.summary);
                // console.log("%s - %s", endDate, event.summary);

                 // All day event: time zone must be set to UTC +0
                if (start.indexOf("T") == -1) {
                    // Will change the time and date, but not the time zone tag
                    var timeZone = startDate.getTimezoneOffset() / 60
                    startDate.setUTCHours(timeZone);
                    var dateStr = startDate.getFullYear() + "-" + (startDate.getMonth()+1) + "-" + startDate.getDate()
                    if (eventData[dateStr] == null) {
                        eventData[dateStr] = [];
                    }
                    eventData[dateStr].push({
                        "summary": event.summary,
                        "start": "All"
                    });
                }

                // Add to events data
                else if (startDate.getDate() == endDate.getDate()) { // single day event
                    var dateStr = startDate.getFullYear() + "-" + (startDate.getMonth()+1) + "-" + startDate.getDate()
                    if (eventData[dateStr] == null) {
                        eventData[dateStr] = [];
                    }
                    eventData[dateStr].push({
                        "summary": event.summary,
                        "start": time(startDate)
                    });

                // multi day event
                } else {
                    for (j = startDate.getDate(); j <= endDate.getDate(); j++) {
                        var dateStr = startDate.getFullYear() + "-" + (startDate.getMonth()+1) + "-" + j
                        if (eventData[dateStr] == null) {
                            eventData[dateStr] = [];
                        }

                        var startLabel = "All";
                        if (j == startDate.getDate()) { // fist day of multi day event
                            startLabel = time(startDate);
                        } else if (j == endDate.getDate()) { // last day
                            startLabel = "12:00 AM"
                        }

                        eventData[dateStr].push({
                            "summary": event.summary,
                            "start": startLabel
                        });
                    }
                }
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
    var numRows = Math.ceil((numDaysInMonth+firstDOM)/7.0)
    data.weekHeight = 100/numRows; // dynamically calc week height
    for (var i = 1; i <= numRows ; i++) { // Only create necessary # rows in calendar

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

            // Color today
            if (currDayLabel === today.getDate()) {
                data.weeks[i-1].days[j].dayColor = "today";
            }

            // Events
            var dateLabel = (today.getFullYear()) + "-" + (today.getMonth()+1) + "-" + (currDayLabel);
            data.weeks[i-1].days[j].events = []
            if (eventData[dateLabel] != null) {
                for (var k = 0; k < eventData[dateLabel].length; k++) {
                    data.weeks[i-1].days[j].events.push({
                        "eventTitle": eventData[dateLabel][k]["summary"],
                        "eventTime": eventData[dateLabel][k]["start"]
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


function time(date) {
    var hrs = date.getHours() % 12;
    var meridiem = date.getHours() >= 12 ? "PM" : "AM"
    var min = date.getMinutes()
    if (min < 10) { min = "0" + min };
    return hrs + ":" + min + " " + meridiem;
}


window.onload = function(){

    calendarAuth.authorize(function(auth) {

        listEvents(auth, function(eventData) {
            render(eventData);
        });

    });

};
