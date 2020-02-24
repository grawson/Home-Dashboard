// VAR ****************************************************************************************************************

const Mustache = require("mustache");
require('datejs');
const Cheerio = require('cheerio')
const Axios = require('axios')

const REQUEST = "http://www.hebcal.com/hebcal/?v=1&cfg=json&maj=on&min=on&mod=on&nx=on&year=now&month=x&ss=on&mf=on&c=on&geo=geoname&geonameid=5128549&m=50&s=off";
// const REQUEST = "http://www.hebcal.com/hebcal/?v=1&cfg=json&maj=on&min=on&mod=on&nx=on&year=now&month=x&ss=on&mf=on&c=on&geo=geoname&geonameid=5128549&m=50&s=off";
const TEMPLATE = './_view/holidaysCard.mustache';
const MAX_RESULTS = 30;
const REFRESH_RATE = 21600;  // seconds

// FUNC **************************************************************************************************************

// Get the holiday data
function loadData(callback) {
    $.getJSON(REQUEST, function(json) {
        var data = { "holidays": [] };

        for (var i in json.items) {
            var itemDate = Date.parse(json.items[i].date);
            if (Date.today().compareTo(itemDate) > 0) { continue; } // ensure date is later than today
            if (data.holidays.length >= MAX_RESULTS) { break; }  // limit the items

            var holiday = {
                "title": json.items[i].title,
                "date": itemDate.toString("M/d")
            };

            data.holidays.push(holiday);
        }
        callback(data);
    });
}

function render(data) {
    $.get(TEMPLATE, function(template) {
        var rendered = Mustache.render(template, data);
        $('#holidays-card').html(rendered);
    });
}




async function scrapeData(callback) {
    var data = {
        holidays: []
    }

    var webpage = await Axios.get('https://www.yinr.org/')

    var html = await Cheerio.load(webpage.data)

    var nodes = html('.two-fifth')[0].children[1].firstChild.firstChild

    // this weeks parsha
    data.parsha = html(html(nodes).find(':contains("Shabbat")')[1]).text()


    // candle lighting

    var candle_lighting_node = html(nodes).find(':contains("Candle Lighting")')

    var timeRegex =  /\d{1,2}:\d*pm/

    cLTime = timeRegex.exec(html(candle_lighting_node).text())[0]

    data.holidays.push({
        title: "Candle Lighting",
        time: cLTime
    })

    // Mincha
    var minchaNodes = html(nodes).find(":contains('Mincha')")
    var fridayMinchaTime = timeRegex.exec(html(minchaNodes[0]).text())[0]

    data.holidays.push({
        title: "Friday Mincha",
        time: fridayMinchaTime
    })

    var satMinchaTime = timeRegex.exec(html(minchaNodes[2]).text())[0]

    data.holidays.push({
        title: "Shabbat Mincha",
        time: satMinchaTime
    })

    // Havdala
    var havdalNodes = html(nodes).find(":contains('Shabbat Ends')")
    havdalaTime = timeRegex.exec(html(havdalNodes).text())[0]

    data.holidays.push({
        title: "Havdala",
        time: havdalaTime
    })

    callback(data)
}


// MAIN **************************************************************************************************************


$(function () {
    scrapeData(render);
    window.setInterval(function() {
        console.log("Reloading holiday data...");
        scrapeData(render);
    }, REFRESH_RATE*1000);
});