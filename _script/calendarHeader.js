require('datejs');
const Mustache = require("mustache");
 
 
 $(document).ready(() => {
    window.setInterval(function() {
        console.log("Reloading calendar data...");
        render();
    }, 1000);
 })   

function ordinalSuffixOf(i) {
    var j = i % 10, k = i % 100;
    if (j == 1 && k != 11) { return i + "st"; }
    if (j == 2 && k != 12) { return i + "nd"; }
    if (j == 3 && k != 13) { return i + "rd"; }
    return i + "th";
}

function render() {
    const DOW = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const MONTHS = ["January", "February", "March", "April", "May", "June", "July",
                "August", "September", "October", "November", "December"];

    var data = {};
    // Current day
    data.currentDay = `${DOW[Date.today().getDay()]}, ${MONTHS[Date.today().getMonth()]} ${ordinalSuffixOf(Date.today().getDate())}, ${(new Date).getHours() % 12 ? (new Date).getHours() % 12 : 12}:${(new Date).getMinutes()}${(new Date).getHours() > 12 ? 'pm' : 'am'}`;
    $.get('./_view/calendarCard.mustache', function (template) {
        var rendered = Mustache.render(template, data);
        $('#calendar-header').html(rendered);
    });
}

