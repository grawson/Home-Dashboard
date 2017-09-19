var Mustache = require("mustache");

var DOW = ["S", "M", "T", "W", "T", "F", "S"];

function render() {
    data = {}

    // Days of week
    data.dow = []
    for (var i = 0; i < 7; i++) {
        data.dow.push({"dow-title": DOW[i]});
    }

    // Weeks
    var currDay = 1;
    data.weeks = []
    for (var i = 1; i <= 4; i++) {

        data.weeks.push([{"week-number": i}]);

        // Days
        data.weeks[i-1].days = [];
        for (var j = 0; j < 7; j++) {
            data.weeks[i-1].days.push({"day-number": currDay});
            currDay += 1;

            // Events
            data.weeks[i-1].days[j].events = []
            for (var k = 0; k < 3; k++) {
                data.weeks[i-1].days[j].events.push({"event-title": "Event"});
            }
        }
    }

    // Render
    $.get('./_view/calendarCard.mst', function(template) {
       var rendered = Mustache.render(template, data);
       $('#calendar-card').html(rendered);
    });
}

window.onload = function(){
    render();
};
