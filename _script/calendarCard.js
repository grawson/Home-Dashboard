var Mustache = require("mustache");

var DOW = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


function render() {
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

    // Weeks
    var currDay = 1;
    data.weeks = []
    for (var i = 1; i <= 4; i++) {

        data.weeks.push([{"weekNumber": i}]);

        // Days
        data.weeks[i-1].days = [];
        for (var j = 0; j < 7; j++) {
            data.weeks[i-1].days.push({"dayNumber": currDay});
            currDay += 1;

            // Events
            data.weeks[i-1].days[j].events = []
            for (var k = 0; k < 3; k++) {
                data.weeks[i-1].days[j].events.push({"eventTitle": "Event"});
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
    render();
};
