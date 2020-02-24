 $(document).ready(() => {
    window.setInterval(function() {
        console.log("Reloading calendar data...");
        render();
    }, 1000);
 })   
    

function render() {
    var data = {};
    // Current day
    data.currentDay = `${DOW[Date.today().getDay()]}, ${MONTHS[Date.today().getMonth()]} ${ordinalSuffixOf(Date.today().getDate())}, ${(new Date).getHours() % 12 ? (new Date).getHours() % 12 : 12}:${(new Date).getMinutes()}${(new Date).getHours() > 12 ? 'pm' : 'am'}`;
    $.get('./_view/calendarCard.mustache', function (template) {
        var rendered = Mustache.render(template, data);
        $('#calendar-header').html(rendered);
    });
}

